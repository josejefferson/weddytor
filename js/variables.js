var appVersion = '';
var autoSave; // Guarda o timer do auto salvamento
var currentTab = 'tab-html'; // Guia atual
var fileTitle = 'Sem título'; // Título do arquivo
var packages = defaultPackages; // Define as bibliotecas e códigos rápidos
var editorHTMLValue = defaultEditorHTMLValue; // Define o código padrão HTML
var editorCSSValue = defaultEditorCSSValue; // Define o código padrão CSS
var editorJSValue = defaultEditorJSValue; // Define o código padrão JS
var feedbackSrc = 'https://docs.google.com/forms/d/e/1FAIpQLScAUJafppfs1sJhgRuVrtX0MKQRMl4NDX4smA-ReBXs9nUnUA/viewform?embedded=true';
var mobileConsole = true; // Define se utilizará um console no resultado
var watermark = true; // Define se deve-se incluir marca d'água no arquivo
var editorOptions = { // Opções do Ace Editor
	autoScrollEditorIntoView: true,
	fontSize: 14,
	printMargin: false,
	useSoftTabs: false,
	theme: 'ace/theme/monokai',
}

var shareDetails = {
	title: 'Weddytor',
	text: 'Editor de HTML online',
	url: 'https://josejefferson.github.io/weddytor/#!/'
}

// Estrutura do editor de bibliotecas e códigos rápidos
var newItemHTML = (...params) => `<li class="accordion-item quickCodesItem">
		<a class="item-content item-link item-input">
			<div class="item-inner">
				<div class="item-input-wrap">
					<input type="text" placeholder="Nome do item" class="itemName" value="${params[0] || 'Novo item'}" required validate>
				</div>
			</div>
		</a>
		<div class="accordion-item-content block">
			<div class="button button-fill margin-top color-red" onclick="quickCodesRemoveItem(event)">Remover item</div>
			<div class="item-input">
				<div class="item-input-wrap">
					<textarea placeholder="Conteúdo do item" class="itemContent" required validate>${params[1] || ''}</textarea>
				</div>
			</div>
		</div>
		<div class="sortable-handler"></div>
	</li>`;

var newGroupHTML = (...params) => `<li class="accordion-item quickCodesGroup">
		<a class="item-content item-link item-input">
			<div class="item-inner">
				<div class="item-input-wrap">
					<input type="text" placeholder="Nome do grupo" class="groupName" value="${params[0] || 'Novo grupo'}" required validate>
				</div>
			</div>
		</a>
		<div class="accordion-item-content block quickCodesItemList">
			<div class="button button-fill margin-top color-red" onclick="quickCodesRemoveGroup(event)">Remover grupo</div>
			<div class="button button-fill margin-top color-green" onclick="quickCodesAddItem(event)">Adicionar item</div>
			<div class="list accordion-list sortable sortable-opposite">
				<ul>
					${params[1] || ''}
				</ul>
			</div>
		</div>
		<div class="sortable-handler"></div>
	</li>`;

var addPackageCloseHTML = `<div class="actions-group">
		<div class="actions-button actions-close color-red">FECHAR</div>
	</div>`;

var addPackageItemHTML = (...params) => `<div class="actions-button actions-close" data-group="${params[0]}" data-package="${params[1]}">${params[1]}</div>`;
var addPackageGroupHTML = (...params) => `<div class="actions-group">
		<div class="actions-label">${params[0]}</div>
		${params[1]}
	</div>`;