import { cn } from '../../lib/utils'
import type { BaseProps } from '../../types'

interface PageShellProps extends BaseProps {
  /** offset for the fixed sidebar (default true) */
  withSidebar?: boolean
  /** offset for the fixed topbar (default true) */
  withTopBar?: boolean
}

/** Wraps page content with correct offsets for SideNav + TopBar */
export function PageShell({ withSidebar = true, withTopBar = true, className, children }: PageShellProps) {
  return (
    <main
      className={cn(
        withSidebar && 'ml-72',
        withTopBar && 'pt-20',
        'min-h-screen',
        className,
      )}
    >
      {children}
    </main>
  )
}
