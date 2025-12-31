import { useState, FormEvent, useEffect } from 'react'
import { apiClient } from '../api'
import type { Project, Employee } from '../types'

interface ProjectFormProps {
  project?: Project
  onSuccess?: () => void
  onCancel?: () => void
}

export function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const [name, setName] = useState(project?.name || '')
  const [description, setDescription] = useState(project?.description || '')
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>(project?.employees || [])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiClient.getEmployees().then(setEmployees).catch(console.error)
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const data = {
        name,
        description,
        employees: selectedEmployees,
      }

      if (project?.id) {
        await apiClient.updateProject(project.id, data)
      } else {
        await apiClient.createProject(data)
      }

      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleEmployee = (employeeId: number) => {
    setSelectedEmployees(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    )
  }

  return (
    <form onSubmit={handleSubmit} className="project-form">
      <h2>{project ? 'Edit Project' : 'Create Project'}</h2>
      
      {error && <div className="error">{error}</div>}

      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={100}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Employees:</label>
        <div className="checkbox-group">
          {employees.map(employee => (
            <label key={employee.id} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedEmployees.includes(employee.id!)}
                onChange={() => employee.id && toggleEmployee(employee.id)}
              />
              {employee.name}
            </label>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : project ? 'Update' : 'Create'}
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

