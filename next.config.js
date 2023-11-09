/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => {
        return [
            {
                source: '/cuckoo',
                destination: '/cuckoo/index.html',
            },
            {
                source: '/pacman',
                destination: '/pacman/index.html',
            },
            {
                source: '/pose',
                destination: '/pose/index.html',
            },
        ];
    },
};

module.exports = nextConfig;
