/*
 * Retire the Gatsby offline worker at its original URL. Keep this file available
 * for returning visitors, even though the Next.js app never registers a worker.
 * Do not add a fetch handler: all requests must go directly to the network.
 */
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames
          .filter(
            (name) =>
              name.startsWith("gatsby-plugin-offline") ||
              name.startsWith("workbox-")
          )
          .map((name) => caches.delete(name))
      )

      // Remove the registration before navigating so the old worker cannot
      // regain control when the visitor returns. Local storage is preserved.
      await self.registration.unregister()
      const windows = await self.clients.matchAll({ type: "window" })
      await Promise.all(windows.map((client) => client.navigate(client.url)))
    })()
  )
})
