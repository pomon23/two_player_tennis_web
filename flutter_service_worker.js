'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "b0e801ce4e2c7416b39bae111a86714e",
"assets/AssetManifest.bin.json": "f3b91a1a96930bd9c06c64da7b48f941",
"assets/AssetManifest.json": "2862a2aaea8c9073464da272cd38b321",
"assets/assets/audio/music/game_bgm.mp3": "0e5a0cba77273dc8411a7de5950487d5",
"assets/assets/audio/music/menu_bgm.mp3": "60335ec0e53657c712ad042af9289cfa",
"assets/assets/audio/sfx/court_hit_01.ogg": "29bca1a33957a3b43f82aad7b9964011",
"assets/assets/audio/sfx/court_hit_02.ogg": "e22a5d4d0224e0e3bb45be25856b6e49",
"assets/assets/audio/sfx/court_hit_03.ogg": "bc3ba98b04a3ac5e2ccf2e993e5a1dad",
"assets/assets/audio/sfx/interact.ogg": "40963b100d8a1d1d48e2989ccf2d5a46",
"assets/assets/audio/sfx/paddle_hit_01.ogg": "1217f1a82baac5583f23acc5bd4c0941",
"assets/assets/audio/sfx/paddle_hit_02.ogg": "793d9e5396436ed0b7b42ef2324a7f25",
"assets/assets/audio/sfx/paddle_hit_03.ogg": "91bb9a71fc9d3ba1a0a601857ef2cbd7",
"assets/assets/audio/sfx/paddle_hit_04.ogg": "91ef5eea8973963e25e4fa234ad9d021",
"assets/assets/audio/sfx/paddle_hit_05.ogg": "9e7a53d767a5328406ccd44afb8df829",
"assets/assets/audio/sfx/paddle_hit_06.ogg": "4e0f137610af168f43f3f819e31c7147",
"assets/assets/fonts/Righteous-Regular.ttf": "77fa00996ecb4104c7880b8749c7c4e0",
"assets/assets/translations/en-US.json": "2c2fe7557797dfd3dd5e279daaff8bb6",
"assets/assets/translations/sr-Latn-RS.json": "1994ddaee6d6dbbf34127a027cf6e848",
"assets/FontManifest.json": "0b1d34b1a6eb6e02b6185a26ef424d64",
"assets/fonts/MaterialIcons-Regular.otf": "d841a1228250cf1f68c40e41b2444358",
"assets/NOTICES": "bde2bc2f6df4e6c39f3cb357b159b847",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "728b2d477d9b8c14593d4f9b82b484f3",
"canvaskit/canvaskit.js.symbols": "bdcd3835edf8586b6d6edfce8749fb77",
"canvaskit/canvaskit.wasm": "7a3f4ae7d65fc1de6a6e7ddd3224bc93",
"canvaskit/chromium/canvaskit.js": "8191e843020c832c9cf8852a4b909d4c",
"canvaskit/chromium/canvaskit.js.symbols": "b61b5f4673c9698029fa0a746a9ad581",
"canvaskit/chromium/canvaskit.wasm": "f504de372e31c8031018a9ec0a9ef5f0",
"canvaskit/skwasm.js": "ea559890a088fe28b4ddf70e17e60052",
"canvaskit/skwasm.js.symbols": "e72c79950c8a8483d826a7f0560573a1",
"canvaskit/skwasm.wasm": "39dd80367a4e71582d234948adc521c0",
"favicon.png": "0d108707c55f56345130cffa4cd52a8a",
"flutter.js": "83d881c1dbb6d6bcd6b42e274605b69c",
"flutter_bootstrap.js": "e376d3c01fecf61c5869751704ef876f",
"icons/Icon-192.png": "3f35e7fa55affaad8747403cc96a3ead",
"icons/Icon-512.png": "32c5323100a83306801ac8cbd0a9d30d",
"icons/Icon-maskable-192.png": "3f35e7fa55affaad8747403cc96a3ead",
"icons/Icon-maskable-512.png": "32c5323100a83306801ac8cbd0a9d30d",
"index.html": "7020dee5e6697ba9db4105a181f08d84",
"/": "7020dee5e6697ba9db4105a181f08d84",
"main.dart.js": "3f80f958d1e644b71780230c61e75058",
"manifest.json": "7a1a497b655c57a1c682c1b6153a3bf6",
"version.json": "6c9cfcb673311318f4721e114978dd17"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
