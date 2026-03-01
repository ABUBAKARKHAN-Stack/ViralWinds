"use client"
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/section-heading";
import Image from "next/image";
import { ContainerLayout } from "@/components/layout";
import { useGlobalContent } from "@/context/GlobalContentContext";
import { getIconByName } from "@/lib/icon-mapper";
import { LinkProcessor } from "@/components/ui/LinkProcessor";


const Leadership = () => {
  const { globalContent } = useGlobalContent();
  const leadershipData = globalContent?.leadership;
  const founderData = leadershipData?.founder;
  const agencyStructure = leadershipData?.agencyStructure || [];


  return (
    <section className="lg:py-12.5 py-6.25 bg-muted/30 overflow-hidden">

      <ContainerLayout>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left - Founder Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />

            {/* Main photo container */}
            <div className="relative">

              {/* Accent frame */}
              <motion.div
                className="absolute inset-0 border-2 border-accent rounded-3xl"
                initial={{ x: 0, y: 0 }}
                whileInView={{ x: 12, y: 12 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />

              {/* Photo */}
              <div className="relative rounded-3xl overflow-hidden bg-linear-to-br from-accent/20 to-primary/20 p-1">

                <div className="aspect-square">
                  <Image
                    fill
                    src={founderData?.image?.url || "/assets/about/founderImage.png"}
                    alt={`${founderData?.image?.altText || `${founderData?.name || "Mohsin"} - ${founderData?.role || "Founder & Creative Director"}`} `}
                    className="w-full object-cover rounded-2xl grayscale-20 hover:grayscale-0 transition-all duration-700"
                  />

                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-primary/60 via-transparent to-transparent rounded-2xl" />

                {/* Name badge */}
                <motion.div
                  className="absolute bottom-6 left-6 right-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="bg-background/90 backdrop-blur-md rounded-2xl p-4 border border-border/50">
                    <h3 className="text-2xl md:text-3xl font-display font-bold">
                      {founderData?.name || "Mohsin"}
                    </h3>
                    <p className="text-accent font-medium">
                      {founderData?.role || "Founder & Creative Director"}
                    </p>

                    {/* Social links */}
                    {founderData?.socialLinks && founderData.socialLinks.length > 0 && (
                      <div className="flex gap-3 mt-3">
                        {founderData.socialLinks.map((social, i) => {
                          const Icon = getIconByName(social.iconName);
                          return (
                            <motion.a
                              key={i}
                              title={social.label}
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Icon className="w-4 h-4" />
                            </motion.a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right - Info & Structure */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >

            <SectionHeading
              eyebrow={leadershipData?.sectionHeading?.eyebrow || "Leadership"}
              title={leadershipData?.sectionHeading?.title || "The Vision Behind the Brand"}
              description={leadershipData?.sectionHeading?.description}
              className="mb-8"
            />


            {/* Agency Structure */}
            <div className="bg-background border border-border/50 p-6 rounded-2xl">

              <h4 className="text-sm font-medium  text-muted-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
                Agency Structure
              </h4>

              <div className="space-y-3">
                {agencyStructure.map((team, index) => {
                  const IconComponent = getIconByName(team.iconName);

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors duration-300 group"
                    >
                      <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                        <IconComponent className="w-5 h-5 text-accent group-hover:text-accent-foreground transition-colors duration-300" />
                      </div>
                      <div>
                        <h5 className="font-medium">{team.title}</h5>
                        <p className="text-sm text-muted-foreground">
                          <LinkProcessor text={team.description} />
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

            </div>
          </motion.div>
        </div>
      </ContainerLayout>
    </section>
  );
};

export default Leadership;
