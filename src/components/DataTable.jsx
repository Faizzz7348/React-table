import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { 
  ArrowUpDown, 
  Filter, 
  Eye, 
  EyeOff, 
  Link2, 
  Image, 
  Info, 
  Power,
  Edit,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import lightGallery from 'lightgallery'
import 'lightgallery/css/lightgallery.css'
import { useEditMode } from '../context/EditModeContext'
import './DataTable.css'

// Mock data generator
const generateMockData = (count = 50) => {
  const routes = ['Route A', 'Route B', 'Route C', 'Route D', 'Route E']
  const deliveries = ['Express', 'Standard', 'Economy', 'Premium']
  const images = [
    'https://picsum.photos/400/300?random=1',
    'https://picsum.photos/400/300?random=2',
    'https://picsum.photos/400/300?random=3',
    'https://picsum.photos/400/300?random=4',
    'https://picsum.photos/400/300?random=5'
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    code: `CODE-${String(i + 1).padStart(4, '0')}`,
    name: `Item ${i + 1}`,
    delivery: deliveries[Math.floor(Math.random() * deliveries.length)],
    route: routes[Math.floor(Math.random() * routes.length)],
    kilometer: Math.floor(Math.random() * 500) + 10,
    image: images[Math.floor(Math.random() * images.length)],
    active: Math.random() > 0.3
  }))
}

