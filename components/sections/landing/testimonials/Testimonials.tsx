"use client"

import { motion, useMotionValue, useSpring, animate, PanInfo } from "motion/react";
import { Star, Quote } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";

import { ContainerLayout } from "@/components/layout";
import SectionHeading from "@/components/ui/section-heading";
import { useLandingPageContent } from "@/context/LandingPageContentContext";
import { LinkProcessor } from "@/components/ui/LinkProcessor";
import Image from "next/image";


const CARD_WIDTH = 400;
const CARD_GAP = 24;
const DRAG_THRESHOLD = 30;

const getInitials = (name: string) => {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.trim().slice(0, 2).toUpperCase();
};

const Testimonials = () => {
  const { landingPageContent } = useLandingPageContent();
  const cmsTestimonials = landingPageContent?.testimonials?.testimonials;
  const cmsHeading = landingPageContent?.testimonials?.sectionHeading;

  // Use CMS data if available, otherwise fallback to constants
  const displayTestimonials = cmsTestimonials && cmsTestimonials.length > 0
    ? cmsTestimonials.map((t, idx) => ({
      id: idx,
      quote: t.quote,
      author: t.author,
      role: t.role,
      company: t.company,
      rating: 5, // Default rating if not in CMS
      image: t.avatar?.url || null // Remove founder image fallback
    }))
    : [];

  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const dragX = useMotionValue(0);
  const dragXSpring = useSpring(dragX, { stiffness: 300, damping: 30 });

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % displayTestimonials.length);
  }, [displayTestimonials.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length);
  }, [displayTestimonials.length]);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    setIsAutoPlaying(false);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || isDragging) return;

    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isDragging, next]);

  const handleDragStart = () => {
    setIsDragging(true);
    setIsAutoPlaying(false);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);

    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > DRAG_THRESHOLD || velocity > 500) {
      prev();
    } else if (offset < -DRAG_THRESHOLD || velocity < -500) {
      next();
    }

    animate(dragX, 0, { type: "spring", stiffness: 300, damping: 30 });
  };

  const getCardStyle = (index: number) => {
    const diff = index - current;
    const total = displayTestimonials.length;

    let normalizedDiff = diff;
    if (diff > total / 2) normalizedDiff = diff - total;
    if (diff < -total / 2) normalizedDiff = diff + total;

    const isActive = normalizedDiff === 0;
    const isAdjacent = Math.abs(normalizedDiff) === 1;
    const isFar = Math.abs(normalizedDiff) >= 2;

    return {
      x: normalizedDiff * (CARD_WIDTH * 0.7 + CARD_GAP),
      scale: isActive ? 1 : isAdjacent ? 0.85 : 0.7,
      opacity: isFar ? 0 : isAdjacent ? 0.5 : 1,
      rotateY: normalizedDiff * -12,
      zIndex: isActive ? 10 : isAdjacent ? 5 : 1,
      filter: isActive ? "blur(0px)" : "blur(2px)",
    };
  };

  return (
    <section className="lg:py-12.5 py-6.25 relative overflow-hidden bg-muted/30">

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />

      <ContainerLayout className="relative">

        <SectionHeading
          eyebrow={cmsHeading?.eyebrow || "Testimonials"}
          title={cmsHeading?.title || "Client stories"}
          description={cmsHeading?.description || "Our clients value more than just design output. They value the process, the collaboration, and the confidence that comes from working with a team that understands their goals."}
          align="center"
          splitText
        />


        {/* Coverflow Carousel with Drag */}
        <motion.div
          ref={containerRef}
          className="relative h-112.5  md:h-125 cursor-grab active:cursor-grabbing select-none touch-pan-y"
          style={{ perspective: "1200px" }}
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center touch-none"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            dragMomentum={false}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{ x: dragXSpring }}
          >
            {displayTestimonials.map((testimonial, index) => {
              const style = getCardStyle(index);

              return (
                <motion.div
                  key={testimonial.id}
                  className="absolute w-[320px] md:w-100"
                  animate={style}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                  onClick={() => !isDragging && goTo(index)}
                  style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: "center center",
                  }}
                >
                  <motion.div
                    className={`p-6 md:p-8 rounded-2xl border bg-card shadow-2xl transition-all duration-500 ${index === current
                      ? "border-accent/50 shadow-accent/20"
                      : "border-border/50"
                      }`}
                    whileHover={index === current ? { scale: 1.02 } : {}}
                  >
                    <Quote className="absolute top-4 right-4 w-8 h-8 text-accent/20" />

                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Star className="w-4 h-4 fill-accent text-accent" />
                        </motion.div>
                      ))}
                    </div>

                    <blockquote className="text-base md:text-lg leading-relaxed text-foreground/90 font-light mb-6 line-clamp-4">
                      "<LinkProcessor text={testimonial.quote} />"
                    </blockquote>

                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 shrink-0">
                        {testimonial.image ? (
                          <Image
                            src={testimonial.image}
                            alt={testimonial.author}
                            fill
                            className="rounded-full object-cover border-2 border-accent/30"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-accent/10 flex items-center justify-center border-2 border-accent/20 text-accent font-bold text-sm uppercase tracking-wider">
                            {getInitials(testimonial.author)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm">{testimonial.author}</div>
                        <div className="text-xs text-muted-foreground">
                          {testimonial.role}{testimonial.company ? `, ${testimonial.company}` : ""}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 ">
          <motion.button
            onClick={prev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full border border-border hover:border-accent hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all duration-300"
            aria-label="Previous testimonial"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <div className="flex gap-2">
            {displayTestimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goTo(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`h-2 rounded-full transition-all duration-300 ${current === index
                  ? "bg-accent w-8"
                  : "bg-border hover:bg-accent/50 w-2"
                  }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <motion.button
            onClick={next}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full border border-border hover:border-accent hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all duration-300"
            aria-label="Next testimonial"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </ContainerLayout>
    </section>
  );
};

export default Testimonials;
