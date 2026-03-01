import { motion, MotionValue, } from "motion/react";
import { ArrowRight, ArrowUpRight, CheckCircle2, Star } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/ui/logo";
import MagneticButton from "@/components/MagneticButton";
import AnimatedBadge from "@/components/ui/animated-badge";
import { useLandingPageContent } from "@/context/LandingPageContentContext";
import { useGlobalContent } from "@/context/GlobalContentContext";
import { LinkProcessor } from "@/components/ui/LinkProcessor";

type Props = {
    y: MotionValue<number>
}

const HeroMainSection = ({
    y
}: Props) => {
    const { globalContent } = useGlobalContent()
    const { landingPageContent } = useLandingPageContent()

    const heroData = landingPageContent?.hero
    const featuredServices = heroData?.featuredServices;

    return (
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-12 lg:mb-16">

            {/* Left Column */}
            <div>
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="inline-flex items-center gap-3 mb-8"
                >
                    <AnimatedBadge>
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + i * 0.05 }}
                                >
                                    <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                                </motion.div>
                            ))}
                        </div>
                        <span className="text-sm font-medium text-foreground/80">{heroData?.badge || "Trusted by 3,000+ Businesses"}</span>
                    </AnimatedBadge>
                </motion.div>

                {/* Main heading */}
                <div className="mb-8 space-y-1">
                    {heroData?.headingLines?.map((line, index) => (
                        <div key={index} className="overflow-hidden">
                            <motion.h1
                                initial={{ y: 100 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.7, delay: 0.3 + (index * 0.1), ease: [0.16, 1, 0.3, 1] }}
                                className={`text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-display font-bold leading-[1.02] tracking-tight ${line.style === 'stroke' ? 'text-stroke' :
                                    line.style === 'gradient' ? 'gradient-text' : ''
                                    }`}
                            >
                                {line.text}
                            </motion.h1>
                        </div>
                    ))}
                </div>

                {/* Description paragraphs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="space-y-4 max-w-3xl mb-8"
                >
                    {heroData?.descriptionParagraphs?.map((paragraph, index) => (
                        <p key={index} className="text-base md:text-lg text-muted-foreground leading-relaxed">
                            <LinkProcessor text={paragraph.text} />
                        </p>
                    ))}
                </motion.div>

                {/* CTA buttons */}
                {heroData?.ctaButtons && heroData.ctaButtons.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="flex flex-wrap gap-4"
                    >
                        {heroData.ctaButtons.map((button, index) => (
                            <MagneticButton key={index} strength={0.12}>
                                <Link
                                    href={button.url}
                                    className={`group inline-flex items-center gap-3 px-8 py-4 font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${button.variant === 'primary'
                                        ? 'border-2 border-transparent bg-accent text-accent-foreground hover:bg-foreground hover:text-background shadow-lg shadow-accent/20'
                                        : 'border-2 border-border hover:border-accent hover:text-accent'
                                        }`}
                                >
                                    {button.text}
                                    {button.variant === 'primary' ? (
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    ) : (
                                        <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    )}
                                </Link>
                            </MagneticButton>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Right Column - Visual showcase */}
            <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="relative hidden lg:block"
            >
                {/* Main showcase card */}
                <div className="relative">
                    <motion.div
                        style={{ y }}
                        className="relative z-10 bg-card border border-border p-8"
                    >
                        {/* Logo */}
                        <div className="relative flex items-center justify-center mb-8">
                            <motion.div
                                animate={{
                                    opacity: [0.3, 0.5, 0.3],
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute w-40 h-40 bg-accent/15 rounded-full blur-3xl"
                            />
                            <Logo className='h-36 w-36 relative z-10' />
                        </div>

                        {/* Services list */}
                        <div className="space-y-2.5">
                            {featuredServices?.map((service, i) => (
                                <motion.div
                                    key={service.title}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <Link
                                        href={`/services/${service.slug}`}
                                        className="flex items-center gap-3 p-3.5 bg-muted/50 border border-border hover:border-accent/30 hover:bg-accent/5 transition-all group"
                                    >
                                        <div className="w-7 h-7 bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                                        </div>
                                        <span className="text-sm font-medium tracking-wide">{service.title}</span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Decorative frame */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="absolute -top-3 -right-3 w-full h-full border border-accent/40 -z-10"
                    />

                    {/* Accent square */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 }}
                        className="absolute -bottom-5 -left-5 w-16 h-16 bg-accent flex items-center justify-center"
                    >
                        <Star className="w-6 h-6 fill-accent-foreground text-accent-foreground" />
                    </motion.div>

                    {/* Since badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="absolute -top-6 -left-6 bg-foreground text-background px-4 py-2 text-xs font-semibold tracking-wider uppercase"
                    >
                        {globalContent?.stats?.since?.value || "2019"}   {globalContent?.stats?.since?.label || "Since"}
                    </motion.div>
                </div>
            </motion.div>

        </div>
    )
}

export default HeroMainSection