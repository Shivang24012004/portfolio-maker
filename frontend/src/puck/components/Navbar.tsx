import { useState, type ReactNode } from "react";

export type NavItemType = "internal" | "external" | "text";

export interface NavItem {
  label: string;
  type: NavItemType;
  url?: string;
}

export interface NavbarProps {
  brandName: string;
  brandBadge?: string;
  brandLogoUrl?: string;
  items: NavItem[];
  sticky: "sticky" | "static";
  theme: "glass" | "solid" | "transparent";
}

export function Navbar({
  brandName = "Alex Chen",
  brandBadge = "Available for hire",
  brandLogoUrl = "",
  items = [],
  sticky = "sticky",
  theme = "glass",
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const themeClass =
    theme === "solid"
      ? "puck-nav--solid"
      : theme === "transparent"
      ? "puck-nav--transparent"
      : "puck-nav--glass";

  const positionClass = sticky === "sticky" ? "puck-nav--sticky" : "puck-nav--static";

  const renderNavItem = (item: NavItem, isMobile = false): ReactNode => {
    const key = `${item.label}-${item.url || "static"}`;

    if (item.type === "text") {
      return (
        <span key={key} className={`puck-nav-text-item ${isMobile ? "puck-nav-text-item--mobile" : ""}`}>
          <span className="puck-nav-status-dot" />
          <span>{item.label}</span>
        </span>
      );
    }

    const isExternal = item.type === "external";
    // External links always open in a new tab
    const target = isExternal ? "_blank" : undefined;
    const rel = isExternal ? "noopener noreferrer" : undefined;

    return (
      <a
        key={key}
        href={item.url || "#"}
        target={target}
        rel={rel}
        className={`puck-nav-link ${isMobile ? "puck-nav-link--mobile" : ""}`}
        onClick={() => {
          if (isMobile) setMobileMenuOpen(false);
        }}
      >
        <span>{item.label}</span>
        {isExternal && <span className="puck-nav-external-icon">↗</span>}
      </a>
    );
  };

  return (
    <header className={`puck-nav-wrapper ${positionClass} ${themeClass}`}>
      <div className="puck-nav-container">
        {/* Brand / Logo */}
        <div className="puck-nav-brand">
          <a href="#" className="puck-nav-brand-link">
            {brandLogoUrl ? (
              <img src={brandLogoUrl} alt={brandName} className="puck-nav-logo-img" />
            ) : (
              <span className="puck-nav-brand-avatar">
                {brandName.charAt(0) || "P"}
              </span>
            )}
            <span className="puck-nav-brand-name">{brandName}</span>
          </a>
          {brandBadge && (
            <span className="puck-nav-brand-badge">
              <span className="puck-nav-pulse-dot" />
              {brandBadge}
            </span>
          )}
        </div>

        {/* Desktop Navigation Items */}
        <nav className="puck-nav-desktop-items" aria-label="Main Navigation">
          {items.map((item) => renderNavItem(item, false))}
        </nav>

        {/* Mobile Hamburger Toggle Button */}
        <div className="puck-nav-mobile-toggle-wrap">
          <button
            type="button"
            className={`puck-nav-hamburger ${mobileMenuOpen ? "puck-nav-hamburger--active" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            <span className="puck-nav-hamburger-line" />
            <span className="puck-nav-hamburger-line" />
            <span className="puck-nav-hamburger-line" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="puck-nav-mobile-menu">
          <div className="puck-nav-mobile-content">
            <div className="puck-nav-mobile-links">
              {items.map((item) => renderNavItem(item, true))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
