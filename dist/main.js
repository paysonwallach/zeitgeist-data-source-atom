"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const tslib_1 = require("tslib");
const atom_1 = require("atom");
const child_process_1 = require("child_process");
const electron_1 = require("electron");
const file_url_1 = (0, tslib_1.__importDefault)(require("file-url"));
const mmmagic_1 = require("mmmagic");
const typescript_json_serializer_1 = require("typescript-json-serializer");
const protocol_1 = require("./protocol");
var Interpretation;
(function (Interpretation) {
    Interpretation["Access"] = "http://www.zeitgeist-project.com/ontologies/2010/01/27/zg#AccessEvent";
    Interpretation["Exit"] = "http://www.zeitgeist-project.com/ontologies/2010/01/27/zg#LeaveEvent";
})(Interpretation || (Interpretation = {}));
const BRIDGE_EXECUTABLE_NAME = "com.paysonwallach.zeitgeist.bridge";
let subscriptions;
let bridge;
let magic;
let previousEditor;
async function getMimeTypeForFile(path) {
    return new Promise((resolve, reject) => {
        if (magic === null)
            return reject("libmagic proxy is not initialized");
        else
            magic.detectFile(path, async (err, result) => {
                if (err) {
                    console.error(err);
                    return resolve(undefined);
                }
                else {
                    if (result.constructor === Array)
                        return resolve(result[0]);
                    else
                        return resolve(result);
                }
            });
    });
}
async function logEvent(title, path, interpretation) {
    const mimeType = await getMimeTypeForFile(path);
    const url = (0, file_url_1.default)(path);
    const subject = new protocol_1.Subject(undefined, undefined, "http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#SourceCode", undefined, mimeType, undefined, undefined, title, url);
    const event = new protocol_1.Event([subject], Date.now(), 0, "application://atom.desktop", interpretation, "http://www.zeitgeist-project.com/ontologies/2010/01/27/zg#UserActivity");
    if (bridge !== null) {
        const message = Buffer.from(JSON.stringify((0, typescript_json_serializer_1.serialize)(new protocol_1.InsertEventsRequest([event]))));
        const header = Buffer.alloc(4);
        header.writeInt32LE(message.length, 0);
        bridge.stdin.write(header);
        bridge.stdin.write(message);
    }
}
function activate() {
    subscriptions = new atom_1.CompositeDisposable();
    bridge = (0, child_process_1.spawn)(BRIDGE_EXECUTABLE_NAME);
    magic = new mmmagic_1.Magic(mmmagic_1.MAGIC_MIME_TYPE);
    bridge.on("error", (err) => atom.notifications.addError(`Unable to start Zeitgeist Bridge: ${err}`, {
        dismissable: true,
        buttons: [
            {
                text: "View README",
                onDidClick: () => electron_1.shell.openExternal("https://github.com/paysonwallach/atom-zeitgeist"),
            },
            {
                text: "Download Zeitgeist Bridge",
                onDidClick: () => electron_1.shell.openExternal("https://github.com/paysonwallach/atom-zeitgeist/release/latest"),
            },
        ],
        description: "This can occur if you do not have Zeitgeist Bridge installed or it is not in your '$PATH'.",
    }));
    const onActiveTextEditorDidChangeSubscription = atom.workspace.onDidChangeActiveTextEditor((editor) => {
        if (previousEditor !== undefined) {
            const title = previousEditor.getTitle();
            const path = previousEditor.getPath();
            if (path !== undefined)
                logEvent(title, path, Interpretation.Exit);
        }
        if (editor !== undefined) {
            const title = editor.getTitle();
            const path = editor.getPath();
            if (path !== undefined) {
                logEvent(title, path, Interpretation.Access);
                previousEditor = editor;
            }
        }
    });
    if (subscriptions !== null)
        subscriptions.add(onActiveTextEditorDidChangeSubscription);
}
exports.activate = activate;
function deactivate() {
    if (bridge !== null && !bridge.killed)
        bridge.kill();
    if (subscriptions)
        subscriptions.dispose();
    if (magic !== null)
        magic = null;
}
exports.deactivate = deactivate;
