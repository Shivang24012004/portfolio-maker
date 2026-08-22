import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Puck } from "@puckeditor/core";
import { config, initialData, type PuckData } from "../puck/config";
import { layoutDataApi } from "../api/layout-data";
import { errorMessage } from "../api/http";
import type { LayoutData } from "../domain/layouts";

export function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const [portfolio, setPortfolio] = useState<LayoutData | null>(null);
  const [data, setData] = useState<PuckData>(initialData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function loadPortfolio() {
      setLoading(true);
      setError(null);
      try {
        const item = await layoutDataApi.getById(id!);
        setPortfolio(item);

        if (item?.content) {
          const parsed = item.content as unknown as PuckData;
          if (Array.isArray(parsed.content)) {
            setData(parsed);
          }
        }
      } catch (err) {
        setError(errorMessage(err, "Failed to load portfolio"));
      } finally {
        setLoading(false);
      }
    }
    void loadPortfolio();
  }, [id]);

  async function handlePublish(publishedData: PuckData) {
    if (!id || saving) return;
    setSaving(true);
    setSaveMessage(null);
    setError(null);

    try {
      const updated = await layoutDataApi.update(id, {
        name: portfolio?.name || "Untitled Portfolio",
        content: publishedData as unknown as Record<string, unknown>,
      });
      setPortfolio(updated);
      setSaveMessage("Saved successfully!");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setError(errorMessage(err, "Failed to save portfolio changes"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="editor-loading-screen">
        <div className="spinner" />
        <p>Loading editor…</p>
      </div>
    );
  }

  if (error && !portfolio) {
    return (
      <div className="editor-error-screen">
        <h2>Unable to load portfolio</h2>
        <p className="muted">{error}</p>
        <Link to="/" className="btn-secondary">
          ← Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="editor-container">
      <header className="editor-header">
        <div className="editor-header-left">
          <Link to="/" className="editor-back-link">
            ← Dashboard
          </Link>
          <div className="editor-divider" />
          <h2 className="editor-portfolio-title">{portfolio?.name || "Portfolio Editor"}</h2>
          <span className="editor-badge">v{portfolio?.version || 1}</span>
        </div>
        <div className="editor-header-right">
          {saveMessage && <span className="editor-save-status success">{saveMessage}</span>}
          {saving && <span className="editor-save-status">Saving…</span>}
          <Link
            to={`/preview/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="editor-btn-preview"
            title="Open Live Preview in new tab"
          >
            <span>Preview</span>
            <span className="editor-arrow">↗</span>
          </Link>
        </div>
      </header>

      <main className="editor-puck-wrapper">
        <Puck
          config={config}
          data={data}
          onPublish={handlePublish}
          onChange={(newData) => setData(newData)}
          permissions={{
            drag: true,
            edit: true,
            delete: true,
            duplicate: true,
            insert: true,
          }}
        />
      </main>
    </div>
  );
}
