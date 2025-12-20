import { useState, useEffect } from 'react'
import './App.css'
import { apiClient } from './api'
import { EmployeeForm } from './components/EmployeeForm'
import { ProjectForm } from './components/ProjectForm'
import { ReceiptForm } from './components/ReceiptForm'
import { ExpenseItemForm } from './components/ExpenseItemForm'
import type { Employee, Project, Receipt, ExpenseItem } from './types'

type View = 'employees' | 'projects' | 'receipts' | 'expenses'

function App() {
  const [currentView, setCurrentView] = useState<View>('employees')

  // Data states
  const [employees, setEmployees] = useState<Employee[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([])

  // Form states
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>()
  const [editingProject, setEditingProject] = useState<Project | undefined>()
  const [editingReceipt, setEditingReceipt] = useState<Receipt | undefined>()
  const [editingExpenseItem, setEditingExpenseItem] = useState<ExpenseItem | undefined>()
  const [showForm, setShowForm] = useState(false)

  // Load data when view changes
  useEffect(() => {
    if (currentView === 'employees') {
      apiClient.getEmployees().then(setEmployees).catch(console.error)
    } else if (currentView === 'projects') {
      apiClient.getProjects().then(setProjects).catch(console.error)
    } else if (currentView === 'receipts') {
      apiClient.getReceipts().then(setReceipts).catch(console.error)
    } else if (currentView === 'expenses') {
      apiClient.getExpenseItems().then(setExpenseItems).catch(console.error)
    }
  }, [currentView])

  const handleDelete = async (type: View, id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      if (type === 'employees') {
        await apiClient.deleteEmployee(id)
        setEmployees(employees.filter(e => e.id !== id))
      } else if (type === 'projects') {
        await apiClient.deleteProject(id)
        setProjects(projects.filter(p => p.id !== id))
      } else if (type === 'receipts') {
        await apiClient.deleteReceipt(id)
        setReceipts(receipts.filter(r => r.id !== id))
      } else if (type === 'expenses') {
        await apiClient.deleteExpenseItem(id)
        setExpenseItems(expenseItems.filter(e => e.id !== id))
      }
    } catch (error) {
      alert(`Error deleting: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingEmployee(undefined)
    setEditingProject(undefined)
    setEditingReceipt(undefined)
    setEditingExpenseItem(undefined)
    // Reload data
    if (currentView === 'employees') {
      apiClient.getEmployees().then(setEmployees).catch(console.error)
    } else if (currentView === 'projects') {
      apiClient.getProjects().then(setProjects).catch(console.error)
    } else if (currentView === 'receipts') {
      apiClient.getReceipts().then(setReceipts).catch(console.error)
    } else if (currentView === 'expenses') {
      apiClient.getExpenseItems().then(setExpenseItems).catch(console.error)
    }
  }

  const renderContent = () => {
    if (showForm) {
      if (currentView === 'employees') {
        return (
          <EmployeeForm
            employee={editingEmployee}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false)
              setEditingEmployee(undefined)
            }}
          />
        )
      } else if (currentView === 'projects') {
        return (
          <ProjectForm
            project={editingProject}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false)
              setEditingProject(undefined)
            }}
          />
        )
      } else if (currentView === 'receipts') {
        return (
          <ReceiptForm
            receipt={editingReceipt}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false)
              setEditingReceipt(undefined)
            }}
          />
        )
      } else if (currentView === 'expenses') {
        return (
          <ExpenseItemForm
            expenseItem={editingExpenseItem}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false)
              setEditingExpenseItem(undefined)
            }}
          />
        )
      }
    }

    switch (currentView) {
      case 'employees':
        return (
          <div>
            <div className="header-actions">
              <h2>Employees</h2>
              <button onClick={() => {
                setEditingEmployee(undefined)
                setShowForm(true)
              }}>+ Add Employee</button>
            </div>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.id}>
                      <td>{emp.id}</td>
                      <td>{emp.name}</td>
                      <td>{emp.age}</td>
                      <td>
                        <button onClick={() => {
                          setEditingEmployee(emp)
                          setShowForm(true)
                        }}>Edit</button>
                        <button onClick={() => emp.id && handleDelete('employees', emp.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      case 'projects':
        return (
          <div>
            <div className="header-actions">
              <h2>Projects</h2>
              <button onClick={() => {
                setEditingProject(undefined)
                setShowForm(true)
              }}>+ Add Project</button>
            </div>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(proj => (
                    <tr key={proj.id}>
                      <td>{proj.id}</td>
                      <td>{proj.name}</td>
                      <td>{proj.description}</td>
                      <td>${proj.total?.toFixed(2) || '0.00'}</td>
                      <td>
                        <button onClick={() => {
                          setEditingProject(proj)
                          setShowForm(true)
                        }}>Edit</button>
                        <button onClick={() => proj.id && handleDelete('projects', proj.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      case 'receipts':
        return (
          <div>
            <div className="header-actions">
              <h2>Receipts</h2>
              <button onClick={() => {
                setEditingReceipt(undefined)
                setShowForm(true)
              }}>+ Add Receipt</button>
            </div>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Employee</th>
                    <th>Project</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.map(rec => (
                    <tr key={rec.id}>
                      <td>{rec.id}</td>
                      <td>{rec.employee_name}</td>
                      <td>{rec.project_name}</td>
                      <td>{rec.date}</td>
                      <td>${rec.total?.toFixed(2) || '0.00'}</td>
                      <td>
                        <button onClick={() => {
                          setEditingReceipt(rec)
                          setShowForm(true)
                        }}>Edit</button>
                        <button onClick={() => rec.id && handleDelete('receipts', rec.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      case 'expenses':
        return (
          <div>
            <div className="header-actions">
              <h2>Expense Items</h2>
              <button onClick={() => {
                setEditingExpenseItem(undefined)
                setShowForm(true)
              }}>+ Add Expense Item</button>
            </div>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Item</th>
                    <th>Price</th>
                    <th>VAT %</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseItems.map(exp => (
                    <tr key={exp.id}>
                      <td>{exp.id}</td>
                      <td>{exp.item}</td>
                      <td>${exp.price}</td>
                      <td>{exp.VAT}%</td>
                      <td>{exp.quantity}</td>
                      <td>
                        <button onClick={() => {
                          setEditingExpenseItem(exp)
                          setShowForm(true)
                        }}>Edit</button>
                        <button onClick={() => exp.id && handleDelete('expenses', exp.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
    }
  }

  return (
    <>
      <div className="app-container">
        <h1>Tax Legal Management System</h1>
        
        <nav className="main-nav">
          <button 
            className={currentView === 'employees' ? 'active' : ''} 
            onClick={() => {
              setCurrentView('employees')
              setShowForm(false)
            }}
          >
            Employees
          </button>
          <button 
            className={currentView === 'projects' ? 'active' : ''} 
            onClick={() => {
              setCurrentView('projects')
              setShowForm(false)
            }}
          >
            Projects
          </button>
          <button 
            className={currentView === 'receipts' ? 'active' : ''} 
            onClick={() => {
              setCurrentView('receipts')
              setShowForm(false)
            }}
          >
            Receipts
          </button>
          <button 
            className={currentView === 'expenses' ? 'active' : ''} 
            onClick={() => {
              setCurrentView('expenses')
              setShowForm(false)
            }}
          >
            Expenses
          </button>
        </nav>

        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </>
  )
}

export default App
