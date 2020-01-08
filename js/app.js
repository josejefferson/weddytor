let deferredPrompt;
let setupButton;
let showInstallBanner = $.cookie('installBanner') == 'true' || false;
$('#installApp').hide();

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.js', { scope: '.' });
}

window.addEventListener('beforeinstallprompt', e => {
	e.preventDefault();
	deferredPrompt = e;
	if (setupButton == undefined) {
		setupButton = $('#installApp');
	}

	setupButton.show();
	if (!showInstallBanner) {
		app.toast.create({
			text: 'Utilize este editor como um app',
			closeTimeout: 7000,
			closeButton: true,
			closeButtonText: 'Instalar'
		}).open().on('closeButtonClick', () => installApp());
	}
	$.cookie('installBanner', 'true');
});


function installApp() {
	deferredPrompt.prompt();
	setupButton.hide();
	deferredPrompt.userChoice.then(choiceResult => {
		if (choiceResult.outcome === 'accepted') {
			setupButton.hide();
			app.toast.create({
				text: 'Obrigado por instalar o app',
				closeTimeout: 7000,
				closeButton: true
			}).open();
		} else {
			setupButton.show();
		}
		deferredPrompt = null;
	});
}