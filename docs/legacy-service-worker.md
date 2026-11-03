# Returning visitors seeing the old frontend

The likely cause is the offline service worker left behind by the Gatsby site.
The Next.js migration removed the worker script without deploying a replacement
that retires existing registrations.

Evidence collected on November 3, 2026:

- Production `/` returns Next.js HTML with
  `Cache-Control: private,no-cache,no-store,max-age=0,must-revalidate`.
- Production `/sw.js` returns **404 HTML**, rather than a worker update.
- `www.pittcs.wiki` redirects to `pittcs.wiki`.
- A [surviving fork of the Gatsby site](https://github.com/zhenyudg/pittcswiki.github.io/blob/76163b871c47cd0c3dd642f31527b3b97f8bf959/gatsby-config.js)
  enables `gatsby-plugin-offline`. Gatsby's worker URL is `/sw.js`.
- [Commit `72b32fd`](https://github.com/pittcsc/pittcs-wiki/commit/72b32fd56fa7a610e7f166956147dda6fd57d071) already attempted to resolve stale HTML using dynamic
  rendering. HTTP cache headers do not invalidate service worker Cache Storage.

The relevant production response headers were rechecked at **15:45 UTC**:

```text
$ curl -sSI https://pittcs.wiki/
HTTP/2 200
cache-control: private,no-cache,no-store,max-age=0,must-revalidate
content-type: text/html; charset=utf-8
x-powered-by: Next.js

$ curl -sSI https://pittcs.wiki/sw.js
HTTP/2 404
cache-control: private,no-cache,no-store,max-age=0,must-revalidate
content-type: text/html; charset=utf-8

$ curl -sSI https://www.pittcs.wiki/
HTTP/2 301
location: https://pittcs.wiki/
```

The homepage and worker URL were also checked with GET, with the same status
codes and cache headers. Gatsby's [browser API documentation](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/#registerServiceWorker)
identifies `/sw.js` as the registration URL. The [offline plugin source](https://github.com/gatsbyjs/gatsby/blob/gatsby-plugin-offline%403.0.8/packages/gatsby-plugin-offline/src/gatsby-node.js)
sets the cache ID to `gatsby-plugin-offline`.

A previously installed offline worker can keep returning its cached Gatsby app
shell. A hard refresh bypasses the worker for that navigation but does not remove
its registration or cached app. A later visit can therefore show Gatsby again.
New visitors have no old worker and get Next.js directly. An update check that
receives a 404 cannot install a replacement worker.

This diagnosis matches the reported symptoms and was reproduced with a simulated
legacy worker in Chromium; it has not been confirmed in an actual affected user's
browser.
To confirm it on an actual affected browser before deployment, inspect DevTools
**Application → Service Workers** for a root-scoped `/sw.js` registration and
**Cache Storage** for Gatsby/Workbox caches. Network document requests served
by that worker establish the connection to the stale page.

## Fix

`public/sw.js` is a retirement worker served at the original Gatsby URL. The
browser's service worker update mechanism fetches it independently of the old
worker's cached pages. It activates immediately, deletes Gatsby/Workbox caches,
unregisters itself, and reloads controlled tabs at their existing URLs. It has no
fetch handler, so requests use the network. Theme preferences and other local
storage are preserved. The new frontend does not register a service worker.

Both Next.js and Netlify configure `/sw.js` as `no-store`. Keep this file and
these headers available indefinitely for people returning after a long absence.
Adding cleanup only to the new frontend would miss people still running the
cached Gatsby app. This follows the [Chrome worker recovery guidance](https://developer.chrome.com/docs/workbox/remove-buggy-service-workers).

## Deployment verification

1. Deploy this repository through the normal Netlify production pipeline.
2. Check `curl -i https://pittcs.wiki/sw.js`: expect **200**, a JavaScript content
   type, `Cache-Control: no-store`, and the retirement worker body.
3. Revisit from an affected browser without clearing storage. Once its browser
   detects the worker update, the old page should reload automatically. It may
   appear briefly while the background update runs.
4. Check that the registration and Gatsby/Workbox caches disappear. Revisit
   again, including a guide URL, and confirm the Next.js frontend remains.
5. Check a fresh browser profile and an existing theme preference.

Tests cover immediate activation, no request interception, scoped cache cleanup,
unregistration before reload, and preserving tab URLs. A Chromium reproduction
also exercises the 404 failure, multiple controlled tabs, repeated visits, fresh
visitors, and preservation of unrelated caches and theme preferences.

The browser reproduction used a localhost server with three phases:

1. Register a root-scoped `/sw.js` worker that serves cached old HTML for document
   navigations; seed Gatsby/Workbox caches and a separate unrelated cache.
2. Switch the server to new HTML and a 404 for `/sw.js`. Reload twice and request
   a worker update: the old HTML remains visible. Open a second controlled tab at
   `/guides?source=test#section` and confirm it also shows old HTML.
3. Replace `/sw.js` with this PR's retirement worker and request an update. Both
   tabs reload into new HTML; the guide URL, query, and fragment are preserved.
   Registrations and Gatsby/Workbox caches disappear, while the unrelated cache
   and `localStorage.theme` remain. Two further reloads and a fresh browser
   context show new HTML with no worker registration.

The update was explicitly requested with `registration.update()` to exercise the
browser's real installation/activation lifecycle without depending on its
background update timing. Production recovery depends on the browser detecting
the replacement during its normal update checks.
