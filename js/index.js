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

window.location.replace('#!/');


// Variáveis
var currentTab = 'tab-html';
var fileTitle = 'Sem título';

// Framework7
var app = new Framework7({
	root: '#app',
	name: 'Editor de HTML',
	id: 'com.jeffersondantas.htmleditor',
	routes: [
		{ name: 'home', path: '/', pageName: 'home' },
		{ name: 'result', path: '/result/', pageName: 'result' },
		{ name: 'feditor', path: '/feditor/', pageName: 'feditor' },
		{ name: 'colorPick', path: '/colorPick/', pageName: 'colorPick' },
		{ name: 'open', path: '/open/', pageName: 'open' },
		{ name: 'save', path: '/save/', pageName: 'save' },
		{ name: 'settings', path: '/settings/', pageName: 'settings' },
		{ name: 'quickCodes', path: '/quickCodes/', pageName: 'quickCodes' },
	]
});

var mainView = app.views.create('.view-main', {
	stackPages: true,
	pushState: true,
});

var colorPicker = app.colorPicker.create({
	containerEl: '#colorPicker',
	targetElSetBackgroundColor: true,
	modules: ['current-color', 'sb-spectrum', 'hsb-sliders', 'rgb-sliders', 'alpha-slider', 'hex', 'palette'],
	openIn: 'auto',
	sliderValue: true,
	sliderValueEditable: true,
	sliderLabel: true,
	hexLabel: true,
	hexValueEditable: true,
	groupedModules: true,
	palette: [
		['#ffebee', '#ffcdd2', '#ef9a9a', '#e57373', '#ef5350', '#f44336', '#e53935', '#d32f2f', '#c62828', '#b71c1c', '#ff8a80', '#ff5252', '#ff1744', '#d50000'],
		['#fce4ec', '#f8bbd0', '#f48fb1', '#f06292', '#ec407a', '#e91e63', '#d81b60', '#c2185b', '#ad1457', '#880e4f', '#ff80ab', '#ff4081', '#f50057', '#c51162'],
		['#f3e5f5', '#e1bee7', '#ce93d8', '#ba68c8', '#ab47bc', '#9c27b0', '#8e24aa', '#7b1fa2', '#6a1b9a', '#4a148c', '#ea80fc', '#e040fb', '#d500f9', '#aa00ff'],
		['#ede7f6', '#d1c4e9', '#b39ddb', '#9575cd', '#7e57c2', '#673ab7', '#5e35b1', '#512da8', '#4527a0', '#311b92', '#b388ff', '#7c4dff', '#651fff', '#6200ea'],
		['#e8eaf6', '#c5cae9', '#9fa8da', '#7986cb', '#5c6bc0', '#3f51b5', '#3949ab', '#303f9f', '#283593', '#1a237e', '#8c9eff', '#536dfe', '#3d5afe', '#304ffe'],
		['#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0d47a1', '#82b1ff', '#448aff', '#2979ff', '#2962ff'],
		['#e1f5fe', '#b3e5fc', '#81d4fa', '#4fc3f7', '#29b6f6', '#03a9f4', '#039be5', '#0288d1', '#0277bd', '#01579b', '#80d8ff', '#40c4ff', '#00b0ff', '#0091ea'],
		['#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064', '#84ffff', '#18ffff', '#00e5ff', '#00b8d4'],
		['#e0f2f1', '#b2dfdb', '#80cbc4', '#4db6ac', '#26a69a', '#009688', '#00897b', '#00796b', '#00695c', '#004d40', '#a7ffeb', '#64ffda', '#1de9b6', '#00bfa5'],
		['#e8f5e9', '#c8e6c9', '#a5d6a7', '#81c784', '#66bb6a', '#4caf50', '#43a047', '#388e3c', '#2e7d32', '#1b5e20', '#b9f6ca', '#69f0ae', '#00e676', '#00c853'],
		['#f1f8e9', '#dcedc8', '#c5e1a5', '#aed581', '#9ccc65', '#8bc34a', '#7cb342', '#689f38', '#558b2f', '#33691e', '#ccff90', '#b2ff59', '#76ff03', '#64dd17'],
		['#f9fbe7', '#f0f4c3', '#e6ee9c', '#dce775', '#d4e157', '#cddc39', '#c0ca33', '#afb42b', '#9e9d24', '#827717', '#f4ff81', '#eeff41', '#c6ff00', '#aeea00'],
		['#fffde7', '#fff9c4', '#fff59d', '#fff176', '#ffee58', '#ffeb3b', '#fdd835', '#fbc02d', '#f9a825', '#f57f17', '#ffff8d', '#ffff00', '#ffea00', '#ffd600'],
		['#fff8e1', '#ffecb3', '#ffe082', '#ffd54f', '#ffca28', '#ffc107', '#ffb300', '#ffa000', '#ff8f00', '#ff6f00', '#ffe57f', '#ffd740', '#ffc400', '#ffab00'],
		['#fff3e0', '#ffe0b2', '#ffcc80', '#ffb74d', '#ffa726', '#ff9800', '#fb8c00', '#f57c00', '#ef6c00', '#e65100', '#ffd180', '#ffab40', '#ff9100', '#ff6d00'],
		['#fbe9e7', '#ffccbc', '#ffab91', '#ff8a65', '#ff7043', '#ff5722', '#f4511e', '#e64a19', '#d84315', '#bf360c', '#ff9e80', '#ff6e40', '#ff3d00', '#dd2c00'],
		['#efebe9', '#d7ccc8', '#bcaaa4', '#a1887f', '#8d6e63', '#795548', '#6d4c41', '#5d4037', '#4e342e', '#3e2723'],
		['#fafafa', '#f5f5f5', '#eeeeee', '#e0e0e0', '#bdbdbd', '#9e9e9e', '#757575', '#616161', '#424242', '#212121'],
		['#eceff1', '#cfd8dc', '#b0bec5', '#90a4ae', '#78909c', '#607d8b', '#546e7a', '#455a64', '#37474f', '#263238'],
		['#ffffff', '#000000']
	],
	value: {
		hex: '#ff0000',
	},
});

