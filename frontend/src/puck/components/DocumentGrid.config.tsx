import type { ComponentConfig } from "@puckeditor/core";
import { DocumentGrid, type DocumentGridProps } from "./DocumentGrid";

export const documentGridConfig: ComponentConfig<DocumentGridProps> = {
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
      label: "Grid Spacing",
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
    items: {
      type: "array",
      label: "Documents List",
      getItemSummary: (item, index) =>
        item.title || `Document ${(index ?? 0) + 1}`,
      defaultItemProps: {
        title: "Resume & Professional Bio",
        description: "<p>Comprehensive summary of engineering experience, system architecture projects, and skill proficiencies.</p>",
        documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        fileType: "pdf",
        fileSize: "1.2 MB",
        badge: "Updated",
        date: "2026",
      },
      arrayFields: {
        title: {
          type: "text",
          label: "Document Title",
        },
        documentUrl: {
          type: "text",
          label: "Document / Preview URL (opens in new tab)",
        },
        fileType: {
          type: "select",
          label: "Document Format / Type",
          options: [
            { label: "PDF Document (.pdf)", value: "pdf" },
            { label: "Word Document (.docx / .doc)", value: "docx" },
            { label: "Excel Spreadsheet (.xlsx / .csv)", value: "xlsx" },
            { label: "Presentation Deck (.pptx)", value: "pptx" },
            { label: "Code / Schema / Config", value: "code" },
            { label: "Archive Bundle (.zip)", value: "zip" },
            { label: "Image Asset / Diagram", value: "image" },
            { label: "Generic Document", value: "generic" },
          ],
        },
        description: {
          type: "richtext",
          label: "Description (Rich Text)",
        },
        fileSize: {
          type: "text",
          label: "File Size (e.g. 2.4 MB, 450 KB)",
        },
        date: {
          type: "text",
          label: "Date / Version Tag (e.g. Aug 2026)",
        },
        badge: {
          type: "text",
          label: "Optional Status Pill (e.g. Latest, Official)",
        },
      },
    },
  },
  defaultProps: {
    sectionTitle: "Documents & Publications",
    sectionSubtitle: "Preview and download curriculum vitae, research papers, system specifications, and architectural documentation.",
    gap: "md",
    cardStyle: "glass",
    items: [
      {
        title: "Senior Staff Engineer Resume",
        description: "<p>Full chronological overview of <strong>backend architectures</strong>, distributed systems, and team leadership milestones.</p>",
        documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        fileType: "pdf",
        fileSize: "2.1 MB",
        badge: "Latest",
        date: "Aug 2026",
      },
      {
        title: "Distributed Consensus Whitepaper",
        description: "<p>Deep dive research paper examining <em>low-latency Raft consensus</em> for globally replicated datastores.</p>",
        documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        fileType: "pdf",
        fileSize: "4.8 MB",
        badge: "Research",
        date: "2026",
      },
      {
        title: "API Architecture & Data Contracts",
        description: "<p>Complete <strong>OpenAPI 3.1 specification</strong> and SDK design patterns for developer platform microservices.</p>",
        documentUrl: "https://github.com",
        fileType: "code",
        fileSize: "680 KB",
        badge: "Spec",
        date: "v2.4",
      },
      {
        title: "Cloud Migration Strategy Deck",
        description: "<p>Executive presentation deck outlining the zero-downtime multi-region Kubernetes migration roadmap.</p>",
        documentUrl: "https://example.com",
        fileType: "pptx",
        fileSize: "14.2 MB",
        badge: "Strategy",
        date: "Q3 2026",
      },
    ],
  },
  render: (props) => <DocumentGrid {...props} />,
};
