import { WrenchIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: WrenchIcon,

  fields: [

    //* Branding
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "localizedString",
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: "tagline",
      title: "Tagline",
      type: "localizedString",
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
      validation: Rule => Rule.required(),
    }),

    //* Base SEO 
    defineField({
      name: "seo",
      title: "Default SEO",
      type: "seo",
      description: "Fallback SEO for pages without custom SEO",
      validation: Rule => Rule.required(),
    }),

    //* Legal / Footer
    defineField({
      name: "footerText",
      title: "Footer Text",
      type: "localizedText",
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: "copyright",
      title: "Copyright Text",
      type: "localizedString",
      validation: Rule => Rule.required(),
    }),

    //* Menu Management
    defineField({
      name: "headerMenu",
      title: "Header Navigation Menu",
      type: "reference",
      to: [{ type: "menu" }],
      description: "Select the menu to display in the website header",
    }),

    defineField({
      name: "footerMenu",
      title: "Footer Navigation Menu",
      type: "reference",
      to: [{ type: "menu" }],
      description: "Select the menu to display in the website footer",
    }),

    //* Contact Info Array
    defineField({
      name: "contactInfo",
      title: "Contact Info List",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Heading / Label", type: "localizedString", validation: Rule => Rule.required() }),
            defineField({ name: "value", title: "Value (e.g. email or phone)", type: "localizedString", validation: Rule => Rule.required() }),
            defineField({ name: "icon", type: "string", description: "Icon name (e.g., Mail, Phone, MapPin)", validation: Rule => Rule.required() }),
          ],
        },
      ],
    }),

    //* Social Links Array
    defineField({
      name: "socialLinks",
      title: "Social Links List",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", type: "localizedString", validation: Rule => Rule.required() }),
            defineField({ name: "icon", type: "string", description: "Icon name (e.g., Facebook, Twitter, Instagram)", validation: Rule => Rule.required() }),
            defineField({ name: "url", type: "url", validation: Rule => Rule.required() }),
          ],
        },
      ],
    }),

    //* Footer CTA
    defineField({
      name: "footerCTA",
      title: "Footer CTA Section",
      type: "object",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow Text",
          type: "localizedString",
          description: "e.g. Have a project in mind?",
        }),
        defineField({
          name: "headingPrefix",
          title: "Heading Prefix",
          type: "localizedString",
          description: "e.g. Let's work",
        }),
        defineField({
          name: "headingHighlight",
          title: "Heading Highlight (Stroked)",
          type: "localizedString",
          description: "e.g. together",
        }),
        defineField({
          name: "buttonText",
          title: "Button Text",
          type: "localizedString",
        }),
        defineField({
          name: "buttonUrl",
          title: "Button URL",
          type: "string",
          description: "Defaults to /contact",
        }),
      ],
    }),
  ],

  preview: {
    prepare() {
      return {
        title: "Site Settings",
      };
    },
  },
});
