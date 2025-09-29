import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import {
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
  $getRoot,
} from 'lexical';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { TOGGLE_LINK_COMMAND, LinkNode } from '@lexical/link';
import { mergeRegister } from '@lexical/utils';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';

const toolbarButtonBase =
  'rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40';

const theme = {
  paragraph: 'mb-3 text-slate-100',
  heading: {
    h1: 'text-3xl font-semibold text-slate-100 mb-4',
    h2: 'text-2xl font-semibold text-slate-100 mb-3',
    h3: 'text-xl font-semibold text-slate-100 mb-2',
  },
  list: {
    ul: 'ml-6 list-disc text-slate-100',
    ol: 'ml-6 list-decimal text-slate-100',
  },
  link: 'text-cyan-300 underline decoration-slate-500 hover:text-cyan-200',
  quote: 'border-l-4 border-slate-600 pl-4 italic text-slate-300',
  text: {
    bold: 'font-semibold text-slate-50',
    italic: 'italic text-slate-100',
    underline: 'underline',
    strikethrough: 'line-through',
  },
};

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [formats, setFormats] = useState({ bold: false, italic: false, underline: false });

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          editor.getEditorState().read(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            setFormats({
              bold: selection.hasFormat('bold'),
              italic: selection.hasFormat('italic'),
              underline: selection.hasFormat('underline'),
            });
          });
          return false;
        },
        1
      ),
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;
          setFormats({
            bold: selection.hasFormat('bold'),
            italic: selection.hasFormat('italic'),
            underline: selection.hasFormat('underline'),
          });
        });
      })
    );
  }, [editor]);

  const buttonClass = useCallback(
    (active) =>
      `${toolbarButtonBase} ${
        active ? 'border-primary bg-primary/20 text-primary' : 'border-slate-700'
      }`,
    []
  );

  const toggleLink = useCallback(() => {
    const url = window.prompt('Enter link URL (leave empty to clear)');
    if (url === null) return;
    const value = url.trim();
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, value === '' ? null : value);
  }, [editor]);

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 bg-slate-900/70 px-3 py-2">
      <button
        type="button"
        className={buttonClass(formats.bold)}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        aria-label="Bold"
      >
        Bold
      </button>
      <button
        type="button"
        className={buttonClass(formats.italic)}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        aria-label="Italic"
      >
        Italic
      </button>
      <button
        type="button"
        className={buttonClass(formats.underline)}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        aria-label="Underline"
      >
        Underline
      </button>
      <span className="mx-2 h-4 w-px bg-slate-700" aria-hidden />
      <button
        type="button"
        className={toolbarButtonBase}
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND)}
        aria-label="Bulleted list"
      >
        Bullets
      </button>
      <button
        type="button"
        className={toolbarButtonBase}
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND)}
        aria-label="Numbered list"
      >
        Numbers
      </button>
      <button
        type="button"
        className={toolbarButtonBase}
        onClick={() => editor.dispatchCommand(REMOVE_LIST_COMMAND)}
        aria-label="Remove list"
      >
        Clear list
      </button>
      <button type="button" className={toolbarButtonBase} onClick={toggleLink} aria-label="Toggle link">
        Link
      </button>
    </div>
  );
}

function InitialHtmlPlugin({ initialHtml, lastHtmlRef }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (initialHtml === undefined || initialHtml === null) {
      return;
    }
    if (lastHtmlRef.current === initialHtml) {
      return;
    }

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(initialHtml || '<p></p>', 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      root.append(...nodes);
    });

    lastHtmlRef.current = initialHtml;
  }, [editor, initialHtml, lastHtmlRef]);

  return null;
}

function RichTextEditor({ value, onChange, placeholder = 'Write your article…' }) {
  const lastHtmlRef = useRef(value ?? '');

  const editorConfig = useMemo(
    () => ({
      namespace: 'post-editor',
      theme,
      onError(error) {
        throw error;
      },
      nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode],
    }),
    []
  );

  const handleChange = useCallback(
    (editorState, editor) => {
      if (!onChange) return;
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor);
        onChange(html);
        lastHtmlRef.current = html;
      });
    },
    [onChange]
  );

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="flex flex-col">
        <ToolbarPlugin />
        <div className="relative rounded-b-2xl">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[240px] rounded-b-2xl px-4 py-3 text-base text-slate-100 focus:outline-none" />
            }
            placeholder={
              <div className="pointer-events-none absolute left-4 top-3 text-sm text-slate-500">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoFocusPlugin />
          <OnChangePlugin onChange={handleChange} />
          <InitialHtmlPlugin initialHtml={value} lastHtmlRef={lastHtmlRef} />
        </div>
      </div>
    </LexicalComposer>
  );
}

export default RichTextEditor;
