'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  delay?: number
  className?: string
  children: ReactNode
}

export default function FadeInSection({ delay = 0, className = '', children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
