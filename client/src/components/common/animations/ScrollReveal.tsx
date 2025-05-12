

import { type ReactNode, useRef } from "react"
import { motion, useInView } from "framer-motion"

interface ScrollRevealProps {
    children: ReactNode
    delay?: number
    direction?: "up" | "down" | "left" | "right"
    className?: string
}

export default function ScrollReveal({ children, delay = 0.2, direction = "up", className = "" }: ScrollRevealProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })

    const directionVariants = {
        up: { y: 50 },
        down: { y: -50 },
        left: { x: 50 },
        right: { x: -50 },
    }

    const variants = {
        hidden: {
            opacity: 0,
            ...directionVariants[direction],
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                duration: 0.6,
                delay,
                ease: "easeOut",
            },
        },
    }

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    )
}
