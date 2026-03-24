"use client"

import { useEffect, useState } from 'react'
import { motion, useTransform } from 'framer-motion'

import type { MotionValue } from 'framer-motion'

interface GlobalLightingProps {
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}

/** 마우스 추적 조명 — 넓게 퍼지는 소프트 그라데이션 + soft-light로 은은한 대비 */
export function GlobalLighting({ mouseX, mouseY }: GlobalLightingProps) {
  const [size, setSize] = useState({ w: 1920, h: 1080 })

  useEffect(() => {
    setSize({ w: window.innerWidth, h: window.innerHeight })
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const gradientX = useTransform(mouseX, [0, size.w], [18, 82])
  const gradientY = useTransform(mouseY, [0, size.h], [16, 84])

  const background = useTransform([gradientX, gradientY], ([x, y]: number[]) => {
    const warm = `radial-gradient(ellipse 125% 105% at ${x}% ${y}%, rgba(255,250,242,0.038) 0%, rgba(255,255,255,0.015) 42%, transparent 78%)`
    const cool = `radial-gradient(ellipse 155% 135% at ${x}% ${y}%, rgba(140,185,255,0.028) 0%, rgba(100,140,220,0.01) 48%, transparent 82%)`
    const wash = `radial-gradient(circle min(125vw, 2000px) at ${x}% ${y}%, rgba(255,255,255,0.014) 0%, transparent 72%)`
    return [warm, cool, wash].join(', ')
  })

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-0 mix-blend-screen"
      style={{
        background,
        willChange: 'background',
      }}
      aria-hidden
    />
  )
}
