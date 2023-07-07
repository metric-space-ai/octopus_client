import md5 from 'spark-md5';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_OPENAI_API_KEY?: string;
      CODE?: string;
      NEXT_PUBLIC_BASE_URL?: string;
      NEXT_PUBLIC_PROXY_URL?: string;
      VERCEL?: string;
      HIDE_USER_API_KEY?: string; // disable user's api key input
      DISABLE_GPT4?: string; // allow user to use gpt-4 or not
      BUILD_MODE?: 'standalone' | 'export';
      BUILD_APP?: string; // is building desktop app
    }
  }
}

const ACCESS_CODES = (function getAccessCodes(): Set<string> {
  const code = process.env.NEXT_PUBLIC_CODE;

  try {
    const codes = (code?.split(',') ?? []).filter((v) => !!v).map((v) => md5.hash(v.trim()));
    return new Set(codes);
  } catch (e) {
    return new Set();
  }
})();

export const getServerSideConfig = () => {
  if (typeof process === 'undefined') {
    throw Error('[Server Config] you are importing a nodejs-only module outside of nodejs');
  }

  return {
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    code: process.env.NEXT_PUBLIC_CODE,
    codes: ACCESS_CODES,
    needCode: ACCESS_CODES.size > 0,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    proxyUrl: process.env.NEXT_PUBLIC_PROXY_URL,
    isVercel: !!process.env.VERCEL,
    hideUserApiKey: !!process.env.HIDE_USER_API_KEY,
    enableGPT4: !process.env.DISABLE_GPT4,
  };
};
