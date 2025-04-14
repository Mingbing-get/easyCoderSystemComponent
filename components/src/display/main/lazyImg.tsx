import { useEffect, useRef, useState } from 'react'

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {}

export default function LazyImg(props: Props) {
  const [showImg, setShowImg] = useState(false)
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!spanRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowImg(true)

          if (spanRef.current) {
            observer.unobserve(spanRef.current)
          }

          observer.disconnect()
        }
      },
      {
        threshold: 1,
      }
    )

    observer.observe(spanRef.current)

    return () => {
      if (spanRef.current) {
        observer.unobserve(spanRef.current)
      }
      observer.disconnect()
    }
  }, [])

  if (!showImg) {
    return (
      <span
        ref={spanRef}
        style={{ display: 'inline-block', width: 1, height: 1 }}
      />
    )
  }

  return <img {...props} />
}
