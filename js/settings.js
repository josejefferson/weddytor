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
	editorHTML.clearSelection();
	editorCSS.clearSelection();
	editorJS.clearSelection();
	app.toast.create({
		text: 'Sessão restaurada',
		closeTimeout: 7000,
		closeButton: true
	}).open();
}

function deleteSavedCodes() {
	$.removeCookie('olderHTML');
	$.removeCookie('olderCSS');
	$.removeCookie('olderJS');
	app.toast.create({
		text: 'Códigos salvos apagados',
		closeTimeout: 7000,
		closeButton: true
	}).open();
}

function quickCodesMount() {
	let html = '';
	for (let group in packages) {
		let itemHTML = '';
		for (let item in packages[group]) {
			let itemContent = packages[group][item];
			itemHTML += `<li class="accordion-item quickCodesItem">`;
			itemHTML += `	<a class="item-content item-link item-input">`;
			itemHTML += `		<div class="item-inner">`;
			itemHTML += `			<div class="item-input-wrap">`;
			itemHTML += `				<input type="text" placeholder="Nome do item" class="itemName" value="${item}">`;
			itemHTML += `			</div>`;
			itemHTML += `		</div>`;
			itemHTML += `	</a>`;
			itemHTML += `	<div class="accordion-item-content block">`;
			itemHTML += `		<div class="button button-fill margin-top color-red" onclick="quickCodesRemoveItem(event)">Remover item</div>`;
			itemHTML += `		<div class="item-input">`;
			itemHTML += `			<div class="item-input-wrap">`;
			itemHTML += `				<textarea placeholder="Conteúdo do item" class="itemContent">${itemContent}</textarea>`;
			itemHTML += `			</div>`;
			itemHTML += `		</div>`;
			itemHTML += `	</div>`;
			itemHTML += `	<div class="sortable-handler"></div>`;
			itemHTML += `</li>`;
		}
		html += `<li class="accordion-item quickCodesGroup">`;
		html += `	<a class="item-content item-link item-input">`;
		html += `		<div class="item-inner">`;
		html += `			<div class="item-input-wrap">`;
		html += `				<input type="text" placeholder="Nome do grupo" class="groupName" value="${group}">`;
		html += `			</div>`;
		html += `		</div>`;
		html += `	</a>`;
		html += `	<div class="accordion-item-content block quickCodesItemList">`;
		html += `		<div class="button button-fill margin-top color-red" onclick="quickCodesRemoveGroup(event)">Remover grupo</div>`;
		html += `		<div class="button button-fill margin-top color-green" onclick="quickCodesAddItem(event)">Adicionar item</div>`;
		html += `		<div class="list accordion-list sortable sortable-opposite">`;
		html += `			<ul>`;
		html += `				${itemHTML}`;
		html += `			</ul>`;
		html += `		</div>`;
		html += `	</div>`;
		html += `	<div class="sortable-handler"></div>`;
		html += `</li>`;
	}

	$('#quickCodes').html(html);

	$('#sortablePackagesToggle').on('toggle:change', function () {
		let value = app.toggle.get('#sortablePackagesToggle').checked;
		if (value) {
			$('.quickCodesList, .quickCodesItem').addClass('sortable-enabled');
			$('.accordion-item').on('accordion:opened accordion:closed', function (e) {
				let element = e.target;
				$(element).parent().children('.accordion-item-opened').length > 0 ?
					$(element).closest('.sortable').removeClass('sortable-enabled') :
					$(element).closest('.sortable').addClass('sortable-enabled');
			});
		} else {
			$('.quickCodesList, .quickCodesItem').closest('.list').removeClass('sortable-enabled');
			$('.accordion-item').off('accordion:opened accordion:closed');
		}
	});
}

