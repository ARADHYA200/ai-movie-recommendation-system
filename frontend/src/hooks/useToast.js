import { useCallback, useEffect, useState } from "react"

export default function useToast(duration = 3000) {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type })
  }, [])

  const clearToast = useCallback(() => {
    setToast(null)
  }, [])

  useEffect(() => {
    if (!toast) {
      return undefined
    }

    const timeout = window.setTimeout(() => {
      setToast(null)
    }, duration)

    return () => window.clearTimeout(timeout)
  }, [toast, duration])

  return { toast, showToast, clearToast }
}
