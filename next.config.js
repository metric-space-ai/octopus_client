// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   webpack(config) {
//     config.module.rules.push({
//       test: /\.svg$/,
//       use: ['@svgr/webpack'],
//     });

//     return config;
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'api.likora.octopus-ai.app',
//         port: '',
//         pathname: '/public/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'api.preview.octopus-ai.app',
//         port: '',
//         pathname: '/public/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'api.octopus-ai.app',
//         port: '',
//         pathname: '/public/**',
//       },
//     ],
//   },
// };

// module.exports = nextConfig;


// next.config.js

module.exports = (phase, {defaultConfig}) => {
  const env = {
    NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  };
  console.log({NEXT_PUBLIC_DOMAIN: env.NEXT_PUBLIC_DOMAIN});
  // Return the next config along with the environment variables
  return {
    ...defaultConfig,
    reactStrictMode: true,
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });
      return config;
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: env.NEXT_PUBLIC_DOMAIN,
          port: '',
          pathname: '/public/**',
        },
      ],
    },
    env,
  };
};