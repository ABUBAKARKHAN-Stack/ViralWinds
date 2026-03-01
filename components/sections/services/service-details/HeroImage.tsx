"use client"
import { urlFor } from '@/sanity/lib/image';
import { SanityImage } from '@/types/services.types';
import { useScroll, useTransform, motion } from 'motion/react';
import Image from 'next/image';
import  { useRef } from 'react'

type Props = {
    heroImage: SanityImage
}
const HeroImage = ({
    heroImage,
}: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const imageY = useTransform(scrollYProgress, [0, 1], [0, 200]);

    return (
        <section ref={containerRef} className="relative h-[50vh] md:h-[70vh] overflow-hidden">
            <motion.div
                style={{ y: imageY }}
                className="absolute inset-0"
            >
                <Image
                    src={urlFor(heroImage.source).quality(90).url()}
                    alt={heroImage.alt}
                    className="w-full h-full object-cover"
                    priority
                    fill
        
                />
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
            </motion.div>
        </section>
    )
}

export default HeroImage