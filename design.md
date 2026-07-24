You are a senior product designer and UI/UX designer. Design the complete UI for “Portfolio Maker” — a visual builder that lets people create, customize, and publish personal portfolio websites without writing code.

═══════════════════════════════════════
PRODUCT OVERVIEW
═══════════════════════════════════════

Product name: Portfolio Maker
Tagline direction: “Build a portfolio that looks like you — not a template.”
Category: No-code / low-code visual website builder focused on personal portfolios (developers, designers, freelancers, creatives).

Core idea:
Users assemble a portfolio as a hierarchical layout tree (page → sections → rows/columns/grids → content blocks). Structure, style, and content are separate concerns. The product is a canvas-first editor with a live preview of the portfolio site.

Target users:
- Developers and designers who want a polished personal site quickly
- Freelancers and creatives who need a portfolio but not a full CMS
- Non-technical professionals who want a modern site without Figma/code

Primary jobs-to-be-done:
1. Start from a blank page or a starter layout and build a portfolio structure visually
2. Edit content (text, images, links, cards, etc.) in place or via a properties panel
3. Style sections and components without CSS knowledge
4. Preview the live site (desktop + mobile)
5. Save, version, and manage multiple layouts/pages
6. Eventually publish/share a public portfolio URL (design for this even if publish isn’t fully built yet)

═══════════════════════════════════════
DATA MODEL THE UI MUST REFLECT
═══════════════════════════════════════

The backend models portfolios as recursive Layout nodes:

Layout {
  id: UUID
  type: LayoutType
  name: string
  version: number
  style: object (free-form style map)
  children: Layout[]
  parent_id: UUID | null
}

Supported LayoutTypes (these are the building blocks in the component palette):

STRUCTURE / LAYOUT
- Page          — root of a portfolio page
- Container     — generic wrapper
- Navbar        — top navigation
- Footer        — site footer
- Row           — horizontal flex/layout
- Column        — vertical flex/layout
- Grid          — CSS-grid style layout
- Divider       — visual separator
- Spacer        — empty spacing unit

CONTENT / MEDIA
- SectionTitle  — content slots: text
- SmallText     — content slots: text
- LongText      — content slots: text
- Image         — content slots: src, alt
- Icon          — content slots: name
- Button        — content slots: label, href
- Link          — content slots: label, href
- Card          — content slots: title, description, image
- Carousel      — content slots: items

Content is conceptually bound via content slots per type (structure vs content separation). LayoutData holds { layout_id, version, content } where content maps node ids → slot values.

API surface the UI will talk to (design around these flows):
- Create / list / get / update / delete layouts
- List returns root layouts only (parent_id == null)
- Nested children live inside the root layout tree

═══════════════════════════════════════
SCREENS & FLOWS TO DESIGN
═══════════════════════════════════════

Design full UI for these screens. For each, specify layout, hierarchy, key components, empty/loading/error states, and desktop + mobile behavior.

1) MARKETING / LANDING (public)
- Hero with brand “Portfolio Maker” as the dominant brand signal
- One headline, one short supporting line, one primary CTA (“Start building”)
- Secondary CTA optional (“See examples”)
- Do NOT make this look like a dashboard
- Avoid generic SaaS purple gradients, cream+serif terracotta, and newspaper layouts
- Show a real visual of the product (editor canvas / published portfolio), full-bleed, not a floating card collage

2) AUTH (lightweight)
- Sign up / Sign in (email magic link or email+password — pick one and stay consistent)
- Minimal, calm, on-brand

3) DASHBOARD — “My Portfolios”
- List of root layouts/pages (name, updated time, thumbnail/preview)
- Create new portfolio / page
- Duplicate, rename, delete
- Empty state that encourages first create
- Pagination/offset-friendly (API uses limit/offset)

4) EDITOR — the core product (highest priority)
A three-zone visual builder:

A. LEFT RAIL — Component Palette + Layers
- Palette grouped: Structure | Content | Media | Actions
- Search/filter components
- Drag components onto canvas or into the layers tree
- Layers / outline tree reflecting the recursive Layout.children hierarchy
- Show type icon + name; selected node highlighted
- Reorder (drag), nest into Container/Row/Column/Grid, delete

B. CENTER — Canvas / Live Preview
- WYSIWYG rendering of the layout tree
- Click-to-select nodes; hover outlines
- Drop targets for Row/Column/Grid/Container
- Device switcher: Desktop / Tablet / Mobile preview widths
- Optional “Edit vs Preview” toggle
- Breadcrumb of selection path (Page > Section > Card…)
- Zoom / fit-to-width controls

C. RIGHT RAIL — Inspector
Tabs or sections:
- Content: forms driven by content slots for the selected LayoutType
  e.g. Image → src + alt; Button → label + href; Card → title, description, image
- Style: visual controls that write into layout.style
  (spacing, typography, colors, alignment, width, background, border, radius — keep practical, not a full CSS editor)
- Settings: name, type (read-only or limited), version indicator

Top editor chrome:
- Portfolio/page name (inline editable)
- Save status (Saved / Saving / Unsaved)
- Undo / Redo
- Preview (opens published-style view)
- Publish / Share (even if stubbed)
- Back to dashboard

Editor interactions to design carefully:
- Selecting nested nodes without fighting the parent
- Empty containers with clear “Drop component here” affordances
- Keyboard: Delete to remove, Esc to deselect, Cmd/Ctrl+S save
- Confirm before deleting nodes with children

