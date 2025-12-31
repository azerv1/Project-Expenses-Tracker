import { useState, useEffect } from 'react'
import './App.css'
import { apiClient } from './api'
import { EmployeeForm } from './components/EmployeeForm'
import { ProjectForm } from './components/ProjectForm'
import { ReceiptForm } from './components/ReceiptForm'
import { ExpenseItemForm } from './components/ExpenseItemForm'
import type { Employee, Project, Receipt, ExpenseItem } from './types'

type View = 'employees' | 'projects' | 'receipts' | 'expenses'

type SortDirection = 'asc' | 'desc' | null

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

  // Sorting states
  const [employeeSort, setEmployeeSort] = useState<{ column: string | null; direction: SortDirection }>({ column: null, direction: null })
  const [projectSort, setProjectSort] = useState<{ column: string | null; direction: SortDirection }>({ column: null, direction: null })
  const [receiptSort, setReceiptSort] = useState<{ column: string | null; direction: SortDirection }>({ column: null, direction: null })
  const [expenseSort, setExpenseSort] = useState<{ column: string | null; direction: SortDirection }>({ column: null, direction: null })
  
  // Search state
  const [expenseSearchQuery, setExpenseSearchQuery] = useState<string>('')

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

  // Sorting functions
  const handleSort = (view: View, column: string) => {
    if (view === 'employees') {
      const newDirection = employeeSort.column === column && employeeSort.direction === 'asc' ? 'desc' : 'asc'
      setEmployeeSort({ column, direction: newDirection })
    } else if (view === 'projects') {
      const newDirection = projectSort.column === column && projectSort.direction === 'asc' ? 'desc' : 'asc'
      setProjectSort({ column, direction: newDirection })
    } else if (view === 'receipts') {
      const newDirection = receiptSort.column === column && receiptSort.direction === 'asc' ? 'desc' : 'asc'
      setReceiptSort({ column, direction: newDirection })
    } else if (view === 'expenses') {
      const newDirection = expenseSort.column === column && expenseSort.direction === 'asc' ? 'desc' : 'asc'
      setExpenseSort({ column, direction: newDirection })
    }
  }

  const getSortIcon = (view: View, column: string) => {
    let sortState: { column: string | null; direction: SortDirection }
    if (view === 'employees') sortState = employeeSort
    else if (view === 'projects') sortState = projectSort
    else if (view === 'receipts') sortState = receiptSort
    else sortState = expenseSort

    if (sortState.column !== column) return '⇅'
    if (sortState.direction === 'asc') return '↑'
    if (sortState.direction === 'desc') return '↓'
    return '⇅'
  }

  const sortData = <T,>(data: T[], view: View, getValue: (item: T, column: string) => any): T[] => {
    let sortState: { column: string | null; direction: SortDirection }
    if (view === 'employees') sortState = employeeSort
    else if (view === 'projects') sortState = projectSort
    else if (view === 'receipts') sortState = receiptSort
    else sortState = expenseSort

    if (!sortState.column || !sortState.direction) return data

    return [...data].sort((a, b) => {
      const aVal = getValue(a, sortState.column!)
      const bVal = getValue(b, sortState.column!)
      
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortState.direction === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      
      const numA = typeof aVal === 'number' ? aVal : parseFloat(String(aVal))
      const numB = typeof bVal === 'number' ? bVal : parseFloat(String(bVal))
      
      if (isNaN(numA) || isNaN(numB)) {
        return sortState.direction === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal))
      }
      
      return sortState.direction === 'asc' ? numA - numB : numB - numA
    })
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
        const sortedEmployees = sortData(employees, 'employees', (emp, col) => {
          if (col === 'id') return emp.id
          if (col === 'name') return emp.name
          if (col === 'age') return emp.age
          return null
        })
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
                    <th>
                      <button className="sort-button" onClick={() => handleSort('employees', 'id')}>
                        ID {getSortIcon('employees', 'id')}
                      </button>
                    </th>
                    <th>
                      <button className="sort-button" onClick={() => handleSort('employees', 'name')}>
                        Name {getSortIcon('employees', 'name')}
                      </button>
                    </th>
                    <th>
                      <button className="sort-button" onClick={() => handleSort('employees', 'age')}>
                        Age {getSortIcon('employees', 'age')}
                      </button>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedEmployees.map(emp => (
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
        const sortedProjects = sortData(projects, 'projects', (proj, col) => {
          if (col === 'id') return proj.id
          if (col === 'name') return proj.name
          if (col === 'description') return proj.description
          if (col === 'total') return proj.total || 0
          return null
        })
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
                    <th>
                      <button className="sort-button" onClick={() => handleSort('projects', 'id')}>
                        ID {getSortIcon('projects', 'id')}
                      </button>
                    </th>
                    <th>
                      <button className="sort-button" onClick={() => handleSort('projects', 'name')}>
                        Name {getSortIcon('projects', 'name')}
                      </button>
                    </th>
                    <th>
                      <button className="sort-button" onClick={() => handleSort('projects', 'description')}>
                        Description {getSortIcon('projects', 'description')}
                      </button>
                    </th>
                    <th>
                      <button className="sort-button" onClick={() => handleSort('projects', 'total')}>
                        Total {getSortIcon('projects', 'total')}
                      </button>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProjects.map(proj => (
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
        const sortedReceipts = sortData(receipts, 'receipts', (rec, col) => {
          if (col === 'id') return rec.id
          if (col === 'employee') return rec.employee_name || ''
          if (col === 'project') return rec.project_name || ''
          if (col === 'date') return rec.date || ''
          if (col === 'total') return rec.total || 0
          return null
        })
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
                    <th>
                      <button className="sort-button" onClick={() => handleSort('receipts', 'id')}>
                        ID {getSortIcon('receipts', 'id')}
                      </button>
                    </th>
                    <th>
                      <button className="sort-button" onClick={() => handleSort('receipts', 'employee')}>
                        Employee {getSortIcon('receipts', 'employee')}
                      </button>
                    </th>
                    <th>
                      <button className="sort-button" onClick={() => handleSort('receipts', 'project')}>
                        Project {getSortIcon('receipts', 'project')}
                      </button>
                    </th>
                    <th>
                      <button className="sort-button" onClick={() => handleSort('receipts', 'date')}>
                        Date {getSortIcon('receipts', 'date')}
                      </button>
                    </th>
                    <th>
                      <button className="sort-button" onClick={() => handleSort('receipts', 'total')}>
                        Total {getSortIcon('receipts', 'total')}
                      </button>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedReceipts.map(rec => (
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
        // Filter expenses based on search query
        const filteredExpenses = expenseItems.filter(exp => {
          if (!expenseSearchQuery.trim()) return true
          const query = expenseSearchQuery.toLowerCase()
          return (
            exp.id?.toString().includes(query) ||
            exp.item.toLowerCase().includes(query) ||
            exp.price.toString().includes(query) ||
            exp.VAT.toString().includes(query) ||
            exp.quantity.toString().includes(query)
          )
        })
        
        const sortedExpenses = sortData(filteredExpenses, 'expenses', (exp, col) => {
          if (col === 'id') return exp.id
          if (col === 'item') return exp.item
          if (col === 'price') return typeof exp.price === 'number' ? exp.price : parseFloat(String(exp.price))
          if (col === 'vat') return typeof exp.VAT === 'number' ? exp.VAT : parseFloat(String(exp.VAT))
          if (col === 'quantity') return exp.quantity
          return null
        })
        return (
          <div>
            <div className="header-actions">
              <h2>Expense Items</h2>
              <button onClick={() => {
                setEditingExpenseItem(undefined)
                setShowForm(true)
              }}>+ Add Expense Item</button>
            </div>
            <div className="search-bar-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search expenses by ID, item, price, VAT, or quantity..."
                value={expenseSearchQuery}
                onChange={(e) => setExpenseSearchQuery(e.target.value)}
              />
            </div>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>
                      <button className="sort-button" onClick={() => handleSort('expenses', 'id')}>
                        ID {getSortIcon('expenses', 'id')}
                      </button>
                    </th>
                    <th>
                      <button className="sort-button" onClick={() => handleSort('expenses', 'item')}>
                        Item {getSortIcon('expenses', 'item')}
                      </button>
                    </th>
                    <th>
                      <button className="sort-button" onClick={() => handleSort('expenses', 'price')}>
                        Price {getSortIcon('expenses', 'price')}
                      </button>
                    </th>
                    <th>
                      <button className="sort-button" onClick={() => handleSort('expenses', 'vat')}>
                        VAT % {getSortIcon('expenses', 'vat')}
                      </button>
                    </th>
                    <th>
                      <button className="sort-button" onClick={() => handleSort('expenses', 'quantity')}>
                        Quantity {getSortIcon('expenses', 'quantity')}
                      </button>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedExpenses.map(exp => (
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
              setEmployeeSort({ column: null, direction: null })
            }}
          >
            Employees
          </button>
          <button 
            className={currentView === 'projects' ? 'active' : ''} 
            onClick={() => {
              setCurrentView('projects')
              setShowForm(false)
              setProjectSort({ column: null, direction: null })
            }}
          >
            Projects
          </button>
          <button 
            className={currentView === 'receipts' ? 'active' : ''} 
            onClick={() => {
              setCurrentView('receipts')
              setShowForm(false)
              setReceiptSort({ column: null, direction: null })
            }}
          >
            Receipts
          </button>
          <button 
            className={currentView === 'expenses' ? 'active' : ''} 
            onClick={() => {
              setCurrentView('expenses')
              setShowForm(false)
              setExpenseSort({ column: null, direction: null })
              setExpenseSearchQuery('')
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
