'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "9a79a3d049aa43dceae8f0b6be2531d6",
"assets/AssetManifest.bin.json": "4a369cbbb722d74a18985a94a8a014e9",
"assets/AssetManifest.json": "5570dbeebcb4fbbe2b232b1f407da73f",
"assets/assets/audio/music/game_bgm.mp3": "0e5a0cba77273dc8411a7de5950487d5",
"assets/assets/audio/music/menu_bgm.mp3": "60335ec0e53657c712ad042af9289cfa",
"assets/assets/audio/sfx/court_hit_01.mp3": "bb3a40814eb433354500108391121df5",
"assets/assets/audio/sfx/court_hit_02.mp3": "eb05895e3d651abf382b433b1da54b24",
"assets/assets/audio/sfx/court_hit_03.mp3": "53eb9a2d486dd6223b3defb73ced12e8",
"assets/assets/audio/sfx/interact.mp3": "bdc9a53c94a5f4ccb4f6ea56141180b9",
"assets/assets/audio/sfx/paddle_hit_01.mp3": "8fe2e539e53451a579470c727094f980",
"assets/assets/audio/sfx/paddle_hit_02.mp3": "3b10cd7869efbe43760cee51c2245630",
"assets/assets/audio/sfx/paddle_hit_03.mp3": "43ce03948ce9ed7e823101a08192c821",
"assets/assets/audio/sfx/paddle_hit_04.mp3": "55bf77282f93c0cc2d67fd3d401b3233",
"assets/assets/audio/sfx/paddle_hit_05.mp3": "c461de39493299a54044020650b2b5a2",
"assets/assets/audio/sfx/paddle_hit_06.mp3": "3e4877a5a0235adbf0726935fff33f7e",
"assets/assets/fonts/Righteous-Regular.ttf": "77fa00996ecb4104c7880b8749c7c4e0",
"assets/assets/translations/en-US.json": "78679ed362ee874fbc688fb354f01a45",
"assets/assets/translations/sr-Latn-RS.json": "51ba17301f6dd28b7c769d2a3d46e263",
"assets/FontManifest.json": "0b1d34b1a6eb6e02b6185a26ef424d64",
"assets/fonts/MaterialIcons-Regular.otf": "50e28345de26fe54042942f9dc3e7886",
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
"flutter_bootstrap.js": "f2a0bc420c44aee01ca47c16e4feb61a",
"icons/Icon-192.png": "3f35e7fa55affaad8747403cc96a3ead",
"icons/Icon-512.png": "32c5323100a83306801ac8cbd0a9d30d",
"icons/Icon-maskable-192.png": "3f35e7fa55affaad8747403cc96a3ead",
"icons/Icon-maskable-512.png": "32c5323100a83306801ac8cbd0a9d30d",
"index.html": "7020dee5e6697ba9db4105a181f08d84",
"/": "7020dee5e6697ba9db4105a181f08d84",
"main.dart.js": "b283e8c4c5c4eadccee0926aae59d312",
"manifest.json": "be0ac5922a21d5d4ac6081a9a091fcaa",
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
