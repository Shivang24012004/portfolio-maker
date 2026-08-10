import { Component, EventEmitter, HostBinding, Input, Output, signal } from '@angular/core';
import { NgStyle } from '@angular/common';
import { ContentMap, Layout } from '../../core/models/layouts.models';
import {
  canHaveChildren,
  getGridConfig,
  listGridCells,
} from '../../core/utils/layout-tree';

export type LayoutDropPayload = {
  parentId: string;
  type: string;
  colStart?: number;
  rowStart?: number;
};

export type CarouselSlide = {
  title?: string;
  description?: string;
  image?: string;
};

@Component({
  selector: 'app-layout-renderer',
  templateUrl: './layout-renderer.html',
  styleUrls: ['./layout-renderer.scss'],
  imports: [NgStyle, LayoutRenderer],
})
export class LayoutRenderer {
  @Input({ required: true }) node!: Layout;
  @Input({ required: true }) content!: ContentMap;
  @Input() editable = false;
  @Input() selectedId: string | null = null;
  /** True when this node is a direct child of a Grid. */
  @Input() inGrid = false;

  @Output() selectNode = new EventEmitter<string>();
  @Output() dropOnNode = new EventEmitter<LayoutDropPayload>();

  /** Active slide index for this node when it is a Carousel. */
  carouselIndex = signal(0);

  @HostBinding('class.grid-item')
  get hostIsGridItem(): boolean {
    return this.inGrid;
  }

  @HostBinding('class.is-editable')
  get hostEditable(): boolean {
    return this.editable;
  }

  @HostBinding('class.is-preview')
  get hostPreview(): boolean {
    return !this.editable;
  }

  @HostBinding('class.selected-host')
  get hostSelected(): boolean {
    return this.inGrid && this.isSelected();
  }

  @HostBinding('style.grid-column')
  get hostGridColumn(): string | null {
    return this.inGrid ? (this.node.style['grid-column'] ?? null) : null;
  }

  @HostBinding('style.grid-row')
  get hostGridRow(): string | null {
    return this.inGrid ? (this.node.style['grid-row'] ?? null) : null;
  }

  @HostBinding('style.min-width')
  get hostMinWidth(): string | null {
    return this.inGrid ? '0' : null;
  }

  @HostBinding('style.max-width')
  get hostMaxWidth(): string | null {
    return this.inGrid ? '100%' : null;
  }

  @HostBinding('style.min-height')
  get hostMinHeight(): string | null {
    return this.inGrid ? '0' : null;
  }

  @HostBinding('style.overflow')
  get hostOverflow(): string | null {
    // Clip in the editor only. In preview, avoid nested scrollports that steal trackpad scroll.
    if (!this.inGrid) return null;
    return this.editable ? 'hidden' : 'visible';
  }

  @HostBinding('style.z-index')
  get hostZIndex(): string | null {
    return this.inGrid ? '1' : null;
  }

  @HostBinding('style.position')
  get hostPosition(): string | null {
    return this.inGrid ? 'relative' : null;
  }

  @HostBinding('style.height')
  get hostHeight(): string | null {
    return this.inGrid ? '100%' : null;
  }

  @HostBinding('style.width')
  get hostWidth(): string | null {
    return this.inGrid ? '100%' : null;
  }

  slots() {
    return this.content[this.node.id] ?? {};
  }

  text(key: string): string {
    return String(this.slots()[key] ?? '');
  }

  cardIsMediaOnly(): boolean {
    return !!this.text('image').trim() && !this.text('title').trim() && !this.text('description').trim();
  }

  /** Drop padding for image-only cards so the photo can fill edge-to-edge. */
  cardVisualStyle(): Record<string, string> {
    const style = { ...this.visualStyle() };
    if (this.cardIsMediaOnly()) {
      style['padding'] = '0';
    }
    return style;
  }

  carouselItems(): CarouselSlide[] {
    const raw = this.slots()['items'];
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
      .map((item) => ({
        title: item['title'] != null ? String(item['title']) : undefined,
        description: item['description'] != null ? String(item['description']) : undefined,
        image: item['image'] != null ? String(item['image']) : undefined,
      }));
  }

  activeCarouselSlide(): CarouselSlide | null {
    const items = this.carouselItems();
    if (items.length === 0) return null;
    const index = ((this.carouselIndex() % items.length) + items.length) % items.length;
    return items[index] ?? null;
  }

  carouselCanNav(): boolean {
    return this.carouselItems().length > 1;
  }

  carouselLabel(): string {
    const total = this.carouselItems().length;
    if (total === 0) return '';
    const index = ((this.carouselIndex() % total) + total) % total;
    return `${index + 1} / ${total}`;
  }

