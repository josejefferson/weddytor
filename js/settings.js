$(document).ready(function () {
	localStorage.getItem('defaultHTMLCode') != undefined ? editorHTMLValue = localStorage.getItem('defaultHTMLCode') : false;
	localStorage.getItem('defaultCSSCode') != undefined ? editorCSSValue = localStorage.getItem('defaultCSSCode') : false;
	localStorage.getItem('defaultJSCode') != undefined ? editorJSValue = localStorage.getItem('defaultJSCode') : false;

	localStorage.getItem('darkTheme') == 'true' && ($('body').addClass('theme-dark'), $('#darkTheme').prop('checked', true));

	localStorage.getItem('darkThemeEditor') == 'false' && (
		editorHTML.setOption('theme', 'ace/theme/chrome'),
		editorCSS.setOption('theme', 'ace/theme/chrome'),
		editorJS.setOption('theme', 'ace/theme/chrome'),
		$('#darkThemeEditor').prop('checked', false));

	localStorage.getItem('textBreakEditor') == 'true' && (
		editorHTML.setOption('wrap', true),
		editorCSS.setOption('wrap', true),
		editorJS.setOption('wrap', true),
		$('#textBreakEditor').prop('checked', true)
	);

	localStorage.getItem('fontSize') && (
		editorHTML.setOption('fontSize', Number(localStorage.getItem('fontSize'))),
		editorCSS.setOption('fontSize', Number(localStorage.getItem('fontSize'))),
		editorJS.setOption('fontSize', Number(localStorage.getItem('fontSize'))),
		app.range.get('#editorFontSizeRange').setValue(Number(localStorage.getItem('fontSize'))),
		$('#editorFontSizeIndicator').text(localStorage.getItem('fontSize'))
	);

	localStorage.getItem('autoSave') == 'false' ? (
		clearInterval(autoSave),
		app.toggle.get('#autoSaveToggle').checked = false
	) : autoSave = setInterval(saveCode, 6e4);

	localStorage.getItem('autoRestore') == 'false' ? app.toggle.get('#autoRestoreToggle').checked = false : false;

	if ((localStorage.getItem('olderHTML') || localStorage.getItem('olderCSS') || localStorage.getItem('olderJS'))) {
		localStorage.getItem('autoRestore') == 'false' ? app.toast.create({
			text: 'Restaurar sessão anterior?',
			closeTimeout: 7000,
			closeButton: true,
			closeButtonText: 'Restaurar'
		}).open().on('closeButtonClick', restoreCode) : restoreCode();
	}

	localStorage.getItem('console') == 'false' ? (
		mobileConsole = false,
		app.toggle.get('#consoleToggle').checked = false
	) : mobileConsole = true;

	localStorage.getItem('watermark') == 'false' ? (
		watermark = false,
		app.toggle.get('#watermarkToggle').checked = false
	) : watermark = true;

	$('#defaultHTMLCode').val(localStorage.getItem('defaultHTMLCode') != undefined ? localStorage.getItem('defaultHTMLCode') : editorHTMLValue);
	$('#defaultCSSCode').val(localStorage.getItem('defaultCSSCode') != undefined ? localStorage.getItem('defaultCSSCode') : editorCSSValue);
	$('#defaultJSCode').val(localStorage.getItem('defaultJSCode') != undefined ? localStorage.getItem('defaultJSCode') : editorJSValue);

	localStorage.getItem('quickCodes') ? packages = JSON.parse(localStorage.getItem('quickCodes')) : false;
});

$('#hiddenCharsToggle').on('toggle:change', function () {
	editorCurrent.setShowInvisibles($('#hiddenChars').prop('checked'));
});

$('#darkThemeToggle').on('toggle:change', function () {
	let value = app.toggle.get('#darkThemeToggle').checked;
	value ? $('body').addClass('theme-dark') : $('body').removeClass('theme-dark');
	localStorage.setItem('darkTheme', value);
});

$('#darkThemeEditorToggle').on('toggle:change', function () {
	let value = app.toggle.get('#darkThemeEditorToggle').checked;
	value ? (
		editorHTML.setOption('theme', 'ace/theme/monokai'),
		editorCSS.setOption('theme', 'ace/theme/monokai'),
		editorJS.setOption('theme', 'ace/theme/monokai')
	) : (
			editorHTML.setOption('theme', 'ace/theme/chrome'),
			editorCSS.setOption('theme', 'ace/theme/chrome'),
			editorJS.setOption('theme', 'ace/theme/chrome')
		);
	localStorage.setItem('darkThemeEditor', value);
});

$('#editorFontSizeRange').on('range:change', function (e) {
	let value = app.range.get(e.target).value;
	editorHTML.setOption('fontSize', value);
	editorCSS.setOption('fontSize', value);
	editorJS.setOption('fontSize', value);
	$('#editorFontSizeIndicator').text(value);
	localStorage.setItem('fontSize', value);
});

$('#textBreakEditorToggle').on('toggle:change', function () {
	let value = app.toggle.get('#textBreakEditorToggle').checked;
	value ? (
		editorHTML.setOption('wrap', true),
		editorCSS.setOption('wrap', true),
		editorJS.setOption('wrap', true)
	) : (
			editorHTML.setOption('wrap', false),
			editorCSS.setOption('wrap', false),
			editorJS.setOption('wrap', false)
		);
	localStorage.setItem('textBreakEditor', value);
});

$('#darkThemeEditorToggle').on('toggle:change', function () {
	let value = app.toggle.get('#darkThemeEditorToggle').checked;
	value ? (
		editorHTML.setOption('theme', 'ace/theme/monokai'),
		editorCSS.setOption('theme', 'ace/theme/monokai'),
		editorJS.setOption('theme', 'ace/theme/monokai')
	) : (
			editorHTML.setOption('theme', 'ace/theme/chrome'),
			editorCSS.setOption('theme', 'ace/theme/chrome'),
			editorJS.setOption('theme', 'ace/theme/chrome')
		);
	localStorage.setItem('darkThemeEditor', value);
});

$('#autoSaveToggle').on('toggle:change', function () {
	let value = app.toggle.get('#autoSaveToggle').checked;
	value ? autoSave = setInterval(saveCode, 6e4) : clearInterval(autoSave);
	localStorage.setItem('autoSave', value);
});

$('#autoRestoreToggle').on('toggle:change', function () {
	let value = app.toggle.get('#autoRestoreToggle').checked;
	localStorage.setItem('autoRestore', value);
});

$('#consoleToggle').on('toggle:change', function () {
	let value = app.toggle.get('#consoleToggle').checked;
	value ? mobileConsole = true : mobileConsole = false;
	localStorage.setItem('console', value);
});

$('#watermarkToggle').on('toggle:change', function () {
	let value = app.toggle.get('#watermarkToggle').checked;
	value ? watermark = true : watermark = false;
	localStorage.setItem('watermark', value);
});

$('#defaultHTMLCode').on('change', function () {
	let value = $(this).val();
	localStorage.setItem('defaultHTMLCode', value);
	editorHTMLValue = value;
});

$('#defaultCSSCode').on('change', function () {
	let value = $(this).val();
	localStorage.setItem('defaultCSSCode', value);
	editorCSSValue = value;
});

$('#defaultJSCode').on('change', function () {
	let value = $(this).val();
	localStorage.setItem('defaultJSCode', value);
	editorJSValue = value;
});