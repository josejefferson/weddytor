self.addEventListener('install', e => {
	e.waitUntil(
		caches.open('htmleditor').then(cache => {
			return cache.addAll([
				'.',
				'app.js',
				'customF7.css',
				'index.css',
				'index.html',
				'index.js',
				'manifest.json',
				'sw.js',
				'user.js',
			])
				.then(() => self.skipWaiting());
		})
	);
});

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.open('htmleditor')
			.then(cache => cache.match(event.request, { ignoreSearch: true }))
			.then(response => {
				return response || fetch(event.request);
			})
	);
});