function getColorPicker() {
	return {
		hex: colorPicker.value.hex,
		rgb: 'rgb(' + colorPicker.value.rgb.join(', ') + ')',
		rgba: 'rgba(' + colorPicker.value.rgba.join(', ') + ')'
	}
}

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
editorHTML.setValue($.cookie('defaultHTMLCode') != undefined ? $.cookie('defaultHTMLCode') : editorHTMLValue);
editorHTML.clearSelection();
editorCSS.setValue($.cookie('defaultCSSCode') != undefined ? $.cookie('defaultCSSCode') : editorCSSValue);
editorCSS.clearSelection();
editorJS.setValue($.cookie('defaultJSCode') != undefined ? $.cookie('defaultJSCode') : editorJSValue);
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
$('#addPackage').on('click', '.actions-button[data-package]', function () {
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
$('[data-action]').click(function (e) {
	let action = $(this).data('action');
	switch (action) {
		case 'beautify': beautifyCode(); break;
		case 'copyAll': editorCurrent.selectAll(); editorCurrent.focus(); document.execCommand('copy'); break;
		case 'addPackageMount': addPackageMount(); break;
		case 'deleteAll': deleteAll(); break;
		case 'deleteSavedCodes': deleteSavedCodes(); break;
		case 'exportSettings': exportSettings(); break;
		case 'feditor': initFEditor(); break;
		case 'insertColorHEX': editorCurrent.insert(getColorPicker().hex); break;
		case 'insertColorRGB': editorCurrent.insert(getColorPicker().rgb); break;
		case 'insertColorRGBA': editorCurrent.insert(getColorPicker().rgba); break;
		case 'hiddenChars': editorCurrent.setShowInvisibles($('#hiddenChars').prop('checked')); break;
		case 'importSettings': importSettings(); break;
		case 'install': installApp(); break;
		case 'openFile': openFile(); break;
		case 'quickCodesMount': quickCodesMount(); break;
		case 'quickCodesRestore': quickCodesRestore(); break;
		case 'quickCodesSave': quickCodesSave(); break;
		case 'redo': editorCurrent.redo(); break;
		case 'restoreDefaultSettings': restoreDefaultSettings(); break;
		case 'restoreHTMLDefaultCode': $('#defaultHTMLCode').val(defaultEditorHTMLValue); $.removeCookie('defaultHTMLCode'); break;
		case 'restoreCSSDefaultCode': $('#defaultCSSCode').val(defaultEditorCSSValue); $.removeCookie('defaultCSSCode'); break;
		case 'restoreJSDefaultCode': $('#defaultJSCode').val(defaultEditorJSValue); $.removeCookie('defaultJSCode'); break;
		case 'run': previewHTML(); break;
		case 'saveFEditor': saveFEditor(); break;
		case 'saveFile': saveFile(); break;
		case 'selectAll': editorCurrent.selectAll(); editorCurrent.focus(); break;
		case 'undo': editorCurrent.undo(); break;
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
					updateTitle();
				}
			},
			{ text: 'Não' }
		]
	}).open();
}
function saveFile() {
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
	$('.fileTitle').text(fileTitle);
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


