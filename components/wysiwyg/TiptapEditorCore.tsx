"use client"

import { useEffect } from 'react'
import { useEditor, EditorContent, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import { cn } from '@/lib/utils'
import ImageUploadButton from './ImageUploadButton'

// class 속성으로 정렬을 저장하는 커스텀 Image 확장
const ImageWithAlign = Image.extend({
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      class: {
        default: 'img-align-center',
        parseHTML: (el: Element) => el.getAttribute('class') ?? 'img-align-center',
        renderHTML: (attrs: Record<string, unknown>) => ({ class: attrs.class }),
      },
    }
  },
})

type ImageAlign = 'left' | 'center' | 'right' | 'full'

const ALIGN_OPTIONS: { value: ImageAlign; label: string; cls: string }[] = [
  { value: 'left',   label: '◀',  cls: 'img-align-left'   },
  { value: 'center', label: '⊕',  cls: 'img-align-center' },
  { value: 'right',  label: '▶',  cls: 'img-align-right'  },
  { value: 'full',   label: '↔',  cls: 'img-align-full'   },
]

export interface TiptapEditorCoreProps {
  content?: string | null
  onChange?: (html: string) => void
  className?: string
}

export default function TiptapEditorCore({ content, onChange, className }: TiptapEditorCoreProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      ImageWithAlign.configure({ inline: false }),
      Underline,
    ],
    content: content ?? '',
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    const next = content ?? ''
    if (current !== next) {
      editor.commands.setContent(next)
    }
  }, [content, editor])

  // Tiptap v3 — 선택 상태를 reactive하게 구독
  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      imageSelected: ctx.editor?.isActive('image') ?? false,
      currentClass: (ctx.editor?.getAttributes('image').class ?? 'img-align-center') as string,
    }),
  })
  const imageSelected = editorState?.imageSelected ?? false
  const currentClass = editorState?.currentClass ?? 'img-align-center'

  if (!editor) return null

  const toolbarBtn = (active: boolean, onClick: () => void, label: string) => (
    <button
      key={label}
      type="button"
      onClick={onClick}
      className={cn(
        'px-2 py-1 text-sm rounded hover:bg-white/10 transition-colors',
        active && 'bg-white/20 font-semibold'
      )}
    >
      {label}
    </button>
  )

  return (
    <div className={cn('border border-white/20 rounded-lg bg-white/5', className)}>
      {/* 툴바 */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10">
        {toolbarBtn(editor.isActive('bold'),      () => editor.chain().focus().toggleBold().run(),                   'B')}
        {toolbarBtn(editor.isActive('italic'),    () => editor.chain().focus().toggleItalic().run(),                 'I')}
        {toolbarBtn(editor.isActive('underline'), () => editor.chain().focus().toggleUnderline().run(),              'U')}
        {toolbarBtn(editor.isActive('strike'),    () => editor.chain().focus().toggleStrike().run(),                 'S')}
        <span className="w-px h-4 bg-white/20 mx-1" />
        {toolbarBtn(editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'H2')}
        {toolbarBtn(editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), 'H3')}
        <span className="w-px h-4 bg-white/20 mx-1" />
        {toolbarBtn(editor.isActive('bulletList'),   () => editor.chain().focus().toggleBulletList().run(),   '• 목록')}
        {toolbarBtn(editor.isActive('orderedList'),  () => editor.chain().focus().toggleOrderedList().run(),  '1. 목록')}
        {toolbarBtn(editor.isActive('blockquote'),   () => editor.chain().focus().toggleBlockquote().run(),   '인용')}
        {toolbarBtn(editor.isActive('code'),         () => editor.chain().focus().toggleCode().run(),         '코드')}
        <span className="w-px h-4 bg-white/20 mx-1" />
        <ImageUploadButton editor={editor} />

        {/* 이미지 선택 시에만 정렬 버튼 표시 */}
        {imageSelected && (
          <>
            <span className="w-px h-4 bg-white/20 mx-1" />
            <span className="text-xs text-gray-400 px-1 select-none">정렬</span>
            {ALIGN_OPTIONS.map(({ value, label, cls }) => (
              <button
                key={value}
                type="button"
                title={value}
                onClick={() => editor.chain().focus().updateAttributes('image', { class: cls }).run()}
                className={cn(
                  'px-2 py-1 text-sm rounded hover:bg-white/10 transition-colors',
                  currentClass === cls && 'bg-white/20 font-semibold text-white'
                )}
              >
                {label}
              </button>
            ))}
          </>
        )}
      </div>

      {/* 에디터 본문 */}
      <EditorContent
        editor={editor}
        className="p-3 min-h-[200px] prose prose-invert max-w-none focus:outline-none"
      />
    </div>
  )
}
