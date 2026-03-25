"use client"

import { ContainerLayout } from "../../../layout";
import ServiceCard from "./ServiceCard";
import BGDecorations from "./BG-Decorations";
import SectionHeading from "@/components/ui/section-heading";
import { SectionHeadingType, ServiceType } from "@/types/services.types";
import ContactDrawer from "../../shared/ContactDrawer";
import { useState } from "react";

type Props = {
  sectionHeading: SectionHeadingType;
  services: ServiceType[];
}


const AllServices = ({ sectionHeading, services }: Props) => {
  const [service, setService] = useState<string | null>(null);

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
              <ServiceCard
                onClick={() => setService(service.title)}
                key={`${service.title}-${i}`}
                service={service}
                index={i}
              />
            )
          })}
        </div>
      </ContainerLayout>

      <ContactDrawer
        open={!!service}
        onOpenChange={(open) => setService(open ? service : null)}
        service={service || ""}
      />
    </section>
  );
};

export default AllServices;
