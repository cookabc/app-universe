import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '@/components/common/ComingSoon'
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout'

export const Route = createFileRoute('/settings')({
  component: Settings,
})

function Settings() {
  return (
    <DashboardLayout>
      <ComingSoon 
        title="Account Settings" 
        description="We are working on advanced profile and security settings. Stay tuned!" 
      />
    </DashboardLayout>
  )
}
