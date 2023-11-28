/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => {
        return [
            {
                source: '/cuckoo',
                destination: '/cuckoo/index.html',
            },
            {
                source: '/face',
                destination: '/face/index.html',
            },
            {
                source: '/nlp',
                destination: '/nlp/index.html',
            },
            {
                source: '/pacman',
                destination: '/pacman/index.html',
            },
            {
                source: '/pose',
                destination: '/pose/index.html',
            },
            {
                source: '/snake',
                destination: '/snake/index.html',
            },
            {
                source: '/tic-tac-toe',
                destination: '/tic-tac-toe/index.html',
            },
            {
                source: '/train/image',
                destination: '/train/index.html',
            },
            {
                source: '/train/audio',
                destination: '/train/index.html',
            },
            {
                source: '/train/pose',
                destination: '/train/index.html',
            },
            {
                source: '/wave',
                destination: '/wave/index.html',
            },
        ];
    },
};

module.exports = nextConfig;
