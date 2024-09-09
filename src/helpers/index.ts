import {useEffect, useState} from 'react';

import {toast} from 'react-hot-toast';

export function trimTopic(topic: string) {
  return topic.replace(/[，。！？”“"、,.!?]*$/, '');
}

export const clearWhitespaces = (text: string) => {
  if (text) {
    return text.replace(/\s+/g, '');
  }
  return text;
};

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to the clipboard');
  } catch (error) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      // showToast(Locale.Copy.Success);
    } catch (error) {
      // showToast(Locale.Copy.Failed);
    }
    document.body.removeChild(textArea);
  }
}

export function downloadAs(text: string, filename: string) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

// export function readFromFile() {
//   return new Promise<string>((res, rej) => {
//     const fileInput = document.createElement('input');
//     fileInput.type = 'file';
//     fileInput.accept = 'application/json';

//     fileInput.onchange = (event: any) => {
//       const file = event.target.files[0];
//       const fileReader = new FileReader();
//       fileReader.onload = (e: any) => {
//         res(e.target.result);
//       };
//       fileReader.onerror = (e) => rej(e);
//       fileReader.readAsText(file);
//     };

//     fileInput.click();
//   });
// }
export function readFromFile(): Promise<string> {
  return new Promise<string>((res, rej) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';

    fileInput.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file) {
        const fileReader = new FileReader();

        fileReader.onload = (e: ProgressEvent<FileReader>) => {
          res(e.target?.result as string);
        };

        fileReader.onerror = (e: ProgressEvent<FileReader>) => {
          rej(e);
        };

        fileReader.readAsText(file);
      } else {
        rej(new Error('No file selected'));
      }
    };

    fileInput.click();
  });
}

export function isIOS() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

export function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const onResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return size;
}

export const MOBILE_MAX_WIDTH = 600;
export function useMobileScreen() {
  const {width} = useWindowSize();

  return width <= MOBILE_MAX_WIDTH;
}

export function isFirefox() {
  return typeof navigator !== 'undefined' && /firefox/i.test(navigator.userAgent);
}

export function selectOrCopy(el: HTMLElement, content: string) {
  const currentSelection = window.getSelection();

  if (currentSelection?.type === 'Range') {
    return false;
  }

  copyToClipboard(content);

  return true;
}

function getDomContentWidth(dom: HTMLElement) {
  const style = window.getComputedStyle(dom);
  const paddingWidth = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  const width = dom.clientWidth - paddingWidth;
  return width;
}

function getOrCreateMeasureDom(id: string, init?: (dom: HTMLElement) => void) {
  let dom = document.getElementById(id) as HTMLElement | null;

  if (!dom) {
    dom = document.createElement('span');
    dom.style.position = 'absolute';
    dom.style.wordBreak = 'break-word';
    dom.style.fontSize = '14px';
    dom.style.transform = 'translateY(-200vh)';
    dom.style.pointerEvents = 'none';
    dom.style.opacity = '0';
    dom.id = id;
    document.body.appendChild(dom);
    init?.(dom);
  }

  return dom as HTMLElement;
}

export function autoGrowTextArea(dom: HTMLTextAreaElement) {
  const measureDom = getOrCreateMeasureDom('__measure');
  const singleLineDom = getOrCreateMeasureDom('__single_measure', (dom) => {
    dom.innerText = 'TEXT_FOR_MEASURE';
  });

  const width = getDomContentWidth(dom);
  measureDom.style.width = width + 'px';
  measureDom.innerText = dom.value !== '' ? dom.value : '1';
  measureDom.style.fontSize = dom.style.fontSize;
  const endWithEmptyLine = dom.value.endsWith('\n');
  const height = parseFloat(window.getComputedStyle(measureDom).height);
  const singleLineHeight = parseFloat(window.getComputedStyle(singleLineDom).height);

  const rows = Math.round(height / singleLineHeight) + (endWithEmptyLine ? 1 : 0);
  return rows;
}

export function getCSSVar(varName: string) {
  return getComputedStyle(document.body).getPropertyValue(varName).trim();
}

const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

export function bytesCalculator(size: number) {
  let l = 0,
    n = parseInt(size.toString(), 10) || 0;

  while (n >= 1024 && ++l) {
    n = n / 1024;
  }
  if (n >= 100) {
    return (n / 1024).toFixed(1) + ' ' + units[l + 1];
  } else {
    return n.toFixed(1) + ' ' + units[l];
  }
}

export const spaceBeforeCapitalLetters = (letters: string) => {
  return letters.replace(/([A-Z])/g, ' $1').trim();
};

export function numberWithCommas(x: string | number): string {
  if (x === 0 || x === '0' || x === undefined) return '0';
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export * from './timeHelper';
