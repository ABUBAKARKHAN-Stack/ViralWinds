"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, Clock, User } from "lucide-react"
import { ContainerLayout } from "@/components/layout"
import { LinkProcessor } from "@/components/ui/LinkProcessor"
import { urlFor } from "@/sanity/lib/image"
import Link from "next/link"
import { AnimatePresence } from "motion/react"
import React, { useEffect, useCallback } from "react"

interface BlogPost {
    _id: string
    title: string
    slug: string
    description: string
    categories: string[]
    author: string
    date: string
    image: any
    readTime: number
    featured?: boolean
}

interface BlogMainContentProps {
    posts: BlogPost[]
}

export default function BlogMainContent({ posts }: BlogMainContentProps) {
    const [activeCategory, setActiveCategory] = useState("All")
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    const categories = ["All", ...new Set(posts.flatMap(post => post.categories || []).filter(Boolean))]

    const filteredPosts = activeCategory === "All"
        ? posts
        : posts.filter(post => (post.categories || []).includes(activeCategory))

    const featuredPosts = posts.filter(p => p.featured)

    // If no posts are explicitly featured, use the first post as featured for the UI layout
    const hasExplicitFeatured = featuredPosts.length > 0
    const displayFeatured = hasExplicitFeatured ? featuredPosts : [posts[0]].filter(Boolean)

    const featuredIds = new Set(displayFeatured.map(p => p._id))
    const remainingPosts = filteredPosts.filter(p => !featuredIds.has(p._id))

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % displayFeatured.length)
    }, [displayFeatured.length])

    useEffect(() => {
        if (!isAutoPlaying || displayFeatured.length <= 1) return
        const interval = setInterval(nextSlide, 5000)
        return () => clearInterval(interval)
    }, [isAutoPlaying, nextSlide, displayFeatured.length])


    return (
        <section className="lg:py-12.5 py-6.25 relative overflow-hidden">

            <ContainerLayout>
                {/* Categories */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-wrap gap-3 mb-16"
                >
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-5 py-2 text-sm uppercase tracking-widest border transition-all duration-300 ${activeCategory === category
                                ? "bg-accent text-accent-foreground border-accent"
                                : "border-border text-muted-foreground hover:border-accent hover:text-accent"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </motion.div>

                {/* Featured Blog Carousel */}
                {displayFeatured.length > 0 && activeCategory === "All" && (
                    <div className="relative mb-24">
                        <div className="overflow-hidden relative min-h-[500px] lg:min-h-[400px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                    className="w-full"
                                >
                                    <Link
                                        href={`/blog/${displayFeatured[currentSlide]?.slug}`}
                                        className="grid lg:grid-cols-2 gap-8 items-center group cursor-pointer"
                                    >
                                        <div className="aspect-16/10 overflow-hidden relative">
                                            <img
                                                src={displayFeatured[currentSlide].image?.url || (displayFeatured[currentSlide].image ? urlFor(displayFeatured[currentSlide].image).url() : '')}
                                                alt={displayFeatured[currentSlide].title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                                            />
                                            <div className="absolute top-4 left-4 px-4 py-1 bg-accent text-accent-foreground text-xs uppercase tracking-widest">
                                                Featured
                                            </div>
                                        </div>
                                        <div className="lg:pl-8">
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground uppercase tracking-widest mb-4">
                                                {displayFeatured[currentSlide].categories?.map((cat, idx) => (
                                                    <React.Fragment key={cat}>
                                                        <span className="text-accent">{cat}</span>
                                                        {idx < (displayFeatured[currentSlide].categories?.length || 0) - 1 && <span>·</span>}
                                                    </React.Fragment>
                                                ))}
                                                {displayFeatured[currentSlide].categories?.length > 0 && <span>·</span>}
                                                <span>{new Date(displayFeatured[currentSlide].date).toLocaleDateString("en", { month: 'short', year: 'numeric' })}</span>
                                            </div>
                                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight group-hover:text-accent transition-colors mb-6">
                                                {displayFeatured[currentSlide].title}
                                            </h2>
                                            <p className="text-lg text-muted-foreground mb-6 line-clamp-3">
                                                <LinkProcessor text={displayFeatured[currentSlide].description} />
                                            </p>
                                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    {displayFeatured[currentSlide].author}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    {displayFeatured[currentSlide].readTime} Read Time
                                                </div>
                                            </div>
                                            <div className="mt-8">
                                                <span className="inline-flex items-center gap-2 text-sm uppercase tracking-widest group-hover:text-accent transition-colors">
                                                    Read Article <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Carousel Navigation */}
                        {displayFeatured.length > 1 && (
                            <div className="flex items-center gap-4 mt-8">
                                <div className="flex gap-2">
                                    {displayFeatured.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setCurrentSlide(index);
                                                setIsAutoPlaying(false);
                                            }}
                                            className={`h-1.5 transition-all duration-300 rounded-full ${currentSlide === index ? "w-12 bg-accent" : "w-4 bg-border hover:bg-accent/50"
                                                }`}
                                            aria-label={`Go to slide ${index + 1}`}
                                        />
                                    ))}
                                </div>
                                <div className="ml-auto flex gap-2">
                                    <button
                                        onClick={() => {
                                            setCurrentSlide((prev) => (prev - 1 + displayFeatured.length) % displayFeatured.length);
                                            setIsAutoPlaying(false);
                                        }}
                                        className="p-2 border border-border hover:border-accent hover:text-accent transition-colors rounded-full"
                                    >
                                        <ArrowUpRight className="h-5 w-5 rotate-225" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setCurrentSlide((prev) => (prev + 1) % displayFeatured.length);
                                            setIsAutoPlaying(false);
                                        }}
                                        className="p-2 border border-border hover:border-accent hover:text-accent transition-colors rounded-full"
                                    >
                                        <ArrowUpRight className="h-5 w-5 rotate-45" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Divider */}
                {displayFeatured.length > 0 && activeCategory === "All" && (
                    <div className="border-t border-border mb-16" />
                )}

                {/* Posts Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(activeCategory === "All" ? remainingPosts : filteredPosts).map((post, i) => (
                        <motion.article
                            key={post._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <Link href={`/blog/${post.slug}`}>
                                <div className="aspect-16/12 overflow-hidden mb-6">
                                    <img
                                        src={post.image?.url || (post.image ? urlFor(post.image).url() : '')}
                                        alt={post.title}
                                        className="w-full h-full object-cover   group-hover:scale-105 transition-all duration-700"
                                    />
                                </div>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-muted-foreground uppercase tracking-widest mb-3">
                                    {post.categories?.map((cat, idx) => (
                                        <React.Fragment key={cat}>
                                            <span className="text-accent">{cat}</span>
                                            {idx < (post.categories?.length || 0) - 1 && <span>·</span>}
                                        </React.Fragment>
                                    ))}
                                    {post.categories?.length > 0 && <span>·</span>}
                                    <span>{new Date(post.date).toLocaleDateString(
                                        "en",
                                        { month: 'short', year: 'numeric' }
                                    )}</span>
                                </div>
                                <h3 className="text-xl font-display font-bold tracking-tight group-hover:text-accent transition-colors mb-3 line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                    <LinkProcessor text={post.description} />
                                </p>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        {post.readTime} Read Time
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-xs uppercase tracking-widest group-hover:text-accent transition-colors">
                                        Read Article <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </span>
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </div>

                {/* Empty State */}
                {filteredPosts.length === 0 && (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-display font-semibold mb-2">No posts found</h3>
                        <p className="text-muted-foreground">Check back later for more content.</p>
                    </div>
                )}
            </ContainerLayout>
        </section>
    )
}
