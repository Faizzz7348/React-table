import React, { createContext, useContext, useState, useEffect } from 'react'

const EditModeContext = createContext()

export function useEditMode() {
  const context = useContext(EditModeContext)
  if (!context) {
    throw new Error('useEditMode must be used within an EditModeProvider')
  }
  return context
}

export function EditModeProvider({ children }) {
  const [isEditMode, setIsEditMode] = useState(() => {
    const savedMode = localStorage.getItem('editMode')
    return savedMode === 'true'
  })

  useEffect(() => {
    localStorage.setItem('editMode', isEditMode)
  }, [isEditMode])

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
  }

  return (
    <EditModeContext.Provider value={{ isEditMode, toggleEditMode }}>
      {children}
    </EditModeContext.Provider>
  )
}
