import { CONTENT_SLOTS, Layout, LayoutType, ContentMap } from '../models/layouts.models';

export function findNode(root: Layout, id: string): Layout | null {
  if (root.id === id) {
    return root;
  }

  for (const child of root.children) {
    const result = findNode(child, id);
    if (result) {
      return result;
    }
  }

  return null;
}

export function findParent(root: Layout, id: string): Layout | null {
  for (const child of root.children) {
    if (child.id === id) {
      return root;
    }
    const result = findParent(child, id);
    if (result) {
      return result;
    }
  }

  return null;
}

export function removeNode(root: Layout, id: string): Layout | null {
  const parent = findParent(root, id);
  if (!parent) return null;
  const idx = parent.children.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const [removed] = parent.children.splice(idx, 1);
  return removed;
}

export function createNode(type: LayoutType, parentId: string): Layout {
  return {
    id: crypto.randomUUID(),
    type,
    name: type,
    version: 1,
    style: { ...defaultStyle(type) },
    children: [],
    parent_id: parentId,
  };
}

export function defaultStyle(type: LayoutType): Record<string, string> {
  return { ...DEFAULT_STYLES[type] };
}

export const DEFAULT_STYLES: Record<LayoutType, Record<string, string>> = {
  Page: {
    'box-sizing': 'border-box',
    display: 'flex',
    'flex-direction': 'column',
    width: '100%',
    'min-height': '100vh',
    margin: '0',
    background: '#0b1220',
    color: '#e8eef7',
    'font-family': 'IBM Plex Sans, system-ui, sans-serif',
    'line-height': '1.5',
  },

  Container: {
    'box-sizing': 'border-box',
    width: '100%',
    'max-width': 'min(960px, 100%)',
    margin: '0 auto',
    padding: 'clamp(1.25rem, 4vw, 3rem) clamp(1rem, 4vw, 2rem)',
  },

  Navbar: {
    'box-sizing': 'border-box',
    display: 'flex',
    'flex-wrap': 'wrap',
    'justify-content': 'space-between',
    'align-items': 'center',
    gap: '0.75rem 1.25rem',
    width: '100%',
    padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 4vw, 2rem)',
    'border-bottom': '1px solid #1e293b',
  },

  Footer: {
    'box-sizing': 'border-box',
    display: 'flex',
    'flex-wrap': 'wrap',
    'justify-content': 'space-between',
    'align-items': 'center',
    gap: '0.75rem 1.25rem',
    width: '100%',
    padding: 'clamp(1rem, 3vw, 2rem) clamp(1rem, 4vw, 2rem)',
    'border-top': '1px solid #1e293b',
    'margin-top': 'clamp(1.5rem, 4vw, 3rem)',
  },

  Row: {
    'box-sizing': 'border-box',
    display: 'flex',
    'flex-wrap': 'wrap',
    'align-items': 'center',
    gap: 'clamp(0.5rem, 2vw, 1rem)',
    width: '100%',
  },

  Column: {
    'box-sizing': 'border-box',
    display: 'flex',
    'flex-direction': 'column',
    gap: 'clamp(0.5rem, 2vw, 0.75rem)',
    width: '100%',
    'min-width': '0',
  },

  Grid: {
    'box-sizing': 'border-box',
    display: 'grid',
    '--grid-cols': '2',
    '--grid-rows': '5',
    'grid-template-columns': 'repeat(2, minmax(0, 1fr))',
    'grid-template-rows': 'repeat(5, minmax(4.5rem, auto))',
    'align-content': 'start',
    'justify-items': 'stretch',
    'align-items': 'stretch',
    gap: '0.75rem',
    width: '100%',
    'max-width': '100%',
    'min-width': '0',
    padding: '1rem',
    margin: '0 0 1rem 0',
    position: 'relative',
    overflow: 'hidden',
    'border-bottom': '1px solid #1e293b',
  },

  Divider: {
    'box-sizing': 'border-box',
    width: '100%',
    height: '0',
    margin: 'clamp(0.75rem, 2vw, 1.25rem) 0',
    border: 'none',
    'border-top': '1px solid #334155',
  },

  Spacer: {
    'box-sizing': 'border-box',
    width: '100%',
    height: 'clamp(1rem, 3vw, 2rem)',
    'flex-shrink': '0',
  },

  Card: {
    'box-sizing': 'border-box',
    width: '100%',
    'min-width': '0',
    'max-width': '100%',
    height: '100%',
    background: '#111827',
    border: '1px solid #1f2937',
    'border-radius': '0.5rem',
    padding: 'clamp(0.85rem, 2vw, 1.1rem)',
    overflow: 'auto',
  },

  SectionTitle: {
    'box-sizing': 'border-box',
    margin: '0',
    padding: '0',
    'font-size': 'clamp(1.35rem, 3.5vw, 2.25rem)',
    'font-weight': '700',
    'line-height': '1.2',
    'min-width': '0',
    'max-width': '100%',
    'overflow-wrap': 'anywhere',
    'word-break': 'break-word',
  },

  SmallText: {
    'box-sizing': 'border-box',
    margin: '0',
    padding: '0',
    'font-size': 'clamp(0.875rem, 2vw, 1rem)',
    'line-height': '1.5',
    color: '#cbd5e1',
    'min-width': '0',
    'max-width': '100%',
    'overflow-wrap': 'anywhere',
    'word-break': 'break-word',
  },

  LongText: {
    'box-sizing': 'border-box',
    margin: '0',
    padding: '0',
    'font-size': 'clamp(0.95rem, 2.2vw, 1.05rem)',
    'line-height': '1.65',
    color: '#94a3b8',
    'min-width': '0',
    'max-width': '100%',
    'overflow-wrap': 'anywhere',
    'word-break': 'break-word',
  },

  Carousel: {
    'box-sizing': 'border-box',
    display: 'flex',
    'flex-direction': 'column',
    width: '100%',
    height: '100%',
    'min-width': '0',
    'max-width': '100%',
    'min-height': '8rem',
    padding: '0',
    overflow: 'hidden',
  },

  Button: {
    'box-sizing': 'border-box',
    display: 'inline-flex',
    'align-items': 'center',
    'justify-content': 'center',
    gap: '0.35rem',
    background: '#14b8a6',
    color: '#042f2e',
    padding: 'clamp(0.55rem, 1.5vw, 0.7rem) clamp(0.9rem, 2.5vw, 1.15rem)',
    border: 'none',
    'border-radius': '0.4rem',
    'font-size': 'clamp(0.875rem, 2vw, 1rem)',
    'font-weight': '600',
    'text-decoration': 'none',
    'text-align': 'center',
    'white-space': 'normal',
    'overflow-wrap': 'break-word',
    cursor: 'pointer',
    width: '100%',
    'min-width': '0',
  },

  Link: {
    'box-sizing': 'border-box',
    display: 'inline-block',
    color: '#94a3b8',
    'font-size': 'clamp(0.875rem, 2vw, 1rem)',
    'text-decoration': 'none',
    'line-height': '1.4',
  },

  Image: {
    'box-sizing': 'border-box',
    display: 'block',
    width: '100%',
    'max-width': '100%',
    height: 'auto',
    'border-radius': '0.4rem',
    'object-fit': 'cover',
  },

  Icon: {
    'box-sizing': 'border-box',
    display: 'inline-flex',
    'align-items': 'center',
    'justify-content': 'center',
    'font-size': 'clamp(1.1rem, 2.5vw, 1.5rem)',
    'line-height': '1',
    color: '#e8eef7',
  },
};

