import type { ComponentConfig } from "@puckeditor/core";
import { Carousel, type CarouselProps } from "./Carousel";

export const carouselConfig: ComponentConfig<CarouselProps> = {
  fields: {
    items: {
      type: "array",
      label: "Carousel Slides",
      getItemSummary: (item, index) =>
        item.smallText || (item.image ? `Slide ${(index ?? 0) + 1}` : "Empty Slide"),
      defaultItemProps: {
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
        imageAlt: "Project screenshot",
        smallText: "AI Developer Tool",
        longText: "A next-generation code editor extension helping developers write clean and resilient systems.",
        linkUrl: "https://github.com",
      },
      arrayFields: {
        image: {
          type: "text",
          label: "Image URL",
        },
        imageAlt: {
          type: "text",
          label: "Image Alt Text (optional)",
        },
        smallText: {
          type: "text",
          label: "Small Text / Title (optional)",
        },
        longText: {
          type: "textarea",
          label: "Long Text / Description (optional)",
        },
        linkUrl: {
          type: "text",
          label: "Link URL (optional)",
        },
      },
    },
    aspectRatio: {
      type: "select",
      label: "Aspect Ratio",
      options: [
        { label: "16:9 (Widescreen)", value: "16:9" },
        { label: "21:9 (Ultrawide Cinematic)", value: "21:9" },
        { label: "4:3 (Standard Photo)", value: "4:3" },
        { label: "1:1 (Square)", value: "1:1" },
      ],
    },
    autoPlay: {
      type: "radio",
      label: "Autoplay Slides?",
      options: [
        { label: "No (Manual navigation)", value: "no" },
        { label: "Yes (Auto rotate)", value: "yes" },
      ],
    },
    autoPlaySeconds: {
      type: "select",
      label: "Autoplay Duration",
      options: [
        { label: "3 Seconds", value: "3" },
        { label: "5 Seconds", value: "5" },
        { label: "7 Seconds", value: "7" },
        { label: "10 Seconds", value: "10" },
      ],
    },
    showArrows: {
      type: "radio",
      label: "Show Previous/Next Arrows?",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
    },
    showDots: {
      type: "radio",
      label: "Show Dot Indicators?",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
    },
    showCounter: {
      type: "radio",
      label: "Show Slide Counter (e.g. 1/3)?",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
    },
    overlayTheme: {
      type: "select",
      label: "Text Overlay Style",
      options: [
        { label: "Frosted Gradient (Dark Blur)", value: "gradient" },
        { label: "Glass Card (Floating)", value: "glass-card" },
        { label: "Minimal Dark", value: "minimal" },
      ],
    },
  },
  defaultProps: {
    aspectRatio: "16:9",
    autoPlay: "no",
    autoPlaySeconds: "5",
    showArrows: "yes",
    showDots: "yes",
    showCounter: "yes",
    overlayTheme: "gradient",
    items: [
      {
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
        imageAlt: "Developer platform",
        smallText: "Portfolio Studio 2.0",
        longText: "A high-performance visual website and portfolio builder designed for modern engineers and creators.",
        linkUrl: "https://github.com",
      },
      {
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80",
        imageAlt: "Analytics dashboard",
        smallText: "Distributed Analytics Engine",
        longText: "Real-time streaming pipeline processing billions of metrics per day with sub-second querying latency.",
        linkUrl: "https://github.com",
      },
      {
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
        imageAlt: "Cybersecurity architecture",
        smallText: "Zero-Trust Cloud Mesh",
        longText: "Automated end-to-end encrypted transport architecture for modern multi-cloud microservices.",
        linkUrl: "https://github.com",
      },
    ],
  },
  render: (props) => <Carousel {...props} />,
};
