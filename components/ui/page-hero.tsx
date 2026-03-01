"use client"

import { motion } from "motion/react";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { ContainerLayout } from "../layout";
import { LinkProcessor } from "./LinkProcessor";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  titleAccent?: string;
  subtitle?: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
}

const PageHero = ({ title, titleAccent = ".", subtitle, description, breadcrumbs }: PageHeroProps) => {
  return (
    <section className="pt-15 pb-10 md:pt-20 md:pb-15 relative overflow-hidden">

      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -right-1/4 w-125 h-125 rounded-full border border-accent/10" />
        <div className="absolute bottom-1/4 -left-1/4 w-75 h-75 rounded-full border border-border/20" />
      </div>

      <ContainerLayout className=" relative z-10">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
          aria-label="Breadcrumb"
        >
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link
                href="/"
                className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-1"
              >
                <Home className="w-3.5 h-3.5" />
                <span className="sr-only">Home</span>
              </Link>
            </li>
            {breadcrumbs.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
                {item.href ? (
                  <Link
                    href={`${item.href}`}
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </motion.nav>

        {/* Subtitle/Eyebrow */}
        {subtitle && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-accent text-sm tracking-widest uppercase mb-6 block"
          >
            {subtitle}
          </motion.span>
        )}

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-5xl xsm:text-6xl lg:text-8xl xl:text-9xl font-display font-bold tracking-tighter leading-[0.85]">
            {title}
            <span className="text-accent">{titleAccent}</span>
          </h1>
        </motion.div>

        {/* Description */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl text-muted-foreground mt-6 max-w-2xl"
          >
            <LinkProcessor text={description} />
          </motion.p>
        )}
      </ContainerLayout>
    </section>
  );
};

export default PageHero;
