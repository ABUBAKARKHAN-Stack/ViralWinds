export interface SanityImageWithAlt {
    _id?: string;
    url: string;
    altText?: string;
}

export interface SanityImageAsset {
    _id: string;
    url: string;
    altText?: {
        en?: string;
        ur?: string;
        es?: string;
        ar?: string;
    };
    caption?: {
        en?: string;
        ur?: string;
        es?: string;
        ar?: string;
    };
}
