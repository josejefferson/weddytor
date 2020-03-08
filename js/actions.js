window.location.replace('#!/');

// Definir versão
if (self.fetch) {
	fetch('VERSION.txt').then(function (response) {
		return response.text();
	}).then(function (data) {
		appVersion = data;
	});
} else {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'VERSION.txt');
	xhr.onload = function () {
		if (xhr.status === 200) {
			appVersion = xhr.responseText;
		}
	};
	xhr.send();
}

$(document).not('input, textarea').add('.editor').on('contextmenu', function () {
	return false;
});

$('.editor').keyup(function (e) {
	$(document).keyup(function (e) {
		if (e.keyCode == 27) {
			editorBlur();
			editorCurrent.blur();
		}
	});
});

// Ações
$('[data-action]').click(function () {
	let action = $(this).data('action');
	switch (action) {
		case 'about': about(); break;
		case 'beautify': beautifyCode(); break;
		case 'copyAll': editorCurrent.selectAll(); editorCurrent.focus(); document.execCommand('copy'); break;
		case 'addPackageMount': addPackageMount(); break;
		case 'deleteAll': deleteAll(); break;
		case 'deleteSavedCodes': deleteSavedCodes(); break;
		case 'exportSettings': exportSettings(); break;
		case 'feditor': initFEditor(); break;
		case 'feedback': $('#feedbackIFrame').attr('src', feedbackSrc); break;
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
		case 'refreshResult': reloadHTML(); break;
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

// Pesquisar pacotes
$('#foundResults').hide();
$('#search').change(function () {
	let searchTerm = $('#search').val();
	if (searchTerm != '') {
		$.ajax({
			url: `https://api.cdnjs.com/libraries?search=${searchTerm}`,
			beforeSend: function () {
				$('#foundResults').hide();
				$('#searchInfo').html('<div class="text-align-center"><div class="preloader color-blue"></div></div>');
				app.preloader.init('#searchInfo .preloader');
			},
			success: function (data) {
				$('#foundResults ul').html('');
				if (data.results.length) {
					$('#searchInfo').html(`<div class="block-title">${data.total} resultados</div>`);
					$('#foundResults').show();
					data.results.forEach(function (elem) {
						$('#foundResults ul').append(`<a class="item-content item-link" onclick="mountDetails('${elem.name}')"><div class="item-inner"><div class="item-title">${elem.name}</div></div></a>`);
					});
				} else {
					$('#searchInfo').html('Sem resultados');
				}
			},
			error: function () {
				$('#searchInfo').html('Ocorreu um erro');
			}
		});
	} else {
		$('#foundResults').hide();
		$('#searchInfo').html('Digite o termo de busca na caixa acima e pressione Pesquisar no seu teclado ou Enter.<br>Dica: você pode utilizar o caractere * como curinga.<br><b class="margin-top">Distribuído por <a href="https://cdnjs.com/" class="link external">cdnjs.com</a></b>');
	}
});

function mountDetails(packageName) {
	app.preloader.show();
	$.ajax({
		url: `https://api.cdnjs.com/libraries/${packageName}?fields=name,filename,version,description,assets`,
		success: function (data) {
			latestVersion = `${data.version}` || '';
			$('#packageName').html(`${packageName} (${latestVersion})`);
			$('#packageDescription').html(data.description || 'Sem descrição');
			let defaultFileURL = data.filename ? `https://cdnjs.cloudflare.com/ajax/libs/${packageName}/${latestVersion}/${data.filename}` : undefined;
			let defaultFileHTML;

			if (defaultFileURL) {
				if (data.filename.endsWith('.js')) { defaultFileHTML = `<script src=\\\'${defaultFileURL}\\\'></script>`; }
				else if (data.filename.endsWith('.css')) { defaultFileHTML = `<link rel=\\\'stylesheet\\\' href=\\\'${defaultFileURL}\\\'>`; }
				else { defaultFileHTML = defaultFileURL; }

				$('#addToQuickCodes').show();
			} else {
				$('#addToQuickCodes').hide();
				$('#packageDefaultFile ul').html('<li class="item-content"><div class="item-inner"><div class="item-title">Não possui arquivo principal</div></div></li>');
			}

			defaultFileURL && ($('#addToQuickCodes').attr('onclick', `!packages['Pacotes do cdnjs.com'] && (packages['Pacotes do cdnjs.com'] = {}); packages['Pacotes do cdnjs.com']['${packageName}'] = '${defaultFileHTML}'; $.cookie('quickCodes', JSON.stringify(packages), { expires: 365 * 10 }); app.toast.create({ text: 'Adicionado com sucesso', closeTimeout: 7000, closeButton: true }).open()`));
			defaultFileURL && ($('#packageDefaultFile ul').html(`<li class="item-content item-link" onclick="editorCurrent.insert('${defaultFileHTML}'); app.toast.create({ text: 'Adicionado', closeTimeout: 7000, closeButton: true }).open()" oncontextmenu="copy('${defaultFileHTML}'); app.toast.create({ text: 'Copiado', closeTimeout: 7000, closeButton: true }).open()"><div class="item-inner"><div class="item-title">${data.filename}</div></div></li>`));
			$('#packageFiles ul').html('');
			data.assets[0].files.forEach(function (file) {
				if (file.endsWith('.js') || file.endsWith('.css')) {
					let fileURL = `https://cdnjs.cloudflare.com/ajax/libs/${packageName}/${latestVersion}/${file}`;
					let fileHTML;

					if (file.endsWith('.js')) { fileHTML = `<script src=\\\'${fileURL}\\\'></script>`; }
					else if (file.endsWith('.css')) { fileHTML = `<link rel=\\\'stylesheet\\\' href=\\\'${fileURL}\\\'>`; }
					else { fileHTML = fileURL; }

					$('#packageFiles ul').append(`<li class="item-content item-link" onclick="editorCurrent.insert('${fileHTML}'); app.toast.create({ text: 'Adicionado', closeTimeout: 7000, closeButton: true }).open()" oncontextmenu="copy('${fileHTML}'); app.toast.create({ text: 'Copiado', closeTimeout: 7000, closeButton: true }).open()"><div class="item-inner"><div class="item-title">${file}</div></div></li>`);
				}
			});
			app.views.main.router.navigate('/pSearchDetails/');
			app.preloader.hide();
		},
		error: function () {
			app.preloader.hide();
			app.toast.create({
				text: 'Não foi possível encontrar este pacote',
				closeTimeout: 7000,
				closeButton: true
			}).open();
		}
	});
}