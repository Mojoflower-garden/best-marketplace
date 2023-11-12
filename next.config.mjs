/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.youtube.com',
      },
    ],
    domains: [
      'source.unsplash.com',
      'source.unsplash.it',
      'unsplash.it',
      'unsplash.it',
      'fra1.digitaloceanspaces.com',
      'gaia.fra1.digitaloceanspaces.com',
      'calyx.fra1.digitaloceanspaces.com',
      'images.unsplash.com',
      'calyx.fra1.digitaloceanspaces.com',
      'mojo-development.fra1.digitaloceanspaces.com',
      'youtube.com',
    ],
  },};

export default config;
