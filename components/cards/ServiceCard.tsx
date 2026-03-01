import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import Image from "next/image";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import { urlFor } from "@/sanity/lib/image";
import { LinkProcessor } from "../ui/LinkProcessor";

interface ServiceCardProps {
    service: { _id: string; title: string; slug: string; description: string; heroImage: { alt: string; source: string; }; items: string[]; };
    index: number;
}

const ServiceCard = ({ service, index }: ServiceCardProps) => {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const isTouchDevice = useIsTouchDevice()

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
        stiffness: 300,
        damping: 30,
    });

    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
        stiffness: 300,
        damping: 30,
    });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const resetTilt = () => {
        mouseX.set(0);
        mouseY.set(0);
        setIsHovered(false);
    };



    return (
        <motion.a
            ref={cardRef}
            href={`/services/${service.slug}`}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.7,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
            }}
            style={{
                rotateX: isHovered ? rotateX : 0,
                rotateY: isHovered ? rotateY : 0,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={resetTilt}
            className="relative group block cursor-pointer perspective-1000"
        >
            <motion.div
                className={cn(
                    "relative p-8 overflow-hidden",
                    "bg-card/80 backdrop-blur-sm",
                    "border border-border/50 transition-all duration-500",
                    isHovered && "border-accent shadow-[0_25px_70px_-20px_hsl(var(--accent)/0.35)]",
                    isTouchDevice && "h-92"
                )}
                animate={!isTouchDevice ? (isHovered ? { height: "23rem" } : { height: "17rem" }) : undefined}
                transition={{ duration: 0.1 }}
            >
                {/* Background */}
                <div className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity duration-500">
                    <Image
                        fill
                        src={urlFor(service.heroImage.source).url()}
                        alt={service.heroImage.alt}
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-card via-card/80 to-card/40" />
                </div>

                {/* Hover Gradient */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-br from-accent/10 via-transparent to-accent/5" />

                {/* Shine */}
                <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                    style={{
                        background:
                            "linear-gradient(105deg, transparent 40%, hsl(var(--accent) / 0.08) 45%, hsl(var(--accent) / 0.05) 50%, transparent 55%)",
                    }}
                    animate={
                        isHovered
                            ? { transform: ["translateX(-100%)", "translateX(100%)"] }
                            : { transform: "translateX(-100%)" }
                    }
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                />

                {/* Top Accent */}
                <motion.div
                    className="absolute top-0 left-0 h-0.5 bg-accent"
                    animate={{ width: isHovered ? "100%" : "0%" }}
                    transition={{ duration: 0.4 }}
                />

                {/* CONTENT */}
                <div
                    className="relative z-10 h-full flex flex-col gap-5"
                    style={{ transform: "translateZ(30px)" }}
                >

                    {/* Header */}
                    <div className="flex items-start justify-between">
                       <span className="block text-sm tracking-[0.4em] text-accent font-semibold mb-1">
                            {index > 9 ? index + 1 : `0${index + 1}`}
                        </span>

                        <motion.div
                            className="size-10 border border-border hidden min-[370px]:flex items-center justify-center group-hover:border-accent group-hover:bg-accent transition-colors"
                            animate={{
                                x: isHovered ? 3 : 0,
                                y: isHovered ? -3 : 0,
                            }}
                        >
                            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
                        </motion.div>
                    </div>


                    <div>
                       
                        <motion.h3
                            className="text-xl line-clamp-2 lg:text-2xl font-bold tracking-tight font-display"
                            animate={{
                                color: isHovered
                                    ? "hsl(var(--accent))"
                                    : "hsl(var(--foreground))",
                            }}
                        >
                            {service.title}
                        </motion.h3>
                    </div>

                    {/* Description  */}

                    {!isTouchDevice ?
                        <motion.p
                            initial={false}
                            animate={{
                                opacity: isHovered ? 1 : 0,
                                y: isHovered ? 0 : 6,
                            }}
                            transition={{ duration: 0.25 }}
                            className="text-muted-foreground my-auto leading-relaxed text-base pointer-events-none line-clamp-3"
                        >
                            <LinkProcessor text={service.description} />
                        </motion.p>
                        :
                        <p
                            className="text-muted-foreground my-auto leading-relaxed text-base pointer-events-none line-clamp-3">
                            <LinkProcessor text={service.description} />
                        </p>
                    }

                    {/* Tags */}
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                        {service.items.slice(0, 3).map((feature) => (
                            <span
                                key={feature}
                                className="text-[10px] tracking-wider px-2 py-1 bg-muted/50 text-muted-foreground border border-border/50 group-hover:border-accent/30 group-hover:text-foreground transition-all truncate"
                            >
                                {feature}
                            </span>
                        ))}

                        {service.items.length > 3 && (
                            <span className="text-[10px] px-2 py-1 bg-accent/10 text-accent border border-accent/30">
                                +{service.items.length - 3} more
                            </span>
                        )}
                    </div>
                </div>

                {/* Bottom Glow */}
                <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/15 transition-all duration-500" />
            </motion.div>
        </motion.a>
    );
};

export default ServiceCard;
