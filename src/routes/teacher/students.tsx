import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '../../components/common/ComingSoon'

export const Route = createFileRoute('/teacher/students')({
  component: () => <ComingSoon title="Student Roster" />,
})
