import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let saveCommand = vscode.commands.registerCommand('runCommandSaver.saveCommand', async () => {
        const input = await vscode.window.showInputBox({
            prompt: "Enter the command to save",
            placeHolder: "e.g., python3 -m streamlit run main.py"
        });

        if (!input) {
            vscode.window.showErrorMessage("No command entered!");
            return;
        }

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("No workspace open!");
            return;
        }

        const workspacePath = workspaceFolders[0].uri.fsPath;
        const filePath = path.join(workspacePath, "RUN_COMMANDS.md");

        fs.appendFileSync(filePath, `\n${input}`);
        vscode.window.showInformationMessage(`Command saved: ${input}`);
    });

    let viewCommands = vscode.commands.registerCommand('runCommandSaver.viewCommands', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("No workspace open!");
            return;
        }

        const workspacePath = workspaceFolders[0].uri.fsPath;
        const filePath = path.join(workspacePath, "RUN_COMMANDS.md");

        if (!fs.existsSync(filePath)) {
            vscode.window.showErrorMessage("No commands saved yet!");
            return;
        }

        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);
    });

    context.subscriptions.push(saveCommand, viewCommands);
}

export function deactivate() {}
