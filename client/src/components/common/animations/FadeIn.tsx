

import { type ReactNode, useRef } from "react"
import { motion, useInView } from "framer-motion"

interface FadeInProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}

export default function FadeIn({ children, delay = 0, duration = 0.5, className = "" }: FadeInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{
        duration,
        delay,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