// Editable Cell Component
const EditableCell = ({ value, onSave, type = 'text', options = [], isEditMode }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if (type === 'text') {
        inputRef.current.select()
      }
    }
  }, [isEditing, type])

  const handleSave = () => {
    onSave(editValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const handleClick = () => {
    if (isEditMode) {
      setIsEditing(true)
    }
  }

  if (isEditing) {
    if (type === 'select') {
      return (
        <div className="editable-cell editing">
          <select
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="editable-select"
          >
            {options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )
    }

    return (
      <div className="editable-cell editing">
        <input
          ref={inputRef}
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="editable-input"
        />
      </div>
    )
  }

  return (
    <div className={`editable-cell ${!isEditMode ? 'read-only' : ''}`} onClick={handleClick}>
      <span className="editable-value">{value}</span>
      {isEditMode && <Edit size={12} className="edit-icon" />}
    </div>
  )
}

// Sortable Row Component
const SortableRow = ({ item, index, indexOfFirstItem, visibleColumns, showInfo, togglePower, onUpdateCell, isEditMode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <tr ref={setNodeRef} style={style} className={isDragging ? 'dragging' : ''}>
      {visibleColumns.no && (
        <td>
          <div className="no-cell">
            <span {...attributes} {...listeners} className="drag-handle">
              <GripVertical size={16} />
            </span>
            {indexOfFirstItem + index + 1}
          </div>
        </td>
      )}
      {visibleColumns.code && (
        <td>
          <EditableCell
            value={item.code}
            onSave={(value) => onUpdateCell(item.id, 'code', value)}
            type="text"
            isEditMode={isEditMode}
          />
        </td>
      )}
      {visibleColumns.name && (
        <td>
          <EditableCell
            value={item.name}
            onSave={(value) => onUpdateCell(item.id, 'name', value)}
            type="text"
            isEditMode={isEditMode}
          />
        </td>
      )}
      {visibleColumns.delivery && (
        <td>
          <EditableCell
            value={item.delivery}
            onSave={(value) => onUpdateCell(item.id, 'delivery', value)}
            type="select"
            options={['Express', 'Standard', 'Economy', 'Premium']}
            isEditMode={isEditMode}
          />
        </td>
      )}
      {visibleColumns.route && (
        <td>
          <EditableCell
            value={item.route}
            onSave={(value) => onUpdateCell(item.id, 'route', value)}
            type="select"
            options={['Route A', 'Route B', 'Route C', 'Route D', 'Route E']}
            isEditMode={isEditMode}
          />
        </td>
      )}
      {visibleColumns.kilometer && (
        <td>
          <EditableCell
            value={item.kilometer}
            onSave={(value) => onUpdateCell(item.id, 'kilometer', parseInt(value) || 0)}
            type="number"
            isEditMode={isEditMode}
          />
        </td>
      )}
      {visibleColumns.action && (
        <td>
          <div className="action-buttons">
            <a
              href={item.image}
              className="action-btn gallery-item"
              data-src={item.image}
            >
              <Image size={16} />
            </a>
            <button
              className="action-btn"
              onClick={() => showInfo(item)}
            >
              <Info size={16} />
            </button>
            <button
              className={`action-btn power-btn ${item.active ? 'active' : ''}`}
              onClick={() => togglePower(item.id)}
            >
              <Power size={16} />
            </button>
          </div>
        </td>
      )}
    </tr>
  )
}

const DataTable = () => {
  const { isEditMode } = useEditMode()
  const [data, setData] = useState(generateMockData())
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [filterText, setFilterText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [visibleColumns, setVisibleColumns] = useState({
    no: true,
    code: true,
    name: true,
    delivery: true,
    route: true,
    kilometer: true,
    action: true
  })
  const [showColumnMenu, setShowColumnMenu] = useState(false)
  const [showSortTooltip, setShowSortTooltip] = useState(false)
  const galleryRef = useRef(null)
  const lgInstance = useRef(null)

  // DnD Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Initialize lightGallery
  useEffect(() => {
    if (galleryRef.current && !lgInstance.current) {
      lgInstance.current = lightGallery(galleryRef.current, {
        speed: 500,
        selector: '.gallery-item'
      })
    }

    return () => {
      if (lgInstance.current) {
        lgInstance.current.destroy()
        lgInstance.current = null
      }
    }
  }, [])

  // Filter and sort data with useMemo
  const filteredData = useMemo(() => {
    let result = data.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(filterText.toLowerCase())
      )
    )

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    return result
  }, [filterText, data, sortConfig])

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Sort handler
  const handleSort = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        // First click was asc, now go to desc
        setSortConfig({ key, direction: 'desc' })
      } else if (sortConfig.direction === 'desc') {
        // Second click was desc, now reset to no sort
        setSortConfig({ key: null, direction: 'asc' })
      }
    } else {
      // New column, start with asc
      setSortConfig({ key, direction: 'asc' })
    }
  }

  // Update cell value (inline editing)
  const handleUpdateCell = (id, field, value) => {
    setData(data.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  // Drag and drop handler
  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = currentItems.findIndex((item) => item.id === active.id)
      const newIndex = currentItems.findIndex((item) => item.id === over.id)
      
      const newCurrentItems = arrayMove(currentItems, oldIndex, newIndex)
      
      // Update the main data array
      const newData = [...data]
      newCurrentItems.forEach((item) => {
        const dataIndex = newData.findIndex(d => d.id === item.id)
        if (dataIndex !== -1) {
          newData[dataIndex] = { ...item }
        }
      })
      setData(newData)
    }
  }

  // Toggle power status
  const togglePower = (id) => {
    setData(data.map(item =>
      item.id === id ? { ...item, active: !item.active } : item
    ))
  }

  // Show info
  const showInfo = (item) => {
    alert(`Info for ${item.name}:\nCode: ${item.code}\nDelivery: ${item.delivery}\nRoute: ${item.route}\nKilometer: ${item.kilometer}`)
  }

  // Generate shareable link
  const generateLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    alert('Link copied to clipboard!')
  }

  // Toggle column visibility
  const toggleColumn = (column) => {
    setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }))
  }

  // Calculate totals
  const totalKilometer = filteredData.reduce((sum, item) => sum + item.kilometer, 0)

  return (
    <div className="data-table-container">
      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="toolbar-left">
          <div className="filter-container">
            <Filter size={18} />
            <input
              type="text"
              placeholder="Filter table..."
              value={filterText}
              onChange={(e) => {
                setFilterText(e.target.value)
                setCurrentPage(1)
              }}
              className="filter-input"
            />
          </div>
        </div>
        <div className="toolbar-right">
          {/* Sort Button */}
          <div className="sort-button-container">
            <button
              className="toolbar-btn"
              onClick={() => {
                setShowSortTooltip(true)
                setTimeout(() => setShowSortTooltip(false), 2000)
              }}
            >
              {sortConfig.key === null ? (
                <ArrowUpDown size={18} />
              ) : sortConfig.direction === 'asc' ? (
                <ArrowUp size={18} />
              ) : (
                <ArrowDown size={18} />
              )}
            </button>
            {showSortTooltip && (
              <div className="sort-tooltip">
                Click the column to sort
              </div>
            )}
          </div>

          <div className="column-visibility">
            <button
              className="toolbar-btn"
              onClick={() => setShowColumnMenu(!showColumnMenu)}
            >
              {showColumnMenu ? <EyeOff size={18} /> : <Eye size={18} />}
              <span>Columns</span>
            </button>
            {showColumnMenu && (
              <div className="column-menu">
                {Object.keys(visibleColumns).map(col => (
                  <label key={col} className="column-item">
                    <input
                      type="checkbox"
                      checked={visibleColumns[col]}
                      onChange={() => toggleColumn(col)}
                    />
                    <span>{col.charAt(0).toUpperCase() + col.slice(1)}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <button className="toolbar-btn" onClick={generateLink}>
            <Link2 size={18} />
            <span>Generate Link</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper" ref={galleryRef}>
        <table className="data-table">
          <thead>
            <tr>
              {visibleColumns.no && <th style={{ width: '60px', textAlign: 'center' }}>No</th>}
              {visibleColumns.code && (
                <th onClick={() => handleSort('code')} className="sortable">
                  <div className="th-content">
                    Code
                    <ArrowUpDown size={16} />
                  </div>
                </th>
              )}
              {visibleColumns.name && (
                <th onClick={() => handleSort('name')} className="sortable">
                  <div className="th-content">
                    Name
                    <ArrowUpDown size={16} />
                  </div>
                </th>
              )}
              {visibleColumns.delivery && (
                <th onClick={() => handleSort('delivery')} className="sortable">
                  <div className="th-content">
                    Delivery
                    <ArrowUpDown size={16} />
                  </div>
                </th>
              )}
              {visibleColumns.route && (
                <th onClick={() => handleSort('route')} className="sortable">
                  <div className="th-content">
                    Route
                    <ArrowUpDown size={16} />
                  </div>
                </th>
              )}
              {visibleColumns.kilometer && (
                <th onClick={() => handleSort('kilometer')} className="sortable">
                  <div className="th-content">
                    Kilometer
                    <ArrowUpDown size={16} />
                  </div>
                </th>
              )}
              {visibleColumns.action && <th style={{ width: '200px' }}>Action</th>}
            </tr>
          </thead>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={currentItems.map(item => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <tbody>
                {currentItems.map((item, index) => (
                  <SortableRow
                    key={item.id}
                    item={item}
                    index={index}
                    indexOfFirstItem={indexOfFirstItem}
                    visibleColumns={visibleColumns}
                    showInfo={showInfo}
                    togglePower={togglePower}
                    onUpdateCell={handleUpdateCell}
                    isEditMode={isEditMode}
                  />
                ))}
              </tbody>
            </SortableContext>
          </DndContext>

          {/* Footer */}
          <tfoot>
            <tr className="footer-row">
              <td colSpan={visibleColumns.kilometer ? 
                Object.values(visibleColumns).filter(v => v).length - 2 : 
                Object.values(visibleColumns).filter(v => v).length - 1
              } className="footer-label">
                <strong>Total:</strong>
              </td>
              {visibleColumns.kilometer && (
                <td className="footer-total">
                  <strong>{totalKilometer} km</strong>
                </td>
              )}
              {visibleColumns.action && <td></td>}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <div className="pagination-info">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
        </div>
        <div className="pagination-buttons">
          <button
            className="page-btn"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={18} />
            Previous
          </button>
          
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1
            // Show first, last, current, and adjacent pages
            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
            ) {
              return (
                <button
                  key={pageNum}
                  className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              )
            } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
              return <span key={pageNum} className="page-ellipsis">...</span>
            }
            return null
          })}
          
          <button
            className="page-btn"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataTable
