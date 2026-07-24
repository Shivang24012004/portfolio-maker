from app.models.layout_type import LayoutType

ContentSlots: dict[LayoutType, tuple[str, ...]] = {
    LayoutType.SECTION_TITLE: ("text",),
    LayoutType.SMALL_TEXT: ("text",),
    LayoutType.LONG_TEXT: ("text",),
    LayoutType.IMAGE: ("src", "alt"),
    LayoutType.ICON: ("name",),
    LayoutType.BUTTON: ("label", "href"),
    LayoutType.LINK: ("label", "href"),
    LayoutType.CARD: ("title", "description", "image"),
    LayoutType.CAROUSEL: ("items",),
    LayoutType.PAGE: (),
    LayoutType.CONTAINER: (),
    LayoutType.NAVBAR: (),
    LayoutType.FOOTER: (),
    LayoutType.ROW: (),
    LayoutType.COLUMN: (),
    LayoutType.GRID: (),
    LayoutType.DIVIDER: (),
    LayoutType.SPACER: (),
}