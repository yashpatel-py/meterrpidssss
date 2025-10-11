import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  $isRootOrShadowRoot,
} from 'lexical';
import { $setBlocksType, $getSelectionStyleValueForProperty, $patchStyleText } from '@lexical/selection';
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListItemNode,
  ListNode,
} from '@lexical/list';
import {
  HeadingNode,
  QuoteNode,
  $createHeadingNode,
  $createQuoteNode,
} from '@lexical/rich-text';
import { LinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $createCodeNode, CodeNode } from '@lexical/code';
import {
  TableNode,
  TableCellNode,
  TableRowNode,
  INSERT_TABLE_COMMAND,
} from '@lexical/table';
import {
  HorizontalRuleNode,
  INSERT_HORIZONTAL_RULE_COMMAND,
} from '@lexical/react/LexicalHorizontalRuleNode';
import { mergeRegister } from '@lexical/utils';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  AArrowUp,
  AArrowDown,
  Bold,
  Brush,
  ClipboardCopy,
  ClipboardPaste,
  Code2,
  Eraser,
  Eye,
  Highlighter,
  Image as ImageIcon,
  IndentDecrease,
  IndentIncrease,
  Italic,
  Link2,
  Link2Off,
  List as ListIcon,
  ListChecks,
  ListOrdered,
  Maximize2,
  Minimize2,
  Omega,
  Palette,
  Pilcrow,
  Quote as QuoteIcon,
  Redo2,
  Scissors,
  Search,
  Smile,
  Strikethrough,
  Subscript,
  Superscript,
  Table as TableIcon,
  Type,
  Underline,
  Undo2,
} from 'lucide-react';

const toolbarButtonBase =
  'inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-800 px-2.5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-40 disabled:hover:text-slate-200';

const theme = {
  paragraph: 'mb-3 text-slate-900',
  heading: {
    h1: 'text-3xl font-semibold text-slate-900 mb-4',
    h2: 'text-2xl font-semibold text-slate-900 mb-3',
    h3: 'text-xl font-semibold text-slate-900 mb-2',
  },
  list: {
    ul: 'ml-6 list-disc text-slate-900',
    ol: 'ml-6 list-decimal text-slate-900',
    check: 'ml-6 list-none text-slate-900',
  },
  link: 'text-primary underline decoration-primary/40 hover:text-primary/80',
  quote: 'border-l-4 border-primary/40 pl-4 italic text-slate-700',
  text: {
    bold: 'font-semibold text-slate-900',
    italic: 'italic text-slate-900',
    underline: 'underline',
    strikethrough: 'line-through text-slate-700',
    highlight: 'bg-amber-200/60 text-slate-900',
    code: 'font-mono text-slate-900 bg-slate-100 px-1 rounded',
  },
  code: 'font-mono text-sm bg-slate-900/90 text-emerald-200 rounded-lg p-4 block whitespace-pre-wrap',
  table: 'border border-slate-300',
  tableCell: 'border border-slate-300 px-2 py-1 align-top',
};

const blockTypeOptions = [
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'quote', label: 'Quote' },
  { value: 'code', label: 'Code Block' },
];

const presetColors = ['#0f172a', '#be123c', '#b45309', '#2563eb', '#059669', '#9333ea', '#111827'];

function normalizeColorValue(color, fallback = '#0f172a') {
  if (!color || typeof color !== 'string') return fallback;
  if (color === 'transparent') return fallback;
  if (color.startsWith('#')) {
    if (color.length === 4) {
      const [, r, g, b] = color;
      return `#${r}${r}${g}${g}${b}${b}`;
    }
    return color.slice(0, 7);
  }
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!match) return fallback;
  const [, r, g, b] = match.map(Number);
  const toHex = (value) => value.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getSelectedNode(selection) {
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  return selection.isBackward() ? focusNode : anchorNode;
}

