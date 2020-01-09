var appVersion = '1.0.0-alpha';

var autoSave; // Guarda o timer do auto salvamento
var currentTab = 'tab-html'; // Guia atual
var fileTitle = 'Sem título'; // Título do arquivo
var packages = defaultPackages; // Define os códigos rápidos
var editorHTMLValue = defaultEditorHTMLValue; // Define o código padrão HTML
var editorCSSValue = defaultEditorCSSValue; // Define o código padrão CSS
var editorJSValue = defaultEditorJSValue; // Define o código padrão JS
var mobileConsole = true; // Define se utilizará um console no resultado
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

// Estrutura do editor de códigos rápidos
var newItemHTML = '<li class="accordion-item quickCodesItem">' +
	'	<a class="item-content item-link item-input">' +
	'		<div class="item-inner">' +
	'			<div class="item-input-wrap">' +
	'				<input type="text" placeholder="Nome do item" class="itemName" value="Novo item" required validate>' +
	'			</div>' +
	'		</div>' +
	'	</a>' +
	'	<div class="accordion-item-content block">' +
	'		<div class="button button-fill margin-top color-red" onclick="quickCodesRemoveItem(event)">Remover item</div>' +
	'		<div class="item-input">' +
	'			<div class="item-input-wrap">' +
	'				<textarea placeholder="Conteúdo do item" class="itemContent" required validate></textarea>' +
	'			</div>' +
	'		</div>' +
	'	</div>' +
	'	<div class="sortable-handler"></div>' +
	'</li>';

var newGroupHTML = '<li class="accordion-item quickCodesGroup">' +
	'	<a class="item-content item-link item-input">' +
	'		<div class="item-inner">' +
	'			<div class="item-input-wrap">' +
	'				<input type="text" placeholder="Nome do grupo" class="groupName" value="Novo grupo" required validate>' +
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