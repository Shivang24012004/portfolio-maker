import { Layout, LayoutData } from '../models/layouts.models';
import { defaultStyle, prepareGridChildStyles, setGridConfig, setPlacement } from '../utils/layout-tree';

const PAGE_ID = '11111111-1111-1111-1111-111111111111';
const NAV_ID = '22222222-2222-2222-2222-222222222222';
const BRAND_ID = '22222222-2222-2222-2222-222222222201';
const LINK_PROJECTS_ID = '22222222-2222-2222-2222-222222222203';
const LINK_CONTACT_ID = '22222222-2222-2222-2222-222222222204';
const GRID_ID = '44444444-4444-4444-4444-444444444444';
const TITLE_ID = '33333333-3333-3333-3333-333333333301';
const BIO_ID = '33333333-3333-3333-3333-333333333302';
const CTA_ID = '33333333-3333-3333-3333-333333333304';
const CARD1_ID = '55555555-5555-5555-5555-555555555501';
const CARD2_ID = '55555555-5555-5555-5555-555555555502';
const FOOTER_ID = '66666666-6666-6666-6666-666666666666';
const FOOTER_COPY_ID = '66666666-6666-6666-6666-666666666601';
const FOOTER_LINK_ID = '66666666-6666-6666-6666-666666666602';

function node(
  id: string,
  type: Layout['type'],
  name: string,
  parentId: string | null,
  style: Record<string, string>,
  children: Layout[] = []
): Layout {
  return {
    id,
    type,
    name,
    version: 1,
    parent_id: parentId,
    style,
    children,
  };
}

function placed(
  type: Layout['type'],
  placement: { colStart: number; rowStart: number; colSpan: number; rowSpan: number },
  extra: Record<string, string> = {}
): Record<string, string> {
  const style = { ...defaultStyle(type), ...extra };
  prepareGridChildStyles(style);
  setPlacement({ style } as Layout, placement);
  return style;
}

const gridStyle = defaultStyle('Grid');
setGridConfig({ style: gridStyle } as Layout, 2, 5);

export const SAMPLE_LAYOUT: Layout = node(
  PAGE_ID,
  'Page',
  'Developer Portfolio',
  null,
  defaultStyle('Page'),
  [
    node(NAV_ID, 'Navbar', 'Top Nav', PAGE_ID, defaultStyle('Navbar'), [
      node(BRAND_ID, 'SmallText', 'Brand', NAV_ID, {
        ...defaultStyle('SmallText'),
        'font-weight': '700',
        color: '#e8eef7',
        'letter-spacing': '0.04em',
      }),
      node(LINK_PROJECTS_ID, 'Link', 'Projects Link', NAV_ID, defaultStyle('Link')),
      node(LINK_CONTACT_ID, 'Link', 'Contact Link', NAV_ID, defaultStyle('Link')),
    ]),
    node(GRID_ID, 'Grid', 'Main Grid 2×5', PAGE_ID, gridStyle, [
      node(
        TITLE_ID,
        'SectionTitle',
        'Hero Title',
        GRID_ID,
        placed('SectionTitle', { colStart: 1, rowStart: 1, colSpan: 2, rowSpan: 1 })
      ),
      node(
        BIO_ID,
        'LongText',
        'Hero Bio',
        GRID_ID,
        placed('LongText', { colStart: 1, rowStart: 2, colSpan: 2, rowSpan: 1 })
      ),
      node(
        CTA_ID,
        'Button',
        'Primary CTA',
        GRID_ID,
        placed('Button', { colStart: 1, rowStart: 3, colSpan: 2, rowSpan: 1 })
      ),
      node(
        CARD1_ID,
        'Card',
        'Project Card 1',
        GRID_ID,
        placed('Card', { colStart: 1, rowStart: 4, colSpan: 1, rowSpan: 1 })
      ),
      node(
        CARD2_ID,
        'Card',
        'Project Card 2',
        GRID_ID,
        placed('Card', { colStart: 2, rowStart: 4, colSpan: 1, rowSpan: 1 })
      ),
    ]),
    node(FOOTER_ID, 'Footer', 'Site Footer', PAGE_ID, defaultStyle('Footer'), [
      node(FOOTER_COPY_ID, 'SmallText', 'Copyright', FOOTER_ID, defaultStyle('SmallText')),
      node(FOOTER_LINK_ID, 'Link', 'GitHub', FOOTER_ID, {
        ...defaultStyle('Link'),
        color: '#14b8a6',
      }),
    ]),
  ]
);

export const SAMPLE_LAYOUT_DATA: LayoutData = {
  id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  layout_id: PAGE_ID,
  version: 1,
  content: {
    [BRAND_ID]: { text: 'ALEX DEV' },
    [LINK_PROJECTS_ID]: { label: 'Projects', href: '#projects' },
    [LINK_CONTACT_ID]: { label: 'Contact', href: '#contact' },
    [TITLE_ID]: { text: "Hi, I'm Alex — full-stack engineer" },
    [BIO_ID]: {
      text: 'I build APIs, design systems, and product UIs.',
    },
    [CTA_ID]: { label: 'View projects', href: '#projects' },
    [CARD1_ID]: {
      title: 'Portfolio Maker',
      description: 'Visual layout builder for personal sites',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    },
    [CARD2_ID]: {
      title: 'API Gateway',
      description: 'Typed FastAPI services with Mongo persistence',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    },
    [FOOTER_COPY_ID]: { text: '© 2026 Alex Dev' },
    [FOOTER_LINK_ID]: { label: 'GitHub', href: 'https://github.com' },
  },
};
