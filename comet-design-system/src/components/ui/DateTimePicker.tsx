import { useState, useEffect } from 'react'
import { Calendar, Clock } from 'lucide-react'

interface DateTimePickerProps {
  value?: Date
  onChange: (date: Date | undefined) => void
  minDate?: Date
  label?: string
  placeholder?: string
}

export function DateTimePicker({
  value,
  onChange,
  minDate = new Date(),
  label = 'Schedule for',
}: DateTimePickerProps) {
  const [dateStr, setDateStr] = useState('')
  const [timeStr, setTimeStr] = useState('')

  useEffect(() => {
    if (value) {
      // Format date as YYYY-MM-DD
      const year = value.getFullYear()
      const month = String(value.getMonth() + 1).padStart(2, '0')
      const day = String(value.getDate()).padStart(2, '0')
      setDateStr(`${year}-${month}-${day}`)

      // Format time as HH:MM
      const hours = String(value.getHours()).padStart(2, '0')
      const minutes = String(value.getMinutes()).padStart(2, '0')
      setTimeStr(`${hours}:${minutes}`)
    }
  }, [value])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateStr = e.target.value
    setDateStr(newDateStr)
    updateDateTime(newDateStr, timeStr)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTimeStr = e.target.value
    setTimeStr(newTimeStr)
    updateDateTime(dateStr, newTimeStr)
  }

  const updateDateTime = (date: string, time: string) => {
    if (!date || !time) {
      onChange(undefined)
      return
    }

    const [year, month, day] = date.split('-').map(Number)
    const [hours, minutes] = time.split(':').map(Number)

    const newDate = new Date(year, month - 1, day, hours, minutes)

    // Check if the date is valid and not in the past
    if (newDate.getTime() < minDate.getTime()) {
      return
    }

    onChange(newDate)
  }

  const handleClear = () => {
    setDateStr('')
    setTimeStr('')
    onChange(undefined)
  }

  // Get min date string for date input
  const getMinDateStr = () => {
    const year = minDate.getFullYear()
    const month = String(minDate.getMonth() + 1).padStart(2, '0')
    const day = String(minDate.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-on-surface">{label}</label>
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
          <input
            type="date"
            value={dateStr}
            onChange={handleDateChange}
            min={getMinDateStr()}
            className="w-full pl-10 pr-3 py-2.5 bg-surface-container rounded-xl border border-outline-variant/20 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Select date"
          />
        </div>
        <div className="flex-1 relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
          <input
            type="time"
            value={timeStr}
            onChange={handleTimeChange}
            className="w-full pl-10 pr-3 py-2.5 bg-surface-container rounded-xl border border-outline-variant/20 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Select time"
          />
        </div>
        {value && (
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm text-error hover:bg-error/10 rounded-xl transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      {value && (
        <p className="text-xs text-on-surface-variant">
          Scheduled for: {value.toLocaleString()}
        </p>
      )}
    </div>
  )
}
