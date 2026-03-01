import PageHero from '@/components/ui/page-hero'

type Props = {
    projectTitle: string;
    projectDescription: string
}
export const PortfolioPageHero = ({
    projectDescription,
    projectTitle
}: Props) => {
    return (
        <PageHero
            title={projectTitle}
            description={projectDescription}
            breadcrumbs={[
                { label: "Our Work", href: "/portfolio" },
                { label: projectTitle },
            ]}
        />
    )
}