  prevCarouselSlide(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const total = this.carouselItems().length;
    if (total <= 1) return;
    this.carouselIndex.update((i) => (i - 1 + total) % total);
  }

  nextCarouselSlide(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const total = this.carouselItems().length;
    if (total <= 1) return;
    this.carouselIndex.update((i) => (i + 1) % total);
  }

  /** Styles for the visual element (placement lives on the host when inGrid). */
  visualStyle(): Record<string, string> {
    if (this.node.type === 'Grid') {
      return this.normalizedGridStyle();
    }
    if (!this.inGrid) return this.node.style;
    const { ['grid-column']: _c, ['grid-row']: _r, ...rest } = this.node.style;
    const overflow =
      this.node.type === 'Carousel'
        ? rest['overflow'] || 'hidden'
        : this.editable
          ? rest['overflow'] || 'auto'
          : 'visible';
    return {
      ...rest,
      'min-width': '0',
      'max-width': '100%',
      width: '100%',
      height: '100%',
      'max-height': '100%',
      'box-sizing': 'border-box',
      // Nested overflow:auto steals 2-finger page scroll in preview.
      // Carousel must stay clipped so the track scrolls horizontally.
      overflow,
      'overflow-wrap': rest['overflow-wrap'] || 'anywhere',
      'word-break': rest['word-break'] || 'break-word',
    };
  }

  isSelected(): boolean {
    return this.editable && this.selectedId === this.node.id;
  }

  acceptsDrop(): boolean {
    return this.editable && canHaveChildren(this.node.type);
  }

  hasFooterChild(): boolean {
    return this.node.children.some((c) => c.type === 'Footer');
  }

  gridCells() {
    return listGridCells(this.node);
  }

  gridSlotsStyle(): Record<string, string> {
    const { cols, rows } = getGridConfig(this.node);
    return {
      'grid-column': '1 / -1',
      'grid-row': '1 / -1',
      display: 'grid',
      'grid-template-columns': `repeat(${cols}, minmax(0, 1fr))`,
      'grid-template-rows': `repeat(${rows}, minmax(4.5rem, auto))`,
      gap: this.node.style['gap'] || '0.75rem',
      'pointer-events': 'none',
      'z-index': '0',
      'min-width': '0',
      'max-width': '100%',
    };
  }

  private normalizedGridStyle(): Record<string, string> {
    const { cols, rows } = getGridConfig(this.node);
    return {
      ...this.node.style,
      display: 'grid',
      'grid-template-columns': `repeat(${cols}, minmax(0, 1fr))`,
      'grid-template-rows': `repeat(${rows}, minmax(4.5rem, auto))`,
      'align-content': this.node.style['align-content'] || 'start',
      'justify-items': this.node.style['justify-items'] || 'stretch',
      'align-items': this.node.style['align-items'] || 'stretch',
      width: this.node.style['width'] || '100%',
      'max-width': '100%',
      'min-width': '0',
      // Hidden only while editing so preview does not trap scroll.
      overflow: this.editable
        ? this.node.style['overflow'] || 'hidden'
        : this.node.style['overflow'] || 'visible',
      'box-sizing': 'border-box',
    };
  }

  onClick(event: MouseEvent) {
    if (!this.editable) return;
    event.stopPropagation();
    this.selectNode.emit(this.node.id);
  }

  /** In the editor, block navigation so selection works; in preview, allow links. */
  onAnchorClick(event: MouseEvent) {
    if (!this.editable) return;
    event.preventDefault();
    this.onClick(event);
  }

  onDragOver(event: DragEvent) {
    if (!this.acceptsDrop()) return;
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    if (!this.acceptsDrop()) return;
    event.preventDefault();
    event.stopPropagation();
    const type = event.dataTransfer?.getData('application/x-layout-type');
    if (!type) return;
    this.dropOnNode.emit({ parentId: this.node.id, type });
  }

  onCellDragOver(event: DragEvent, occupied: boolean) {
    if (!this.editable || occupied) return;
    event.preventDefault();
    event.stopPropagation();
  }

  onCellDrop(event: DragEvent, col: number, row: number, occupied: boolean) {
    if (!this.editable || occupied) return;
    event.preventDefault();
    event.stopPropagation();
    const type = event.dataTransfer?.getData('application/x-layout-type');
    if (!type) return;
    this.dropOnNode.emit({
      parentId: this.node.id,
      type,
      colStart: col,
      rowStart: row,
    });
  }

  onChildSelect(id: string): void {
    this.selectNode.emit(id);
  }

  onChildDrop(payload: LayoutDropPayload): void {
    this.dropOnNode.emit(payload);
  }
}
