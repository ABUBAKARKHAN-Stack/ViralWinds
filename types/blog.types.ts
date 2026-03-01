import { SanityImageWithAlt } from './image.types';
import { SEOType } from './seo.types';

export interface BlogPageContentData {
    hero: {
        title: string;
        subtitle: string;
        description: string;
    };
    blogList: {
        posts: BlogPost[];
    };
    cta: {
        sectionHeading?: {
            eyebrow?: string;
            title: string;
            description?: string;
        };
        form: any;
    };
    seo: SEOType
}

export interface BlogPost {
    _id: string;
    title: string;
    slug: string;
    description: string;
    categories: string[];
    author: string;
    date: string;
    image: SanityImageWithAlt;
    readTime: number;
    tags?: string[];
    featured?: boolean;
}