function addPackageMount() {
	let html = '';
	for (let group in packages) {
		let itemHTML = '';
		for (let item in packages[group]) {
			let itemContent = packages[group][item];
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

var newItemHTML = '<li class="accordion-item quickCodesItem">' +
	'	<a class="item-content item-link item-input">' +
	'		<div class="item-inner">' +
	'			<div class="item-input-wrap">' +
	'				<input type="text" placeholder="Nome do item" class="itemName" value="Novo item">' +
	'			</div>' +
	'		</div>' +
	'	</a>' +
	'	<div class="accordion-item-content block">' +
	'		<div class="button button-fill margin-top color-red" onclick="quickCodesRemoveItem(event)">Remover item</div>' +
	'		<div class="item-input">' +
	'			<div class="item-input-wrap">' +
	'				<textarea placeholder="Conteúdo do item" class="itemContent"></textarea>' +
	'			</div>' +
	'		</div>' +
	'	</div>' +
	'	<div class="sortable-handler"></div>' +
	'</li>';

var newGroupHTML = '<li class="accordion-item quickCodesGroup">' +
	'	<a class="item-content item-link item-input">' +
	'		<div class="item-inner">' +
	'			<div class="item-input-wrap">' +
	'				<input type="text" placeholder="Nome do grupo" class="groupName" value="Novo grupo">' +
	'			</div>' +
	'		</div>' +
	'	</a>' +
	'	<div class="accordion-item-content block quickCodesItemList">' +
	'		<div class="button button-fill margin-top color-red" onclick="quickCodesRemoveGroup(event)">Remover grupo</div>' +
	'		<div class="button button-fill margin-top color-green" onclick="quickCodesAddItem(event)">Adicionar item</div>' +
	'		<div class="list accordion-list sortable sortable-opposite">' +
	'			<ul></ul>' +
	'		</div>' +
	'	</div>' +
	'	<div class="sortable-handler"></div>' +
	'</li>';

function quickCodesAddGroup(e) {
	$(e.target).parent().parent().children('.quickCodesList').children('ul').append(newGroupHTML);
}

function quickCodesRemoveGroup(e) {
	$(e.target).parent().parent().remove();
}

function quickCodesAddItem(e) {
	$(e.target).parent().children('.list').children('ul').append(newItemHTML);
}

function quickCodesRemoveItem(e) {
	$(e.target).parent().parent().remove();
}

function quickCodesSave() {
	packages = {};
	$('.quickCodesGroup').each(function () {
		let groupName = $(this).children('.item-content').children('.item-inner').children('.item-input-wrap').children('.groupName').val();
		packages[groupName] = {};
		$(this).children('.quickCodesItemList').children('.list').children('ul').children('.quickCodesItem').each(function () {
			let itemName = $(this).children('.item-content').children('.item-inner').children('.item-input-wrap').children('.itemName').val();
			let itemContent = $(this).children('.accordion-item-content').children('.item-input').children('.item-input-wrap').children('.itemContent').val();
			packages[groupName][itemName] = itemContent;
		});
	});

	$.cookie('quickCodes', JSON.stringify(packages));

	app.toast.create({
		text: 'Códigos rápidos atualizados',
		closeTimeout: 7000,
		closeButton: true,
	}).open();
}

function quickCodesRestore() {
	app.dialog.create({
		title: 'Restaurar códigos rápidos',
		text: 'Tem certeza que deseja restaurar os códigos rápidos padrão?',
		buttons: [
			{
				text: 'Sim',
				onClick: function () {
					packages = defaultPackages;
					quickCodesMount();
					$.removeCookie('quickCodes');
					app.toast.create({
						text: 'Códigos rápidos padrão restaurados',
						closeTimeout: 7000,
						closeButton: true,
					}).open();
				}
			},
			{
				text: 'Não'
			}
		]
	}).open();
}

function importSettings() {
	app.dialog.create({
		title: 'Importar configurações',
		text: 'Importe os dados deste app a partir de um arquivo. AS CONFIGURAÇÕES ATUAIS SERÃO PERDIDAS!',
		content: `<label class="button button-fill link external margin-top" id="saveFileHTML"><span class="fileName">Selecionar arquivo</span><input type="file" id="settingsFile" hidden></label>`,
		buttons: [{ text: 'Cancelar' }],
		cssClass: 'importSettingsDialog'
	}).open();
	$('#settingsFile').change(function () {
		let fileName = $(this)[0].files[0] ? $(this)[0].files[0].name : 'Selecionar arquivo';
		$(this).siblings('.fileName').text(fileName);
		let settingsFile = $('#settingsFile')[0].files[0];
		settingsF = new FileReader();
		settingsF.readAsText(settingsFile);
		settingsF.onload = () => {
			try {
				$(window).off('beforeunload');
				clearInterval(autoSave);
				for (let cookie in $.cookie()) { $.removeCookie(cookie); }
				let settings = JSON.parse(settingsF.result);
				for (let sett in settings) { $.cookie(sett, settings[sett]); }
				app.dialog.close('.importSettingsDialog');
				$('.view-main').html('');
				app.toast.create({ text: 'Configurações importadas com sucesso. Aguarde o recarregamento da página' }).open();
				window.location.reload();
			} catch (err) {
				app.toast.create({
					text: 'O arquivo que você escolheu é inválido',
					closeTimeout: 7000,
					closeButton: true
				}).open();
				app.dialog.close('.importSettingsDialog');
			}
		}

	});
}

function exportSettings() {
	let settings = JSON.stringify($.cookie());
	app.dialog.create({
		title: 'Exportar configurações',
		text: 'Exporte os dados deste app para um arquivo',
		content: `<a href="data:application/json,${encodeURI(settings).replace(/#/g, '%23')}" download="weddytor-settings-${Date.now()}.json" class="button button-fill link external margin-top" id="saveFileHTML">Salvar no dispositivo</a>`,
		buttons: [{ text: 'OK' }]
	}).open();
}

function restoreDefaultSettings() {
	app.dialog.create({
		title: 'Restaurar configurações padrão',
		text: 'Tem certeza que deseja restaurar as configurações padrão? Que tal criar um backup de suas configurações clicando no botão exportar?',
		buttons: [
			{
				text: 'Exportar',
				onClick: function () { exportSettings(); }
			},
			{
				text: 'Sim',
				onClick: function () {
					app.dialog.create({
						title: 'Restaurar configurações padrão',
						text: 'Último aviso! Você não poderá desfazer esta ação, a menos que você tenha exportado as configurações!',
						buttons: [
							{
								text: 'Sim',
								onClick: function () {
									$(window).off('beforeunload');
									clearInterval(autoSave);
									for (var cookie in $.cookie()) { $.removeCookie(cookie); }
									$('.view-main').html('');
									app.toast.create({ text: 'Configurações padrão restauradas com sucesso. Aguarde o recarregamento da página' }).open();
									window.location.reload();
								}
							},
							{ text: 'Não' }
						]
					}).open();
				}
			},
			{ text: 'Não' }
		]
	}).open();

}


var autoSave;

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

	$.cookie('exitSave') == 'false' ? (
		$(window).off('beforeunload'),
		app.toggle.get('#exitSaveToggle').checked = false
	) : $(window).on('beforeunload', saveCode);

	$.cookie('autoRestore') == 'false' ? app.toggle.get('#autoRestoreToggle').checked = false : false;

	if (($.cookie('olderHTML') || $.cookie('olderCSS') || $.cookie('olderJS'))) {
		$.cookie('autoRestore') == 'false' ? app.toast.create({
			text: 'Restaurar sessão anterior?',
			closeTimeout: 7000,
			closeButton: true,
			closeButtonText: 'Restaurar'
		}).open().on('closeButtonClick', restoreCode) : restoreCode();
	}

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
	$.cookie('darkTheme', value);
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
	$.cookie('darkThemeEditor', value);
});

$('#editorFontSizeRange').on('range:change', function (e) {
	let value = app.range.get(e.target).value;
	editorHTML.setOption('fontSize', value);
	editorCSS.setOption('fontSize', value);
	editorJS.setOption('fontSize', value);
	$('#editorFontSizeIndicator').text(value);
	$.cookie('fontSize', value);
});

$('#autoSaveToggle').on('toggle:change', function () {
	let value = app.toggle.get('#autoSaveToggle').checked;
	value ? autoSave = setInterval(saveCode, 6e4) : clearInterval(autoSave);
	$.cookie('autoSave', value);
});

$('#exitSaveToggle').on('toggle:change', function () {
	let value = app.toggle.get('#exitSaveToggle').checked;
	value ? $(window).on('beforeunload', saveCode) : $(window).off('beforeunload');
	$.cookie('exitSave', value);
});

$('#autoRestoreToggle').on('toggle:change', function () {
	let value = app.toggle.get('#autoRestoreToggle').checked;
	$.cookie('autoRestore', value);
});

$('#defaultHTMLCode').on('change', function () {
	let value = $(this).val();
	$.cookie('defaultHTMLCode', value);
	editorHTMLValue = value;
});

$('#defaultCSSCode').on('change', function () {
	let value = $(this).val();
	$.cookie('defaultCSSCode', value);
	editorCSSValue = value;
});

$('#defaultJSCode').on('change', function () {
	let value = $(this).val();
	$.cookie('defaultJSCode', value);
	editorJSValue = value;
});