import { toast } from "sonner"
import { useCallback, useMemo } from "react"

export function useAppToast() {
  const success = useCallback((message: string, description?: string) => {
    toast.success(message, { description })
  }, [])

  const error = useCallback((message: string, description?: string) => {
    toast.error(message, { description })
  }, [])

  const info = useCallback((message: string, description?: string) => {
    toast.info(message, { description })
  }, [])

  const warning = useCallback((message: string, description?: string) => {
    toast.warning(message, { description })
  }, [])

  return useMemo(() => ({
    success,
    error,
    info,
    warning,
    toast // expose direct access if needed
  }), [success, error, info, warning])
}
