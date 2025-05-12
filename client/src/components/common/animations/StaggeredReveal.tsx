
import { type ReactNode, useRef } from "react"
import { motion, useInView } from "framer-motion"

interface StaggeredRevealProps {
    children: ReactNode[]
    staggerDelay?: number
    containerClassName?: string
    direction?: "up" | "down" | "left" | "right"
}

export default function StaggeredReveal({
    children,
    staggerDelay = 0.1,
    containerClassName = "",
    direction = "up",
}: StaggeredRevealProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.2 })

    const directionVariants = {
        up: { y: 40 },
        down: { y: -40 },
        left: { x: 40 },
        right: { x: -40 },
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
            },
        },
    }

    const itemVariants = {
        hidden: {
            opacity: 0,
            ...directionVariants[direction],
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    }

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className={containerClassName}
        >
            {Array.isArray(children) ? (
                children.map((child, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        {child}
                    </motion.div>
                ))
            ) : (
                <motion.div variants={itemVariants}>{children}</motion.div>
            )}
        </motion.div>
    )
}
