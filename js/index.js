function conv(str) {
	if (typeof str != 'string') return str;
	else {
		if (str === '') return str;
		else if (str === 'true') return true;
		else if (str === 'false') return false;
		else if (str === 'undefined') return undefined;
		else if (str === 'NaN') return NaN;
		else if (str === 'null') return null;
		else {
			if (!isNaN(Number(str))) return Number(str);
			else try { return JSON.parse(str) } catch { return str; }
		}
	}
}

// function vue() {
// 	$('[data-value-target]').each(function () {
// 		let $this = $(this);
// 		let target = $(this).data('value-target');
// 		$(target).on('click mousemove change paste', function () {
// 			$this.text($(this).val())
// 		});
// 	});
// }


window.location.replace('#!/');


// Variáveis
var currentTab = 'tab-html';
var fileTitle = 'Sem título';


// Vue
var vue = new Vue({ el: '#app' });


// Framework7
var app = new Framework7({
	root: '#app',
	name: 'Editor de HTML',
	id: 'com.jeffersondantas.htmleditor',
	routes: [
		{ name: 'home', path: '/', pageName: 'home' },
		{ name: 'result', path: '/result/', pageName: 'result' },
		{ name: 'feditor', path: '/feditor/', pageName: 'feditor' },
		{ name: 'open', path: '/open/', pageName: 'open' },
		{ name: 'save', path: '/save/', pageName: 'save' },
		{ name: 'settings', path: '/settings/', pageName: 'settings' },
	]
});

var mainView = app.views.create('.view-main', {
	stackPages: true,
	pushState: true,
});


// Ace Editor
var editorOptions = {
	animatedScroll: true,
	autoScrollEditorIntoView: true,
	fontSize: 14,
	printMargin: false,
	useSoftTabs: false,
	theme: 'ace/theme/monokai',
}

var editorHTML = ace.edit('editorHTML', editorOptions);
editorHTML.setOptions({ mode: 'ace/mode/html' });

var editorCSS = ace.edit('editorCSS', editorOptions);
editorCSS.setOptions({ mode: 'ace/mode/css' });

var editorJS = ace.edit('editorJS', editorOptions);
editorJS.setOptions({ mode: 'ace/mode/javascript' });

editorHTML.renderer.setScrollMargin(5, 5);
editorCSS.renderer.setScrollMargin(5, 5);
editorJS.renderer.setScrollMargin(5, 5);

// Default values
editorHTML.setValue(editorHTMLValue || '');
editorHTML.clearSelection();
editorCSS.setValue(editorCSSValue || '');
editorCSS.clearSelection();
editorJS.setValue(editorJSValue || '');
editorJS.clearSelection();

// window.onbeforeunload = function () {
// 	$.cookie('data', editorHTML.getValue());
// }

// editorHTML.setValue($.cookie('data') || editorHTMLValue); //////////
// editorHTML.clearSelection(); ////////////

updateTitle();

// Editor Focus and Blur
editorHTML.on('focus', editorFocus);
editorCSS.on('focus', editorFocus);
editorJS.on('focus', editorFocus);
$('#toolbarX').click(editorBlur);

function editorFocus() {
	app.navbar.hide('.navbar');
	app.toolbar.hide('.toolbar.toolbar-top');
	app.toolbar.show('.toolbar.toolbar-bottom');
	$('.tab').addClass('no-padding-top').removeClass('no-padding-bottom');
	$('.fab').fadeOut();
}
function editorBlur() {
	updateTitle();
	app.navbar.show('.navbar');
	app.toolbar.show('.toolbar.toolbar-top');
	app.toolbar.hide('.toolbar.toolbar-bottom');
	$('.tab').removeClass('no-padding-top').addClass('no-padding-bottom');
	$('.fab').fadeIn();
}

// Current editor
var editorCurrent = editorHTML;
$('#tab-html').on('tab:show', function () { editorCurrent = editorHTML });
$('#tab-css').on('tab:show', function () { editorCurrent = editorCSS });
$('#tab-js').on('tab:show', function () { editorCurrent = editorJS });

$('.tab').on('tab:show', function () {
	currentTab = $('.tab-active').attr('id');
	$('#hiddenChars').prop('checked', editorCurrent.getShowInvisibles());
});


