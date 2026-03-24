"use client"

import dynamic from 'next/dynamic'
import type { TiptapEditorCoreProps } from './TiptapEditorCore'

const TiptapEditorCore = dynamic(() => import('./TiptapEditorCore'), { ssr: false })

export default function TiptapEditor(props: TiptapEditorCoreProps) {
  return <TiptapEditorCore {...props} />
}
