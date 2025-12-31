import { useState, FormEvent, useEffect } from 'react'
import { apiClient } from '../api'
import type { ExpenseItem, Receipt } from '../types'

interface ExpenseItemFormProps {
  expenseItem?: ExpenseItem
  onSuccess?: () => void
  onCancel?: () => void
}

export function ExpenseItemForm({ expenseItem, onSuccess, onCancel }: ExpenseItemFormProps) {
  const [receiptId, setReceiptId] = useState(expenseItem?.receipt?.toString() || '')
  const [item, setItem] = useState(expenseItem?.item || '')
  const [price, setPrice] = useState(expenseItem?.price?.toString() || '')
  const [vat, setVat] = useState(expenseItem?.VAT?.toString() || '')
  const [quantity, setQuantity] = useState(expenseItem?.quantity?.toString() || '1')
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiClient.getReceipts().then(setReceipts).catch(console.error)
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const data = {
        receipt: parseInt(receiptId, 10),
        item,
        price: parseFloat(price),
        VAT: parseFloat(vat),
        quantity: parseInt(quantity, 10),
      }

      if (expenseItem?.id) {
        await apiClient.updateExpenseItem(expenseItem.id, data)
      } else {
        await apiClient.createExpenseItem(data)
      }

      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="expense-item-form">
      <h2>{expenseItem ? 'Edit Expense Item' : 'Create Expense Item'}</h2>
      
      {error && <div className="error">{error}</div>}

      <div className="form-group">
        <label htmlFor="receipt">Receipt:</label>
        <select
          id="receipt"
          value={receiptId}
          onChange={(e) => setReceiptId(e.target.value)}
          required
        >
          <option value="">Select a receipt</option>
          {receipts.map(receipt => (
            <option key={receipt.id} value={receipt.id}>
              {receipt.employee_name} - {receipt.project_name} ({receipt.date})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="item">Item Name:</label>
        <input
          id="item"
          type="text"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          required
          maxLength={100}
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Price:</label>
        <input
          id="price"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="vat">VAT (%):</label>
        <input
          id="vat"
          type="number"
          step="0.01"
          min="0"
          value={vat}
          onChange={(e) => setVat(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="quantity">Quantity:</label>
        <input
          id="quantity"
          type="number"
          min="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : expenseItem ? 'Update' : 'Create'}
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

