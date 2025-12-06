import React, { useState } from 'react'
import { X, Save, Edit2 } from 'lucide-react'
import './EditRowModal.css'

const EditRowModal = ({ isOpen, onClose, rowData, onSave }) => {
  const [formData, setFormData] = useState({
    code: rowData?.code || '',
    name: rowData?.name || '',
    delivery: rowData?.delivery || 'Standard',
    route: rowData?.route || 'Route A',
    kilometer: rowData?.kilometer || 0
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(rowData.id, formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Edit2 size={20} />
            <h3>Edit Row</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                placeholder="Enter code..."
              />
            </div>

            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter name..."
              />
            </div>

            <div className="form-group">
              <label>Delivery Type</label>
              <select
                value={formData.delivery}
                onChange={(e) => handleChange('delivery', e.target.value)}
              >
                <option value="Express">Express</option>
                <option value="Standard">Standard</option>
                <option value="Economy">Economy</option>
                <option value="Premium">Premium</option>
              </select>
            </div>

            <div className="form-group">
              <label>Route</label>
              <select
                value={formData.route}
                onChange={(e) => handleChange('route', e.target.value)}
              >
                <option value="Route A">Route A</option>
                <option value="Route B">Route B</option>
                <option value="Route C">Route C</option>
                <option value="Route D">Route D</option>
                <option value="Route E">Route E</option>
              </select>
            </div>

            <div className="form-group">
              <label>Kilometer</label>
              <input
                type="number"
                value={formData.kilometer}
                onChange={(e) => handleChange('kilometer', parseInt(e.target.value) || 0)}
                placeholder="Enter kilometer..."
                min="0"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              <X size={16} />
              Cancel
            </button>
            <button type="submit" className="btn-save">
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditRowModal
