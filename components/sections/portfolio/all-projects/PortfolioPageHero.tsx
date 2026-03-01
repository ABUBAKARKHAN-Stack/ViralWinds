import PageHero from '@/components/ui/page-hero'

interface PortfolioPageHeroProps {
    title: string
    subtitle: string
    description: string
}

const PortfolioPageHero = ({ title, subtitle, description }: PortfolioPageHeroProps) => {
    return (
        <PageHero
            title={title}
            subtitle={subtitle}
            description={description}
            breadcrumbs={[{ label: "Our Work" }]}
        />
    )
}

export default PortfolioPageHero