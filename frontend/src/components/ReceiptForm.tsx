import { useState, FormEvent, useEffect } from 'react'
import { apiClient } from '../api'
import type { Receipt, Employee, Project } from '../types'

interface ReceiptFormProps {
  receipt?: Receipt
  onSuccess?: () => void
  onCancel?: () => void
}

export function ReceiptForm({ receipt, onSuccess, onCancel }: ReceiptFormProps) {
  const [employeeId, setEmployeeId] = useState(receipt?.employee?.toString() || '')
  const [projectId, setProjectId] = useState(receipt?.project?.toString() || '')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      apiClient.getEmployees().then(setEmployees),
      apiClient.getProjects().then(setProjects),
    ]).catch(console.error)
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const data = {
        employee: parseInt(employeeId, 10),
        project: parseInt(projectId, 10),
      }

      if (receipt?.id) {
        await apiClient.updateReceipt(receipt.id, data)
      } else {
        await apiClient.createReceipt(data)
      }

      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="receipt-form">
      <h2>{receipt ? 'Edit Receipt' : 'Create Receipt'}</h2>
      
      {error && <div className="error">{error}</div>}

      <div className="form-group">
        <label htmlFor="employee">Employee:</label>
        <select
          id="employee"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
        >
          <option value="">Select an employee</option>
          {employees.map(employee => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="project">Project:</label>
        <select
          id="project"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          required
        >
          <option value="">Select a project</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : receipt ? 'Update' : 'Create'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={isLoading}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

