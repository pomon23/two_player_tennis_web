'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "c1de17b32add3383b67a2b7ee0399896",
"assets/AssetManifest.bin.json": "a82982c6959bb9d0e6ab97e197eecca9",
"assets/AssetManifest.json": "565fb2634eb888236743ca434bf14b95",
"assets/assets/audio/music/game_bgm.ogg": "1579e232bbdfa418c7415b0fcd03e334",
"assets/assets/audio/music/menu_bgm.ogg": "7fea004109de1216499e856861d9aacd",
"assets/assets/audio/sfx/court_hit_01.ogg": "158538e17aaebde6577cc37331ca2912",
"assets/assets/audio/sfx/court_hit_02.ogg": "ebb4d7607ebdbce391e7a73906b76549",
"assets/assets/audio/sfx/court_hit_03.ogg": "c7f8e5d613936e6f9981aea904b1385f",
"assets/assets/audio/sfx/interact.ogg": "15d8df9dc8999eb08e522660412aace4",
"assets/assets/audio/sfx/paddle_hit_01.ogg": "ea97c8f6a9e056883829b791f439ee54",
"assets/assets/audio/sfx/paddle_hit_02.ogg": "3bc7f8f6df8c05d3f1dcf65f92ca79a7",
"assets/assets/audio/sfx/paddle_hit_03.ogg": "d435a3847f39988fa7cc2c65b3d23664",
"assets/assets/audio/sfx/paddle_hit_04.ogg": "1370afa44d2e604e9487efee5d021e13",
"assets/assets/audio/sfx/paddle_hit_05.ogg": "71ddf12e82ab6187e99c852730a4e481",
"assets/assets/audio/sfx/paddle_hit_06.ogg": "da5e9dcc248067082043a7f490b5d359",
"assets/assets/fonts/Righteous-Regular.ttf": "77fa00996ecb4104c7880b8749c7c4e0",
"assets/assets/translations/en-US.json": "2c2fe7557797dfd3dd5e279daaff8bb6",
"assets/assets/translations/sr-Latn-RS.json": "1994ddaee6d6dbbf34127a027cf6e848",
"assets/FontManifest.json": "0b1d34b1a6eb6e02b6185a26ef424d64",
"assets/fonts/MaterialIcons-Regular.otf": "d841a1228250cf1f68c40e41b2444358",
"assets/NOTICES": "ce32c5e06988ebe957eb105ea6628933",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/packages/flutter_soloud/web/init_module.dart.js": "ea0b343660fd4dace81cfdc2910d14e6",
"assets/packages/flutter_soloud/web/libflutter_soloud_plugin.js": "328542a0581477d30370a3f2929fbb7e",
"assets/packages/flutter_soloud/web/libflutter_soloud_plugin.wasm": "96e558342d9f27f5d10121484c51501e",
"assets/packages/flutter_soloud/web/worker.dart.js": "2fddc14058b5cc9ad8ba3a15749f9aef",
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
"flutter_bootstrap.js": "5d7dacbb807c00d37da7b84fa52de68b",
"icons/Icon-192.png": "3f35e7fa55affaad8747403cc96a3ead",
"icons/Icon-512.png": "32c5323100a83306801ac8cbd0a9d30d",
"icons/Icon-maskable-192.png": "3f35e7fa55affaad8747403cc96a3ead",
"icons/Icon-maskable-512.png": "32c5323100a83306801ac8cbd0a9d30d",
"index.html": "9ecc9588f732266ff4593d0b2dffec13",
"/": "9ecc9588f732266ff4593d0b2dffec13",
"main.dart.js": "bbc0bd147b9864b0767370262a1ed0ad",
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
