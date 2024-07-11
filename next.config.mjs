/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "localhost",
            },
            {
                hostname: "mirror.mangayaro.com",
            },
        ],
    },
    experimental: {
        missingSuspenseWithCSRBailout: false
    }
};

export default nextConfig;