function ToolbarButton({ icon: Icon, label, onClick, active = false, disabled = false }) {
  return (
    <button
      type="button"
      className={`${toolbarButtonBase} ${active ? 'border-primary bg-primary text-white shadow-sm shadow-primary/40' : 'hover:border-primary/50 hover:text-white/90'}`}
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function Divider() {
  return <span className="mx-2 h-5 w-px bg-slate-600" aria-hidden />;
}

function ColorDropdown({ label, icon: Icon, value, onChange }) {
  return (
    <div className="relative inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] uppercase tracking-wide text-slate-300">
      <Icon className="h-3.5 w-3.5" aria-hidden />
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="appearance-none bg-transparent text-[11px] font-semibold text-slate-100 focus:outline-none"
        aria-label={label}
      >
        {presetColors.map((color) => (
          <option key={color} value={color} className="bg-slate-800 text-slate-100">
            {color}
          </option>
        ))}
      </select>
      <span className="ml-1 h-4 w-4 rounded border border-slate-600" style={{ background: value }} aria-hidden />
    </div>
  );
}

function ToolbarPlugin({
  onRequestHtmlEdit,
  onTogglePreview,
  isPreview,
  onToggleFullscreen,
  isFullscreen,
  onToggleFormattingMarks,
  showFormattingMarks,
}) {
  const [editor] = useLexicalComposerContext();
  const [formats, setFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    code: false,
    highlight: false,
    superscript: false,
    subscript: false,
  });
  const [blockType, setBlockType] = useState('paragraph');
  const [elementFormat, setElementFormat] = useState('left');
  const [isLink, setIsLink] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [fontColor, setFontColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState('16px');

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      setFormats((prev) => ({ ...prev, bold: false, italic: false, underline: false, strikethrough: false, code: false, highlight: false, superscript: false, subscript: false }));
      setIsLink(false);
      return;
    }

    setFormats({
      bold: selection.hasFormat('bold'),
      italic: selection.hasFormat('italic'),
      underline: selection.hasFormat('underline'),
      strikethrough: selection.hasFormat('strikethrough'),
      code: selection.hasFormat('code'),
      highlight: selection.hasFormat('highlight'),
      superscript: selection.hasFormat('superscript'),
      subscript: selection.hasFormat('subscript'),
    });

    const anchorNode = selection.anchor.getNode();
    let topLevelElement;
    try {
      topLevelElement = anchorNode.getTopLevelElementOrThrow();
    } catch (_error) {
      if ($isRootOrShadowRoot(anchorNode)) {
        setBlockType('paragraph');
        setElementFormat('left');
        setIsLink(false);
        return;
      }
      topLevelElement = anchorNode;
    }

    if ($isRootOrShadowRoot(topLevelElement)) {
      setBlockType('paragraph');
      setElementFormat('left');
      setIsLink(false);
      return;
    };

    if ($isListNode(topLevelElement)) {
      const parent = topLevelElement.getParent();
      const listType = ($isListNode(parent) ? parent : topLevelElement).getListType();
      setBlockType(listType);
    } else if (topLevelElement instanceof HeadingNode) {
      setBlockType(topLevelElement.getTag());
    } else if (topLevelElement instanceof QuoteNode) {
      setBlockType('quote');
    } else if (topLevelElement instanceof CodeNode) {
      setBlockType('code');
    } else {
      const type = topLevelElement.getType();
      setBlockType(type === 'root' ? 'paragraph' : type);
    }

    const format = topLevelElement.getFormatType();
    setElementFormat(format === 'start' ? 'left' : format === 'end' ? 'right' : format);

    const selectedNode = getSelectedNode(selection);
    const parent = selectedNode.getParent();
    setIsLink(selectedNode instanceof LinkNode || parent instanceof LinkNode);

    const color = $getSelectionStyleValueForProperty(selection, 'color', '#0f172a');
    const background = $getSelectionStyleValueForProperty(selection, 'background-color', '#ffffff');
    const size = $getSelectionStyleValueForProperty(selection, 'font-size', '16px');
    setFontColor(normalizeColorValue(color, '#0f172a'));
    setBgColor(normalizeColorValue(background, '#ffffff'));
    setFontSize(size);
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(Boolean(payload));
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(Boolean(payload));
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateToolbar]);

  const applyStyleText = useCallback(
    (styles) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, styles);
        }
      });
    },
    [editor]
  );

  const formatBlockType = useCallback(
    (target) => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        switch (target) {
          case 'paragraph':
            $setBlocksType(selection, () => $createParagraphNode());
            break;
          case 'h1':
          case 'h2':
          case 'h3':
            $setBlocksType(selection, () => $createHeadingNode(target));
            break;
          case 'quote':
            $setBlocksType(selection, () => $createQuoteNode());
            break;
          case 'code':
            $setBlocksType(selection, () => $createCodeNode());
            break;
          default:
            break;
        }
      });
    },
    [editor]
  );

  const insertImage = useCallback(() => {
    const url = window.prompt('Image URL');
    if (!url) return;
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      const parser = new DOMParser();
      const dom = parser.parseFromString(`<img src="${url}" alt="" loading="lazy" />`, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      selection.insertNodes(nodes);
    });
  }, [editor]);

  const insertEmoji = useCallback(() => {
    const emoji = window.prompt('Emoji to insert');
    if (!emoji) return;
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.insertText(emoji);
      }
    });
  }, [editor]);

  const clearFormatting = useCallback(() => {
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      selection.getNodes().forEach((node) => {
        if ($isTextNode(node)) {
          node.setFormat(0);
          node.setStyle('');
        }
      });
      $patchStyleText(selection, { color: '', 'background-color': '', 'font-size': '' });
      $setBlocksType(selection, () => $createParagraphNode());
    });
  }, [editor]);

  const adjustFontSize = useCallback(
    (direction) => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;
        const currentSize = parseInt(
          $getSelectionStyleValueForProperty(selection, 'font-size', '16px').replace(/[^0-9]/g, ''),
          10
        );
        const nextSize = Math.max(10, Math.min(72, currentSize + (direction === 'up' ? 2 : -2)));
        $patchStyleText(selection, { 'font-size': `${nextSize}px` });
      });
    },
    [editor]
  );

  const toggleSuperscript = useCallback(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
  }, [editor]);

  const toggleSubscript = useCallback(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
  }, [editor]);

  const handleClipboard = useCallback(
    (type) => {
      if (type === 'cut' || type === 'copy') {
        editor.getEditorState().read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const text = selection.getTextContent();
            if (!text) return;
            if (navigator.clipboard?.writeText) {
              navigator.clipboard.writeText(text).catch(() => document.execCommand(type));
            } else {
              document.execCommand(type);
            }
            if (type === 'cut') {
              editor.update(() => {
                selection.insertText('');
              });
            }
          }
        });
      } else if (type === 'paste') {
        if (navigator.clipboard?.readText) {
          navigator.clipboard
            .readText()
            .then((text) => {
              if (!text) return;
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  selection.insertText(text);
                }
              });
            })
            .catch(() => document.execCommand('paste'));
        } else {
          document.execCommand('paste');
        }
      }
    },
    [editor]
  );

  const handleFind = useCallback(() => {
    const value = window.prompt('Find text');
    if (!value) return;
    const rootElement = editor.getRootElement();
    if (rootElement) {
      rootElement.focus();
      window.find(value, false, false, true, false, false, false);
    }
  }, [editor]);

  const insertSpecialCharacter = useCallback(() => {
    const value = window.prompt('Special character to insert');
    if (!value) return;
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.insertText(value);
      }
    });
  }, [editor]);

  const insertTable = useCallback(() => {
    const rows = Number(window.prompt('Number of rows?', '2'));
    const columns = Number(window.prompt('Number of columns?', '2'));
    if (!rows || !columns) return;
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      columns,
      rows,
      includeHeaders: true,
    });
  }, [editor]);

  const insertHorizontalRule = useCallback(() => {
    editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
  }, [editor]);

  return (
    <div className="space-y-2 rounded-t-2xl border border-slate-700 bg-slate-900/90 px-3 py-3 text-slate-100">
      <div className="flex flex-wrap items-center gap-2">
        <ToolbarButton
          icon={Undo2}
          label="Undo"
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          disabled={!canUndo}
        />
        <ToolbarButton
          icon={Redo2}
          label="Redo"
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          disabled={!canRedo}
        />
        <Divider />
        <select
          className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs font-medium uppercase tracking-wide text-slate-200"
          value={blockType}
          onChange={(event) => {
            const value = event.target.value;
            setBlockType(value);
            formatBlockType(value);
          }}
          aria-label="Block type"
        >
          {blockTypeOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-800 text-slate-100">
              {option.label}
            </option>
          ))}
        </select>
        <Divider />
        <ToolbarButton
          icon={Bold}
          label="Bold"
          active={formats.bold}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        />
        <ToolbarButton
          icon={Italic}
          label="Italic"
          active={formats.italic}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        />
        <ToolbarButton
          icon={Underline}
          label="Underline"
          active={formats.underline}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        />
        <ToolbarButton
          icon={Strikethrough}
          label="Strikethrough"
          active={formats.strikethrough}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        />
        <ToolbarButton
          icon={Superscript}
          label="Superscript"
          active={formats.superscript}
          onClick={toggleSuperscript}
        />
        <ToolbarButton
          icon={Subscript}
          label="Subscript"
          active={formats.subscript}
          onClick={toggleSubscript}
        />
        <ToolbarButton
          icon={Code2}
          label="Inline code"
          active={formats.code}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
        />
        <ToolbarButton
          icon={Highlighter}
          label="Highlight"
          active={formats.highlight}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'highlight')}
        />
        <ColorDropdown label="Font color" icon={Palette} value={fontColor} onChange={(value) => applyStyleText({ color: value })} />
        <ColorDropdown
          label="Background color"
          icon={Brush}
          value={bgColor}
          onChange={(value) => applyStyleText({ 'background-color': value })}
        />
        <ToolbarButton icon={AArrowUp} label="Increase font size" onClick={() => adjustFontSize('up')} />
        <ToolbarButton icon={AArrowDown} label="Decrease font size" onClick={() => adjustFontSize('down')} />
        <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] text-slate-300" aria-live="polite">
          {fontSize.replace(/[^0-9]/g, '') || '16'}px
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ToolbarButton
          icon={AlignLeft}
          label="Align left"
          active={elementFormat === 'left'}
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
        />
        <ToolbarButton
          icon={AlignCenter}
          label="Align center"
          active={elementFormat === 'center'}
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
        />
        <ToolbarButton
          icon={AlignRight}
          label="Align right"
          active={elementFormat === 'right'}
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
        />
        <ToolbarButton
          icon={AlignJustify}
          label="Justify"
          active={elementFormat === 'justify'}
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
        />
        <ToolbarButton
          icon={IndentIncrease}
          label="Increase indent"
          onClick={() => editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)}
        />
        <ToolbarButton
          icon={IndentDecrease}
          label="Decrease indent"
          onClick={() => editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)}
        />
        <ToolbarButton
          icon={ListIcon}
          label="Bulleted list"
          active={blockType === 'bullet'}
          onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
        />
        <ToolbarButton
          icon={ListOrdered}
          label="Numbered list"
          active={blockType === 'number'}
          onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
        />
        <ToolbarButton
          icon={ListChecks}
          label="Checklist"
          active={blockType === 'check'}
          onClick={() => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)}
        />
        <ToolbarButton
          icon={QuoteIcon}
          label="Block quote"
          active={blockType === 'quote'}
          onClick={() => formatBlockType('quote')}
        />
        <ToolbarButton icon={Smile} label="Insert emoji" onClick={insertEmoji} />
        <ToolbarButton icon={ImageIcon} label="Insert image" onClick={insertImage} />
        <ToolbarButton
          icon={Link2}
          label="Insert link"
          active={isLink}
          onClick={() => {
            const url = window.prompt(isLink ? 'Update or clear the URL (leave empty to remove)' : 'Enter URL');
            if (url === null) return;
            const value = url.trim();
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, value === '' ? null : value);
          }}
        />
        <ToolbarButton icon={Link2Off} label="Remove link" onClick={() => editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)} />
        <ToolbarButton icon={TableIcon} label="Insert table" onClick={insertTable} />
        <ToolbarButton icon={Type} label="Horizontal rule" onClick={insertHorizontalRule} />
        <ToolbarButton icon={Omega} label="Insert special character" onClick={insertSpecialCharacter} />
        <ToolbarButton icon={Scissors} label="Cut" onClick={() => handleClipboard('cut')} />
        <ToolbarButton icon={ClipboardCopy} label="Copy" onClick={() => handleClipboard('copy')} />
        <ToolbarButton icon={ClipboardPaste} label="Paste" onClick={() => handleClipboard('paste')} />
        <ToolbarButton icon={Search} label="Find" onClick={handleFind} />
        <ToolbarButton icon={Eraser} label="Clear formatting" onClick={clearFormatting} />
        <ToolbarButton icon={Pilcrow} label="Toggle formatting marks" active={showFormattingMarks} onClick={onToggleFormattingMarks} />
        <ToolbarButton icon={Eye} label={isPreview ? 'Disable preview' : 'Preview mode'} active={isPreview} onClick={() => onTogglePreview?.(editor)} />
        <ToolbarButton icon={Code2} label="Edit HTML" onClick={() => onRequestHtmlEdit?.(editor)} />
        <ToolbarButton icon={isFullscreen ? Minimize2 : Maximize2} label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'} active={isFullscreen} onClick={onToggleFullscreen} />
      </div>
    </div>
  );
}
function EditorControllerPlugin({ onReady }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    onReady?.(editor);
  }, [editor, onReady]);
  return null;
}

