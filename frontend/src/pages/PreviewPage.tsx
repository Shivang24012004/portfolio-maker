import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Render } from "@puckeditor/core";
import { config, initialData, type PuckData } from "../puck/config";
import { layoutDataApi } from "../api/layout-data";
import { errorMessage } from "../api/http";
import type { LayoutData } from "../domain/layouts";

export function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const [portfolio, setPortfolio] = useState<LayoutData | null>(null);
  const [data, setData] = useState<PuckData>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const item = await layoutDataApi.getById(id!);
        setPortfolio(item);

        if (item?.name) {
          document.title = `${item.name} | Portfolio`;
        }

        if (item?.content) {
          const parsed = item.content as unknown as PuckData;
          if (Array.isArray(parsed.content)) {
            setData(parsed);
          }
        }
      } catch (err) {
        setError(errorMessage(err, "Portfolio not found"));
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [id]);

  if (loading) {
    return (
      <div className="preview-loading-screen">
        <div className="spinner" />
        <p>Loading portfolio preview…</p>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="preview-error-screen">
        <h2>Portfolio not found</h2>
        <p className="muted">{error || "The requested portfolio does not exist."}</p>
        <Link to="/" className="btn-secondary">
          ← Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="portfolio-preview-page">
      {/* Floating Action Pill Bar */}
      {/* <div className="preview-floating-bar" title="Preview Controls">
        <span className="preview-pill-badge">Live Preview</span>
        <div className="preview-pill-divider" />
        <Link to={`/editor/${id}`} className="preview-edit-btn">
          <span>Edit</span>
          <span className="preview-arrow">↗</span>
        </Link>
      </div> */}

      <main className="portfolio-rendered-content">
        <Render config={config} data={data} />
      </main>
    </div>
  );
}
