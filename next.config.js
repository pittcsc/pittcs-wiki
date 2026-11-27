const path = require("path")

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "md", "ts", "tsx"],
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ]
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    })

    config.module.rules.push({
      test: /\.mdx$/,
      use: "raw-loader",
    })

    config.resolve.fallback = {
      fs: false,
      path: false,
    }

    // Fix for @dagrejs/dagre requiring @dagrejs/graphlib
    config.resolve.alias = {
      ...config.resolve.alias,
      "@dagrejs/graphlib": "@dagrejs/graphlib",
      "@dagrejs/dagre": path.resolve(
        __dirname,
        "node_modules/@dagrejs/dagre/dist/dagre.js"
      ),
    }

    return config
  },
  experimental: {
    // webpackBuildWorker: true,
  },
  async redirects() {
    return [
      {
        source: "/guides/zero-to-offer/ace-your-interview",
        destination: "/guides/zero-to-offer/technical-interviews",
        permanent: false,
      },
      {
        source: "/guides/zero-to-offer/potpourri",
        destination: "/guides/zero-to-offer",
        permanent: false,
      },
      {
        source: "/zero-to-offer/intro",
        destination: "/zero-to-offer",
        permanent: false,
      },
      {
        source: "/guides/zero-to-offer/intro",
        destination: "/guides/zero-to-offer",
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
