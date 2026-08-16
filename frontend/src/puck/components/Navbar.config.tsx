import type { ComponentConfig } from "@puckeditor/core";
import { Navbar, type NavbarProps } from "./Navbar";

export const navbarConfig: ComponentConfig<NavbarProps> = {
  fields: {
    brandName: {
      type: "text",
      label: "Brand Name / Your Name",
    },
    // brandBadge: {
    //   type: "text",
    //   label: "Brand Badge / Status (optional)",
    // },
    brandLogoUrl: {
      type: "text",
      label: "Logo Image URL (optional)",
    },
    sticky: {
      type: "radio",
      label: "Positioning",
      options: [
        { label: "Sticky (Fixed on scroll)", value: "sticky" },
        { label: "Static (Scrolls with page)", value: "static" },
      ],
    },
    theme: {
      type: "select",
      label: "Visual Theme",
      options: [
        { label: "Frosted Glass (Dark Blur)", value: "glass" },
        { label: "Solid Dark", value: "solid" },
        { label: "Transparent", value: "transparent" },
      ],
    },
    items: {
      type: "array",
      label: "Navigation Items (Text & Links)",
      getItemSummary: (item) =>
        `${item.label || "Untitled"} (${item.type || "internal"})`,
      defaultItemProps: {
        label: "Projects",
        type: "internal",
        url: "#projects",
      },
      arrayFields: {
        label: {
          type: "text",
          label: "Label / Text",
        },
        type: {
          type: "select",
          label: "Item Type",
          options: [
            { label: "Internal Link (e.g. #projects, /about)", value: "internal" },
            { label: "External Link (e.g. GitHub, LinkedIn)", value: "external" },
            { label: "Static Text / Badge (Non-clickable)", value: "text" },
          ],
        },
        url: {
          type: "text",
          label: "URL / Target Anchor (e.g. #projects or https://...)",
        },
      },
    },
  },
  defaultProps: {
    brandName: "Alex Chen",
    brandLogoUrl: "",
    sticky: "sticky",
    theme: "glass",
    items: [
      {
        label: "About",
        type: "internal",
        url: "#about",
      },
      {
        label: "GitHub",
        type: "external",
        url: "https://github.com",
      },
      {
        label: "Remote / SF",
        type: "text",
      },
    ],
  },
  render: (props) => <Navbar {...props} />,
};
