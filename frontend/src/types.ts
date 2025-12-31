// TypeScript types for API models

export interface Employee {
  id?: number
  name: string
  age: number
}

export interface Project {
  id?: number
  name: string
  description: string
  employees?: number[] // Array of employee IDs
  total?: number // Calculated field
}

export interface ExpenseItem {
  id?: number
  receipt: number // Receipt ID
  item: string
  price: string | number
  VAT: string | number
  quantity: number
}

export interface Receipt {
  id?: number
  project: number // Project ID
  project_name?: string // Read-only field
  employee: number // Employee ID
  employee_name?: string // Read-only field
  date?: string
  total?: number // Calculated field
}

