from enum import Enum

class LayoutType(str, Enum):
    PAGE = "Page"
    CONTAINER = "Container"

    NAVBAR = "Navbar"
    FOOTER = "Footer"

    SECTION_TITLE = "SectionTitle"
    SMALL_TEXT = "SmallText"
    LONG_TEXT = "LongText"

    CARD = "Card"
    CAROUSEL = "Carousel"

    BUTTON = "Button"
    LINK = "Link"

    IMAGE = "Image"
    ICON = "Icon"

    ROW = "Row"
    COLUMN = "Column"
    GRID = "Grid"

    DIVIDER = "Divider"
    SPACER = "Spacer"