export function initContentSlots(content: ContentMap, node: Layout): void {
  const slots = CONTENT_SLOTS[node.type];
  if (!slots.length) return;

  if (node.type === 'Carousel') {
    content[node.id] = {
      items: [
        {
          title: 'Slide 1',
          description: 'First slide',
          image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
        },
        {
          title: 'Slide 2',
          description: 'Second slide',
          image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
        },
      ],
    };
    return;
  }

  content[node.id] = Object.fromEntries(
    slots.map((s) => [s, s === 'items' ? [] : ''])
  );
}

export function canHaveChildren(type: LayoutType): boolean {
  return ['Page', 'Navbar', 'Footer', 'Grid', 'Container', 'Row', 'Column'].includes(type);
}

/** Types allowed as direct children of Page in the hybrid model. */
export function canDropOnPage(type: LayoutType): boolean {
  return type === 'Navbar' || type === 'Footer' || type === 'Grid';
}

/** Types allowed as children of a Grid cell host. */
export function canDropOnGrid(type: LayoutType): boolean {
  return ![
    'Page',
    'Navbar',
    'Footer',
    'Grid',
    'Container',
    'Row',
    'Column',
  ].includes(type);
}

/** Types allowed inside Navbar / Footer (brand, links, etc.). */
export function canDropOnChrome(type: LayoutType): boolean {
  return ['SmallText', 'Link', 'Button', 'Icon', 'Row', 'Spacer', 'Divider'].includes(type);
}

