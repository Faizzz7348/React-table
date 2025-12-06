# React Data Table with Advanced Features

A comprehensive data table built with React and Vite featuring drag-and-drop, filtering, sorting, pagination, and image gallery.

## 🚀 Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

## ✨ Features

### Table Toolbar
- **🔍 Filter** - Real-time filtering across all columns
- **👁️ Column Visibility** - Toggle any column on/off
- **🔗 Generate Link** - Copy shareable URL

### Table Columns
1. **No** - Row number with drag handle
2. **Code** - Sortable unique identifier
3. **Name** - Sortable item name
4. **Delivery** - Sortable delivery type
5. **Route** - Sortable route information
6. **Kilometer** - Sortable distance with totals
7. **Action** - Interactive buttons:
   - 🖼️ Image gallery (LightGallery)
   - ℹ️ Info popup
   - ⚡ Power toggle

### Key Features
- ✅ Drag & drop row reordering
- ✅ Multi-column sorting
- ✅ Real-time filtering
- ✅ Column visibility controls
- ✅ Footer with totals
- ✅ Pagination with page numbers
- ✅ Responsive design
- ✅ 50 items of mock data

## 🛠️ Technologies

- React 19
- Vite 7
- @dnd-kit (drag & drop)
- LightGallery (image viewer)
- Lucide React (icons)

## 📦 Installation Commands

If you encounter dependency issues, use:

```bash
npm install --legacy-peer-deps
```

Or install packages individually:

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install lightgallery lg-thumbnail lg-zoom
npm install lucide-react
```

## 🎯 Usage

The table component is in `src/components/DataTable.jsx`. Customize by:
- Modifying `generateMockData()` for your data
- Adjusting `itemsPerPage` for pagination
- Editing `DataTable.css` for styling

## 📱 Responsive

Fully responsive with mobile-friendly controls and horizontal scroll on small screens.
