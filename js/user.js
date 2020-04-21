var defaultEditorHTMLValue = '<!DOCTYPE html>\n<html lang="pt-br">\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<title></title>\n</head>\n<body>\n\t<h1>Hello World</h1>\n</body>\n</html>';
var defaultEditorCSSValue = '';
var defaultEditorJSValue = '';
var mobileConsoleCode = '<script src="https://cdn.jsdelivr.net/npm/eruda"></script><script>eruda.init()</script>';
var htmlWatermark = '<!-- Criado com Weddytor (https://josejefferson.github.io/weddytor/) -->\n';
var cssWatermark = '/* Criado com Weddytor (https://josejefferson.github.io/weddytor/) */\n';
var jsWatermark = '// Criado com Weddytor (https://josejefferson.github.io/weddytor/)\n';
var defaultPackages = {
	'CSS': {
		'Bootstrap': '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css">',
		'FontAwesome': '<script src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.12.0/js/fontawesome.min.js"></script>',
		'Material Icons': '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">',
		'Material Design Icons': '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/3.7.95/css/materialdesignicons.min.css">',
		'Legit Ripple': '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/legit-ripple@1.1.0/dist/ripple.min.css">',
	},
	'JavaScript': {
		'Bootstrap': '<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/js/bootstrap.bundle.min.js"></script>',
		'jQuery': '<script src="https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js"></script>',
		'jQuery Cookie': '<script src="https://cdn.jsdelivr.net/npm/jquery.cookie@1.4.1/jquery.cookie.min.js"></script>',
		'Legit Ripple': '<script src="https://cdn.jsdelivr.net/npm/legit-ripple@1.1.0/dist/ripple.min.js"></script>',
	},
	'Outros': {
		'Estrutura básica do HTML': defaultEditorHTMLValue,
	},
}