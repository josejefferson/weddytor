function updateTitle() {
	let regexTitle = /<title[^>]*>([^<]+)<\/title>/;
	fileTitle = regexTitle.test(editorHTML.getValue()) ?
		(editorHTML.getValue().match(regexTitle)[1] ? editorHTML.getValue().match(regexTitle)[1] : 'Sem título')
		: 'Sem título';
	$('.fileTitle').text(fileTitle);
}
function saveCode() {
	if (editorHTML.getValue() != editorHTMLValue ||
		editorCSS.getValue() != editorCSSValue ||
		editorJS.getValue() != editorJSValue) {
		$.cookie('olderHTML', editorHTML.getValue());
		$.cookie('olderCSS', editorCSS.getValue());
		$.cookie('olderJS', editorJS.getValue());
	}
}
function restoreCode() {
	editorHTML.setValue($.cookie('olderHTML'));
	editorCSS.setValue($.cookie('olderCSS'));
	editorJS.setValue($.cookie('olderJS'));
	editorHTML.navigateFileEnd();
	editorCSS.navigateFileEnd();
	editorJS.navigateFileEnd();
	updateTitle();
	app.toast.create({
		text: 'Sessão restaurada',
		closeTimeout: 7000,
		closeButton: true
	}).open();
}
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
function previewHTML() {
	var input = `${editorHTML.getValue()} <style> ${editorCSS.getValue()} </style> <script> ${editorJS.getValue()} </script>`;
	var output = parent.output.document;
	output.open();
	output.write(input + (mobileConsole ? mobileConsoleCode : ''));
	output.close();
}
function unloadHTML() {
	$('#output').replaceWith('<iframe name="output" id="output"><\/iframe>');
}
function reloadHTML() {
	unloadHTML();
	previewHTML();
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

					htmlFile && editorHTML.setValue('');
					cssFile && editorCSS.setValue('');
					jsFile && editorJS.setValue('');

					htmlF.onload = function () { editorHTML.setValue(htmlF.result || ''); editorHTML.navigateFileEnd(); }
					cssF.onload = function () { editorCSS.setValue(cssF.result || ''); editorCSS.navigateFileEnd(); }
					jsF.onload = function () { editorJS.setValue(jsF.result || ''); editorJS.navigateFileEnd(); }

					app.toast.create({
						text: 'Arquivo(s) aberto(s)',
						closeTimeout: 7000,
						closeButton: true
					}).open();

					$('#openFileHTML, #openFileCSS, #openFileJS').val('');
					updateTitle();
					app.views.main.router.back();
				}
			},
			{ text: 'Não' }
		]
	}).open();
}
function saveFile() {
	editorHTML.getValue() == '' ? $('#saveFileHTML').addClass('disabled') : $('#saveFileHTML').removeClass('disabled');
	editorCSS.getValue() == '' ? $('#saveFileCSS').addClass('disabled') : $('#saveFileCSS').removeClass('disabled');
	editorJS.getValue() == '' ? $('#saveFileJS').addClass('disabled') : $('#saveFileJS').removeClass('disabled');

	editorHTML.getValue() == '' && editorCSS.getValue() == '' && editorJS.getValue() == '' ?
		$('#saveFileZIP').addClass('disabled') : $('#saveFileZIP').removeClass('disabled');

	let zip = new JSZip();
	editorHTML.getValue() != '' && (zip.file("index.html", editorHTML.getValue()));
	editorCSS.getValue() != '' && (zip.file('index.css', editorCSS.getValue()));
	editorJS.getValue() != '' && (zip.file('index.js', editorJS.getValue()));
	zip.generateAsync({
		type: "blob"
	}).then(function (content) {
		let url = window.URL.createObjectURL(content);
		$('#saveFileZIP').attr('href', url);
		$('#download').attr({ 'href': url, 'target': '_blank', 'download': 'download.zip' });
	});

	$('#saveFileHTML').attr('download', fileTitle + '.html');
	$('#saveFileCSS').attr('download', fileTitle + '.css');
	$('#saveFileJS').attr('download', fileTitle + '.js');
	$('#saveFileZIP').attr('download', fileTitle + '.zip');

	$('#saveFileHTML').attr('href', 'data:text/html,' + encodeURI(editorHTML.getValue()).replace(/#/g, '%23'));
	$('#saveFileCSS').attr('href', 'data:text/css,' + encodeURI(editorCSS.getValue()).replace(/#/g, '%23'));
	$('#saveFileJS').attr('href', 'data:text/javascript,' + encodeURI(editorJS.getValue()).replace(/#/g, '%23'));
}
function addPackageMount() {
	let html = '';
	for (let group in packages) {
		let itemHTML = '';
		for (let item in packages[group]) {
			itemHTML += `<div class="actions-button actions-close" data-group="${group}" data-package="${item}">${item}</div>`;
		}
		html += `<div class="actions-group">`;
		html += `	<div class="actions-label">${group}</div>`;
		html += `	${itemHTML}`;
		html += `</div>`;
	}
	html += `<div class="actions-group">`;
	html += `	<div class="actions-button actions-close color-red">FECHAR</div>`;
	html += `</div>`;

	$('#addPackage').html(html);
}
function about() {
	app.dialog.create({
		title: 'Sobre o Weddytor',
		text: `Weddytor v${appVersion}<br>Copyright © Jefferson Dantas 2020`,
		buttons: [{ text: 'OK' }, {
			text: 'Licença',
			onClick: function () {
				window.open('LICENSE.txt', '_blank');
			}
		}]
	}).open();
}