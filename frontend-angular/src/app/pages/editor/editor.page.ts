import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import {
  CONTENT_SLOTS,
  CONTENT_TYPES,
  ContentMap,
  Layout,
  LayoutData,
  LayoutType,
  STRUCTURE_TYPES,
} from '../../core/models/layouts.models';
import { LayoutRenderer } from '../../shared/layout-renderer/layout-renderer';
import {
  canDropOnChrome,
  canDropOnGrid,
  canDropOnPage,
  canHaveChildren,
  canPlace,
  collectIds,
  countDescendants,
  createNode,
  findNextFreeCellOrGrow,
  findNode,
  findParent,
  getGridConfig,
  getPlacement,
  initContentSlots,
  insertOnPage,
  isCellFree,
  prepareGridChildStyles,
  pruneContent,
  removeNode,
  setGridConfig,
  setPlacement,
} from '../../core/utils/layout-tree';
import { LayoutDropPayload } from '../../shared/layout-renderer/layout-renderer';
import { LayoutApiService } from '../../core/services/layout-api.service';
import { LayoutDataApiService } from '../../core/services/layout-data-api.service';

type InspectorTab = 'content' | 'layout' | 'style' | 'settings';
type SlotControl = 'text' | 'textarea' | 'url' | 'items';

interface ContentField {
  slot: string;
  label: string;
  control: SlotControl;
  placeholder?: string;
  hint?: string;
}

const SIZE_STYLE_KEYS = new Set([
  'width',
  'height',
  'max-width',
  'min-width',
  'min-height',
  'max-height',
  'grid-template-columns',
  'grid-template-rows',
  'grid-column',
  'grid-row',
  '--grid-cols',
  '--grid-rows',
]);

/** Common CSS props shown in the inspector (kebab-case keys). */
const COMMON_STYLE_FIELDS: { key: string; label: string; placeholder?: string }[] = [
  { key: 'display', label: 'Display', placeholder: 'flex | grid | block' },
  { key: 'flex-direction', label: 'Flex direction', placeholder: 'row | column' },
  { key: 'justify-content', label: 'Justify content', placeholder: 'space-between' },
  { key: 'align-items', label: 'Align items', placeholder: 'center' },
  { key: 'gap', label: 'Gap', placeholder: '1rem' },
  { key: 'padding', label: 'Padding', placeholder: '1rem 2rem' },
  { key: 'margin', label: 'Margin', placeholder: '0 auto' },
  { key: 'width', label: 'Width', placeholder: '100%' },
  { key: 'max-width', label: 'Max width', placeholder: '960px' },
  { key: 'min-height', label: 'Min height', placeholder: '100vh' },
  { key: 'background', label: 'Background', placeholder: '#0b1220' },
  { key: 'color', label: 'Color', placeholder: '#e8eef7' },
  { key: 'font-size', label: 'Font size', placeholder: '1.25rem' },
  { key: 'font-weight', label: 'Font weight', placeholder: '600' },
  { key: 'font-family', label: 'Font family', placeholder: 'IBM Plex Sans, sans-serif' },
  { key: 'text-align', label: 'Text align', placeholder: 'left | center' },
  { key: 'border', label: 'Border', placeholder: '1px solid #1f2937' },
  { key: 'border-radius', label: 'Border radius', placeholder: '0.5rem' },
];

