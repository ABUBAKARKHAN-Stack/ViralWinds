import PageHero from '@/components/ui/page-hero'

type Props = {
    serviceTitle: string;
    serviceSubtitle: string;
    serviceDescription: string
}
const ServiceDetailsPageHero = ({
    serviceDescription,
    serviceSubtitle,
    serviceTitle
}: Props) => {
    return (
        <PageHero
            title={serviceTitle}
            subtitle={serviceSubtitle}
            description={serviceDescription}
            breadcrumbs={[
                { label: "Services", href: "/services" },
                { label: serviceTitle },
            ]}
        />
    )
}

export default ServiceDetailsPageHero