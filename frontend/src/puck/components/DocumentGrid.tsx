import type { ReactNode } from "react";
import { renderRichText } from "../utils/renderRichText";

export type DocumentType =
  | "pdf"
  | "docx"
  | "xlsx"
  | "pptx"
  | "code"
  | "zip"
  | "image"
  | "generic";

export interface DocumentItem {
  title: string;
  description?: any;
  documentUrl: string;
  fileType?: DocumentType;
  fileSize?: string;
  date?: string;
  badge?: string;
}

export interface DocumentGridProps {
  sectionTitle?: string;
  sectionSubtitle?: string;
  gap: "sm" | "md" | "lg";
  cardStyle: "glass" | "solid" | "elevated";
  items: DocumentItem[];
}

function getFileIcon(type: DocumentType = "generic"): { icon: ReactNode; label: string; colorClass: string } {
  switch (type) {
    case "pdf":
      return {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        ),
        label: "PDF",
        colorClass: "puck-doc-icon--pdf",
      };
    case "docx":
      return {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        ),
        label: "DOCX",
        colorClass: "puck-doc-icon--docx",
      };
    case "xlsx":
      return {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="8" y1="13" x2="16" y2="17" />
            <line x1="16" y1="13" x2="8" y2="17" />
          </svg>
        ),
        label: "XLSX",
        colorClass: "puck-doc-icon--xlsx",
      };
    case "pptx":
      return {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <rect x="8" y="12" width="8" height="6" rx="1" />
          </svg>
        ),
        label: "PPTX",
        colorClass: "puck-doc-icon--pptx",
      };
    case "code":
      return {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        ),
        label: "CODE",
        colorClass: "puck-doc-icon--code",
      };
    case "zip":
      return {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        ),
        label: "ZIP",
        colorClass: "puck-doc-icon--zip",
      };
    case "image":
      return {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        ),
        label: "IMG",
        colorClass: "puck-doc-icon--image",
      };
    default:
      return {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        ),
        label: "DOC",
        colorClass: "puck-doc-icon--generic",
      };
  }
}

export function DocumentGrid({
  sectionTitle = "Documents & Publications",
  sectionSubtitle = "Download and preview resumes, whitepapers, specifications, and architecture docs.",
  gap = "md",
  cardStyle = "glass",
  items = [],
}: DocumentGridProps) {
  if (items.length === 0) {
    return (
      <div className="puck-docgrid-empty">
        <div className="puck-docgrid-empty-icon">📄</div>
        <p className="puck-docgrid-empty-title">Document Grid is empty</p>
        <p className="puck-docgrid-empty-desc">
          Add document items in the Puck sidebar on the right.
        </p>
      </div>
    );
  }

  const renderCard = (doc: DocumentItem, idx: number): ReactNode => {
    const fileMeta = getFileIcon(doc.fileType);
    const hasLink = Boolean(doc.documentUrl);

    return (
      <div key={idx} className={`puck-doc-card puck-doc-card--${cardStyle}`}>
        {/* Card Header with File Type Icon & Metadata */}
        <div className="puck-doc-card-header">
          <div className={`puck-doc-icon-wrap ${fileMeta.colorClass}`}>
            {fileMeta.icon}
          </div>

          <div className="puck-doc-header-meta">
            <span className={`puck-doc-type-tag ${fileMeta.colorClass}`}>
              {fileMeta.label}
            </span>
            {doc.badge && (
              <span className="puck-doc-badge">{doc.badge}</span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="puck-doc-card-body">
          <h3 className="puck-doc-title">
            {doc.title || "Untitled Document"}
          </h3>

          {doc.description && (
            <div className="puck-doc-desc">
              {renderRichText(doc.description)}
            </div>
          )}
        </div>

        {/* Card Footer with Meta Details & Preview Link */}
        <div className="puck-doc-card-footer">
          <div className="puck-doc-info">
            {doc.fileSize && <span className="puck-doc-size">{doc.fileSize}</span>}
            {doc.date && <span className="puck-doc-date">{doc.date}</span>}
          </div>

          {hasLink ? (
            <a
              href={doc.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="puck-doc-preview-btn"
              title="Open and preview document in new tab"
            >
              <span>Preview</span>
              <span className="puck-doc-arrow">↗</span>
            </a>
          ) : (
            <span className="puck-doc-no-link">No link set</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="puck-docgrid-section">
      <div className="puck-docgrid-container">
        {/* Section Header */}
        {(sectionTitle || sectionSubtitle) && (
          <header className="puck-docgrid-header">
            {sectionTitle && <h2 className="puck-docgrid-title">{sectionTitle}</h2>}
            {sectionSubtitle && <p className="puck-docgrid-subtitle">{sectionSubtitle}</p>}
          </header>
        )}

        {/* Documents Grid with fluid responsive column calculation */}
        <div className={`puck-docgrid-layout puck-docgrid--gap-${gap}`}>
          {items.map((doc, idx) => renderCard(doc, idx))}
        </div>
      </div>
    </section>
  );
}
