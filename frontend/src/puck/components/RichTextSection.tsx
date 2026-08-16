import { renderRichText } from "../utils/renderRichText";

export interface RichTextSectionProps {
  content: any;
  maxWidth: "prose" | "standard" | "wide" | "full";
  align: "left" | "center" | "right";
  padding: "compact" | "normal" | "spacious";
  surface: "transparent" | "glass" | "card";
}

export function RichTextSection({
  content = "<p>Write your detailed bio, publication, announcement, or technical case study here using rich text formatting.</p>",
  maxWidth = "standard",
  align = "left",
  padding = "normal",
  surface = "transparent",
}: RichTextSectionProps) {
  const renderedContent = renderRichText(content);

  const containerClasses = [
    "puck-richtext-section",
    `puck-richtext--align-${align}`,
    `puck-richtext--padding-${padding}`,
    `puck-richtext--surface-${surface}`,
  ].join(" ");

  const innerClasses = [
    "puck-richtext-container",
    `puck-richtext--max-${maxWidth}`,
    "puck-prose",
  ].join(" ");

  return (
    <section className={containerClasses}>
      <div className={innerClasses}>
        {renderedContent || (
          <p className="puck-richtext-placeholder">
            Click here to edit rich text content...
          </p>
        )}
      </div>
    </section>
  );
}