const SLOT_LABELS: Record<string, string> = {
  text: 'Text',
  name: 'Icon name',
  label: 'Label',
  href: 'Link URL',
  title: 'Title (optional)',
  description: 'Description (optional)',
  image: 'Image URL',
  items: 'Items',
};

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [LayoutRenderer, FormsModule, JsonPipe, RouterLink],
  templateUrl: './editor.page.html',
  styleUrl: './editor.page.css',
})
export class EditorPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly layoutsApi = inject(LayoutApiService);
  private readonly layoutDataApi = inject(LayoutDataApiService);

  layout = signal<Layout | null>(null);
  content = signal<ContentMap>({});
  layoutDataMeta = signal<Pick<LayoutData, 'id' | 'layout_id' | 'version'> | null>(null);

  loading = signal(true);
  saving = signal(false);
  loadError = signal<string | null>(null);
  saveMessage = signal<string | null>(null);

  selectedId = signal<string | null>(null);
  showJson = signal(false);
  inspectorTab = signal<InspectorTab>('content');
  itemsError = signal<string | null>(null);
  dropMessage = signal<string | null>(null);

  structureTypes = STRUCTURE_TYPES;
  contentTypes = CONTENT_TYPES;

  newStyleKey = '';
  newStyleValue = '';

  ngOnInit(): void {
    const layoutId = this.route.snapshot.paramMap.get('layoutId');
    if (!layoutId) {
      this.loadError.set('Missing layout id');
      this.loading.set(false);
      return;
    }
    this.load(layoutId);
  }

  selectedNode(): Layout | null {
    const root = this.layout();
    const id = this.selectedId();
    return root && id ? findNode(root, id) : null;
  }

  selectedParent(): Layout | null {
    const root = this.layout();
    const id = this.selectedId();
    if (!root || !id) return null;
    return findParent(root, id);
  }

  isGridNode(): boolean {
    return this.selectedNode()?.type === 'Grid';
  }

  isGridChild(): boolean {
    return this.selectedParent()?.type === 'Grid';
  }

  gridConfig() {
    const node = this.selectedNode();
    if (!node || node.type !== 'Grid') return { cols: 3, rows: 3 };
    return getGridConfig(node);
  }

  childPlacement() {
    const node = this.selectedNode();
    if (!node || !this.isGridChild()) {
      return { colStart: 1, rowStart: 1, colSpan: 1, rowSpan: 1 };
    }
    return getPlacement(node);
  }

  visibleStyleFields() {
    const hideSize = this.isGridChild() || this.isGridNode();
    return COMMON_STYLE_FIELDS.filter((f) => !(hideSize && SIZE_STYLE_KEYS.has(f.key)));
  }

  extraStyleEntries(): { key: string; value: string }[] {
    const node = this.selectedNode();
    if (!node) return [];
    const common = new Set(COMMON_STYLE_FIELDS.map((f) => f.key));
    return Object.entries(node.style)
      .filter(([key]) => {
        if (common.has(key)) return false;
        if (key.startsWith('--grid')) return false;
        if (key === 'grid-column' || key === 'grid-row') return false;
        if (key === 'grid-template-columns' || key === 'grid-template-rows') return false;
        return true;
      })
      .map(([key, value]) => ({ key, value }));
  }

  contentFields(): ContentField[] {
    const node = this.selectedNode();
    if (!node) return [];

    return CONTENT_SLOTS[node.type].map((slot) => {
      const control = this.controlForSlot(node.type, slot);
      return {
        slot,
        label: SLOT_LABELS[slot] ?? slot,
        control,
        placeholder: this.placeholderForSlot(slot, control),
        hint: this.hintForSlot(slot, control),
      };
    });
  }

  hasContentSlots(): boolean {
    return this.contentFields().length > 0;
  }

  slotValue(slot: string): string {
    const id = this.selectedId();
    if (!id) return '';
    const value = this.content()[id]?.[slot];
    if (value == null) return '';
    if (typeof value === 'string') return value;
    return String(value);
  }

  itemsJson(): string {
    const id = this.selectedId();
    if (!id) return '[]';
    const value = this.content()[id]?.['items'];
    if (Array.isArray(value)) return JSON.stringify(value, null, 2);
    if (typeof value === 'string' && value.trim()) return value;
    return '[\n  { "title": "Slide 1", "description": "First slide", "image": "https://..." },\n  { "title": "Slide 2", "image": "https://..." }\n]';
  }

  imagePreviewUrl(): string | null {
    const node = this.selectedNode();
    if (!node || node.type !== 'Card') return null;
    const src = this.slotValue('image').trim();
    return src || null;
  }

  styleValue(key: string): string {
    return this.selectedNode()?.style[key] ?? '';
  }

  setTab(tab: InspectorTab): void {
    this.inspectorTab.set(tab);
  }

  save(): void {
    const root = this.layout();
    const meta = this.layoutDataMeta();
    if (!root || !meta || this.saving()) return;

    this.saving.set(true);
    this.saveMessage.set(null);

    const dataPayload: LayoutData = {
      id: meta.id,
      layout_id: meta.layout_id,
      version: meta.version,
      content: this.content(),
    };

    forkJoin({
      layout: this.layoutsApi.update(root.id, root),
      data: this.layoutDataApi.update(meta.id, dataPayload),
    }).subscribe({
      next: ({ layout, data }) => {
        this.layout.set(layout);
        this.content.set(data.content ?? {});
        this.layoutDataMeta.set({
          id: data.id,
          layout_id: data.layout_id,
          version: data.version,
        });
        this.saving.set(false);
        this.saveMessage.set('Saved');
      },
      error: (err) => {
        this.saving.set(false);
        this.saveMessage.set(this.errorDetail(err, 'Save failed'));
      },
    });
  }

  onPaletteDragStart(event: DragEvent, type: LayoutType): void {
    event.dataTransfer?.setData('application/x-layout-type', type);
    event.dataTransfer!.effectAllowed = 'copy';
  }

  onSelect(id: string): void {
    const root = this.layout();
    if (!root) return;

    this.selectedId.set(id);
    this.newStyleKey = '';
    this.newStyleValue = '';
    this.itemsError.set(null);
    this.dropMessage.set(null);

    const node = findNode(root, id);
    if (node && CONTENT_SLOTS[node.type].length > 0 && !this.content()[id]) {
      const next = structuredClone(this.content());
      initContentSlots(next, node);
      this.content.set(next);
    }

    const parent = node ? findParent(root, id) : null;
    if (node?.type === 'Grid' || parent?.type === 'Grid') {
      this.inspectorTab.set('layout');
    } else if (node && CONTENT_SLOTS[node.type].length > 0) {
      this.inspectorTab.set('content');
    } else {
      this.inspectorTab.set('style');
    }
  }

  onDropOnNode(payload: LayoutDropPayload): void {
    const type = payload.type as LayoutType;
    const root = this.cloneRoot();
    if (!root) return;

    let parent = findNode(root, payload.parentId);
    if (!parent || !canHaveChildren(parent.type)) return;

    this.dropMessage.set(null);

    // Dropping Grid/Navbar/Footer onto a covered section still means "add to Page".
    if (parent.type !== 'Page' && canDropOnPage(type)) {
      if (root.type !== 'Page') {
        this.dropMessage.set('Could not find the Page to place this section.');
        return;
      }
      parent = root;
    }

    if (parent.type === 'Page') {
      if (!canDropOnPage(type)) {
        this.dropMessage.set('Drop Navbar, Footer, or Grid onto the Page (or onto any section).');
        return;
      }
      const child = createNode(type, parent.id);
      if (type === 'Grid') {
        setGridConfig(child, 2, 5);
      }
      insertOnPage(parent, child);
      this.commitDrop(root, child, type);
      this.inspectorTab.set('layout');
      return;
    }

    if (parent.type === 'Grid') {
      if (!canDropOnGrid(type)) {
        this.dropMessage.set('Drop content (Card, text, Button, …) onto a free grid cell.');
        return;
      }

      let colStart = payload.colStart;
      let rowStart = payload.rowStart;

      if (colStart != null && rowStart != null) {
        if (!isCellFree(parent, colStart, rowStart)) {
          const grown = findNextFreeCellOrGrow(parent);
          if (!grown) {
            this.dropMessage.set('Grid is full (max rows reached). Free a cell or add another Grid.');
            return;
          }
          colStart = grown.colStart;
          rowStart = grown.rowStart;
          this.dropMessage.set(`Cell was occupied — placed at ${colStart},${rowStart}.`);
        }
      } else {
        const cell = findNextFreeCellOrGrow(parent);
        if (!cell) {
          this.dropMessage.set('Grid is full (max rows reached). Free a cell or add another Grid.');
          return;
        }
        colStart = cell.colStart;
        rowStart = cell.rowStart;
      }

      const child = createNode(type, parent.id);
      prepareGridChildStyles(child.style);
      setPlacement(child, {
        colStart: colStart!,
        rowStart: rowStart!,
        colSpan: 1,
        rowSpan: 1,
      });
      parent.children.push(child);
      this.commitDrop(root, child, type);
      this.inspectorTab.set('layout');
      return;
    }

    if (parent.type === 'Navbar' || parent.type === 'Footer') {
      if (!canDropOnChrome(type)) {
        this.dropMessage.set('Navbar/Footer accept brand text, links, buttons, or icons.');
        return;
      }
      const child = createNode(type, parent.id);
      parent.children.push(child);
      this.commitDrop(root, child, type);
      return;
    }

    const child = createNode(type, parent.id);
    parent.children.push(child);
    this.commitDrop(root, child, type);
  }

  updateGridCols(raw: string | number): void {
    const nodeId = this.selectedId();
    if (!nodeId) return;
    const root = this.cloneRoot();
    if (!root) return;
    const node = findNode(root, nodeId);
    if (!node || node.type !== 'Grid') return;
    const { rows } = getGridConfig(node);
    const cols = Number(raw);
    if (!this.gridShrinkIsSafe(node, cols, rows)) {
      this.dropMessage.set('Some items would fall outside this grid. Move or shrink them first.');
      return;
    }
    setGridConfig(node, cols, rows);
    this.layout.set(root);
    this.dropMessage.set(null);
  }

  updateGridRows(raw: string | number): void {
    const nodeId = this.selectedId();
    if (!nodeId) return;
    const root = this.cloneRoot();
    if (!root) return;
    const node = findNode(root, nodeId);
    if (!node || node.type !== 'Grid') return;
    const { cols } = getGridConfig(node);
    const rows = Number(raw);
    if (!this.gridShrinkIsSafe(node, cols, rows)) {
      this.dropMessage.set('Some items would fall outside this grid. Move or shrink them first.');
      return;
    }
    setGridConfig(node, cols, rows);
    this.layout.set(root);
    this.dropMessage.set(null);
  }

  updateChildColSpan(raw: string | number): void {
    this.updateChildPlacement({ colSpan: Number(raw) });
  }

  updateChildRowSpan(raw: string | number): void {
    this.updateChildPlacement({ rowSpan: Number(raw) });
  }

  updateChildColStart(raw: string | number): void {
    this.updateChildPlacement({ colStart: Number(raw) });
  }

  updateChildRowStart(raw: string | number): void {
    this.updateChildPlacement({ rowStart: Number(raw) });
  }

  updateSlot(slot: string, value: string): void {
    const id = this.selectedId();
    if (!id) return;
    const next = structuredClone(this.content());
    next[id] = { ...(next[id] ?? {}), [slot]: value };
    this.content.set(next);
  }

  updateItemsJson(raw: string): void {
    const id = this.selectedId();
    if (!id) return;

    try {
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) {
        this.itemsError.set('Items must be a JSON array.');
        return;
      }
      const next = structuredClone(this.content());
      next[id] = { ...(next[id] ?? {}), items: parsed };
      this.content.set(next);
      this.itemsError.set(null);
    } catch {
      this.itemsError.set('Invalid JSON. Fix the array to apply.');
    }
  }

  updateNodeName(name: string): void {
    const id = this.selectedId();
    if (!id) return;
    const root = this.cloneRoot();
    if (!root) return;
    const node = findNode(root, id);
    if (!node) return;
    node.name = name;
    this.layout.set(root);
  }

  updateStyle(key: string, value: string): void {
    const id = this.selectedId();
    if (!id) return;

    const root = this.cloneRoot();
    if (!root) return;
    const node = findNode(root, id);
    if (!node) return;

    const trimmed = value.trim();
    if (trimmed === '') {
      delete node.style[key];
    } else {
      node.style[key] = trimmed;
    }

    this.layout.set(root);
  }

  removeStyle(key: string): void {
    this.updateStyle(key, '');
  }

  addCustomStyle(): void {
    const key = this.newStyleKey.trim().toLowerCase();
    if (!key || !this.selectedId()) return;
    this.updateStyle(key, this.newStyleValue.trim());
    this.newStyleKey = '';
    this.newStyleValue = '';
  }

  toggleJson(): void {
    this.showJson.update((v) => !v);
  }

  deleteNode(id: string): void {
    const root = this.cloneRoot();
    if (!root || root.id === id) return;

    const target = findNode(root, id);
    if (!target) return;

    const descendants = countDescendants(target);
    if (descendants > 0) {
      const ok = confirm(`Delete "${target.name}" and its ${descendants} child component(s)?`);
      if (!ok) return;
    }

    const removed = removeNode(root, id);
    if (!removed) return;

    const removedIds = collectIds(removed);
    this.layout.set(root);
    this.content.set(pruneContent(this.content(), removedIds));
    if (removedIds.includes(this.selectedId() ?? '')) {
      this.selectedId.set(null);
    }
  }

  deleteSelected(): void {
    const id = this.selectedId();
    if (id) this.deleteNode(id);
  }

  canDeleteSelected(): boolean {
    const root = this.layout();
    const id = this.selectedId();
    return !!root && !!id && id !== root.id;
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
      event.preventDefault();
      this.save();
      return;
    }

    if (event.key === 'Escape') {
      this.selectedId.set(null);
      return;
    }

    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (!this.canDeleteSelected()) return;
      event.preventDefault();
      this.deleteSelected();
    }
  }

  private load(layoutId: string): void {
    this.loading.set(true);
    this.loadError.set(null);

    forkJoin({
      layout: this.layoutsApi.getById(layoutId),
      data: this.layoutDataApi.getByLayoutId(layoutId),
    }).subscribe({
      next: ({ layout, data }) => {
        this.layout.set(layout);
        this.content.set(data.content ?? {});
        this.layoutDataMeta.set({
          id: data.id,
          layout_id: data.layout_id,
          version: data.version,
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.loadError.set(this.errorDetail(err, 'Failed to load layout'));
        this.loading.set(false);
      },
    });
  }

  private cloneRoot(): Layout | null {
    const root = this.layout();
    return root ? structuredClone(root) : null;
  }

  private commitDrop(root: Layout, child: Layout, type: LayoutType): void {
    const nextContent = structuredClone(this.content());
    initContentSlots(nextContent, child);
    this.layout.set(root);
    this.content.set(nextContent);
    this.selectedId.set(child.id);
    this.inspectorTab.set(CONTENT_SLOTS[type].length > 0 ? 'content' : 'style');
  }

  private gridShrinkIsSafe(grid: Layout, cols: number, rows: number): boolean {
    for (const child of grid.children) {
      const p = getPlacement(child);
      if (p.colStart + p.colSpan - 1 > cols) return false;
      if (p.rowStart + p.rowSpan - 1 > rows) return false;
    }
    return true;
  }

  private updateChildPlacement(
    patch: Partial<{
      colStart: number;
      rowStart: number;
      colSpan: number;
      rowSpan: number;
    }>,
  ): void {
    const id = this.selectedId();
    if (!id) return;

    const root = this.cloneRoot();
    if (!root) return;
    const parent = findParent(root, id);
    const node = findNode(root, id);
    if (!parent || parent.type !== 'Grid' || !node) return;

    const current = getPlacement(node);
    const next = {
      colStart: patch.colStart ?? current.colStart,
      rowStart: patch.rowStart ?? current.rowStart,
      colSpan: patch.colSpan ?? current.colSpan,
      rowSpan: patch.rowSpan ?? current.rowSpan,
    };

    if (
      !Number.isFinite(next.colStart) ||
      !Number.isFinite(next.rowStart) ||
      !Number.isFinite(next.colSpan) ||
      !Number.isFinite(next.rowSpan) ||
      next.colStart < 1 ||
      next.rowStart < 1 ||
      next.colSpan < 1 ||
      next.rowSpan < 1
    ) {
      return;
    }

    next.colStart = Math.round(next.colStart);
    next.rowStart = Math.round(next.rowStart);
    next.colSpan = Math.round(next.colSpan);
    next.rowSpan = Math.round(next.rowSpan);

    if (!canPlace(parent, next, node.id)) {
      this.dropMessage.set('That placement overlaps another item or exceeds the grid.');
      return;
    }

    setPlacement(node, next);
    this.layout.set(root);
    this.dropMessage.set(null);
  }

  private controlForSlot(type: LayoutType, slot: string): SlotControl {
    if (slot === 'items') return 'items';
    if (slot === 'src' || slot === 'href' || slot === 'image') return 'url';
    if (slot === 'description' || (slot === 'text' && (type === 'LongText' || type === 'SectionTitle'))) {
      return 'textarea';
    }
    return 'text';
  }

  private placeholderForSlot(slot: string, control: SlotControl): string {
    switch (slot) {
      case 'text':
        return control === 'textarea' ? 'Enter body copy…' : 'Enter text…';
      case 'src':
      case 'image':
        return 'https://…';
      case 'alt':
        return 'Describe the image';
      case 'label':
        return 'Button or link label';
      case 'href':
        return 'https://… or #section';
      case 'title':
        return 'Optional — leave blank to hide';
      case 'description':
        return 'Optional — leave blank to hide';
      case 'name':
        return 'Icon name or glyph';
      case 'items':
        return 'JSON array of items';
      default:
        return '';
    }
  }

  private hintForSlot(slot: string, control: SlotControl): string | undefined {
    if (slot === 'items') {
      return 'JSON array of slides: title, description, image (all optional per slide).';
    }
    if (slot === 'href') {
      return 'Use a full URL or an in-page anchor like #projects.';
    }
    if (slot === 'image') {
      return 'Use Card for images. Title and description are optional.';
    }
    if (slot === 'title' || slot === 'description') {
      return 'Optional. Shown only when this field has a value.';
    }
    return undefined;
  }

  private errorDetail(err: unknown, fallback: string): string {
    const detail = (err as { error?: { detail?: string } })?.error?.detail;
    return typeof detail === 'string' ? detail : fallback;
  }
}
