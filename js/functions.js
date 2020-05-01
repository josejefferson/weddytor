function copy(text) {
	var el = document.createElement('textarea');
	el.value = text;
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
}
function updateTitle() {
	let regexTitle = /<title[^>]*>([^<]+)<\/title>/;
	fileTitle = regexTitle.test(editorHTML.getValue()) ?
		(editorHTML.getValue().match(regexTitle)[1] ?
			editorHTML.getValue().match(regexTitle)[1] : 'Sem título') : 'Sem título';
	$('.fileTitle').text(fileTitle);
}
function readFile(file) {
	return new Promise((resolve, reject) => {
		let reader = new FileReader();
		reader.onload = () => {
			resolve(reader.result);
		};
		reader.onerror = reject;
		reader.readAsText(file);
	})
}
function saveCode() {
	if (editorHTML.getValue() != editorHTMLValue ||
		editorCSS.getValue() != editorCSSValue ||
		editorJS.getValue() != editorJSValue) {
		localStorage.setItem('olderHTML', editorHTML.getValue());
		localStorage.setItem('olderCSS', editorCSS.getValue());
		localStorage.setItem('olderJS', editorJS.getValue());
	}
}
function restoreCode() {
	editorHTML.setValue(localStorage.getItem('olderHTML'));
	editorCSS.setValue(localStorage.getItem('olderCSS'));
	editorJS.setValue(localStorage.getItem('olderJS'));
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
				onClick: async function () {
					let htmlFile = $('#openFileHTML')[0].files[0];
					let cssFile = $('#openFileCSS')[0].files[0];
					let jsFile = $('#openFileJS')[0].files[0];

					let html = htmlFile && await readFile(htmlFile);
					let css = cssFile && await readFile(cssFile);
					let js = jsFile && await readFile(jsFile);

					htmlFile && editorHTML.setValue('');
					cssFile && editorCSS.setValue('');
					jsFile && editorJS.setValue('');

					htmlFile && (editorHTML.setValue(html.startsWith(htmlWatermark) ?
						html.substring(htmlWatermark.length) : html || ''),
						editorHTML.navigateFileEnd());
					cssFile && (editorCSS.setValue(css.startsWith(cssWatermark) ?
						css.substring(cssWatermark.length) : css || ''),
						editorCSS.navigateFileEnd());
					jsFile && (editorJS.setValue(js.startsWith(jsWatermark) ?
						js.substring(jsWatermark.length) : js || ''),
						editorJS.navigateFileEnd());

					app.toast.create({
						text: 'Arquivo(s) aberto(s)',
						closeTimeout: 7000,
						closeButton: true
					}).open();

					$('#openFileHTML, #openFileCSS, #openFileJS').val('');
					updateTitle();
					saveCode();
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
	editorHTML.getValue() != '' && (zip.file("index.html", (watermark ? htmlWatermark : '') + editorHTML.getValue()));
	editorCSS.getValue() != '' && (zip.file('index.css', (watermark ? cssWatermark : '') + editorCSS.getValue()));
	editorJS.getValue() != '' && (zip.file('index.js', (watermark ? jsWatermark : '') + editorJS.getValue()));
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

	$('#saveFileHTML').attr('href', 'data:text/html,' + encodeURIComponent((watermark ? htmlWatermark : '') + editorHTML.getValue()));
	$('#saveFileCSS').attr('href', 'data:text/css,' + encodeURIComponent((watermark ? cssWatermark : '') + editorCSS.getValue()));
	$('#saveFileJS').attr('href', 'data:text/javascript,' + encodeURIComponent((watermark ? jsWatermark : '') + editorJS.getValue()));
}
function addPackageMount() {
	let html = addPackageCloseHTML;
	for (let group in packages) {
		let itemHTML = '';
		for (let item in packages[group]) {
			itemHTML += addPackageItemHTML(group, item);
		}
		html += addPackageGroupHTML(group, itemHTML);
	}

	$('#addPackage').html(html);
}
function about() {
	app.dialog.create({
		title: 'Sobre o Weddytor',
		text: `Weddytor v${appVersion}<br>Desenvolvido por Jefferson Dantas`,
		buttons: [{ text: 'OK' }]
	}).open();
}