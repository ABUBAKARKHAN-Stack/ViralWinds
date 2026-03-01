import PageHero from '../../../ui/page-hero'

type ServicesPageHeroProps = {
  title: string
  subtitle: string
  description: string
}

const ServicesPageHero = ({ title, subtitle, description }: ServicesPageHeroProps) => {
  return (
    <PageHero
      title={title}
      subtitle={subtitle}
      description={description}
      breadcrumbs={[{ label: "Services" }]}
    />
  )
}

export default ServicesPageHero