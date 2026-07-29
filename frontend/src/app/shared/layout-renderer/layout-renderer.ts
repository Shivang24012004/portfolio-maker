import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
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

  @HostBinding('class.grid-item')
  get hostIsGridItem(): boolean {
    return this.inGrid;
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

  slots() {
    return this.content[this.node.id] ?? {};
  }

  text(key: string): string {
    return String(this.slots()[key] ?? '');
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

  /** Styles for the visual element (placement lives on the host when inGrid). */
  visualStyle(): Record<string, string> {
    if (!this.inGrid) return this.node.style;
    const { ['grid-column']: _c, ['grid-row']: _r, ...rest } = this.node.style;
    return rest;
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
      'grid-template-rows': `repeat(${rows}, minmax(72px, auto))`,
      gap: this.node.style['gap'] || '0.75rem',
      'pointer-events': 'none',
      'z-index': '0',
    };
  }

  onClick(event: MouseEvent) {
    if (!this.editable) return;
    event.stopPropagation();
    this.selectNode.emit(this.node.id);
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
