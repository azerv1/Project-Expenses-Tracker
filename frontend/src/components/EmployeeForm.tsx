import { useState, FormEvent } from 'react'
import { apiClient } from '../api'
import type { Employee } from '../types'

interface EmployeeFormProps {
  employee?: Employee
  onSuccess?: () => void
  onCancel?: () => void
}

export function EmployeeForm({ employee, onSuccess, onCancel }: EmployeeFormProps) {
  const [name, setName] = useState(employee?.name || '')
  const [age, setAge] = useState(employee?.age?.toString() || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const data = {
        name,
        age: parseInt(age, 10),
      }

      if (employee?.id) {
        await apiClient.updateEmployee(employee.id, data)
      } else {
        await apiClient.createEmployee(data)
      }

      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <h2>{employee ? 'Edit Employee' : 'Create Employee'}</h2>
      
      {error && <div className="error">{error}</div>}

      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={1}
          maxLength={100}
        />
      </div>

      <div className="form-group">
        <label htmlFor="age">Age:</label>
        <input
          id="age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
          min={18}
        />
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : employee ? 'Update' : 'Create'}
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

