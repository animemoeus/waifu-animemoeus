import { Link } from '@tanstack/react-router'
import { ArrowLeft, Images, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

export interface GalleryHeaderProps {
  backToGallery?: boolean
}

export function GalleryHeader({ backToGallery = false }: GalleryHeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-3">
          {backToGallery && (
            <Link
              to="/"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-elevated px-3 text-sm font-medium text-ink transition-colors hover:border-line-strong hover:bg-subtle"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Back to Gallery</span>
            </Link>
          )}

          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-2.5 rounded-lg px-1.5 text-ink transition-colors hover:text-accent"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <Images className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold tracking-tight sm:text-lg">
              Anime Waifus
            </span>
          </Link>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={isDark}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-line bg-elevated text-ink transition-colors hover:border-line-strong hover:bg-subtle"
        >
          {isDark ? (
            <Sun className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Moon className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
    </header>
  )
}
