import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
      <Loader2 className="h-16 w-16 animate-spin text-[#CC0000]" />
      <h2 className="text-xl font-medium mt-4">Loading...</h2>
    </div>
  )
}
