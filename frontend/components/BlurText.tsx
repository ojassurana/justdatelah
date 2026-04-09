'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

type BlurTextProps = {
  text: string
  className?: string
}

export function BlurText({ text, className }: BlurTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const words = text.split(/\s+/).filter(Boolean)

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex max-w-5xl flex-wrap justify-center gap-x-3 gap-y-2 text-center',
        className,
      )}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block will-change-[filter,opacity,transform]"
          initial={{
            filter: 'blur(10px)',
            opacity: 0,
            y: 50,
          }}
          animate={
            inView
              ? {
                filter: ['blur(10px)', 'blur(5px)', 'blur(0px)'],
                opacity: [0, 0.5, 1],
                y: [50, -5, 0],
              }
              : {
                filter: 'blur(10px)',
                opacity: 0,
                y: 50,
              }
          }
          transition={{
            duration: 1.05,
            delay: i * 0.1,
            times: [0, 0.33, 1],
            ease: 'easeOut',
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}
