import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { AlertTriangle, ImageOff, RotateCw } from 'lucide-react'
import { Suspense, lazy, useEffect, useState } from 'react'
import appCss from '../styles.css?url'
import type { QueryClient } from '@tanstack/react-query'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { GalleryHeader } from '@/components/GalleryHeader'
import { SmoothScroll } from '@/components/SmoothScroll'
import { THEME_INIT_SCRIPT, ThemeProvider } from '@/components/ThemeProvider'

const LazyParticleBackground = lazy(() =>
  import('@/components/three/ParticleBackground').then((module) => ({
    default: module.ParticleBackground,
  })),
)

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Anime Waifus Gallery',
      },
      {
        name: 'description',
        content:
          'Browse curated anime illustrations and discover visually similar artwork from AnimeMoe.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
  }),

  shellComponent: RootDocument,
  errorComponent: RootErrorComponent,
  notFoundComponent: RootNotFoundComponent,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        {isMounted && (
          <Suspense fallback={null}>
            <LazyParticleBackground />
          </Suspense>
        )}
        <SmoothScroll />
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent-contrast focus:shadow-lg"
          >
            Skip to main content
          </a>
          {children}
          {import.meta.env.DEV && (
            <TanStackDevtools
              config={{
                position: 'bottom-right',
              }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
              ]}
            />
          )}
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}

function RootErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter()
  const message =
    error instanceof Error && error.message.trim()
      ? error.message
      : 'An unexpected error occurred while rendering this page.'

  return (
    <>
      <GalleryHeader backToGallery />
      <main
        id="main-content"
        className="relative z-10 flex min-h-[calc(100vh-4rem)] w-full items-center justify-center px-4 py-12 text-ink"
      >
        <div
          role="alert"
          className="w-full max-w-md rounded-2xl border border-line bg-elevated/95 p-8 text-center shadow-sm"
        >
          <AlertTriangle
            className="mx-auto mb-4 h-10 w-10 text-danger"
            aria-hidden="true"
          />
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-muted">{message}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                reset()
                void router.invalidate()
              }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast transition-colors hover:bg-accent-hover"
            >
              <RotateCw className="h-4 w-4" aria-hidden="true" />
              Try again
            </button>
            <Link
              to="/"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-line bg-subtle px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-line-strong hover:bg-canvas"
            >
              Back to Gallery
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

function RootNotFoundComponent() {
  return (
    <>
      <GalleryHeader backToGallery />
      <main
        id="main-content"
        className="relative z-10 flex min-h-[calc(100vh-4rem)] w-full items-center justify-center px-4 py-12 text-ink"
      >
        <div className="w-full max-w-md rounded-2xl border border-line bg-elevated/95 p-8 text-center shadow-sm">
          <ImageOff
            className="mx-auto mb-4 h-10 w-10 text-muted"
            aria-hidden="true"
          />
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Page not found
          </h1>
          <p className="mt-2 text-sm text-muted">
            The page or artwork you are looking for does not exist or may have
            moved.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              to="/"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-contrast transition-colors hover:bg-accent-hover"
            >
              Back to Gallery
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
