import type { Config, Data } from "@puckeditor/core";
import { navbarConfig } from "./components/Navbar.config";
import type { NavbarProps } from "./components/Navbar";
import { carouselConfig } from "./components/Carousel.config";
import type { CarouselProps } from "./components/Carousel";
import { cardGridConfig } from "./components/CardGrid.config";
import type { CardGridProps } from "./components/CardGrid";
import { documentGridConfig } from "./components/DocumentGrid.config";
import type { DocumentGridProps } from "./components/DocumentGrid";
import { richTextSectionConfig } from "./components/RichTextSection.config";
import type { RichTextSectionProps } from "./components/RichTextSection";
import { footerConfig } from "./components/Footer.config";
import type { FooterProps } from "./components/Footer";

// Props definition for portfolio components
export type UserProps = {
  Navbar: NavbarProps;
  Carousel: CarouselProps;
  CardGrid: CardGridProps;
  DocumentGrid: DocumentGridProps;
  RichTextSection: RichTextSectionProps;
  Footer: FooterProps;
  Heading: {
    title: string;
    subtitle?: string;
    align?: "left" | "center" | "right";
  };
};

export const config: Config<UserProps> = {
  categories: {
    layout: {
      title: "Layout & Navigation",
      components: ["Navbar", "Footer", "CardGrid", "DocumentGrid"],
    },
    media: {
      title: "Media & Galleries",
      components: ["Carousel"],
    },
    typography: {
      title: "Typography & Content",
      components: ["RichTextSection", "Heading"],
    },
  },
  components: {
    Navbar: navbarConfig,
    Footer: footerConfig,
    Carousel: carouselConfig,
    CardGrid: cardGridConfig,
    DocumentGrid: documentGridConfig,
    RichTextSection: richTextSectionConfig,
    Heading: {
      fields: {
        title: { type: "text" },
        subtitle: { type: "text" },
        align: {
          type: "radio",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
      },
      defaultProps: {
        title: "Welcome to My Portfolio",
        subtitle: "A showcase of my recent projects, skills, and experience.",
        align: "left",
      },
      render: ({ title, subtitle, align = "left" }) => {
        return (
          <div style={{ textAlign: align, padding: "2.5rem 1.5rem" }}>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "0.5rem", color: "#f8fafc" }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{ fontSize: "1.15rem", color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>
                {subtitle}
              </p>
            )}
          </div>
        );
      },
    },
  },
};

export type PuckData = Data<UserProps>;

export const initialData: PuckData = {
  content: [
    {
      type: "Navbar",
      props: {
        id: "navbar-1",
        brandName: "Alex Chen",
        brandBadge: "Available for hire",
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
            label: "Projects",
            type: "internal",
            url: "#projects",
          },
          {
            label: "Documents",
            type: "internal",
            url: "#documents",
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
    },
    {
      type: "Heading",
      props: {
        id: "heading-1",
        title: "Featured Works & Systems",
        subtitle: "Explore interactive snapshots and highlights of my engineering projects.",
        align: "center",
      },
    },
    {
      type: "Carousel",
      props: {
        id: "carousel-1",
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
        ],
      },
    },
    {
      type: "CardGrid",
      props: {
        id: "cardgrid-1",
        sectionTitle: "Project Highlights",
        sectionSubtitle: "Deep dive into selected production applications and technical architecture.",
        gap: "md",
        cardStyle: "glass",
        imageAspectRatio: "16:9",
        items: [
          {
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
            imageAlt: "Cloud IDE",
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
            imageAlt: "Analytics Engine",
            shortText: "StreamMetrics Telemetry",
            longText: "<p>Ultra-fast telemetry streaming pipeline supporting <strong>high-cardinality</strong> time series metrics and dashboards.</p>",
            badge: "Go / Kafka",
            links: [
              { label: "Documentation", url: "https://example.com" },
              { label: "Source Code", url: "https://github.com" },
            ],
          },
          {
            image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
            imageAlt: "Auth Key",
            shortText: "AuthKey Zero-Trust Protocol",
            longText: "<p>Decentralized cryptographic credential verification system with <strong>zero-knowledge proofs</strong>.</p>",
            badge: "Security",
            links: [
              { label: "Whitepaper", url: "https://example.com" },
              { label: "GitHub", url: "https://github.com" },
            ],
          },
        ],
      },
    },
    {
      type: "RichTextSection",
      props: {
        id: "richtext-1",
        content: `<h2>Engineering Principles & Background</h2>
<p>I build <strong>high-availability distributed systems</strong> and developer platforms that scale gracefully under load. Over the past decade, I've designed resilient microservice architectures, real-time streaming engines, and elegant web interfaces.</p>
<blockquote>Simplicity is prerequisite for reliability. — Edsger W. Dijkstra</blockquote>
<h3>Core Competencies & Stack</h3>
<ul>
  <li>Distributed consensus protocols, Raft, and data replication engines.</li>
  <li>Event streaming with Apache Kafka, NATS, and Redis Pub/Sub.</li>
  <li>Modern TypeScript / React visual design systems and developer tooling.</li>
</ul>`,
        maxWidth: "standard",
        align: "left",
        padding: "normal",
        surface: "glass",
      },
    },
    {
      type: "DocumentGrid",
      props: {
        id: "docgrid-1",
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
        ],
      },
    },
    {
      type: "Footer",
      props: {
        id: "footer-1",
        brandName: "Alex Chen",
        tagline: "Building high-performance distributed systems, cloud infrastructure, and modern developer platforms.",
        copyrightText: "All rights reserved.",
        builtWithText: "Crafted with Portfolio Studio",
        theme: "glass",
        layout: "columns",
        links: [
          { label: "About", url: "#about", isExternal: "no" },
          { label: "Projects", url: "#projects", isExternal: "no" },
          { label: "Documents", url: "#documents", isExternal: "no" },
          { label: "Contact", url: "mailto:alex@example.com", isExternal: "yes" },
        ],
        socials: [
          { platform: "github", label: "GitHub", url: "https://github.com" },
          { platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com" },
          { platform: "twitter", label: "Twitter / X", url: "https://x.com" },
          { platform: "email", label: "Email", url: "mailto:alex@example.com" },
        ],
      },
    },
  ],
  root: {},
};
