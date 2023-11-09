/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => {
        return [
            {
                source: '/pose',
                destination: '/pose/index.html',
            }
        ];
    },
};

module.exports = nextConfig;
