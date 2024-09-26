/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Configuração do Webpack
    webpack: (config, { isServer }) => {
        if (isServer) {
            // Ignorar o módulo 'canvas' durante a compilação no servidor
            config.externals.push('canvas');
        }

        return config;
    },
};

export default nextConfig;
