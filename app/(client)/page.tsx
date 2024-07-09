import LatestUpdate from "@/components/LatestUpdate"
import { Suspense } from "react"

const HomePage = () => {
  return (
    <main className="max-w-5xl mx-auto">
      <Suspense>
        <LatestUpdate />
      </Suspense>
    </main>
  )
}

export default HomePage