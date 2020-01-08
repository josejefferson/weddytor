window.location.replace('#!/');

// Ações
$('[data-action]').click(function () {
	let action = $(this).data('action');
	switch (action) {
		case 'beautify': beautifyCode(); break;
		case 'copyAll': editorCurrent.selectAll(); editorCurrent.focus(); document.execCommand('copy'); break;
		case 'addPackageMount': addPackageMount(); break;
		case 'deleteAll': deleteAll(); break;
		case 'deleteSavedCodes': deleteSavedCodes(); break;
		case 'exportSettings': exportSettings(); break;
		case 'feditor': initFEditor(); break;
		case 'feedback': ; break;
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
		case 'share': navigator.share(shareDetails); break;
		case 'undo': editorCurrent.undo(); break;
	}
	updateTitle();
});

$('[data-return]').click(function () {
	app.views.main.router.back();
});

// Descarregar resultado
$('.page[data-name="result"]').on('page:beforeout', function () {
	unloadHTML();
});

// Configuração do seletor de arquivos personalizado
$('.customFileSelect').on('change', 'input[type=file]', function () {
	let fileName = $(this)[0].files[0] ? $(this)[0].files[0].name : 'Selecionar arquivo';
	$(this).siblings('.fileName').text(fileName);
});