function RichTextEditor({ value, onChange, placeholder = 'Write your article…' }) {
  const lastHtmlRef = useRef('');
  const editorRef = useRef(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHtmlModalOpen, setIsHtmlModalOpen] = useState(false);
  const [htmlDraft, setHtmlDraft] = useState('');
  const [showFormattingMarks, setShowFormattingMarks] = useState(false);
  const [editorReady, setEditorReady] = useState(false);

  const editorConfig = useMemo(
    () => ({
      namespace: 'post-editor',
      theme,
      onError(error) {
        throw error;
      },
      nodes: [
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        CodeNode,
        LinkNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        HorizontalRuleNode,
      ],
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

  const handleEditorReady = useCallback((editor) => {
    editorRef.current = editor;
    setEditorReady(true);
  }, []);

  const handleTogglePreview = useCallback((editor) => {
    const targetEditor = editor ?? editorRef.current;
    if (!targetEditor) return;
    setIsPreview((prev) => {
      const next = !prev;
      targetEditor.setEditable(!next);
      return next;
    });
  }, []);

  const handleRequestHtmlEdit = useCallback((editor) => {
    const targetEditor = editor ?? editorRef.current;
    if (!targetEditor) return;
    editorRef.current = targetEditor;
    const html = $generateHtmlFromNodes(targetEditor);
    setHtmlDraft(html);
    setIsHtmlModalOpen(true);
  }, []);

  const handleApplyHtml = useCallback((valueToApply) => {
    const editor = editorRef.current;
    if (!editor) return;
    setIsHtmlModalOpen(false);
    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(valueToApply || '<p></p>', 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      root.append(...nodes);
    });
    lastHtmlRef.current = valueToApply;
  }, []);

  const toggleFormattingMarks = useCallback(() => {
    setShowFormattingMarks((prev) => !prev);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (!editorReady) return;
    const editor = editorRef.current;
    if (!editor) return;
    const html = value ?? '';
    if (lastHtmlRef.current === html) return;
    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(html || '<p></p>', 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      root.append(...nodes);
    });
    lastHtmlRef.current = html;
  }, [value, editorReady]);

  const containerClass = isFullscreen
    ? 'fixed inset-6 z-[1200] flex flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl'
    : 'flex flex-col';
  const editorShellClass = showFormattingMarks
    ? 'min-h-[320px] rounded-b-2xl px-4 py-3 text-base text-slate-900 focus:outline-none show-formatting'
    : 'min-h-[320px] rounded-b-2xl px-4 py-3 text-base text-slate-900 focus:outline-none';

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className={containerClass}>
        <EditorControllerPlugin onReady={handleEditorReady} />
        <ToolbarPlugin
          onRequestHtmlEdit={handleRequestHtmlEdit}
          onTogglePreview={handleTogglePreview}
          isPreview={isPreview}
          onToggleFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
          onToggleFormattingMarks={toggleFormattingMarks}
          showFormattingMarks={showFormattingMarks}
        />
        <div className="relative flex-1 overflow-hidden rounded-b-2xl border border-slate-700">
          <RichTextPlugin
            contentEditable={<ContentEditable className={editorShellClass} />}
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
          <TablePlugin />
          <HorizontalRulePlugin />
          <AutoFocusPlugin />
          <OnChangePlugin onChange={handleChange} />
        </div>
        {showFormattingMarks ? (
          <style>{`.show-formatting p::after{content:'¶';margin-left:0.25rem;color:#94a3b8;} .show-formatting br::after{content:'↵';color:#94a3b8;}`}</style>
        ) : null}

        {isHtmlModalOpen ? (
          <HtmlEditorModal
            initialValue={htmlDraft}
            onCancel={() => setIsHtmlModalOpen(false)}
            onApply={handleApplyHtml}
          />
        ) : null}
      </div>
    </LexicalComposer>
  );
}

function HtmlEditorModal({ initialValue, onCancel, onApply }) {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <header>
          <h3 className="text-lg font-semibold text-slate-900">Edit HTML</h3>
          <p className="text-sm text-slate-500">Paste or tweak the HTML representation of this post.</p>
        </header>
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={12}
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-800 focus:border-primary focus:outline-none"
        />
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:border-slate-400"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onApply(value)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark"
          >
            Apply HTML
          </button>
        </div>
      </div>
    </div>
  );
}

export default RichTextEditor;
