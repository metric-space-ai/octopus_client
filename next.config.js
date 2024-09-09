module.exports = (phase, {defaultConfig}) => {
  const env = {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  };

  const publicHostname = new URL(env.NEXT_PUBLIC_BASE_URL).hostname;

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
      domains: [publicHostname],
      remotePatterns: [
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