5) PREVIEW / PUBLISHED VIEW
- Clean public portfolio render with no editor chrome
- Navbar/Footer behave as real site chrome
- Mobile responsive
- Optional share sheet (copy link)

6) SETTINGS (account + portfolio)
- Account basics
- Portfolio metadata (title, slug, SEO title/description, favicon)
- Danger zone: delete portfolio

═══════════════════════════════════════
KEY UX PRINCIPLES
═══════════════════════════════════════

- Canvas-first: the portfolio preview is the hero of the editor, not forms
- Structure before polish: make nesting Row/Column/Grid feel obvious
- Content slots drive the inspector — never show fields that don’t apply to the selected type
- Progressive disclosure: beginners see friendly controls; power users can dig into style
- Fast path to a good first portfolio: offer 2–3 starter layouts (e.g. Developer, Designer, Minimal) that pre-seed a Page with Navbar, hero SectionTitle, projects Grid of Cards, Footer
- One job per surface: don’t clutter the first viewport of marketing or the editor chrome

═══════════════════════════════════════
VISUAL DIRECTION
═══════════════════════════════════════

Overall feel: modern creative tool — confident, calm, precise. Closer to a design tool (Figma-lite) than a corporate admin panel.

Define a clear design system:
- CSS variables for: background, surface, border, text-primary, text-muted, accent, accent-hover, danger, success, canvas-bg, selection-outline
- Typography: expressive display font for marketing brand; clean readable UI font for editor chrome (avoid Inter/Roboto/Arial/system defaults as the “designed” choice — pick distinctive but professional pairings)
- Backgrounds: subtle depth (soft gradients, grain, or structured canvas grid) — not flat single-color everywhere; editor chrome can be quieter than marketing
- Accent: pick ONE strong accent (e.g. deep teal, ink blue, or warm chartreuse) — avoid purple-on-white / indigo gradient clichés
- Selection on canvas: crisp outline + subtle label chip for component type (part of editor UX, not marketing stickers)
- Motion: 2–3 intentional motions only (e.g. panel slide-in, selection outline fade, palette drag ghost). No noisy bounce/glow spam
- Cards: use cards only where they are interactive containers (dashboard portfolio tiles, palette items if needed). No card soup in marketing hero. Canvas itself is not a card.

Avoid:
- Generic AI SaaS look (purple gradients, glow orbs, pill badge clusters, multi-layer shadows)
- Warm cream + terracotta + overdone serif editorial look
- Dense broadsheet / newspaper layout
- Dashboard-looking landing page
- Emoji as UI decoration

═══════════════════════════════════════
COMPONENT INVENTORY (DESIGN SYSTEM)
═══════════════════════════════════════

Design tokens + reusable components:
- App shell (marketing vs app)
- Buttons (primary, secondary, ghost, danger)
- Inputs, textareas, selects, toggles, segmented controls
- Tabs, tooltips, modals, toasts, dropdown menus
- Tree view (layers)
- Draggable palette item
- Canvas selection chrome
- Empty states, skeletons, error banners
- Device preview frame
- Thumbnail / portfolio card for dashboard

═══════════════════════════════════════
RESPONSIVE REQUIREMENTS
═══════════════════════════════════════

- Marketing: excellent mobile + desktop
- Dashboard: stacked list on mobile
- Editor: desktop-first (primary experience). On tablet/mobile, use a simplified mode:
  - Collapsible palette / inspector drawers
  - Canvas takes most of the screen
  - Clearly communicate that full editing is best on desktop if needed

═══════════════════════════════════════
STATES & EDGE CASES
═══════════════════════════════════════

Design for:
- Empty portfolio list
- Empty page (only Page root)
- Invalid/missing image src
- Long text overflow in SmallText vs LongText
- Deep nesting (5+ levels) in layers tree
- Save conflict / failed save toast
- Loading layouts from API
- 404 layout
- Delete confirmation for page with many children

═══════════════════════════════════════
DELIVERABLES I WANT FROM YOU
═══════════════════════════════════════

1. Product UI concept summary (1 short paragraph + visual direction)
2. Information architecture / sitemap
3. User flows: Create portfolio → Edit → Preview → Publish
4. Wireframes (low-fi) for: Landing, Dashboard, Editor, Preview
5. High-fidelity UI mockups for the same screens (desktop), plus mobile for Landing + Dashboard + simplified Editor
6. Design system: colors, typography, spacing scale, component specs
7. Detailed Editor specification: palette groups, inspector fields per LayoutType (mapped to content slots), canvas interactions
8. Starter layout proposals (2–3) described as Layout trees using the LayoutTypes above
9. Microcopy suggestions for key CTAs and empty states
10. Optional: Figma-ready frame structure / naming convention

═══════════════════════════════════════
CONSTRAINTS
═══════════════════════════════════════

- The UI must map cleanly to the Layout tree + LayoutType + content slots model
- Do not invent unrelated CMS features (blog engine, ecommerce, multi-tenant admin)
- Auth can be minimal; editor and dashboard are the focus
- Prefer clarity and craft over feature sprawl
- Output should be concrete enough that an engineer can implement the frontend against a FastAPI + MongoDB backend that already has layout CRUD

Start with the Editor and Dashboard as priority #1, then Landing, then Auth/Settings.