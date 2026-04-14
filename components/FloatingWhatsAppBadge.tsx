"use client"
import { motion } from "motion/react"

const FloatingWhatsAppBadge = ({
    phone = 923019452882,
    message = "Hello! I want to know more about your services."
}) => {

    const encodedMessage = encodeURIComponent(message)
    const encodedUrl = `https://wa.me/${phone}?text=${encodedMessage}`

    return (
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
        >
            <a
                href={encodedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 hover:bg-[#075E54] hover:text-background px-3 py-6 shadow-lg bg-[#25D366] text-background transition-colors duration-300"
            >
                <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                    {/* WhatsApp SVG Icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        className="h-5 w-5 fill-current"
                    >
                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.7 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.2-17.1-41.3-4.5-11.2-9.1-9.7-12.5-9.8-3.2-.1-6.9-.1-10.6-.1-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.1 13.9 10.9-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                    </svg>
                </motion.div>
                <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                >
                    WhatsApp
                </span>
            </a>
        </motion.div>
    )
}

export default FloatingWhatsAppBadge