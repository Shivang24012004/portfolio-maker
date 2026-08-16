import type { ReactNode } from "react";

export type SocialPlatform =
  | "github"
  | "linkedin"
  | "twitter"
  | "email"
  | "website"
  | "generic";

export interface SocialLink {
  platform: SocialPlatform;
  label?: string;
  url: string;
}

export interface FooterLink {
  label: string;
  url: string;
  isExternal?: "yes" | "no";
}

export interface FooterProps {
  brandName: string;
  tagline?: string;
  copyrightText?: string;
  builtWithText?: string;
  theme: "glass" | "solid" | "minimal";
  layout: "columns" | "compact";
  links: FooterLink[];
  socials: SocialLink[];
}

function getSocialIcon(platform: SocialPlatform): ReactNode {
  switch (platform) {
    case "github":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.65 1.65 0 0 0-1.66 1.66 1.66 1.66 0 0 0 1.66 1.66 1.66 1.66 0 0 0 1.66-1.66 1.65 1.65 0 0 0-1.66-1.66Z" />
        </svg>
      );
    case "twitter":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "email":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
    case "website":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    default:
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      );
  }
}

export function Footer({
  brandName = "Alex Chen",
  tagline = "Designing resilient distributed systems, modern web tools, and developer platforms.",
  copyrightText = "All rights reserved.",
  builtWithText = "Crafted with Portfolio Studio",
  theme = "glass",
  layout = "columns",
  links = [],
  socials = [],
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`puck-footer-section puck-footer--${theme}`}>
      <div className="puck-footer-container">
        {/* Main Content Area */}
        <div className={`puck-footer-main puck-footer-main--${layout}`}>
          {/* Brand & Bio Column */}
          <div className="puck-footer-brand-col">
            <div className="puck-footer-brand-header">
              <span className="puck-footer-avatar">
                {brandName.charAt(0) || "P"}
              </span>
              <span className="puck-footer-brand-name">{brandName}</span>
            </div>

            {tagline && <p className="puck-footer-tagline">{tagline}</p>}
          </div>

          {/* Navigation Links Column */}
          {links.length > 0 && (
            <div className="puck-footer-nav-col">
              <h4 className="puck-footer-col-title">Navigation</h4>
              <ul className="puck-footer-nav-list">
                {links.map((link, idx) => {
                  const isExternal =
                    link.isExternal === "yes" ||
                    (link.url && (link.url.startsWith("http://") || link.url.startsWith("https://")));
                  const target = isExternal ? "_blank" : undefined;
                  const rel = isExternal ? "noopener noreferrer" : undefined;

                  return (
                    <li key={idx} className="puck-footer-nav-item">
                      <a
                        href={link.url || "#"}
                        target={target}
                        rel={rel}
                        className="puck-footer-nav-link"
                      >
                        <span>{link.label}</span>
                        {isExternal && <span className="puck-footer-ext">↗</span>}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Social Links Column */}
          {socials.length > 0 && (
            <div className="puck-footer-social-col">
              <h4 className="puck-footer-col-title">Connect</h4>
              <div className="puck-footer-social-list">
                {socials.map((soc, idx) => {
                  const target = soc.url.startsWith("mailto:") ? undefined : "_blank";
                  const rel = soc.url.startsWith("mailto:") ? undefined : "noopener noreferrer";

                  return (
                    <a
                      key={idx}
                      href={soc.url || "#"}
                      target={target}
                      rel={rel}
                      className="puck-footer-social-btn"
                      title={soc.label || soc.platform}
                      aria-label={soc.label || soc.platform}
                    >
                      <span className="puck-footer-social-icon">
                        {getFileIconElement(soc.platform)}
                      </span>
                      {soc.label && <span className="puck-footer-social-label">{soc.label}</span>}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar / Copyright & Attribution */}
        <div className="puck-footer-bottom">
          <div className="puck-footer-copyright">
            <span>© {currentYear} {brandName}. {copyrightText}</span>
            {builtWithText && (
              <>
                <span className="puck-footer-dot">•</span>
                <span className="puck-footer-builtwith">{builtWithText}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

function getFileIconElement(platform: SocialPlatform): ReactNode {
  return getSocialIcon(platform);
}
