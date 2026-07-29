export type LayoutType =
  | 'Page'
  | 'Container'
  | 'Navbar'
  | 'Footer'
  | 'SectionTitle'
  | 'SmallText'
  | 'LongText'
  | 'Card'
  | 'Carousel'
  | 'Button'
  | 'Link'
  | 'Image'
  | 'Icon'
  | 'Row'
  | 'Column'
  | 'Grid'
  | 'Divider'
  | 'Spacer';

export interface Layout {
  id: string;
  type: LayoutType;
  name: string;
  version: number;
  style: Record<string, string>;
  children: Layout[];
  parent_id: string | null;
}

export type ContentMap = Record<string, Record<string, unknown>>;

export interface LayoutData {
  id: string;
  layout_id: string;
  version: number;
  content: ContentMap;
}

export const CONTENT_SLOTS: Record<LayoutType, string[]> = {
  Page: [],
  Container: [],
  Navbar: [],
  Footer: [],
  Row: [],
  Column: [],
  Grid: [],
  Divider: [],
  Spacer: [],
  SectionTitle: ['text'],
  SmallText: ['text'],
  LongText: ['text'],
  Image: ['src', 'alt'],
  Icon: ['name'],
  Button: ['label', 'href'],
  Link: ['label', 'href'],
  Card: ['image', 'title', 'description'],
  Carousel: ['items'],
};

export const STRUCTURE_TYPES: LayoutType[] = [
  'Navbar',
  'Footer',
  'Grid',
  'Divider',
  'Spacer',
];

export const CONTENT_TYPES: LayoutType[] = [
  'SectionTitle',
  'SmallText',
  'LongText',
  'Card',
  'Carousel',
  'Button',
  'Link',
  'Icon',
];