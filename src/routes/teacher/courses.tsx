import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '../../components/common/ComingSoon'

export const Route = createFileRoute('/teacher/courses')({
  component: () => <ComingSoon title="Course Management" />,
})
