![Image of Stock Screener](./bg.png)

# LyteNyte Grid Stock Screener Demo

This demo shows how to build a stock screener using LyteNyte Grid. It’s a fork of the code
used to create the stock screener demo on the [1771 Technologies website](https://www.1771technologies.com/demo).

The demo highlights the flexibility of LyteNyte Grid and some of its key capabilities.

## Overview

The stock screener demo highlights the following key LyteNyte Grid features:

- **Sorting Rows:** Click the arrow icons in a column header or open the [Sort Manager](https://www.1771technologies.com/docs/component-sort-manager)
  dialog to sort rows. You can apply multiple sorts simultaneously.
- **Filtering:** The demo implements filtering via a floating row below the header row.
  Quick filter expressions are supported, and users may also expand a filter configuration
  popover for given columns. The filter popover demonstrates LyteNyte Grid’s
  [Filter Tree](https://www.1771technologies.com/docs/component-filter-tree) feature.
- **Quick Search:** Enter text into the input field to instantly locate matching rows in the grid
  using LyteNyte Grid’s [Quick Search](https://www.1771technologies.com/docs/filtering-quick-search) feature.
- **Row Grouping and Aggregations:** Use the [Pill Manager](https://www.1771technologies.com/docs/component-grid-box) or the
  [Column Manager](https://www.1771technologies.com/docs/component-column-manager) to group rows and calculate aggregations.
  The demo shows the Column Manager in both a side panel and a dialog to highlight flexible layout options.
- **Column Resizing and Autosizing:** You can [resize and move](https://www.1771technologies.com/docs/column-moving) columns.
  [Autosize](https://www.1771technologies.com/docs/column-autosizing) all columns to fit their content with a single action.

Additional demo features include custom cell renderers, copy and paste, cell range selection, row selection,
and context menus. This list isn’t exhaustive. Explore the code to inspire your own implementations and use cases.

> [!Note]
> The stock screener demo doesn’t cover every LyteNyte Grid feature. Other commonly used features not shown include:
>
> - [Column Pivoting](https://www.1771technologies.com/docs/column-pivoting)
> - [Server Data Loading](https://www.1771technologies.com/docs/server-data-loading-overview)
> - [Tree Data](https://www.1771technologies.com/docs/tree-source-overview)
> - [Full Width Rows](https://www.1771technologies.com/docs/row-full-width)
> - [Cell Editing](https://www.1771technologies.com/docs/cell-editing)
> - [Row Dragging](https://www.1771technologies.com/docs/row-dragging)

For details on all LyteNyte Grid features, [click here](https://www.1771technologies.com/pricing?showFeatures=true#lytenyte-features).

## 🚀 Getting Started

The project uses [Vite](https://vite.dev/) for bundling and development.
Vite isn’t required but is our preferred choice. LyteNyte Grid works with Next.js, React Router,
TanStack Start, or any ESM-compatible framework.

To get started, clone the repository:

```sh
git clone https://github.com/1771-Technologies/stock-screen-demo.git
```

Install dependencies and start the dev server:

```sh
pnpm i
pnpm run dev
```

This starts a development server using the standard Vite toolchain. The dev build runs React in development mode,
which is slower than a production build. To test performance, create a production build:

```sh
pnpm run build
pnpm run preview
```

## About the Data

The demo uses a client-side data source with a small subset of real stock
data, located in `src/data.ts`. The dataset is over a year old and
provided for demonstration only. Do not use it for making financial decisions.
