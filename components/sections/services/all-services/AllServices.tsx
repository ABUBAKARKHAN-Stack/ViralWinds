"use client"

import { ContainerLayout } from "../../../layout";
import ServiceCard from "./ServiceCard";
import BGDecorations from "./BG-Decorations";
import SectionHeading from "@/components/ui/section-heading";
import { SectionHeadingType } from "@/types/services.types";

type Props = {
  sectionHeading: SectionHeadingType;
  services: {
    title: string;
    description: string;
    slug: string;
    heroImage: {
      alt: string;
      source: string;
    };
    items: string[];
  }[];
}


const AllServices = ({ sectionHeading, services}: Props) => {

  if (!services || !sectionHeading) return null
  return (

    <section className="lg:py-12.5 py-6.25 relative overflow-hidden">
      {/* Background decorations */}
      <BGDecorations />

      <ContainerLayout className="relative">

        <SectionHeading
          eyebrow={sectionHeading.eyebrow}
          title={sectionHeading.title}
          description={sectionHeading.description}
          align="center"
          splitText
        />

        {/* Services List */}
        <div className="space-y-0">
          {services.map((service, i) => {
            return (
              <ServiceCard key={`${service.title}-${i}`} service={service} index={i} />
            )
          })}
        </div>
      </ContainerLayout>

    </section>
  );
};

export default AllServices;
