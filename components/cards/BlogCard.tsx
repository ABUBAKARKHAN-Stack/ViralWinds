import { urlFor } from "@/sanity/lib/image";
import { BlogPost } from "@/types/blog.types";
import { BlogData } from "@/types/services.types";
import { ArrowUpRight, Clock } from "lucide-react";
import { motion } from "motion/react"
import Image from "next/image";
import Link from "next/link";
import { LinkProcessor } from "../ui/LinkProcessor";

type Props = {
    post: BlogData;
    index: number
}
const BlogCard = ({ post, index }: Props) => {
    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group cursor-pointer"
        >
            <Link href={`/blog/${post.slug}`}>
                {/* Image */}
                <div className="aspect-16/12 overflow-hidden mb-6 relative">
                    <Image
                        fill
                        src={urlFor(post.mainImage.source).url()}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-foreground/10 group-hover:bg-transparent transition-colors duration-500" />
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground uppercase tracking-widest mb-3">
                    <span className="text-accent">{post.categories[0] || "All"}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>{new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-display font-bold tracking-tight group-hover:text-accent transition-colors mb-3 line-clamp-1">
                    {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2"><LinkProcessor text={post.description} />  </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime} min</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs uppercase tracking-widest group-hover:text-accent transition-colors">
                        Read{" "}
                        <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                </div>
            </Link>
        </motion.article>
    )
}

export default BlogCard