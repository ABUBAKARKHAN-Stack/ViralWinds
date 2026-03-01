"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { ContainerLayout } from "@/components/layout";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { LinkProcessor } from "@/components/ui/LinkProcessor";

interface MainContentProps {
  projects: any[]
}

const Portfolio = ({ projects }: MainContentProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (

    <section className="pb-16">
      <ContainerLayout>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {projects?.map((project, i) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                onHoverStart={() => setHoveredId(project._id)}
                onHoverEnd={() => setHoveredId(null)}
              >
                <Link href={`/portfolio/${project.slug}`} className="group block">

                  {/* Image Container */}
                  <div className="relative aspect-4/3 overflow-hidden rounded-2xl mb-5 bg-muted">
                    <Image
                      fill
                      src={urlFor(project.image).url()}
                      alt={project?.image?.altText || project.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-primary/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                    {/* Arrow Button */}
                    <motion.div
                      className="absolute bottom-4 right-4"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{
                        opacity: hoveredId === project._id ? 1 : 0,
                        x: hoveredId === project._id ? 0 : 10,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-14 h-14 bg-accent text-accent-foreground rounded-full flex items-center justify-center shadow-xl shadow-accent/20">
                        <ArrowUpRight className="w-6 h-6" />
                      </div>
                    </motion.div>

                    {/* Tags/Category */}
                    <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                      {project.category && (
                        <span
                          className="px-3 py-1 bg-background/90 backdrop-blur-sm text-xs font-medium rounded-full"
                        >
                          {project.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-display font-bold tracking-tight group-hover:text-accent transition-colors">
                          {project.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground line-clamp-2">
                      <LinkProcessor text={project.description} />
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold mb-2">No projects found</h3>
          </motion.div>
        )}
      </ContainerLayout>
    </section>

  );
};

export default Portfolio;
