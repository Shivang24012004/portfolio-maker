import { useEffect, useState, type FormEvent, type MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { layoutDataApi } from "../api/layout-data";
import { errorMessage } from "../api/http";
import type { LayoutData } from "../domain/layouts";
import { initialData } from "../puck/config";

export function DashboardPage() {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState<LayoutData[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function reload() {
    setLoading(true);
    setError(null);
    try {
      const data = await layoutDataApi.list(50, 0);
      setPortfolios(data || []);
    } catch (err) {
      setError(errorMessage(err, "Failed to load portfolios"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void reload();
  }, []);

  async function handleCreatePortfolio(e: FormEvent) {
    e.preventDefault();
    const name = newPortfolioName.trim();
    if (!name || creating) return;

    setCreating(true);
    setError(null);

    try {
      const newPortfolio = await layoutDataApi.create({
        name,
        content: initialData as unknown as Record<string, unknown>,
      });
      setNewPortfolioName("");
      setIsModalOpen(false);
      void navigate(`/editor/${newPortfolio.id}`);
    } catch (err) {
      setError(errorMessage(err, "Failed to create portfolio"));
      setCreating(false);
    }
  }

  async function handleDeletePortfolio(id: string, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!confirm("Are you sure you want to delete this portfolio?")) return;

    setDeletingId(id);
    try {
      await layoutDataApi.delete(id);
      await reload();
    } catch (err) {
      setError(errorMessage(err, "Failed to delete portfolio"));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <nav className="dashboard-navbar">
        <div className="dashboard-brand">
          <div className="brand-icon">✨</div>
          <div className="brand-text">
            <span className="brand-name">Portfolio Studio</span>
            <span className="brand-badge">Workspace</span>
          </div>
        </div>
        <div className="navbar-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="btn-icon">+</span> New Portfolio
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-info">
            <h1 className="header-title">Portfolios</h1>
            <p className="header-description">
              Manage, organize, and build your digital portfolios in one place.
            </p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-value">{portfolios.length}</span>
              <span className="stat-label">Total Portfolios</span>
            </div>
          </div>
        </header>

        {error && (
          <div className="alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <div className="alert-message">{error}</div>
            <button type="button" className="btn-retry" onClick={() => void reload()}>
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading your portfolios…</p>
          </div>
        ) : portfolios.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h2 className="empty-title">No portfolios found</h2>
            <p className="empty-description">
              Get started by creating your first portfolio project.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="btn-icon">+</span> Create Portfolio
            </button>
          </div>
        ) : (
          <div className="portfolio-grid">
            {portfolios.map((item) => (
              <div key={item.id} className="portfolio-card">
                <div className="card-top">
                  <div className="portfolio-type-pill">Portfolio</div>
                  <span className="portfolio-version">v{item.version}</span>
                </div>
                <Link to={`/editor/${item.id}`} className="portfolio-title-link">
                  <h3 className="portfolio-title">{item.name || "Untitled Portfolio"}</h3>
                </Link>
                <p className="portfolio-id">ID: {item.id}</p>
                <div className="card-footer">
                  <span className="status-indicator">
                    <span className="status-dot" /> Ready
                  </span>
                  <div className="card-actions">
                    <Link
                      to={`/preview/${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-preview-link"
                      title="Open Live Preview"
                    >
                      Preview ↗
                    </Link>
                    <Link to={`/editor/${item.id}`} className="btn-edit">
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="btn-delete"
                      onClick={(e) => void handleDeletePortfolio(item.id, e)}
                      disabled={deletingId === item.id}
                    >
                      {deletingId === item.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h3 className="modal-title">Create New Portfolio</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </header>
            <form onSubmit={handleCreatePortfolio}>
              <div className="modal-body">
                <label htmlFor="portfolio-name-input" className="form-label">
                  Portfolio Name
                </label>
                <input
                  id="portfolio-name-input"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Shivang's Software Engineering Portfolio"
                  value={newPortfolioName}
                  onChange={(e) => setNewPortfolioName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <footer className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={creating || !newPortfolioName.trim()}
                >
                  {creating ? "Creating…" : "Create"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
