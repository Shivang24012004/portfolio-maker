import type { ComponentConfig } from "@puckeditor/core";
import { CardGrid, type CardGridProps } from "./CardGrid";

export const cardGridConfig: ComponentConfig<CardGridProps> = {
  fields: {
    sectionTitle: {
      type: "text",
      label: "Section Title (optional)",
    },
    sectionSubtitle: {
      type: "text",
      label: "Section Subtitle / Description (optional)",
    },
    gap: {
      type: "select",
      label: "Grid Gap / Spacing",
      options: [
        { label: "Compact (1rem)", value: "sm" },
        { label: "Normal (1.5rem)", value: "md" },
        { label: "Spacious (2rem)", value: "lg" },
      ],
    },
    cardStyle: {
      type: "select",
      label: "Card Visual Theme",
      options: [
        { label: "Frosted Glass (Dark Blur)", value: "glass" },
        { label: "Solid Border", value: "solid" },
        { label: "Elevated Surface", value: "elevated" },
      ],
    },
    imageAspectRatio: {
      type: "select",
      label: "Card Image Aspect Ratio",
      options: [
        { label: "16:9 (Widescreen)", value: "16:9" },
        { label: "4:3 (Classic)", value: "4:3" },
        { label: "1:1 (Square)", value: "1:1" },
        { label: "None / Original", value: "none" },
      ],
    },
    items: {
      type: "array",
      label: "Cards List",
      getItemSummary: (item, index) =>
        item.shortText || (item.image ? `Card ${(index ?? 0) + 1}` : "Untitled Card"),
      defaultItemProps: {
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
        imageAlt: "Project screenshot",
        shortText: "Distributed Task Scheduler",
        longText: "<p>A distributed microservice engine processing <strong>background cron</strong> and asynchronous worker queues.</p>",
        badge: "TypeScript",
        links: [
          {
            label: "Live Demo",
            url: "https://example.com",
          },
          {
            label: "GitHub",
            url: "https://github.com",
          },
        ],
      },
      arrayFields: {
        image: {
          type: "text",
          label: "Image URL (optional)",
        },
        imageAlt: {
          type: "text",
          label: "Image Alt Text (optional)",
        },
        shortText: {
          type: "text",
          label: "Short Text / Title",
        },
        longText: {
          type: "richtext",
          label: "Description (Rich Text)",
        },
        badge: {
          type: "text",
          label: "Tag / Category Pill (optional)",
        },
        links: {
          type: "array",
          label: "Card Links (Array)",
          getItemSummary: (link) => link.label || link.url || "Link",
          defaultItemProps: {
            label: "GitHub",
            url: "https://github.com",
          },
          arrayFields: {
            label: {
              type: "text",
              label: "Button Label (e.g. Live Demo, GitHub, Docs)",
            },
            url: {
              type: "text",
              label: "URL",
            },
          },
        },
      },
    },
  },
  defaultProps: {
    sectionTitle: "Featured Projects",
    sectionSubtitle: "Explore some of the high-impact software systems, web tools, and libraries I've built.",
    gap: "md",
    cardStyle: "glass",
    imageAspectRatio: "16:9",
    items: [
      {
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
        imageAlt: "Code editor and system tooling",
        shortText: "DevEngine Cloud IDE",
        longText: "<p>In-browser <strong>collaborative code editor</strong> with real-time sync, containerized execution, and <em>Git integrations</em>.</p>",
        badge: "Full-Stack",
        links: [
          { label: "Live Demo", url: "https://example.com" },
          { label: "GitHub", url: "https://github.com" },
        ],
      },
      {
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
        imageAlt: "Analytics pipeline dashboard",
        shortText: "StreamMetrics",
        longText: "<p>Ultra-fast telemetry streaming pipeline supporting <strong>high-cardinality</strong> time series metrics and dashboards.</p>",
        badge: "Go / Kafka",
        links: [
          { label: "Documentation", url: "https://example.com" },
          { label: "Source Code", url: "https://github.com" },
        ],
      },
      {
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
        imageAlt: "Security mesh dashboard",
        shortText: "AuthKey Protocol",
        longText: "<p>Decentralized cryptographic credential verification system with <strong>zero-knowledge proofs</strong>.</p>",
        badge: "Security",
        links: [
          { label: "Whitepaper", url: "https://example.com" },
          { label: "GitHub", url: "https://github.com" },
        ],
      },
    ],
  },
  render: (props) => <CardGrid {...props} />,
};