export interface GridConfig {
  cols: number;
  rows: number;
}

export interface GridPlacement {
  colStart: number;
  rowStart: number;
  colSpan: number;
  rowSpan: number;
}

const GRID_SIZE_MIN = 1;
const GRID_SIZE_MAX = 24;

export function clampGridSize(n: number): number {
  if (!Number.isFinite(n)) return 3;
  return Math.min(GRID_SIZE_MAX, Math.max(GRID_SIZE_MIN, Math.round(n)));
}

export function getGridConfig(node: Layout): GridConfig {
  const cols = parseInt(node.style['--grid-cols'] ?? '', 10);
  const rows = parseInt(node.style['--grid-rows'] ?? '', 10);
  return {
    cols: clampGridSize(Number.isFinite(cols) ? cols : 3),
    rows: clampGridSize(Number.isFinite(rows) ? rows : 3),
  };
}

export function setGridConfig(node: Layout, cols: number, rows: number): void {
  const c = clampGridSize(cols);
  const r = clampGridSize(rows);
  node.style['display'] = 'grid';
  node.style['--grid-cols'] = String(c);
  node.style['--grid-rows'] = String(r);
  node.style['grid-template-columns'] = `repeat(${c}, minmax(0, 1fr))`;
  node.style['grid-template-rows'] = `repeat(${r}, minmax(4.5rem, auto))`;
  node.style['align-content'] = node.style['align-content'] || 'start';
  node.style['justify-items'] = node.style['justify-items'] || 'stretch';
  node.style['align-items'] = node.style['align-items'] || 'stretch';
  node.style['position'] = node.style['position'] || 'relative';
  node.style['width'] = node.style['width'] || '100%';
  node.style['max-width'] = '100%';
  node.style['min-width'] = '0';
  node.style['overflow'] = node.style['overflow'] || 'hidden';
}

export function prepareGridChildStyles(style: Record<string, string>): void {
  delete style['width'];
  delete style['max-width'];
  delete style['min-height'];
  style['min-width'] = '0';
  style['max-width'] = '100%';
  style['width'] = '100%';
  style['height'] = '100%';
  style['max-height'] = '100%';
  style['box-sizing'] = 'border-box';
  style['overflow'] = style['overflow'] || 'auto';
  style['overflow-wrap'] = style['overflow-wrap'] || 'anywhere';
  style['word-break'] = style['word-break'] || 'break-word';
}

export function listGridCells(grid: Layout): Array<{
  key: string;
  col: number;
  row: number;
  occupied: boolean;
}> {
  const { cols, rows } = getGridConfig(grid);
  const occupied = buildOccupancy(grid);
  const cells: Array<{ key: string; col: number; row: number; occupied: boolean }> = [];
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      cells.push({
        key: `${c},${r}`,
        col: c,
        row: r,
        occupied: occupied.has(`${c},${r}`),
      });
    }
  }
  return cells;
}

export function isCellFree(grid: Layout, col: number, row: number, excludeId?: string): boolean {
  return !buildOccupancy(grid, excludeId).has(`${col},${row}`);
}

function parseSpanSide(value: string | undefined, fallbackStart: number, fallbackSpan: number): {
  start: number;
  span: number;
} {
  if (!value?.trim()) {
    return { start: fallbackStart, span: fallbackSpan };
  }
  const trimmed = value.trim();
  // "2 / span 3" or "2 / 5"
  const parts = trimmed.split('/').map((p) => p.trim());
  if (parts.length === 1) {
    const n = parseInt(parts[0], 10);
    return Number.isFinite(n) ? { start: n, span: 1 } : { start: fallbackStart, span: fallbackSpan };
  }
  const start = parseInt(parts[0], 10);
  const endPart = parts[1];
  const spanMatch = /^span\s+(\d+)$/i.exec(endPart);
  if (spanMatch) {
    return {
      start: Number.isFinite(start) ? start : fallbackStart,
      span: parseInt(spanMatch[1], 10) || fallbackSpan,
    };
  }
  const end = parseInt(endPart, 10);
  if (Number.isFinite(start) && Number.isFinite(end)) {
    return { start, span: Math.max(1, end - start) };
  }
  return { start: fallbackStart, span: fallbackSpan };
}

