import { createFileRoute, Outlet } from '@tanstack/react-router'
import { TeacherLayout } from '../components/teacher/layout/TeacherLayout'

export const Route = createFileRoute('/teacher')({
  component: TeacherLayoutWrapper,
})

function TeacherLayoutWrapper() {
  return (
    <TeacherLayout>
      <Outlet />
    </TeacherLayout>
  )
}