// Add Package
$('#addPackage .actions-button[data-package]').click(function () {
	let group = $(this).data('group');
	let package = $(this).data('package');
	editorHTML.insert(packages[group][package]);
	updateTitle();
});

// Quick Characters
$('#quickCharacters .link:not(#toolbarX):not(#toolbarTab)').on('click contextmenu', function () {
	let char = $(this).text();
	editorCurrent.insert(char);
	editorCurrent.focus();
});

$('#quickCharacters .link#toolbarTab').on('click contextmenu', function () {
	editorCurrent.insert('\t');
	editorCurrent.focus();
});


// Actions
$('[data-action]').click(function () {
	let action = $(this).data('action');
	switch (action) {
		case 'beautify': beautifyCode(); break;
		case 'copyAll': editorCurrent.selectAll(); editorCurrent.focus(); document.execCommand('copy'); break;
		case 'deleteAll': deleteAll(); break;
		case 'feditor': initFEditor(); break;
		case 'hiddenChars': editorCurrent.setShowInvisibles($('#hiddenChars').prop('checked')); break;
		case 'install': installApp(); break;
		case 'openFile': openFile(); break;
		case 'redo': editorCurrent.redo(); break;
		case 'run': previewHTML(); break;
		case 'saveFEditor': saveFEditor(); break;
		case 'saveFile': saveFile(); break;
		case 'selectAll': editorCurrent.selectAll(); editorCurrent.focus(); break;
		case 'undo': editorCurrent.undo(); break;
		// case 'set_fontSize': dial_fontSize.open(); break;
	}
	updateTitle();
});

