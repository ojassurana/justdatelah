'use client'

import Hls from 'hls.js'
import { useEffect, useRef, type CSSProperties } from 'react'

type HlsVideoBackgroundProps = {
  src: string
  className?: string
  style?: CSSProperties
  desaturated?: boolean
}

export function HlsVideoBackground({
  src,
  className,
  style,
  desaturated,
}: HlsVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const canNative =
      video.canPlayType('application/vnd.apple.mpegurl') !== '' ||
      video.canPlayType('application/x-mpegURL') !== ''

    if (canNative) {
      video.src = src
      void video.play().catch(() => {})
      return
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true })
      hls.loadSource(src)
      hls.attachMedia(video)
      void video.play().catch(() => {})
      return () => {
        hls.destroy()
      }
    }

    return undefined
  }, [src])

  return (
    <video
      ref={videoRef}
      className={className}
      style={{
        ...style,
        ...(desaturated ? { filter: 'saturate(0)' } : {}),
      }}
      autoPlay
      muted
      loop
      playsInline
    />
  )
}
