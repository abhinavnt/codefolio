
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"



const ErrorBoundary = ({
    error,
    reset,
  }: {
    error: Error & { digest?: string }
    reset: () => void
  }) => {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
      }, [error])
  return(
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
      <div className="mb-6 text-red-500">
        <AlertCircle className="w-16 h-16 mx-auto" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="default">
          Try again
        </Button>
        <Button onClick={() => (window.location.href = "/")} variant="outline">
          Go to homepage
        </Button>
      </div>
      {error?.digest ? <p className="mt-4 text-xs text-muted-foreground">Error ID: {error.digest}</p> : null}
    </div>
  )
}

export default ErrorBoundary
