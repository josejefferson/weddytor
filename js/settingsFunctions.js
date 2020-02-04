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
			itemHTML += `				<input type="text" placeholder="Nome do item" class="itemName" value="${item}" required validate>`;
			itemHTML += `			</div>`;
			itemHTML += `		</div>`;
			itemHTML += `	</a>`;
			itemHTML += `	<div class="accordion-item-content block">`;
			itemHTML += `		<div class="button button-fill margin-top color-red" onclick="quickCodesRemoveItem(event)">Remover item</div>`;
			itemHTML += `		<div class="item-input">`;
			itemHTML += `			<div class="item-input-wrap">`;
			itemHTML += `				<textarea placeholder="Conteúdo do item" class="itemContent" required validate>${itemContent}</textarea>`;
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
		html += `				<input type="text" placeholder="Nome do grupo" class="groupName" value="${group}" required validate>`;
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
	$(e.target).parent().siblings('.quickCodesList').children('ul').append(newGroupHTML);
}
function quickCodesRemoveGroup(e) {
	$(e.target).parent().parent().remove();
}
function quickCodesAddItem(e) {
	$(e.target).siblings('.list').children('ul').append(newItemHTML);
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

	$.cookie('quickCodes', JSON.stringify(packages), { expires: 365 * 10 });

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
		settingsF.onload = function () {
			try {
				$(window).off('beforeunload');
				clearInterval(autoSave);
				for (let cookie in $.cookie()) { $.removeCookie(cookie); }
				let settings = JSON.parse(settingsF.result);
				for (let sett in settings) { $.cookie(sett, settings[sett], { expires: 365 * 10 }); }
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