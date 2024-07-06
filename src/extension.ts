// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs'; // In NodeJS: 'const fs = require('fs')'

const os = require('node:os');
// const path = require('path');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

async function ChangeCursorColor(Color: String): Promise<void> {

	let colorCustomizations: any = vscode.workspace
		.getConfiguration("workbench")
		.get("colorCustomizations");

	await vscode.workspace.getConfiguration("workbench").update(
		"colorCustomizations",
		{
			...colorCustomizations,
			"editorCursor.foreground": Color,
		},
		1);
}

function HeaderSource(origPath: string | undefined) {
	if (!origPath) { return }
	let path: string;

	if (origPath.endsWith('.c') || origPath.endsWith('.cpp'))
	{
		path = origPath.replace(/\.(c|cpp)$/, '.h');
	}
	else if (origPath.endsWith('.h') || origPath.endsWith('.hpp'))
	{
		path = origPath.replace(/\.(h|hpp)$/, '.cpp');
		if (os.platform() === 'win32') { path = path.replace(/\//, ''); }
		if (!fs.existsSync(path)) { path = path.replace('.cpp', '.c'); }

	} else
	{
		path = '';
	}
	if (path != undefined) {
		vscode.commands.executeCommand("vscode.open", vscode.Uri.file(path));
	}
}

export function activate(context: vscode.ExtensionContext) {

	
	/* if (os.platform() === 'linux') {

		const cp = require('child_process')
		const key_up_bin = path.join(__dirname, 'key_up_x11');
		const key_down_bin = path.join(__dirname, 'key_down_x11');

		cp.exec(key_up_bin, (err: any, stdout: any, stderr: any) => {
			console.log('stdout: ' + stdout);
			console.error('stderr: ' + stderr);
			if (err) {
				console.error('error: ' + err);
			}
		});

		cp.exec(key_down_bin, (err: any, stdout: any, stderr: any) => {
			console.log('stdout: ' + stdout);
			console.error('stderr: ' + stderr);
			if (err) {
				console.error('error: ' + err);
			}
		});
	} */

	vscode.commands.executeCommand("setContext", "modal.normal", true);
	vscode.commands.executeCommand("setContext", "modal.word", false);
	vscode.commands.executeCommand("setContext", "modal.subword", false);
	vscode.commands.executeCommand("setContext", "modal.visual", false);
	vscode.commands.executeCommand("setContext", "modal.delete", false);

	let NORMAL_MODE = true;


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	let commentAandMoveDown = vscode.commands.registerCommand('rahulvscodeplugin.commentAandMoveDown', () => {
		vscode.commands.executeCommand("editor.action.commentLine");
		vscode.commands.executeCommand("cursorDown");
	});
	context.subscriptions.push(commentAandMoveDown);


	//---------------------------------Comment and MoveDown------------------------------------------------

	//---------------------------------Header/Source------------------------------------------------

	let headerSourceNextGroup = vscode.commands.registerCommand('rahulvscodeplugin.headerSourceNextGroup', () => {

		vscode.commands.executeCommand("workbench.action.focusLastEditorGroup");
		let origPath = vscode.window.activeTextEditor?.document.uri.path;
		HeaderSource(origPath);

		// vscode.commands.executeCommand("clangd.switchheadersource").then(() => {
		// vscode.commands.executeCommand("workbench.action.moveEditorToNextGroup");});
	});
	context.subscriptions.push(headerSourceNextGroup);

	let headerSourcePrevGroup = vscode.commands.registerCommand('rahulvscodeplugin.headerSourcePrevGroup', () => {
		vscode.commands.executeCommand("workbench.action.focusPreviousGroup");
		let origPath = vscode.window.activeTextEditor?.document.uri.path;
		HeaderSource(origPath);

		// vscode.commands.executeCommand("clangd.switchheadersource").then(() => {
		// vscode.commands.executeCommand("workbench.action.moveEditorToPreviousGroup");
		// });
	});
	context.subscriptions.push(headerSourcePrevGroup);


	//---------------------------------Hippie  Completion------------------------------------------------

	let tab = vscode.commands.registerCommand('rahulvscodeplugin.tab', () => {

		const editor:any = vscode.window.activeTextEditor;
		if (editor.selection.active.character == 0) {
			 //vscode.commands.executeCommand("editor.action.insertSnippet", { "snippet": "\t" }); return;
			 vscode.commands.executeCommand("tab"); return;
		}
		
		let oneMinus = new vscode.Position(editor.selection.active.line, editor.selection.active.character - 1);
		let range = new vscode.Range(oneMinus, editor.selection.active);

		let charBeforeTab = editor.document.getText(range).trim();
		let hasChar:boolean = charBeforeTab.length > 0 && charBeforeTab.match(/\w+/);

		if (hasChar) {
			vscode.commands.executeCommand("hippie-completion.next");
		} else {
			//vscode.commands.executeCommand("editor.action.insertSnippet", { "snippet": "\t" });
			vscode.commands.executeCommand("tab");
		}

	});
	context.subscriptions.push(tab);


	//---------------------------------OpenFileInNextGroup------------------------------------------------
	let openFileInNextGroup = vscode.commands.registerCommand('rahulvscodeplugin.openFileInNextGroup', () => {

		vscode.commands.executeCommand("workbench.action.focusLastEditorGroup");
		vscode.commands.executeCommand("vscode.open", vscode.window.activeTextEditor?.document.uri);
	});
	context.subscriptions.push(openFileInNextGroup);

	let openFileInPrevGroup = vscode.commands.registerCommand('rahulvscodeplugin.openFileInPrevGroup', () => {

		vscode.commands.executeCommand("workbench.action.focusPreviousGroup");
		vscode.commands.executeCommand("vscode.open", vscode.window.activeTextEditor?.document.uri);
	});
	context.subscriptions.push(openFileInPrevGroup);

	//---------------------------------CutCopyPaste------------------------------------------------
	let cut = vscode.commands.registerCommand('rahulvscodeplugin.cut', () => {
		vscode.commands.executeCommand("editor.action.clipboardCutAction");
		vscode.commands.executeCommand("rahulvscodeplugin.visualOFF");
	});
	context.subscriptions.push(cut);
	let copy = vscode.commands.registerCommand('rahulvscodeplugin.copy', () => {
		vscode.commands.executeCommand("editor.action.clipboardCopyAction");
		vscode.commands.executeCommand("rahulvscodeplugin.visualOFF");
	});
	context.subscriptions.push(copy);
	let paste = vscode.commands.registerCommand('rahulvscodeplugin.paste', () => {
		vscode.commands.executeCommand("editor.action.clipboardPasteAction");
		vscode.commands.executeCommand("rahulvscodeplugin.visualOFF");
	});
	context.subscriptions.push(paste);

	//---------------------------------SEMICOLON------------------------------------------------
	let semicolon = vscode.commands.registerCommand('rahulvscodeplugin.semicolon', () => {
		const editor: any = vscode.window.activeTextEditor;
		let CurrentLine: String = editor.document.lineAt(editor.selection.active.line).text.toString();
		let NextLine: String = editor.document.lineAt(editor.selection.active.line + 1).text.toString();

		vscode.commands.executeCommand("cursorEnd");
		if (CurrentLine.trim().length > 0 &&
			!CurrentLine.includes("{") &&
			!NextLine.includes("{") &&
			!CurrentLine.includes("#") &&
			!CurrentLine.trim().endsWith(";") &&
			!CurrentLine.trim().endsWith(",") &&
			editor.document.languageId != "python") {
			vscode.commands.executeCommand("editor.action.insertSnippet", { "snippet": ";" });
		}
	});
	context.subscriptions.push(semicolon);

	//----------------------------------------------------------------------------------------
	let normal = vscode.commands.registerCommand('rahulvscodeplugin.normal', () => {
		const editor: any = vscode.window.activeTextEditor;
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.commands.executeCommand("setContext", "modal.normal", true);
		vscode.commands.executeCommand("setContext", "modal.insert", false);
		editor.options.cursorStyle = vscode.TextEditorCursorStyle.Block;
		NORMAL_MODE = true;
	});
	context.subscriptions.push(normal);

	let insert = vscode.commands.registerCommand('rahulvscodeplugin.insert', () => {
		const editor: any = vscode.window.activeTextEditor;
		vscode.commands.executeCommand("setContext", "modal.insert", true);
		vscode.commands.executeCommand("setContext", "modal.normal", false);
		vscode.commands.executeCommand("setContext", "modal.word", false);
		vscode.commands.executeCommand("setContext", "modal.subword", false);
		vscode.commands.executeCommand("setContext", "modal.visual", false);
		vscode.commands.executeCommand("setContext", "modal.delete", false);

		editor.options.cursorStyle = vscode.TextEditorCursorStyle.Line;
		NORMAL_MODE = false;
	});
	context.subscriptions.push(insert);


	//----------------------------------------------------------------------------------------
	let word = vscode.commands.registerCommand('rahulvscodeplugin.word', () => {
		vscode.commands.executeCommand("setContext", "modal.word", true);
	});
	context.subscriptions.push(word);

	let wordOFF = vscode.commands.registerCommand('rahulvscodeplugin.wordOFF', () => {
		vscode.commands.executeCommand("setContext", "modal.word", false);
	});
	context.subscriptions.push(wordOFF);

	//----------------------------------------------------------------------------------------
	let sub_word = vscode.commands.registerCommand('rahulvscodeplugin.subword', () => {
		vscode.commands.executeCommand("setContext", "modal.subword", true);
	});
	context.subscriptions.push(sub_word);

	let sub_wordOFF = vscode.commands.registerCommand('rahulvscodeplugin.subwordOFF', () => {
		vscode.commands.executeCommand("setContext", "modal.subword", false);
	});
	context.subscriptions.push(sub_wordOFF);

	//----------------------------------------------------------------------------------------
	let visual = vscode.commands.registerCommand('rahulvscodeplugin.visual', () => {
		vscode.commands.executeCommand("setContext", "modal.visual", true);
		const editor: any = vscode.window.activeTextEditor;
		editor.options.cursorStyle = vscode.TextEditorCursorStyle.Underline;
	});
	context.subscriptions.push(visual);

	let visualOFF = vscode.commands.registerCommand('rahulvscodeplugin.visualOFF', () => {
		vscode.commands.executeCommand("setContext", "modal.visual", false);
		const editor: any = vscode.window.activeTextEditor;
		editor.options.cursorStyle = vscode.TextEditorCursorStyle.Block;
	});
	context.subscriptions.push(visualOFF);
	//----------------------------------------------------------------------------------------
	let delete_mode = vscode.commands.registerCommand('rahulvscodeplugin.delete', () => {
		vscode.commands.executeCommand("setContext", "modal.delete", true);

		vscode.commands.executeCommand("setContext", "modal.delete", true).then(() =>
		{
			vscode.commands.executeCommand("setContext", "modal.delete", true);
			console.log('DELETE MODE ON ');
			vscode.commands.executeCommand("rahulvscodeplugin.visualOFF");	
		})

	});
	context.subscriptions.push(delete_mode);

	let deleteOFF = vscode.commands.registerCommand('rahulvscodeplugin.deleteOFF', () => {
		vscode.commands.executeCommand("setContext", "modal.delete", false);
	});
	context.subscriptions.push(deleteOFF);
	//----------------------------------------------------------------------------------------

	let replace = vscode.commands.registerCommand('rahulvscodeplugin.replace', () => {
		vscode.commands.executeCommand("editor.action.addSelectionToNextFindMatch").then(() => {
			vscode.commands.executeCommand("rahulvscodeplugin.insert") });
	});
	context.subscriptions.push(replace);
	//----------------------------------------------------------------------------------------

	//--------------------------Command and Insert--------------------------------------------
	let command_and_insert = vscode.commands.registerCommand('rahulvscodeplugin.command_and_insert', (args = {}) => {
		vscode.commands.executeCommand(args).then(() => {
			vscode.commands.executeCommand("rahulvscodeplugin.insert") });
	});
	context.subscriptions.push(command_and_insert);
	//--------------------------Format and Expand Line Selection--------------------------------------------
	let format_and_expand_line_select = vscode.commands.registerCommand('rahulvscodeplugin.format_and_expand_line_select', () => {
		vscode.commands.executeCommand("editor.action.formatSelection").then(() => {
			vscode.commands.executeCommand("expandLineSelection") });
	});
	context.subscriptions.push(format_and_expand_line_select);

	//---------------------------------------------Unwrap---------------------------------------------------
	const unwrap = () => {
		vscode.commands.executeCommand("cursorDown").then(() => {
			vscode.commands.executeCommand("editor.action.selectToBracket").then(() => {
				vscode.commands.executeCommand("outdent").then(() => {
					vscode.commands.executeCommand("cancelSelection").then(() => {
						vscode.commands.executeCommand("cursorUp").then(() => {
							vscode.commands.executeCommand("bracketeer.removeBrackets");
						});
					});
				});
			});
		});
	};
	let unwrap_bracket_statements = vscode.commands.registerCommand('rahulvscodeplugin.unwrap', () =>  {
		const editor = vscode.window.activeTextEditor;
		if (!editor) { return; }

		let range = new vscode.Range(editor.selection.active.line, 0, editor.selection.active.line+1, 0);
		let text = editor.document.getText(range);
		let idx = text.indexOf('{');
		if (idx > 0)
		{
			range = new vscode.Range(editor.selection.active.line, 0, editor.selection.active.line, idx);
			editor.edit(edit => {
				edit.delete(range);
			}).then(() => {
				unwrap();
			});
		} else {
			vscode.commands.executeCommand("cut").then(() => {
				unwrap();
			});
		}


		
	});

	context.subscriptions.push(unwrap_bracket_statements);

	//---------------------------------------------Debugger Restart---------------------------------------------------
	let restart_debugger = vscode.commands.registerCommand('workbench.action.debug.restart', () => {
		vscode.commands.executeCommand("workbench.action.debug.stop").then(() => {
			// TODO Handle case for when it's Cmake project or __Python project__ and just a __python file__
			if (vscode.window.activeTextEditor?.document.languageId == 'python')
				vscode.commands.executeCommand('python.debugInTerminal');
			else
				vscode.commands.executeCommand("workbench.action.debug.start") });
	});
	context.subscriptions.push(restart_debugger);

	context.subscriptions.push(vscode.commands.registerTextEditorCommand('rahulvscodeplugin.swapCursorPosInSelection', editor => {
		editor.selections = editor.selections.map( s => new vscode.Selection(s.active, s.anchor));
	  }) );

	  let dotORarrow = vscode.commands.registerCommand('rahulvscodeplugin.dotORarrow', () =>  {
		const editor = vscode.window.activeTextEditor;
		if (!editor) { return; }

		const position = editor.selection.active;
		if (position.character > 0) {
			// Get the position of the character before the cursor
			const newPosition = position.with(position.line, position.character - 1);
			const range = new vscode.Range(newPosition, position);
			const text = editor.document.getText(range);
			if (text == ".")
			{
				vscode.commands.executeCommand("deleteLeft");
				vscode.commands.executeCommand("editor.action.insertSnippet", { "snippet": "->" });
			}
			 else
				vscode.commands.executeCommand("editor.action.insertSnippet", { "snippet": "." });
		}else 
			vscode.commands.executeCommand("editor.action.insertSnippet", { "snippet": "." });
	});
	context.subscriptions.push(dotORarrow);

	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor((editor) => {
			if (!editor) { return; }
			if (NORMAL_MODE)
				editor.options.cursorStyle = vscode.TextEditorCursorStyle.Block;
			else
				editor.options.cursorStyle = vscode.TextEditorCursorStyle.Line;
    })
);

	let previousFile: vscode.TextDocument | null = null;
	let currentFile: vscode.TextDocument | null = null;

	context.subscriptions.push(
	vscode.commands.registerCommand('rahulvscodeplugin.switchBetweenTwoFiles', async () => {
		if (previousFile) {
			const current = vscode.window.activeTextEditor?.document;
			if (!current)
			{
				vscode.commands.executeCommand("workbench.action.focusPreviousGroup");
				return;
			}
			if (current && previousFile) {
				const previousFileUri = previousFile.uri;
				const visibleEditors = vscode.window.visibleTextEditors;

				// Check if the previous file is already open in a different group
				let targetEditor = visibleEditors.find(editor => editor.document.uri.fsPath === previousFileUri.fsPath);

				if (targetEditor) {
					// Switch to the group where the target file is already open
					await vscode.window.showTextDocument(targetEditor.document, { viewColumn: targetEditor.viewColumn });
				} else {
					// Open the file in the current group if it's not already open
					await vscode.window.showTextDocument(previousFile);
				}

				// Update the previous file reference
				previousFile = current;
			}
		}
	}));

	vscode.window.onDidChangeActiveTextEditor(editor => {
	if (editor) {
		if (currentFile) {
			previousFile = currentFile;
		}
		currentFile = editor.document;
	}
	});

}

// this method is called when your extension is deactivated
export function deactivate() { }
