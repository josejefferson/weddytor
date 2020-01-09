self.addEventListener('install', e => {
	e.waitUntil(
		caches.open('weddytor').then(async cache => {
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
		caches.open('weddytor')
			.then(cache => cache.match(event.request, { ignoreSearch: true }))
			.then(response => {
				return response || fetch(event.request);
			})
	);
});