export function getPlacement(node: Layout): GridPlacement {
  const col = parseSpanSide(node.style['grid-column'], 1, 1);
  const row = parseSpanSide(node.style['grid-row'], 1, 1);
  return {
    colStart: col.start,
    rowStart: row.start,
    colSpan: Math.max(1, col.span),
    rowSpan: Math.max(1, row.span),
  };
}

export function setPlacement(node: Layout, placement: GridPlacement): void {
  const { colStart, rowStart, colSpan, rowSpan } = placement;
  node.style['grid-column'] = `${colStart} / span ${colSpan}`;
  node.style['grid-row'] = `${rowStart} / span ${rowSpan}`;
}

function cellsOccupied(p: GridPlacement): Array<{ c: number; r: number }> {
  const cells: Array<{ c: number; r: number }> = [];
  for (let r = p.rowStart; r < p.rowStart + p.rowSpan; r++) {
    for (let c = p.colStart; c < p.colStart + p.colSpan; c++) {
      cells.push({ c, r });
    }
  }
  return cells;
}

function buildOccupancy(
  grid: Layout,
  excludeId?: string
): Set<string> {
  const occupied = new Set<string>();
  for (const child of grid.children) {
    if (excludeId && child.id === excludeId) continue;
    for (const cell of cellsOccupied(getPlacement(child))) {
      occupied.add(`${cell.c},${cell.r}`);
    }
  }
  return occupied;
}

export function canPlace(
  grid: Layout,
  placement: GridPlacement,
  excludeId?: string
): boolean {
  const { cols, rows } = getGridConfig(grid);
  if (
    placement.colStart < 1 ||
    placement.rowStart < 1 ||
    placement.colSpan < 1 ||
    placement.rowSpan < 1 ||
    placement.colStart + placement.colSpan - 1 > cols ||
    placement.rowStart + placement.rowSpan - 1 > rows
  ) {
    return false;
  }
  const occupied = buildOccupancy(grid, excludeId);
  for (const cell of cellsOccupied(placement)) {
    if (occupied.has(`${cell.c},${cell.r}`)) return false;
  }
  return true;
}

export function findNextFreeCell(
  grid: Layout,
  cols?: number,
  rows?: number
): { colStart: number; rowStart: number } | null {
  const config = getGridConfig(grid);
  const cMax = cols ?? config.cols;
  const rMax = rows ?? config.rows;
  const occupied = buildOccupancy(grid);
  for (let r = 1; r <= rMax; r++) {
    for (let c = 1; c <= cMax; c++) {
      if (!occupied.has(`${c},${r}`)) {
        return { colStart: c, rowStart: r };
      }
    }
  }
  return null;
}

/**
 * Find a free cell, growing the grid by one row when full (up to max).
 * Mutates grid config when it grows.
 */
export function findNextFreeCellOrGrow(
  grid: Layout
): { colStart: number; rowStart: number } | null {
  const existing = findNextFreeCell(grid);
  if (existing) return existing;

  const { cols, rows } = getGridConfig(grid);
  if (rows >= GRID_SIZE_MAX) return null;

  const nextRows = rows + 1;
  setGridConfig(grid, cols, nextRows);
  return { colStart: 1, rowStart: nextRows };
}

/** Insert structure onto Page before Footer if present, else append. */
export function insertOnPage(page: Layout, child: Layout): void {
  const footerIdx = page.children.findIndex((c) => c.type === 'Footer');
  if (footerIdx === -1) {
    page.children.push(child);
  } else {
    page.children.splice(footerIdx, 0, child);
  }
}

/** Resolve the Page root from any node in the tree. */
export function findPageRoot(root: Layout): Layout | null {
  if (root.type === 'Page') return root;
  return null;
}

export function collectIds(node: Layout, acc: string[] = []): string[] {
  acc.push(node.id);
  for (const child of node.children) {
    collectIds(child, acc);
  }
  return acc;
}

export function pruneContent(content: ContentMap, ids: string[]): ContentMap {
  const next = { ...content };
  for (const id of ids) {
    delete next[id];
  }
  return next;
}

export function countDescendants(node: Layout): number {
  return node.children.reduce((total, child) => total + 1 + countDescendants(child), 0);
}
