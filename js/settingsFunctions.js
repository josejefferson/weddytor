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
			itemHTML += newItemHTML(item, itemContent);
		}
		html += newGroupHTML(group, itemHTML);
	}

	$('#quickCodes').html(html);

	// Organizar manualmente os códigos (experimental)
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
function quickCodesAddGroup(e) {
	$(e.target).parent().siblings('.quickCodesList').children('ul').append(newGroupHTML());
}
function quickCodesRemoveGroup(e) {
	$(e.target).parent().parent().remove();
}
function quickCodesAddItem(e) {
	$(e.target).siblings('.list').children('ul').append(newItemHTML());
}
function quickCodesRemoveItem(e) {
	$(e.target).parent().parent().remove();
}
function quickCodesSave() {
	packages = {};
	$('.quickCodesGroup').each(function () {
		let groupName = $(this).find('.groupName').val();
		packages[groupName] = {};
		$(this).find('.quickCodesItem').each(function () {
			let itemName = $(this).find('.itemName').val();
			let itemContent = $(this).find('.itemContent').val();
			packages[groupName][itemName] = itemContent;
		});
	});

	localStorage.setItem('quickCodes', JSON.stringify(packages));

	app.toast.create({
		text: 'Bibliotecas e códigos rápidos atualizados',
		closeTimeout: 7000,
		closeButton: true,
	}).open();
}
function quickCodesRestore() {
	app.dialog.create({
		title: 'Restaurar bibliotecas e códigos rápidos',
		text: 'Tem certeza que deseja restaurar as bibliotecas e códigos rápidos padrão?',
		buttons: [
			{
				text: 'Sim',
				onClick: function () {
					packages = defaultPackages;
					quickCodesMount();
					$.removeCookie('quickCodes');
					app.toast.create({
						text: 'Bibliotecas e códigos rápidos padrão restaurados',
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
		content: `<label class="button button-fill link external margin-top" id="saveFileHTML">
				<span class="fileName">Selecionar arquivo</span>
				<input type="file" id="settingsFile" hidden>
			</label>`,
		buttons: [{ text: 'Cancelar' }],
		cssClass: 'importSettingsDialog'
	}).open();
	$('#settingsFile').change(async function () {
		let fileName = $(this)[0].files[0] ? $(this)[0].files[0].name : 'Selecionar arquivo';
		$(this).siblings('.fileName').text(fileName);
		let settingsFile = $('#settingsFile')[0].files[0];
		let settingsJSON = await readFile(settingsFile);
		try {
			$(window).off('beforeunload');
			clearInterval(autoSave);
			localStorage.clear();
			let settings = JSON.parse(settingsJSON);
			for (let sett in settings) { localStorage.setItem(sett, settings[sett]); }
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
	});
}
function exportSettings() {
	let settings = JSON.stringify(localStorage);
	app.dialog.create({
		title: 'Exportar configurações',
		text: 'Exporte os dados deste app para um arquivo',
		content: `<a href="data:application/json,${encodeURIComponent(settings)}" download="weddytor-settings-${Date.now()}.json"
			class="button button-fill link external margin-top" id="saveFileHTML">Salvar no dispositivo</a>`,
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
									localStorage.clear();
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