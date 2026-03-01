import { motion } from "motion/react";
import MagneticButton from "@/components/MagneticButton";
import Image from "next/image";

interface MarqueeRowProps {
    brand: {
        altText: string;
        logo: string;
    };
}

const TrustedByBrandsCard = ({
    brand,
}: MarqueeRowProps) => {
    return (
        <MagneticButton strength={0.15}>
            <motion.div
                className="shrink-0 h-24 w-44 sm:h-28 sm:w-52 md:h-36 md:w-60 flex items-center justify-center grayscale-0 opacity-90 hover:opacity-100 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
            >
                <Image
                    src={brand.logo}
                    alt={brand.altText}
                    fill
                    className="max-h-full max-w-full object-contain pointer-events-none select-none"
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                />
            </motion.div>
        </MagneticButton>
    )
}

export default TrustedByBrandsCard