function deleteAll() {
	app.dialog.create({
		title: 'Apagar código',
		text: 'Tem certeza que deseja apagar o código?',
		buttons: [
			{
				text: 'Todos',
				onClick: function () {
					editorHTML.setValue('');
					editorCSS.setValue('');
					editorJS.setValue('');
					updateTitle();
				}
			},
			{
				text: 'Somente este',
				onClick: function () {
					editorCurrent.setValue('');
					updateTitle();
				}
			},
			{ text: 'Cancelar' }
		]
	}).open();
}
function openFile() {
	app.dialog.create({
		title: 'Abrir arquivos',
		text: 'Tem certeza que deseja abrir os arquivos?<br>Todo o código escrito anteriormente será perdido!',
		buttons: [
			{
				text: 'Sim',
				onClick: function () {
					let htmlFile = $('#openFileHTML')[0].files[0];
					let cssFile = $('#openFileCSS')[0].files[0];
					let jsFile = $('#openFileJS')[0].files[0];

					htmlF = new FileReader();
					cssF = new FileReader();
					jsF = new FileReader();

					htmlFile && htmlF.readAsText(htmlFile);
					cssFile && cssF.readAsText(cssFile);
					jsFile && jsF.readAsText(jsFile);

					editorHTML.setValue('');
					editorCSS.setValue('');
					editorJS.setValue('');

					htmlF.onload = () => { editorHTML.setValue(htmlF.result || ''); editorHTML.clearSelection(); }
					cssF.onload = () => { editorCSS.setValue(cssF.result || ''); editorCSS.clearSelection(); }
					jsF.onload = () => { editorJS.setValue(jsF.result || ''); editorJS.clearSelection(); }

					app.toast.create({
						text: 'Arquivos abertos',
						closeTimeout: 7000,
						closeButton: true
					}).open();

					$('#openFileHTML, #openFileCSS, #openFileJS').val('');
					vue.$forceUpdate();
					updateTitle();
				}
			},
			{ text: 'Não' }
		]
	}).open();
}
function saveFile() {
	vue.$forceUpdate();
	$('#saveFileHTML').attr('download', fileTitle + '.html');
	$('#saveFileCSS').attr('download', fileTitle + '.css');
	$('#saveFileJS').attr('download', fileTitle + '.js');

	$('#saveFileHTML').attr('href', 'data:text/html,' + encodeURI(editorHTML.getValue()).replace(/#/g, '%23'));
	$('#saveFileCSS').attr('href', 'data:text/css,' + encodeURI(editorCSS.getValue()).replace(/#/g, '%23'));
	$('#saveFileJS').attr('href', 'data:text/javascript,' + encodeURI(editorJS.getValue()).replace(/#/g, '%23'));
}
function beautifyCode() {
	app.dialog.create({
		title: 'Organizar código',
		text: 'Tem certeza que deseja organizar o código?',
		buttons: [
			{
				text: 'Todos',
				onClick: function () {
					let HTMLBeautifyCode = html_beautify(editorHTML.getValue(), { indent_char: '\t' });
					let CSSBeautifyCode = css_beautify(editorCSS.getValue(), { indent_char: '\t' });
					let JSBeautifyCode = js_beautify(editorJS.getValue(), { indent_char: '\t' });
					editorHTML.setValue(HTMLBeautifyCode);
					editorCSS.setValue(CSSBeautifyCode);
					editorJS.setValue(JSBeautifyCode);
					editorHTML.navigateFileEnd();
					editorCSS.navigateFileEnd();
					editorJS.navigateFileEnd();
					updateTitle();
				}
			},
			{
				text: 'Somente este',
				onClick: function () {
					let beautifyCode;
					switch (currentTab) {
						case 'tab-html': beautifyCode = html_beautify(editorCurrent.getValue(), { indent_char: '\t' }); break;
						case 'tab-css': beautifyCode = css_beautify(editorCurrent.getValue(), { indent_char: '\t' }); break;
						case 'tab-js': beautifyCode = js_beautify(editorCurrent.getValue(), { indent_char: '\t' }); break;
					}
					editorCurrent.setValue(beautifyCode);
					editorCurrent.navigateFileEnd();
					updateTitle();
				}
			},
			{ text: 'Cancelar' }
		]
	}).open();
}
function updateTitle() {
	let regexTitle = /<title[^>]*>([^<]+)<\/title>/;
	fileTitle = regexTitle.test(editorHTML.getValue()) ?
		(editorHTML.getValue().match(regexTitle)[1] ? editorHTML.getValue().match(regexTitle)[1] : 'Sem título')
		: 'Sem título';
	// vue.$forceUpdate();
}


// Run
var mobileConsole = true;
var mobileConsoleCode = '<script src="https://cdnjs.cloudflare.com/ajax/libs/eruda/1.5.8/eruda.min.js"></script><script>eruda.init()</script>';
var code = '';
function previewHTML() {
	var input = `${editorHTML.getValue()} <style> ${editorCSS.getValue()} </style> <script> ${editorJS.getValue()} </script>`;
	var output = parent.output.document;
	if (code != input) {
		code = input;
		output.open();
		output.write(code + (mobileConsole ? mobileConsoleCode : ''));
		output.close();
	}
}
function unloadHTML() {
	$('#output').replaceWith('<iframe name="output" id="output"><\/iframe>');
	code = '';
}
function reloadHTML() {
	unloadHTML();
	previewHTML();
}


// Close page actions
$('.page[data-name="result"]').on('page:afterout', function () {
	unloadHTML();
});


// Text editor custom buttons
var feditor = app.textEditor.create({
	el: '.text-editor',
	mode: 'keyboard-toolbar',
	placeholder: 'Insira o texto...',
	customButtons: {
		hr: {
			content: '<i class="mdi mdi-minus"></i>',
			onClick() {
				document.execCommand('insertHorizontalRule');
			}
		},
		removeFormat: {
			content: '<i class="mdi mdi-format-clear"></i>',
			onClick() {
				document.execCommand('removeFormat');
			}
		},
	},
	buttons: [
		['bold', 'italic', 'underline', 'strikeThrough'],
		['orderedList', 'unorderedList'],
		['link', 'image', 'hr'],
		['paragraph', 'h1', 'h2', 'h3'],
		['alignLeft', 'alignCenter', 'alignRight', 'alignJustify'],
		['subscript', 'superscript'],
		['indent', 'outdent'],
		['removeFormat']
	]
});

function initFEditor() {
	feditor.setValue(editorHTML.getSelectedText());
}

function saveFEditor() {
	editorHTML.insert(feditor.getValue());
}


$('.toggle').on('toggle:change', function () {
	editorCurrent.setShowInvisibles($('#hiddenChars').prop('checked'));
});