var appVersion = '0.0.0';

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

self.addEventListener('install', e => {
	e.waitUntil(
		caches.open(`weddytor-${appVersion}`).then(async cache => {
			await cache.addAll([
				'.',
				'favicon.ico',
				'index.html',
				'manifest.json',
				'sw.js',
				'css/customF7.css',
				'css/index.css',
				'icons/48.png',
				'icons/72.png',
				'icons/96.png',
				'icons/144.png',
				'icons/192.png',
				'icons/512.png',
				'icons/background.png',
				'js/ace.js',
				'js/actions.js',
				'js/app.js',
				'js/framework7.js',
				'js/functions.js',
				'js/settings.js',
				'js/settingsFunctions.js',
				'js/user.js',
				'js/variables.js',
			]);
			return self.skipWaiting();
		})
	);
});

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.open(`weddytor-${appVersion}`)
			.then(cache => cache.match(event.request, { ignoreSearch: true }))
			.then(response => {
				return response || fetch(event.request);
			})
	);
});