import { createFileRoute } from '@tanstack/react-router'
import { LearningMap } from '@/components/learning/LearningMap'
import { StudentHUD } from '@/components/learning/StudentHUD'
import { LabHeader } from '@/components/lab/image-classifier/layout/LabHeader'

export const Route = createFileRoute('/learning')({
  component: LearningCenter,
})

function LearningCenter() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f0f2f5]">
      <LabHeader />
      <div className="relative flex-1 w-full overflow-hidden">
        <LearningMap />
        <StudentHUD />
      </div>
    </div>
  )
}
