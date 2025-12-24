import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()
  // Hide global header/footer for routes that have their own layouts
  const hideGlobalLayout = 
    location.pathname.startsWith('/teacher') || 
    location.pathname.startsWith('/creation') || 
    location.pathname.startsWith('/lab') ||
    location.pathname.startsWith('/learning') ||
    location.pathname.startsWith('/community') ||
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/settings')

  if (hideGlobalLayout) {
    return (
      <>
        <Outlet />
        <TanStackRouterDevtools />
      </>
    )
  }

  return (
    <>
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-body">
        <Header />
        <main className="flex-1 flex flex-col items-center">
          <Outlet />
        </main>
        <Footer />
      </div>
      <TanStackRouterDevtools />
    </>
  )
}
