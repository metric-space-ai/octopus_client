import {nanoid} from '@reduxjs/toolkit';
import ISO6391 from 'iso-639-1';

import {PartialTRoleLabel, TRecordPluginStatus, TRole, TThemeName, TWaspAppBgColor} from './types';

export const APPREQUESTBASEURL = process.env.NEXT_PUBLIC_BASE_URL ?? '';
export const APPTHEMENAME: TThemeName = (process.env.NEXT_PUBLIC_THEME_NAME as TThemeName) ?? 'default-dark';
export const WASPAPPREQUESTBASEURL = process.env.NEXT_PUBLIC_WASP_BASE_URL ?? '';
export const NEXTPUBLICSLACKWEBHOOKURL = process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL ?? '';
export const NEXTPUBLICSLACKCHANNELID = process.env.NEXT_PUBLIC_SLACK_CHANNEL_ID ?? '';
export const NEXTPUBLICSLACKBOTTOKEN = process.env.NEXT_PUBLIC_SLACK_BOT_TOKEN ?? '';
export const VERSION_NUM = 'v0.7.0';
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

export const WASPAPPTEMPLATECOLOR: TWaspAppBgColor[] = [
  {id: nanoid(16), value: '#F5F5F5', label: 'Default background'},
  {id: nanoid(16), value: '#444444', label: 'Dark Gray'},
  {id: nanoid(16), value: '#78866B', label: 'Moss Green'},
  {id: nanoid(16), value: '#A9BA9D', label: 'Light Green'},
  {id: nanoid(16), value: '#D0D9CD', label: 'Light Gray'},
  {id: nanoid(16), value: '#B2BEB5', label: 'Grayish Green'},
  {id: nanoid(16), value: '#828E84', label: 'Green Gray'},
  {id: nanoid(16), value: '#687169', label: 'Dark Green'},
];

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

export const ROLE_ADMIN: TRole = 'ROLE_ADMIN';
export const ROLE_COMPANY_ADMIN_USER: TRole = 'ROLE_COMPANY_ADMIN_USER';
export const ROLE_PRIVATE_USER: TRole = 'ROLE_PRIVATE_USER';
export const ROLE_PUBLIC_USER: TRole = 'ROLE_PUBLIC_USER';

export const ROLESARRAYVALUE: TRole[] = [ROLE_ADMIN, ROLE_COMPANY_ADMIN_USER, ROLE_PRIVATE_USER, ROLE_PUBLIC_USER];

export const ROLESLABEL: PartialTRoleLabel = {
  ROLE_ADMIN: 'Admin',
  ROLE_COMPANY_ADMIN_USER: 'Admin user',
  ROLE_PRIVATE_USER: 'Private user',
  ROLE_PUBLIC_USER: 'Public user',
};

export const ROLEOPTIONS = [
  {value: ROLE_COMPANY_ADMIN_USER, label: 'Admin user'},
  {value: ROLE_PRIVATE_USER, label: 'Private user'},
  {value: ROLE_PUBLIC_USER, label: 'Public user'},
];

export const ALLROLES = [
  {value: ROLE_ADMIN, label: 'Admin'},
  {value: ROLE_COMPANY_ADMIN_USER, label: 'Admin user'},
  {value: ROLE_PRIVATE_USER, label: 'Private user'},
  {value: ROLE_PUBLIC_USER, label: 'Public user'},
];

export const AI_SERVICES_HEALTH_CHECK_STATUS = {
  NotWorking: 'NotWorking',
  Ok: 'Ok',
};

export const AI_SERVICES_SETUP_STATUS = {
  NotPerformed: 'NotPerformed',
  Performed: 'Performed',
};
export const AI_SERVICES_STATUS = {
  Configuration: 'Configuration',
  Error: 'Error',
  Initial: 'Initial',
  InstallationFinished: 'InstallationFinished',
  InstallationStarted: 'InstallationStarted',
  MaliciousCodeDetected: 'MaliciousCodeDetected',
  ParsingFinished: 'ParsingFinished',
  ParsingStarted: 'ParsingStarted',
  Running: 'Running',
  Setup: 'Setup',
  Stopped: 'Stopped',
};

export const WORKSPACETYPE = {
  PUBLIC: 'Public',
  PRIVATE: 'Private',
};
export const PLUGINSTATUS: TRecordPluginStatus = {
  Configuration: 'Configuration',
  Error: 'Error',
  Initial: 'Initial',
  InstallationFinished: 'InstallationFinished',
  InstallationStarted: 'InstallationStarted',
  MaliciousCodeDetected: 'MaliciousCodeDetected',
  ParsingFinished: 'ParsingFinished',
  ParsingStarted: 'ParsingStarted',
  Running: 'Running',
  Setup: 'Setup',
  Stopped: 'Stopped',
};
export const APPSTATUS = {
  Configuration: 'Configuration',
  Error: 'Error',
  Initial: 'Initial',
  InstallationFinished: 'InstallationFinished',
  InstallationStarted: 'InstallationStarted',
  MaliciousCodeDetected: 'MaliciousCodeDetected',
  ParsingFinished: 'ParsingFinished',
  ParsingStarted: 'ParsingStarted',
  Running: 'Running',
  Setup: 'Setup',
  Stopped: 'Stopped',
};
const languageList = ISO6391.getAllNames();

export const ImagesBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const LANGUAGES = languageList.map((value, index) => ({id: index, name: value}));

export const UPLOADWASPAPPSTEPS = {SelectFile: 1, Upload: 2};

export const VALIDWASPFILE = {
  Format: '.zip',
  Types: ['application/zip', 'application/x-zip', 'application/x-zip-compressed', 'zip'],
};

export const INSTANCETYPES: string[] = ['Private', 'Shared', 'User'];
