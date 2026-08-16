import { isValidElement, type ReactNode } from "react";

export interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface TiptapNode {
  type?: string;
  text?: string;
  marks?: TiptapMark[];
  content?: TiptapNode[];
  attrs?: Record<string, unknown>;
}

function renderTiptapNode(node: TiptapNode, key: number | string): ReactNode {
  if (!node) return null;

  // Text node with marks (bold, italic, code, strike, underline, link)
  if (node.type === "text" && typeof node.text === "string") {
    let element: ReactNode = node.text;

    if (Array.isArray(node.marks)) {
      for (const mark of node.marks) {
        if (mark.type === "bold") {
          element = <strong key={mark.type}>{element}</strong>;
        } else if (mark.type === "italic") {
          element = <em key={mark.type}>{element}</em>;
        } else if (mark.type === "code") {
          element = <code key={mark.type}>{element}</code>;
        } else if (mark.type === "strike") {
          element = <s key={mark.type}>{element}</s>;
        } else if (mark.type === "underline") {
          element = <u key={mark.type}>{element}</u>;
        } else if (mark.type === "link" && mark.attrs?.href) {
          const href = String(mark.attrs.href);
          const isExternal = href.startsWith("http://") || href.startsWith("https://");
          element = (
            <a
              key={mark.type}
              href={href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
            >
              {element}
            </a>
          );
        }
      }
    }
    return <span key={key}>{element}</span>;
  }

  const children = Array.isArray(node.content)
    ? node.content.map((child, idx) => renderTiptapNode(child, idx))
    : null;

  switch (node.type) {
    case "paragraph":
      return <p key={key}>{children && children.length > 0 ? children : "\u00A0"}</p>;
    case "heading": {
      const level = Number(node.attrs?.level) || 3;
      if (level === 1) return <h1 key={key}>{children}</h1>;
      if (level === 2) return <h2 key={key}>{children}</h2>;
      if (level === 3) return <h3 key={key}>{children}</h3>;
      if (level === 4) return <h4 key={key}>{children}</h4>;
      if (level === 5) return <h5 key={key}>{children}</h5>;
      return <h6 key={key}>{children}</h6>;
    }
    case "bulletList":
      return <ul key={key}>{children}</ul>;
    case "orderedList":
      return <ol key={key}>{children}</ol>;
    case "listItem":
      return <li key={key}>{children}</li>;
    case "blockquote":
      return <blockquote key={key}>{children}</blockquote>;
    case "codeBlock":
      return (
        <pre key={key}>
          <code>{children}</code>
        </pre>
      );
    case "hardBreak":
      return <br key={key} />;
    default:
      return <div key={key}>{children}</div>;
  }
}

export function renderRichText(content: unknown): ReactNode {
  if (!content) return null;

  // 1. If it's already a valid React Element (e.g. Puck InlineEditorWrapper or RichTextRender)
  if (isValidElement(content)) {
    return content;
  }

  // 2. If it's a string
  if (typeof content === "string") {
    if (/<[a-z][\s\S]*>/i.test(content)) {
      return (
        <div
          className="puck-rich-text"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
    return <p>{content}</p>;
  }

  // 3. If Tiptap AST object: { type: "doc", content: [...] }
  if (typeof content === "object" && content !== null) {
    const doc = content as TiptapNode;
    if (doc.type === "doc" && Array.isArray(doc.content)) {
      return (
        <div className="puck-rich-text">
          {doc.content.map((node, i) => renderTiptapNode(node, i))}
        </div>
      );
    }
    if (Array.isArray(content)) {
      return <>{content}</>;
    }
  }

  return null;
}
