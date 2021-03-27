/*
 * Copyright (c) 2020 Payson Wallach
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import { CompositeDisposable } from "atom"
import { spawn, ChildProcess } from "child_process"
import { shell } from "electron"
import fileUrl from "file-url"
import { Magic, MAGIC_MIME_TYPE } from "mmmagic"
import { serialize } from "typescript-json-serializer"

import { Subject, Event, InsertEventsRequest } from "./protocol"

enum Interpretation {
    Access = "http://www.zeitgeist-project.com/ontologies/2010/01/27/zg#AccessEvent",
    Exit = "http://www.zeitgeist-project.com/ontologies/2010/01/27/zg#LeaveEvent",
}

const BRIDGE_EXECUTABLE_NAME = "com.paysonwallach.zeitgeist.bridge"

let subscriptions: CompositeDisposable | null
let bridge: ChildProcess | null
let magic: Magic | null

async function getMimeTypeForFile(path: string): Promise<string | undefined> {
    return new Promise<string | undefined>((resolve, reject) => {
        if (magic === null) return reject("libmagic proxy is not initialized")
        else
            magic.detectFile(path, async (err, result) => {
                if (err) {
                    console.error(err)
                    return resolve(undefined)
                } else {
                    if (result.constructor === Array) return resolve(result[0])
                    // @ts-ignore
                    else return resolve(result)
                }
            })
    })
}

async function logEvent(
    title: string,
    path: string,
    interpretation: Interpretation
) {
    const mimeType = await getMimeTypeForFile(path)
    const url = fileUrl(path)
    const subject = new Subject(
        undefined,
        undefined,
        "http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#SourceCode",
        undefined,
        mimeType,
        undefined,
        undefined,
        title,
        url
    )

    const event = new Event(
        [subject],
        Date.now(),
        0,
        "application://atom.desktop",
        interpretation,
        "http://www.zeitgeist-project.com/ontologies/2010/01/27/zg#UserActivity"
    )

    if (bridge !== null) {
        const message = Buffer.from(
            JSON.stringify(serialize(new InsertEventsRequest([event])))
        )
        const header = Buffer.alloc(4)

        header.writeInt32LE(message.length, 0)

        // @ts-ignore
        bridge.stdin.write(header)
        // @ts-ignore
        bridge.stdin.write(message)
    }
}

export function activate(): void {
    subscriptions = new CompositeDisposable()
    bridge = spawn(BRIDGE_EXECUTABLE_NAME)
    magic = new Magic(MAGIC_MIME_TYPE)

    bridge.on("error", (err) =>
        atom.notifications.addError(
            `Unable to start Zeitgeist Bridge: ${err}`,
            {
                dismissable: true,
                buttons: [
                    {
                        text: "View README",
                        onDidClick: () =>
                            shell.openExternal(
                                "https://github.com/paysonwallach/atom-zeitgeist"
                            ),
                    },
                    {
                        text: "Download Zeitgeist Bridge",
                        onDidClick: () =>
                            shell.openExternal(
                                "https://github.com/paysonwallach/atom-zeitgeist/release/latest"
                            ),
                    },
                ],
                description:
                    "This can occur if you do not have Zeitgeist Bridge installed or it is not in your '$PATH'.",
            }
        )
    )
    atom.workspace.observeTextEditors((editor) => {
        const editorSubscriptions = new CompositeDisposable()

        try {
            const title = editor.getTitle()
            const path = editor.getPath()

            if (path !== undefined) {
                logEvent(title, path, Interpretation.Access)
                editorSubscriptions.add(
                    editor.onDidDestroy(() => {
                        logEvent(title, path, Interpretation.Exit)

                        editorSubscriptions.dispose()
                        if (subscriptions !== null)
                            subscriptions.remove(editorSubscriptions)
                    })
                )
            }
        } catch (error) {
            console.error(error)
        }

        if (subscriptions !== null) subscriptions.add(editorSubscriptions)
    })
}

export function deactivate(): void {
    if (bridge !== null && !bridge.killed) bridge.kill()
    if (subscriptions) subscriptions.dispose()
    if (magic !== null) magic = null
}
