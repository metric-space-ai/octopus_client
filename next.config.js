module.exports = (phase, {defaultConfig}) => {
  const env = {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  };
  const publicHostname = env.NEXT_PUBLIC_BASE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');

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
      domains: [env.NEXT_PUBLIC_BASE_URL, publicHostname],
      remotePatterns: [
        // {
        //   protocol: 'https',
        //   hostname: publicHostname,
        //   port: '',
        //   pathname: '/public/**',
        // },
        {
          protocol: 'https',
          hostname: '**',
          port: '',
          pathname: '**',
        },
      ],
    },
    env,
  };
};
