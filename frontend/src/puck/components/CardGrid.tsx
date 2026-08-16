import type { ReactNode } from "react";
import { renderRichText } from "../utils/renderRichText";

export interface CardLink {
  label: string;
  url: string;
}

export interface CardItem {
  image?: string;
  imageAlt?: string;
  shortText?: string;
  longText?: any;
  badge?: string;
  links?: CardLink[];
}

export interface CardGridProps {
  sectionTitle?: string;
  sectionSubtitle?: string;
  gap: "sm" | "md" | "lg";
  cardStyle: "glass" | "solid" | "elevated";
  imageAspectRatio: "16:9" | "4:3" | "1:1" | "none";
  items: CardItem[];
}

export function CardGrid({
  sectionTitle = "Featured Projects",
  sectionSubtitle = "A selection of projects and experiments I've built recently.",
  gap = "md",
  cardStyle = "glass",
  imageAspectRatio = "16:9",
  items = [],
}: CardGridProps) {
  if (items.length === 0) {
    return (
      <div className="puck-cardgrid-empty">
        <div className="puck-cardgrid-empty-icon">🗂️</div>
        <p className="puck-cardgrid-empty-title">Card Grid is empty</p>
        <p className="puck-cardgrid-empty-desc">
          Add card items in the Puck sidebar on the right.
        </p>
      </div>
    );
  }

  const renderCard = (card: CardItem, idx: number): ReactNode => {
    const links = card.links || [];

    return (
      <div key={idx} className={`puck-card puck-card--${cardStyle}`}>
        {/* Card Media Banner */}
        {card.image && (
          <div className={`puck-card-media-wrap puck-card-media--${imageAspectRatio.replace(":", "-")}`}>
            <img
              src={card.image}
              alt={card.imageAlt || card.shortText || `Card ${idx + 1}`}
              className="puck-card-img"
              loading="lazy"
            />
            {card.badge && (
              <span className="puck-card-badge">{card.badge}</span>
            )}
          </div>
        )}

        {/* Card Body */}
        <div className="puck-card-body">
          {!card.image && card.badge && (
            <span className="puck-card-badge puck-card-badge--inline">{card.badge}</span>
          )}

          {card.shortText && (
            <h3 className="puck-card-title">{card.shortText}</h3>
          )}

          {/* Rich Text Description */}
          {card.longText && (
            <div className="puck-card-desc">
              {renderRichText(card.longText)}
            </div>
          )}

          {/* Array of Action Links */}
          {links.length > 0 && (
            <div className="puck-card-links-group">
              {links.map((link, linkIdx) => {
                const isExternal =
                  link.url &&
                  (link.url.startsWith("http://") || link.url.startsWith("https://"));
                const target = isExternal ? "_blank" : undefined;
                const rel = isExternal ? "noopener noreferrer" : undefined;

                return (
                  <a
                    key={linkIdx}
                    href={link.url || "#"}
                    target={target}
                    rel={rel}
                    className="puck-card-action-btn"
                  >
                    <span>{link.label || "Link"}</span>
                    {isExternal && <span className="puck-card-link-ext">↗</span>}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="puck-cardgrid-section">
      <div className="puck-cardgrid-container">
        {/* Section Header */}
        {(sectionTitle || sectionSubtitle) && (
          <header className="puck-cardgrid-header">
            {sectionTitle && <h2 className="puck-cardgrid-title">{sectionTitle}</h2>}
            {sectionSubtitle && <p className="puck-cardgrid-subtitle">{sectionSubtitle}</p>}
          </header>
        )}

        {/* Cards Grid with automatic responsive column calculation */}
        <div className={`puck-cardgrid-layout puck-cardgrid--gap-${gap}`}>
          {items.map((card, idx) => renderCard(card, idx))}
        </div>
      </div>
    </section>
  );
}
