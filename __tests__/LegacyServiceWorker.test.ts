/** @jest-environment node */

import { readFileSync } from "node:fs"
import { join } from "node:path"
import { runInNewContext } from "node:vm"

type WorkerEvent = { waitUntil: (work: Promise<unknown>) => void }

function loadWorker() {
  const listeners: Record<string, (event: WorkerEvent) => void> = {}
  const cacheNames = new Set([
    "gatsby-plugin-offline-precache-v2-https://pittcs.wiki/",
    "workbox-runtime-https://pittcs.wiki/",
    "unrelated-app-data",
  ])
  const unregister = jest.fn().mockResolvedValue(true)
  const windows = [
    "https://pittcs.wiki/",
    "https://pittcs.wiki/guides?q=cs#tips",
  ].map((url) => ({
    url,
    navigate: jest.fn(async () => {
      // The registration must be gone before any old tab reloads.
      expect(unregister).toHaveBeenCalledTimes(1)
    }),
  }))
  const skipWaiting = jest.fn().mockResolvedValue(undefined)

  runInNewContext(readFileSync(join(process.cwd(), "public/sw.js"), "utf8"), {
    self: {
      addEventListener: (
        type: string,
        callback: (event: WorkerEvent) => void
      ) => {
        listeners[type] = callback
      },
      skipWaiting,
      registration: { unregister },
      clients: { matchAll: async () => windows },
    },
    caches: {
      keys: async () => Array.from(cacheNames),
      delete: async (name: string) => cacheNames.delete(name),
    },
  })

  const dispatch = (type: string) => {
    let work = Promise.resolve<unknown>(undefined)
    listeners[type]({ waitUntil: (promise) => (work = promise) })
    return work
  }
  return { listeners, cacheNames, windows, unregister, skipWaiting, dispatch }
}

it("replaces the waiting worker immediately without intercepting requests", async () => {
  const worker = loadWorker()
  await worker.dispatch("install")
  expect(worker.skipWaiting).toHaveBeenCalledTimes(1)
  expect(worker.listeners.fetch).toBeUndefined()
})

it("retires Gatsby caches and registration, then restores each tab's URL", async () => {
  const worker = loadWorker()
  await worker.dispatch("activate")
  expect(Array.from(worker.cacheNames)).toEqual(["unrelated-app-data"])
  expect(worker.unregister).toHaveBeenCalledTimes(1)
  for (const window of worker.windows) {
    expect(window.navigate).toHaveBeenCalledWith(window.url)
  }
})
