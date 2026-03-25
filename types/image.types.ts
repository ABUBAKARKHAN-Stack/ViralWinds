export interface SanityImageWithAlt {
    _id?: string;
    url: string;
    altText?: string;
}

export interface SanityImageAsset {
    _id: string;
    url: string;
    altText?: string
    caption?: string
}

export interface SanityImage {
    alt: string;
    source: string;
}
