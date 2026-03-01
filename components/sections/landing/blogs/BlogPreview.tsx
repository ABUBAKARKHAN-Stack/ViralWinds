"use client"

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import Link from "next/link";
import { ContainerLayout } from "@/components/layout";
import BlogCard from "@/components/cards/BlogCard";
import { useLandingPageContent } from "@/context/LandingPageContentContext";


const BlogPreview = () => {

  const { landingPageContent } = useLandingPageContent();

  const blogPreviewData = landingPageContent?.blogPreview;
  const blogPosts = blogPreviewData?.featuredBlogs;

  if (!blogPreviewData || !blogPosts || blogPosts.length === 0) return null;


  return (
    <section className="lg:py-12.5 py-6.25 bg-background relative overflow-hidden">

      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-muted/30 to-transparent pointer-events-none" />

      <ContainerLayout className=" relative z-10">
        <SectionHeading
          eyebrow={blogPreviewData?.sectionHeading?.eyebrow || "Latest insights"}
          title={blogPreviewData?.sectionHeading?.title || "From the Journal."}
          description={blogPreviewData?.sectionHeading?.description || "Thoughts, ideas, and perspectives on design, technology, and building brands that matter."}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {blogPosts.map((post, index) => (
            <BlogCard key={`${post.slug}-${index}`} post={post} index={index} />
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link href={blogPreviewData?.buttonUrl || "/blog"} className="inline-flex items-center gap-3 group">
            <span className="text-sm uppercase tracking-widest group-hover:text-accent transition-colors">
              {blogPreviewData?.buttonText || "View All Articles"}
            </span>
            <span className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-accent-foreground transition-all duration-300">
              <ArrowUpRight className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </Link>
        </motion.div>
      </ContainerLayout>
    </section>
  );
};

export default BlogPreview;
