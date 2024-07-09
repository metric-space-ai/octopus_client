import React, {RefObject, useEffect, useRef, useState} from 'react';

import {EllipsisHorizontalIcon} from '@heroicons/react/24/solid';
import mermaid from 'mermaid';
import ReactMarkdown from 'react-markdown';
import 'katex/dist/katex.min.css';
import RehypeHighlight from 'rehype-highlight';
import RehypeKatex from 'rehype-katex';
import RemarkBreaks from 'remark-breaks';
import RemarkGfm from 'remark-gfm';
import RemarkMath from 'remark-math';
import {useDebouncedCallback, useThrottledCallback} from 'use-debounce';
import {visit} from 'unist-util-visit';

import {copyToClipboard} from '../helpers';

import './../assets/atelier-cave-dark.css';
import {LinkIcon} from '@heroicons/react/24/outline';
import { isLongTextWithoutSpaces } from '@/helpers/textHelper';

export function Mermaid(props: {code: string}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (props.code && ref.current) {
      mermaid
        .run({
          nodes: [ref.current],
          suppressErrors: true,
        })
        .catch((e) => {
          setHasError(true);
          console.error('[Mermaid] ', e.message);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.code]);

  function viewSvgInNewWindow() {
    const svg = ref.current?.querySelector('svg');
    if (!svg) return;
    const text = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([text], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(blob);
    const win = window.open(url);
    if (win) {
      win.onload = () => URL.revokeObjectURL(url);
    }
  }

  if (hasError) {
    return null;
  }

  return (
    <div
      className='no-dark mermaid'
      style={{
        cursor: 'pointer',
        overflow: 'auto',
      }}
      ref={ref}
      onClick={() => viewSvgInNewWindow()}
    >
      {props.code}
    </div>
  );
}

export function PreCode(props: {children: any}) {
  const ref = useRef<HTMLPreElement>(null);
  const refText = ref.current?.innerText;
  const [mermaidCode, setMermaidCode] = useState('');

  const renderMermaid = useDebouncedCallback(() => {
    if (!ref.current) return;
    const mermaidDom = ref.current.querySelector('code.language-mermaid');
    if (mermaidDom) {
      setMermaidCode((mermaidDom as HTMLElement).innerText);
    }
  }, 600);

  useEffect(() => {
    setTimeout(renderMermaid, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refText]);

  return (
    <>
      {mermaidCode.length > 0 && <Mermaid code={mermaidCode} key={mermaidCode} />}
      <pre
        className='relative text-xs p-2.5 py-4 bg-grey-800 rounded-xs overflow-auto [&>*]:whitespace-pre-wrap word-break'
        ref={ref}
      >
        <span
          className="absolute right-2 top-2 cursor-pointer after:content-['Copy']"
          onClick={() => {
            if (ref.current) {
              const code = ref.current.innerText;
              copyToClipboard(code);
            }
          }}
        ></span>
        {props.children}
      </pre>
    </>
  );
}



const CustomParagraph = ({node, ...props}: any) => {
  const textContent = node.children.map((child: any) => child.value).join(' ');
  const isLongWithoutSpaces = isLongTextWithoutSpaces(textContent);

  const className = isLongWithoutSpaces ? 'break-all' : 'break-words';

  return (
    <p className={className} {...props}>
      {props.children}
    </p>
  );
};

// Custom Remark plugin to handle [n]: URL format
const RemarkCustomLink = () => {
  return (tree: any) => {
    visit(tree, 'definition', (node: any) => {
      if (node && node.type === 'definition') {
        const value = `[${node.title ?? node.label ?? ''}] - ${node.title ? '' : node.url}`;

        node.type = 'link';
        node.children = [{type: 'text', value}];
      }
    });
  };
};

function _MarkDownContent(props: {content: string}) {
  return (
    <ReactMarkdown
      className='flex flex-1 flex-col text-grey-900 dark:text-grey-0 gap-2'
      remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks, RemarkCustomLink]}
      rehypePlugins={[
        RehypeKatex,
        [
          RehypeHighlight,
          {
            detect: false,
            ignoreMissing: true,
          },
        ],
      ]}
      components={{
        pre: PreCode,
        // a: (aProps) => {
        //   const href = aProps.href || '';
        //   const isInternal = /^\/#/i.test(href);
        //   const target = isInternal ? '_self' : aProps.target ?? '_blank';
        //   return (
        //     <>
        //       <LinkIcon className='w-3 h-3 inline-block mr-1' />
        //       <a {...aProps} target={target} className='underline' />
        //     </>
        //   );
        // },
        a: ({node, ...aProps}) => {
          const href = aProps.href || '';

          const isInternal = /^\/#/i.test(href);
          const target = isInternal ? '_self' : aProps.target ?? '_blank';
          return (
            <a {...aProps} target={target} className='underline'>
              <LinkIcon className='w-3 h-3 inline-block mr-1' />
              {aProps.children ?? href}
            </a>
          );
        },
        p: CustomParagraph,
      }}
    >
      {props.content}
    </ReactMarkdown>
  );
}

export const MarkdownContent = React.memo(_MarkDownContent);

export function Markdown(
  props: {
    content: string;
    loading?: boolean;
    fontSize?: number;
    parentRef?: RefObject<HTMLDivElement>;
    defaultShow?: boolean;
  } & React.DOMAttributes<HTMLDivElement>,
) {
  const mdRef = useRef<HTMLDivElement>(null);
  const renderedHeight = useRef(0);
  const renderedWidth = useRef(0);
  const inView = useRef(!!props.defaultShow);
  const [_, triggerRender] = useState(0);
  const checkInView = useThrottledCallback(
    () => {
      const parent = props.parentRef?.current;
      const md = mdRef.current;
      if (parent && md && !props.defaultShow) {
        const parentBounds = parent.getBoundingClientRect();
        const twoScreenHeight = Math.max(500, parentBounds.height * 2);
        const mdBounds = md.getBoundingClientRect();
        const parentTop = parentBounds.top - twoScreenHeight;
        const parentBottom = parentBounds.bottom + twoScreenHeight;
        const isOverlap = Math.max(parentTop, mdBounds.top) <= Math.min(parentBottom, mdBounds.bottom);
        inView.current = isOverlap;
        triggerRender(Date.now());
      }

      if (inView.current && md) {
        const rect = md.getBoundingClientRect();
        renderedHeight.current = Math.max(renderedHeight.current, rect.height);
        renderedWidth.current = Math.max(renderedWidth.current, rect.width);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    300,
    {
      leading: true,
      trailing: true,
    },
  );

  useEffect(() => {
    props.parentRef?.current?.addEventListener('scroll', checkInView);
    checkInView();
    return () => props.parentRef?.current?.removeEventListener('scroll', checkInView);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSize = (x: number) => (!inView.current && x > 0 ? x : 'auto');

  return (
    <div
      className='break-normal'
      style={{
        fontSize: `${props.fontSize ?? 14}px`,
        height: getSize(renderedHeight.current),
        width: getSize(renderedWidth.current),
      }}
      ref={mdRef}
      onContextMenu={props.onContextMenu}
      onDoubleClickCapture={props.onDoubleClickCapture}
    >
      {inView.current &&
        (props.loading ? <EllipsisHorizontalIcon className='w-6 h-6' /> : <MarkdownContent content={props.content} />)}
    </div>
  );
}
