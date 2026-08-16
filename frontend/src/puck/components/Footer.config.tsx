import type { ComponentConfig } from "@puckeditor/core";
import { Footer, type FooterProps } from "./Footer";

export const footerConfig: ComponentConfig<FooterProps> = {
  fields: {
    brandName: {
      type: "text",
      label: "Brand / Author Name",
    },
    tagline: {
      type: "text",
      label: "Tagline / Short Summary",
    },
    theme: {
      type: "select",
      label: "Visual Theme",
      options: [
        { label: "Frosted Glass (Dark Blur)", value: "glass" },
        { label: "Solid Surface", value: "solid" },
        { label: "Minimalist Borderless", value: "minimal" },
      ],
    },
    layout: {
      type: "select",
      label: "Footer Layout Style",
      options: [
        { label: "Multi-Column Grid", value: "columns" },
        { label: "Compact Horizontal / Stacked", value: "compact" },
      ],
    },
    copyrightText: {
      type: "text",
      label: "Copyright Note",
    },
    builtWithText: {
      type: "text",
      label: "Credit / Attribution (optional)",
    },
    links: {
      type: "array",
      label: "Footer Navigation Links",
      getItemSummary: (item) => item.label || item.url || "Link",
      defaultItemProps: {
        label: "Projects",
        url: "#projects",
        isExternal: "no",
      },
      arrayFields: {
        label: {
          type: "text",
          label: "Link Label",
        },
        url: {
          type: "text",
          label: "Destination URL / Anchor",
        },
        isExternal: {
          type: "radio",
          label: "Open in New Tab",
          options: [
            { label: "Yes (External)", value: "yes" },
            { label: "No (Internal)", value: "no" },
          ],
        },
      },
    },
    socials: {
      type: "array",
      label: "Social & Contact Links",
      getItemSummary: (item) => item.label || item.platform || "Social Link",
      defaultItemProps: {
        platform: "github",
        label: "GitHub",
        url: "https://github.com",
      },
      arrayFields: {
        platform: {
          type: "select",
          label: "Platform / Icon",
          options: [
            { label: "GitHub", value: "github" },
            { label: "LinkedIn", value: "linkedin" },
            { label: "X / Twitter", value: "twitter" },
            { label: "Email", value: "email" },
            { label: "Website / Blog", value: "website" },
            { label: "Custom / Link", value: "generic" },
          ],
        },
        label: {
          type: "text",
          label: "Label Text (optional)",
        },
        url: {
          type: "text",
          label: "Profile / Contact Link",
        },
      },
    },
  },
  defaultProps: {
    brandName: "Alex Chen",
    tagline: "Building high-performance distributed systems, cloud infrastructure, and modern web platforms.",
    copyrightText: "All rights reserved.",
    builtWithText: "Designed with Portfolio Studio",
    theme: "glass",
    layout: "columns",
    links: [
      { label: "About", url: "#about", isExternal: "no" },
      { label: "Featured Projects", url: "#projects", isExternal: "no" },
      { label: "Documents & Specs", url: "#documents", isExternal: "no" },
      { label: "Contact", url: "mailto:alex@example.com", isExternal: "yes" },
    ],
    socials: [
      { platform: "github", label: "GitHub", url: "https://github.com" },
      { platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com" },
      { platform: "twitter", label: "Twitter / X", url: "https://x.com" },
      { platform: "email", label: "Email", url: "mailto:alex@example.com" },
    ],
  },
  render: (props) => <Footer {...props} />,
};
