import ISO6391 from 'iso-639-1';

export const VERSION_NUM = 'v0.2.5';
export const RUNTIME_CONFIG_DOM = 'danger-runtime-config';
export const DEFAULT_API_HOST = 'https://chatgpt1.nextweb.fun/api/proxy';

export enum Path {
  Home = '/',
  Chat = '/chat',
  Settings = '/settings',
  NewChat = '/chat/new',
  Masks = '/masks',
  Auth = '/auth',
}

export enum SlotID {
  AppBody = 'app-body',
}

export enum FileName {
  Masks = 'masks.json',
  Prompts = 'prompts.json',
}

export enum StoreKey {
  Chat = 'octopus-store',
  Access = 'access-control',
  Config = 'app-config',
  Mask = 'mask-store',
  Prompt = 'prompt-store',
  Update = 'chat-update',
}

export const MAX_SIDEBAR_WIDTH = 500;
export const MIN_SIDEBAR_WIDTH = 230;
export const NARROW_SIDEBAR_WIDTH = 100;

export const ACCESS_CODE_PREFIX = 'ak-';

export const LAST_INPUT_KEY = 'last-input';

export const REQUEST_TIMEOUT_MS = 60000;

export const EXPORT_MESSAGE_CLASS_NAME = 'export-markdown';

export const OpenaiPath = {
  ChatPath: 'v1/chat/completions',
  UsagePath: 'dashboard/billing/usage',
  SubsPath: 'dashboard/billing/subscription',
};

export const DEFAULT_INPUT_TEMPLATE = `
Act as a virtual assistant powered by model: '{{model}}', my input is:
'''
{{input}}
'''
`;

export const TabModes = [{name: 'Private'}, {name: 'Public'}];
const languageList = ISO6391.getAllNames();

export const LANGUAGES = languageList.map((value, index) => ({id: index, name: value}));
