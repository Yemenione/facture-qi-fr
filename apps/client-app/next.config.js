/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    transpilePackages: ["@my-saas/ui-kit"],
    reactStrictMode: true,
}

module.exports = nextConfig
