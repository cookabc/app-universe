import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '../components/common/ComingSoon'
import { CreationHeader } from '../components/creation/layout/CreationHeader'

export const Route = createFileRoute('/community')({
  component: CommunityPage,
})

function CommunityPage() {
  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#121121] transition-colors duration-200 font-sans">
      <CreationHeader />
      <div className="pt-10">
        <ComingSoon title="Community Hub" description="Join the community to share your projects and collaborate with others." />
      </div>
    </div>
  )
}
