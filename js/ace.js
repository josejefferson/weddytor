// Configuração do Ace Editor
var editorHTML = ace.edit('editorHTML', editorOptions);
var editorCSS = ace.edit('editorCSS', editorOptions);
var editorJS = ace.edit('editorJS', editorOptions);

editorHTML.setOptions({ mode: 'ace/mode/html' });
editorCSS.setOptions({ mode: 'ace/mode/css' });
editorJS.setOptions({ mode: 'ace/mode/javascript' });

editorHTML.renderer.setScrollMargin(5, 5);
editorCSS.renderer.setScrollMargin(5, 5);
editorJS.renderer.setScrollMargin(5, 5);

// Definir o valor inicial dos editores
editorHTML.setValue($.cookie('defaultHTMLCode') != undefined ? $.cookie('defaultHTMLCode') : editorHTMLValue);
editorCSS.setValue($.cookie('defaultCSSCode') != undefined ? $.cookie('defaultCSSCode') : editorCSSValue);
editorJS.setValue($.cookie('defaultJSCode') != undefined ? $.cookie('defaultJSCode') : editorJSValue);
updateTitle();
editorHTML.clearSelection();
editorCSS.clearSelection();
editorJS.clearSelection();

// Definir o editor atual
var editorCurrent = editorHTML;
$('#tab-html').on('tab:show', function () { editorCurrent = editorHTML });
$('#tab-css').on('tab:show', function () { editorCurrent = editorCSS });
$('#tab-js').on('tab:show', function () { editorCurrent = editorJS });

// Ajustar o toggle da opção 'Caracteres ocultos'
$('.tab').on('tab:show', function () {
	currentTab = $('.tab-active').attr('id');
	$('#hiddenChars').prop('checked', editorCurrent.getShowInvisibles());
});

// Configuração do modo de edição
editorHTML.on('focus', editorFocus);
editorCSS.on('focus', editorFocus);
editorJS.on('focus', editorFocus);
$('.toolbarX').click(editorBlur);

// Configuração da barra de ferramentas com caracteres rápidos
$('#quickCharacters .link:not(.toolbarX):not(.toolbarTab)').on('click contextmenu', function () {
	let char = $(this).text();
	editorCurrent.insert(char);
	editorCurrent.focus();
});

$('#quickCharacters .link.toolbarTab').on('click contextmenu', function () {
	editorCurrent.insert('\t');
	editorCurrent.focus();
});

function editorFocus() {
	if (!Framework7.device.desktop) {
		app.navbar.hide('.navbar');
		app.toolbar.hide('.toolbar.toolbar-top');
		switch (editorCurrent) {
			case editorHTML: app.toolbar.show('.htmlQuickCharacters'); break;
			case editorCSS: app.toolbar.show('.cssQuickCharacters'); break;
			case editorJS: app.toolbar.show('.jsQuickCharacters'); break;
		}
		$('.tab').addClass('no-padding-top').removeClass('no-padding-bottom');
		$('.fab').fadeOut();
	}
}
function editorBlur() {
	updateTitle();
	app.navbar.show('.navbar');
	app.toolbar.show('.toolbar.toolbar-top');
	app.toolbar.hide('.htmlQuickCharacters');
	app.toolbar.hide('.cssQuickCharacters');
	app.toolbar.hide('.jsQuickCharacters');
	$('.tab').removeClass('no-padding-top').addClass('no-padding-bottom');
	$('.fab').fadeIn();
}

// Configuração do gerenciador de pacotes
$('#addPackage').on('click', '.actions-button[data-package]', function () {
	let group = $(this).data('group');
	let package = $(this).data('package');
	editorCurrent.insert(packages[group][package]);
	updateTitle();
});