// API configuration
const API_BASE_URL = 'http://localhost:8000/api'

import type { Employee, Project, Receipt, ExpenseItem } from './types'

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
  }

  // Handle empty responses (e.g., DELETE requests)
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T
  }

  return response.json()
}

// API utility functions
export const apiClient = {
  // Ping endpoint
  async ping(): Promise<{ pong: number }> {
    return apiRequest<{ pong: number }>('/ping/')
  },

  // Employee endpoints
  async getEmployees(): Promise<Employee[]> {
    return apiRequest<Employee[]>('/employees/')
  },

  async getEmployee(id: number): Promise<Employee> {
    return apiRequest<Employee>(`/employees/${id}/`)
  },

  async createEmployee(data: Omit<Employee, 'id'>): Promise<Employee> {
    return apiRequest<Employee>('/employees/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateEmployee(id: number, data: Partial<Employee>): Promise<Employee> {
    return apiRequest<Employee>(`/employees/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async deleteEmployee(id: number): Promise<void> {
    await apiRequest<void>(`/employees/${id}/`, {
      method: 'DELETE',
    })
  },

  // Project endpoints
  async getProjects(): Promise<Project[]> {
    return apiRequest<Project[]>('/projects/')
  },

  async getProject(id: number): Promise<Project> {
    return apiRequest<Project>(`/projects/${id}/`)
  },

  async createProject(data: Omit<Project, 'id' | 'total'>): Promise<Project> {
    return apiRequest<Project>('/projects/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateProject(id: number, data: Partial<Project>): Promise<Project> {
    return apiRequest<Project>(`/projects/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async deleteProject(id: number): Promise<void> {
    await apiRequest<void>(`/projects/${id}/`, {
      method: 'DELETE',
    })
  },

  // Receipt endpoints
  async getReceipts(): Promise<Receipt[]> {
    return apiRequest<Receipt[]>('/receipts/')
  },

  async getReceipt(id: number): Promise<Receipt> {
    return apiRequest<Receipt>(`/receipts/${id}/`)
  },

  async createReceipt(data: Omit<Receipt, 'id' | 'total' | 'date' | 'project_name' | 'employee_name'>): Promise<Receipt> {
    return apiRequest<Receipt>('/receipts/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateReceipt(id: number, data: Partial<Receipt>): Promise<Receipt> {
    return apiRequest<Receipt>(`/receipts/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async deleteReceipt(id: number): Promise<void> {
    await apiRequest<void>(`/receipts/${id}/`, {
      method: 'DELETE',
    })
  },

  // ExpenseItem endpoints
  async getExpenseItems(): Promise<ExpenseItem[]> {
    return apiRequest<ExpenseItem[]>('/expenses/')
  },

  async getExpenseItem(id: number): Promise<ExpenseItem> {
    return apiRequest<ExpenseItem>(`/expenses/${id}/`)
  },

  async createExpenseItem(data: Omit<ExpenseItem, 'id'>): Promise<ExpenseItem> {
    return apiRequest<ExpenseItem>('/expenses/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateExpenseItem(id: number, data: Partial<ExpenseItem>): Promise<ExpenseItem> {
    return apiRequest<ExpenseItem>(`/expenses/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async deleteExpenseItem(id: number): Promise<void> {
    await apiRequest<void>(`/expenses/${id}/`, {
      method: 'DELETE',
    })
  },
}

export default apiClient
