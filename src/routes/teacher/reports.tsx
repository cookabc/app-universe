import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '../../components/common/ComingSoon'

export const Route = createFileRoute('/teacher/reports')({
  component: () => <ComingSoon title="Analytics & Reports" />,
})
