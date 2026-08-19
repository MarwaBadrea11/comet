import { useState, useEffect } from 'react'
import { Calendar, Clock } from 'lucide-react'
import { APP_TIME_ZONE, zonedTimeToUtc, getDatePartsInZone } from '../../lib/timezone'

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
      // Display the picked instant as Damascus wall-clock time, not the device's local time.
      const parts = getDatePartsInZone(value, APP_TIME_ZONE)
      setDateStr(`${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`)
      setTimeStr(`${String(parts.hour).padStart(2, '0')}:${String(parts.minute).padStart(2, '0')}`)
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

    // The picker's date/time inputs are always wall-clock Damascus time.
    const newDate = zonedTimeToUtc(year, month, day, hours, minutes, APP_TIME_ZONE)

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

  // Get min date string for date input, expressed in Damascus's current date.
  const getMinDateStr = () => {
    const parts = getDatePartsInZone(minDate, APP_TIME_ZONE)
    return `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`
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
          Scheduled for: {value.toLocaleString('en-US', { timeZone: APP_TIME_ZONE, dateStyle: 'medium', timeStyle: 'short' })} (Damascus time)
        </p>
      )}
    </div>
  )
}
