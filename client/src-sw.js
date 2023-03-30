const { offlineFallback, warmStrategyCache } = require("workbox-recipes");
const { CacheFirst } = require("workbox-strategies");
const { registerRoute } = require("workbox-routing");
const { CacheableResponsePlugin } = require("workbox-cacheable-response");
const { ExpirationPlugin } = require("workbox-expiration");
const { precacheAndRoute } = require("workbox-precaching/precacheAndRoute");

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: "page-cache",
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ["/index.html", "/"],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === "navigate", pageCache);

//Implementing asset caching
const addResourcesToCache = async (resources) => {
  const cache = await caches.open("page-cache2");
  await cache.addAll(resources);
};

// The cache is not installed until all the information from the "addResourcesToCache" data is retrieved, then the cache is installed and able to be used.
self.addEventListener("install", (event) => {
  event.waitUntil(addResourcesToCache(["/src", "/favicon.ico", "/index.html"]));
});

// Once the fetch occurs on the cache (self), our "page-cache" is opened and searched for what is being fetched. If a match is found it is returned. If no match is found within the cache the network is then searched for a match and returned. Both the cache and the network are searched when online. When offline, the cache is used.
self.addEventListener('fetch', async (event) => {
    // Open the cache
    event.respondWith(caches.open("page-cache").then((cache) => {
      // Respond with match from the cache or from the network
      return cache.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request.url).then((fetchedResponse) => {
          // If the response is from the network, it is saved in the cache.
          cache.put(event.request, fetchedResponse.clone());
          // Return the network response if using the network response.
          return fetchedResponse;
        });
      });
    }));
    return new Response("🚫 Netork Error 🚫", {
      status: 408,
      headers: {"Content-Type": "text/plain"}
    })
});

registerRoute();
