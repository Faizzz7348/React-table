import React from 'react'
import Header from './components/Header'
import DataTable from './components/DataTable'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <div className="content">
        <h1>Data Table with Advanced Features</h1>
        <DataTable />
      </div>
    </div>
  )
}

export default App
