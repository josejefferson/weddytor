function conv(str) {
	if (typeof str != 'string') return str;
	else {
		if (str === '') return str;
		else if (str === 'true') return true;
		else if (str === 'false') return false;
		else if (str === 'undefined') return undefined;
		else if (str === 'NaN') return NaN;
		else if (str === 'null') return null;
		else {
			if (!isNaN(Number(str))) return Number(str);
			else try { return JSON.parse(str) } catch { return str; }
		}
	}
}

let searchParams = new URLSearchParams(window.location.search);
if (searchParams.has('homescreen')) {
	if (searchParams.get('homescreen') == 1) {
		$('#hasInstalled').text('Você está usando o app!');
	}
}

if (!window.navigator.onLine) {
	$('#hasOffline').text('Você está offline!');
}

$('#installApp').hide();
let deferredPrompt;
let setupButton;
let fired = conv($.cookie('installBanner')) || false;

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.js', { scope: '.' });
}

window.addEventListener('beforeinstallprompt', (e) => {
	e.preventDefault();
	deferredPrompt = e;
	if (setupButton == undefined) {
		setupButton = $('#installApp');
	}

	setupButton.show();
	if (!fired) {
		app.toast.create({
			text: 'Utilize este editor como um app',
			closeTimeout: 7000,
			closeButton: true,
			closeButtonText: 'Instalar'
		}).open().on('closeButtonClick', () => installApp());
	}
	fired = true;
	$.cookie('installBanner', 'true');
});


function installApp() {
	deferredPrompt.prompt();
	setupButton.hide();
	deferredPrompt.userChoice
		.then((choiceResult) => {
			if (choiceResult.outcome === 'accepted') {
				setupButton.hide();
				app.toast.create({
					text: 'Obrigado por instalar o app',
					closeTimeout: 7000,
					closeButton: true
				}).open();
			} else {
				setupButton.show();
				app.toast.create({
					text: 'Caso mude de ideia, clique no menu e em "Instalar como app"',
					closeTimeout: 7000,
					closeButton: true
				}).open();
			}
			deferredPrompt = null;
		});
}