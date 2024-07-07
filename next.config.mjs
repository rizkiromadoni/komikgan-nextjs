/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "localhost",
            },
        ],
    },
    experimental: {
        missingSuspenseWithCSRBailout: false
    }
};

export default nextConfig;
