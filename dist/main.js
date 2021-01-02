"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const tslib_1 = require("tslib");
const atom_1 = require("atom");
const child_process_1 = require("child_process");
const electron_1 = require("electron");
const file_url_1 = tslib_1.__importDefault(require("file-url"));
const mmm = tslib_1.__importStar(require("mmmagic"));
const typescript_json_serializer_1 = require("typescript-json-serializer");
const util_1 = require("util");
const protocol_1 = require("./protocol");
const magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE);
const detectFile = util_1.promisify(magic.detectFile);
var InterpretationType;
(function (InterpretationType) {
    InterpretationType["Access"] = "http://www.zeitgeist-project.com/ontologies/2010/01/27/zg#AccessEvent";
    InterpretationType["Exit"] = "http://www.zeitgeist-project.com/ontologies/2010/01/27/zg#LeaveEvent";
})(InterpretationType || (InterpretationType = {}));
let subscriptions;
let bridge;
async function getMimeTypeForFile(path) {
    return new Promise((resolve) => {
        detectFile(path).then((mimeType) => {
            resolve(mimeType);
        }, (error) => {
            console.warn(error);
            resolve("text/plain");
        });
    });
}
async function logEvent(title, path, interpretation) {
    const subject = new protocol_1.Subject(undefined, undefined, "http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#SourceCode", undefined, await getMimeTypeForFile(path), undefined, undefined, title, path);
    const event = new protocol_1.Event([subject], Date.now(), 0, "application://atom.desktop", interpretation, "http://www.zeitgeist-project.com/ontologies/2010/01/27/zg#UserActivity");
    if (bridge !== null) {
        const message = Buffer.from(JSON.stringify(typescript_json_serializer_1.serialize(new protocol_1.InsertEventsRequest([event]))));
        const header = Buffer.alloc(4);
        header.writeInt32LE(message.length, 0);
        bridge.stdin.write(header);
        bridge.stdin.write(message);
    }
}
function activate(state) {
    subscriptions = new atom_1.CompositeDisposable();
    bridge = child_process_1.spawn("com.paysonwallach.zeitgeist.bridge");
    bridge.on("error", (err) => atom.notifications.addError(`Unable to start Zeitgeist Bridge: ${err}`, {
        dismissable: true,
        buttons: [
            {
                text: "View README",
                onDidClick: () => electron_1.shell.openExternal("https://github.com/paysonwallach/atom-zeitgeist")
            },
            {
                text: "Download Zeitgeist Bridge",
                onDidClick: () => electron_1.shell.openExternal("https://github.com/paysonwallach/atom-zeitgeist/release/latest")
            }
        ],
        description: "This can occur if you do not have Zeitgeist Bridge installed or it is not in your '$PATH'."
    }));
    atom.workspace.observeTextEditors((editor) => {
        const editorSubscriptions = new atom_1.CompositeDisposable();
        try {
            const title = editor.getTitle();
            const path = editor.getPath();
            if (path !== undefined) {
                const uri = file_url_1.default(path);
                logEvent(title, uri, InterpretationType.Access);
                editorSubscriptions.add(editor.onDidDestroy(() => {
                    logEvent(title, uri, InterpretationType.Exit);
                    editorSubscriptions.dispose();
                    if (subscriptions !== null)
                        subscriptions.remove(editorSubscriptions);
                }));
            }
        }
        catch (error) {
            console.warn(error);
        }
        if (subscriptions !== null)
            subscriptions.add(editorSubscriptions);
    });
}
exports.activate = activate;
function deactivate() {
    if (subscriptions)
        subscriptions.dispose();
}
exports.deactivate = deactivate;
