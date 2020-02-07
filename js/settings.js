$(document).ready(function () {
	$.cookie('defaultHTMLCode') != undefined ? editorHTMLValue = $.cookie('defaultHTMLCode') : false;
	$.cookie('defaultCSSCode') != undefined ? editorCSSValue = $.cookie('defaultCSSCode') : false;
	$.cookie('defaultJSCode') != undefined ? editorJSValue = $.cookie('defaultJSCode') : false;

	$.cookie('darkTheme') == 'true' && ($('body').addClass('theme-dark'), $('#darkTheme').prop('checked', true));

	$.cookie('darkThemeEditor') == 'false' && (
		editorHTML.setOption('theme', 'ace/theme/chrome'),
		editorCSS.setOption('theme', 'ace/theme/chrome'),
		editorJS.setOption('theme', 'ace/theme/chrome'),
		$('#darkThemeEditor').prop('checked', false));

	$.cookie('textBreakEditor') == 'true' && (
		editorHTML.setOption('wrap', true),
		editorCSS.setOption('wrap', true),
		editorJS.setOption('wrap', true),
		$('#textBreakEditor').prop('checked', true)
	);

	$.cookie('fontSize') && (
		editorHTML.setOption('fontSize', Number($.cookie('fontSize'))),
		editorCSS.setOption('fontSize', Number($.cookie('fontSize'))),
		editorJS.setOption('fontSize', Number($.cookie('fontSize'))),
		app.range.get('#editorFontSizeRange').setValue(Number($.cookie('fontSize'))),
		$('#editorFontSizeIndicator').text($.cookie('fontSize'))
	);

	$.cookie('autoSave') == 'false' ? (
		clearInterval(autoSave),
		app.toggle.get('#autoSaveToggle').checked = false
	) : autoSave = setInterval(saveCode, 6e4);

	$.cookie('autoRestore') == 'false' ? app.toggle.get('#autoRestoreToggle').checked = false : false;

	if (($.cookie('olderHTML') || $.cookie('olderCSS') || $.cookie('olderJS'))) {
		$.cookie('autoRestore') == 'false' ? app.toast.create({
			text: 'Restaurar sessão anterior?',
			closeTimeout: 7000,
			closeButton: true,
			closeButtonText: 'Restaurar'
		}).open().on('closeButtonClick', restoreCode) : restoreCode();
	}

	$.cookie('console') == 'false' ? (
		mobileConsole = false,
		app.toggle.get('#consoleToggle').checked = false
	) : mobileConsole = true;

	$.cookie('watermark') == 'false' ? (
		watermark = false,
		app.toggle.get('#watermarkToggle').checked = false
	) : watermark = true;

	$('#defaultHTMLCode').val($.cookie('defaultHTMLCode') != undefined ? $.cookie('defaultHTMLCode') : editorHTMLValue);
	$('#defaultCSSCode').val($.cookie('defaultCSSCode') != undefined ? $.cookie('defaultCSSCode') : editorCSSValue);
	$('#defaultJSCode').val($.cookie('defaultJSCode') != undefined ? $.cookie('defaultJSCode') : editorJSValue);

	$.cookie('quickCodes') ? packages = JSON.parse($.cookie('quickCodes')) : false;
});

$('#hiddenCharsToggle').on('toggle:change', function () {
	editorCurrent.setShowInvisibles($('#hiddenChars').prop('checked'));
});

$('#darkThemeToggle').on('toggle:change', function () {
	let value = app.toggle.get('#darkThemeToggle').checked;
	value ? $('body').addClass('theme-dark') : $('body').removeClass('theme-dark');
	$.cookie('darkTheme', value, { expires: 365 * 10 });
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
	$.cookie('darkThemeEditor', value, { expires: 365 * 10 });
});

$('#editorFontSizeRange').on('range:change', function (e) {
	let value = app.range.get(e.target).value;
	editorHTML.setOption('fontSize', value);
	editorCSS.setOption('fontSize', value);
	editorJS.setOption('fontSize', value);
	$('#editorFontSizeIndicator').text(value);
	$.cookie('fontSize', value, { expires: 365 * 10 });
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
	$.cookie('textBreakEditor', value, { expires: 365 * 10 });
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
	$.cookie('darkThemeEditor', value, { expires: 365 * 10 });
});

$('#autoSaveToggle').on('toggle:change', function () {
	let value = app.toggle.get('#autoSaveToggle').checked;
	value ? autoSave = setInterval(saveCode, 6e4) : clearInterval(autoSave);
	$.cookie('autoSave', value, { expires: 365 * 10 });
});

$('#autoRestoreToggle').on('toggle:change', function () {
	let value = app.toggle.get('#autoRestoreToggle').checked;
	$.cookie('autoRestore', value, { expires: 365 * 10 });
});

$('#consoleToggle').on('toggle:change', function () {
	let value = app.toggle.get('#consoleToggle').checked;
	value ? mobileConsole = true : mobileConsole = false;
	$.cookie('console', value, { expires: 365 * 10 });
});

$('#watermarkToggle').on('toggle:change', function () {
	let value = app.toggle.get('#watermarkToggle').checked;
	value ? watermark = true : watermark = false;
	$.cookie('watermark', value, { expires: 365 * 10 });
});

$('#defaultHTMLCode').on('change', function () {
	let value = $(this).val();
	$.cookie('defaultHTMLCode', value, { expires: 365 * 10 });
	editorHTMLValue = value;
});

$('#defaultCSSCode').on('change', function () {
	let value = $(this).val();
	$.cookie('defaultCSSCode', value, { expires: 365 * 10 });
	editorCSSValue = value;
});

$('#defaultJSCode').on('change', function () {
	let value = $(this).val();
	$.cookie('defaultJSCode', value, { expires: 365 * 10 });
	editorJSValue = value;
});