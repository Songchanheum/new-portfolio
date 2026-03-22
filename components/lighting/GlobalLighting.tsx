"use client"

import { useEffect, useState } from 'react'
import { motion, useTransform } from 'framer-motion'

import type { MotionValue } from 'framer-motion'

interface GlobalLightingProps {
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}

export function GlobalLighting({ mouseX, mouseY }: GlobalLightingProps) {
  const [size, setSize] = useState({ w: 1920, h: 1080 })

  useEffect(() => {
    setSize({ w: window.innerWidth, h: window.innerHeight })
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const gradientX = useTransform(mouseX, [0, size.w], [30, 70])
  const gradientY = useTransform(mouseY, [0, size.h], [30, 70])

  const background = useTransform(
    [gradientX, gradientY],
    ([x, y]: number[]) =>
      `radial-gradient(ellipse at ${x}% ${y}%, rgba(255,255,255,0.04) 0%, transparent 70%)`
  )

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background }}
    />
  )
}
