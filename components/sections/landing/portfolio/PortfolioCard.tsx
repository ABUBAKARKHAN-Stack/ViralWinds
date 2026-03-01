import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type Props = {
    project: {
        title: string;
        slug: string;
        category: string;
        mainImage: {
            source: string;
            alt: string;
        };
    };
};

const PortfolioCard = ({ project }: Props) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <a
            className="relative h-84 min-w-[90vw] w-full min-[30rem]:min-w-120  cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            href={`/portfolio/${project.slug}`}
        >
            <div className="relative h-full overflow-hidden rounded-sm ">

                {/* Image */}
                <Image
                    src={urlFor(project.mainImage.source).url()}
                    alt={project.mainImage.alt || project.title}
                    fill
                    className="object-cover transition-transform duration-500"
                    loading="eager"
                />

                {/* Dark overlay */}
                <div
                    className={cn(
                        "absolute inset-0 bg-black  transition-opacity duration-300",
                        isHovered ? "opacity-40" : "opacity-0"
                    )}
                />


                {/* Content */}
                <div
                    className={cn(
                        "absolute bottom-4 text-center left-4 right-4 md:bottom-6 md:left-6 md:right-6 transition-all duration-300 font-display text-white",
                        isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    )}
                >
                    <span className="text-xs tracking-[0.2em] font-medium uppercase">
                        {project.category}
                    </span>

                    <h3 className="mt-1 md:mt-2 tracking-wider  text-lg md:text-2xl font-semibold">
                        {project.title}
                    </h3>
                </div>

                {/* Arrow (desktop only, hover only) */}
                <div
                    className={cn(
                        "absolute hidden md:flex transition-all duration-300",
                        isHovered ? "opacity-100 top-4 right-4 md:top-6 md:right-6" : "opacity-0 top-0 right-0"
                    )}
                >
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center">
                        <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                </div>

            </div>
        </a>
    );
};

export default PortfolioCard;
