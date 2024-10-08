import de from './de';
import type {LocaleType} from './en';
import en from './en';
import fa from './fa';
import hnd from './Hnd';
import sp from './sp';
import trk from './trk';
import {merge} from '../helpers/merge';
export type {LocaleType, PartialLocaleType} from './en';

const ALL_LANGS = {
  en,
  de,
  fa,
  sp,
  trk,
  hnd,
};

export type Lang = keyof typeof ALL_LANGS;

export const AllLangs = Object.keys(ALL_LANGS) as Lang[];

export const ALL_LANG_OPTIONS: Record<Lang, string> = {
  en: 'English',
  de: 'Deutsch',
  fa: 'Persian',
  sp: 'Spanish',
  trk: 'Turkish',
  hnd: 'Hindi',
};

const LANG_KEY = 'lang';
const DEFAULT_LANG = 'en';

const fallbackLang = en;
const targetLang = ALL_LANGS[getLang()] as LocaleType;

// if target lang missing some fields, it will use fallback lang string
merge(fallbackLang, targetLang);

export default fallbackLang as LocaleType;

function getItem(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // empty block
  }
}

function getLanguage() {
  try {
    return navigator.language.toLowerCase();
  } catch {
    return DEFAULT_LANG;
  }
}

export function getLang(): Lang {
  const savedLang = getItem(LANG_KEY);

  if (AllLangs.includes((savedLang ?? '') as Lang)) {
    return savedLang as Lang;
  }

  const lang = getLanguage();

  for (const option of AllLangs) {
    if (lang.includes(option)) {
      return option;
    }
  }

  return DEFAULT_LANG;
}

export function changeLang(lang: Lang) {
  setItem(LANG_KEY, lang);
  location.reload();
}
