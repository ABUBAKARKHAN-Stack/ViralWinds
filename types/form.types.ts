import { SanityImageWithAlt } from './image.types';
import { SEOType } from './seo.types';

export interface PortfolioPageContentData {
    seo:SEOType
    hero: {
        title: string;
        subtitle: string;
        description: string;
    };
    portfolioList: {
        projects: Project[];
    };
    cta: {
        sectionHeading?: {
            eyebrow?: string;
            title: string;
            description?: string;
        };
        form: any;
    };
}

export interface Project {
    _id: string;
    title: string;
    slug: string;
    category: string;
    description: string;
    image: SanityImageWithAlt;
}

export type FormField = {
    _key?: string;
    fieldType: string;
    fieldName: string;
    label: string;
    placeholder?: string;
    required: boolean;
    validation?: string;
    options?: { label: string; value: string }[];
};

export type FormData = {
    _id: string;
    name: string;
    submitButtonText: string;
    successMessage: string;
    redirectUrl?: string;
    fields: FormField[];
};
