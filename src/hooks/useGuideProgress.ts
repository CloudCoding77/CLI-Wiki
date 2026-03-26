import { useState, useCallback } from 'react'

const STORAGE_PREFIX = 'guide-progress:'

function readProgress(guideId: string): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + guideId)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeProgress(guideId: string, completed: number[]) {
  localStorage.setItem(STORAGE_PREFIX + guideId, JSON.stringify(completed))
}

export function useGuideProgress(guideId: string, totalSteps: number) {
  const [completed, setCompleted] = useState<number[]>(() => readProgress(guideId))

  const toggle = useCallback(
    (stepIndex: number) => {
      setCompleted((prev) => {
        const next = prev.includes(stepIndex)
          ? prev.filter((i) => i !== stepIndex)
          : [...prev, stepIndex].sort((a, b) => a - b)
        writeProgress(guideId, next)
        return next
      })
    },
    [guideId]
  )

  const reset = useCallback(() => {
    setCompleted([])
    localStorage.removeItem(STORAGE_PREFIX + guideId)
  }, [guideId])

  const isCompleted = useCallback(
    (stepIndex: number) => completed.includes(stepIndex),
    [completed]
  )

  const percentage = totalSteps > 0 ? Math.round((completed.length / totalSteps) * 100) : 0
  const isDone = completed.length === totalSteps && totalSteps > 0

  return { completed, toggle, reset, isCompleted, percentage, isDone, completedCount: completed.length }
}

/** Read progress for a guide without hooks (for cards) */
export function getGuideProgress(guideId: string): number[] {
  return readProgress(guideId)
}
