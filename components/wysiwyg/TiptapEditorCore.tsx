"use client"

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import { cn } from '@/lib/utils'
import ImageUploadButton from './ImageUploadButton'

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
      Image.configure({ inline: false }),
      Underline,
    ],
    content: content ?? '',
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  // 외부 content prop 변경 시 에디터 내용 동기화 (폼 초기화 등)
  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    const next = content ?? ''
    if (current !== next) {
      editor.commands.setContent(next)
    }
  }, [content, editor])

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
        {toolbarBtn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), 'B')}
        {toolbarBtn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), 'I')}
        {toolbarBtn(editor.isActive('underline'), () => editor.chain().focus().toggleUnderline().run(), 'U')}
        {toolbarBtn(editor.isActive('strike'), () => editor.chain().focus().toggleStrike().run(), 'S')}
        <span className="w-px h-4 bg-white/20 mx-1" />
        {toolbarBtn(editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'H2')}
        {toolbarBtn(editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), 'H3')}
        <span className="w-px h-4 bg-white/20 mx-1" />
        {toolbarBtn(editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), '• 목록')}
        {toolbarBtn(editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), '1. 목록')}
        {toolbarBtn(editor.isActive('blockquote'), () => editor.chain().focus().toggleBlockquote().run(), '인용')}
        {toolbarBtn(editor.isActive('code'), () => editor.chain().focus().toggleCode().run(), '코드')}
        <span className="w-px h-4 bg-white/20 mx-1" />
        <ImageUploadButton editor={editor} />
      </div>
      {/* 에디터 본문 */}
      <EditorContent
        editor={editor}
        className="p-3 min-h-[200px] prose prose-invert max-w-none focus:outline-none"
      />
    </div>
  )
}
