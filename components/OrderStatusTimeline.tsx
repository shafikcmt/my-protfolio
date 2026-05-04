'use client'

const orderSteps = [
  { key: 'pending', label: 'Pending', help: 'Request received' },
  { key: 'discussing', label: 'Discussing', help: 'Requirement review' },
  { key: 'accepted', label: 'Accepted', help: 'Project approved' },
  { key: 'in_progress', label: 'In Progress', help: 'Development running' },
  { key: 'testing', label: 'Testing', help: 'QA and review' },
  { key: 'delivered', label: 'Delivered', help: 'Delivery shared' },
  { key: 'completed', label: 'Completed', help: 'Project finished' },
]

const bookingSteps = [
  { key: 'pending', label: 'Pending', help: 'Request submitted' },
  { key: 'approved', label: 'Approved', help: 'Slot confirmed' },
  { key: 'completed', label: 'Completed', help: 'Session done' },
]

function normalizeStatus(status?: string) {
  if (!status) return 'pending'
  if (status === 'in-progress') return 'in_progress'
  if (status === 'requested') return 'pending'
  if (status === 'confirmed') return 'approved'
  return status
}

interface TimelineProps {
  status?: string
  type?: 'order' | 'booking'
}

export default function OrderStatusTimeline({ status = 'pending', type = 'order' }: TimelineProps) {
  const currentStatus = normalizeStatus(status)
  const steps = type === 'booking' ? bookingSteps : orderSteps
  const currentIndex = steps.findIndex((step) => step.key === currentStatus)
  const isNegative = currentStatus === 'cancelled' || currentStatus === 'rejected'

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-dark-800/70">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-gray-900 dark:text-white">{type === 'booking' ? 'Booking Timeline' : 'Project Timeline'}</p>
        {isNegative && <span className="text-xs font-semibold text-red-600 dark:text-red-300">{currentStatus.replace('_', ' ')}</span>}
      </div>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {steps.map((step, index) => {
          const active = !isNegative && index <= currentIndex
          const current = !isNegative && index === currentIndex
          return (
            <div key={step.key} className="relative">
              <div className={`rounded-2xl border p-3 ${active ? 'border-primary-500/40 bg-primary-500/10' : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-dark-900/60'}`}>
                <div className={`mb-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${active ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                  {active ? '✓' : index + 1}
                </div>
                <p className={`text-xs font-bold ${current ? 'text-primary-600 dark:text-primary-300' : 'text-gray-900 dark:text-white'}`}>{step.label}</p>
                <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{step.help}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
