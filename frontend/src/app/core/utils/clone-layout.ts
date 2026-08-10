import { ContentMap, Layout, LayoutData } from '../models/layouts.models';
import { SAMPLE_LAYOUT, SAMPLE_LAYOUT_DATA } from '../data/sample-layout';

function newId(): string {
  return crypto.randomUUID();
}

function remapTree(
  node: Layout,
  idMap: Map<string, string>,
  parentId: string | null,
): Layout {
  const id = newId();
  idMap.set(node.id, id);
  return {
    ...structuredClone(node),
    id,
    parent_id: parentId,
    children: node.children.map((child) => remapTree(child, idMap, id)),
  };
}

/** Fresh UUIDs so each "New portfolio" can be POSTed without 409 conflicts. */
export function createPortfolioSeed(): { layout: Layout; layoutData: LayoutData } {
  const idMap = new Map<string, string>();
  const layout = remapTree(SAMPLE_LAYOUT, idMap, null);

  const content: ContentMap = {};
  for (const [oldId, slots] of Object.entries(SAMPLE_LAYOUT_DATA.content)) {
    const mapped = idMap.get(oldId);
    if (mapped) content[mapped] = structuredClone(slots);
  }

  return {
    layout,
    layoutData: {
      id: newId(),
      layout_id: layout.id,
      version: 1,
      content,
    },
  };
}
