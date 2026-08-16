import type { ComponentConfig } from "@puckeditor/core";
import { RichTextSection, type RichTextSectionProps } from "./RichTextSection";

export const richTextSectionConfig: ComponentConfig<RichTextSectionProps> = {
  fields: {
    content: {
      type: "richtext",
      label: "Rich Text Content",
    },
    maxWidth: {
      type: "select",
      label: "Container Max Width",
      options: [
        { label: "Prose / Article (768px)", value: "prose" },
        { label: "Standard (960px)", value: "standard" },
        { label: "Wide (1200px)", value: "wide" },
        { label: "Full Width (100%)", value: "full" },
      ],
    },
    align: {
      type: "radio",
      label: "Text Alignment",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    padding: {
      type: "select",
      label: "Vertical Spacing",
      options: [
        { label: "Compact", value: "compact" },
        { label: "Normal", value: "normal" },
        { label: "Spacious", value: "spacious" },
      ],
    },
    surface: {
      type: "select",
      label: "Background Surface",
      options: [
        { label: "Transparent (Default)", value: "transparent" },
        { label: "Frosted Glass Box", value: "glass" },
        { label: "Elevated Card Box", value: "card" },
      ],
    },
  },
  defaultProps: {
    content: `<h2>About My Engineering Philosophy</h2>
<p>I build <strong>high-availability distributed systems</strong> and developer platforms that scale gracefully under load. Over the past decade, I've designed resilient microservice architectures, real-time streaming engines, and elegant web interfaces.</p>
<blockquote>Simplicity is prerequisite for reliability. — Edsger W. Dijkstra</blockquote>
<h3>Core Competencies & Interests</h3>
<ul>
  <li>Distributed consensus protocols, Raft, and data replication engines.</li>
  <li>Event streaming with Apache Kafka, NATS, and Redis Pub/Sub.</li>
  <li>Modern TypeScript / React visual design systems and developer tooling.</li>
</ul>`,
    maxWidth: "standard",
    align: "left",
    padding: "normal",
    surface: "transparent",
  },
  render: (props) => <RichTextSection {...props} />,
};
