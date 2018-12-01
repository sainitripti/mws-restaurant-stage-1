//To check if service worker is registered
console.log('Service Worker is registered!');

//declaring and initialising varibles
let staticCache = 'version3';
let restaurantCache = [
				'/',
				'/index.html',
				'/restaurant.html',
				'/css/styles.css',
				'/js/dbhelper.js',
				'/js/main.js',
				'/js/restaurant_info.js',
				'/data/restaurants.json',
				'/img/1.jpg',
				'/img/2.jpg',
				'/img/3.jpg',
				'/img/4.jpg',
				'/img/5.jpg',
				'/img/6.jpg',
				'/img/7.jpg',
				'/img/8.jpg',
				'/img/9.jpg',
				'/img/10.jpg'				
			];

//initially opening the cache and adding all data to it
self.addEventListener('install', function(event) {
	event.waitUntil(
	    caches.open(staticCache).then(function(cache) {
	    	//signals cache is open
	    	console.log('Opened cache!');
	        return cache.addAll(restaurantCache);
      	})
	);
});

//to update the cache content
self.addEventListener('activate', function(event) {
	console.log('Service Worker Activated!');
	event.waitUntil(
		//collect cachenames and delete old cache
		caches.keys().then(function(cacheNames) {
			return Promise.all(
			    cacheNames.filter(function(cache) {
			    	return cache != staticCache;
			    }).map(function(cache) {
			    	return caches.delete(cache);
			    })
			);
		})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request).then(function(response) {
			if (response) {
				console.log('Response found!');
				return response;
			} else {
				console.log('No response in cache!');
				return fetch(event.request).then(function(response) {
					const responseToCache = response.clone();
					caches.open(staticCache).then(function(cache) {
						cache.put(event.request, responseToCache);
					});
					return response;
				}).catch(function(error) {
					console.log(error);
				});
			}
		})
	);
});

