import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const DARK_PARTICLE_COLORS = [0xf9a8d4, 0x93c5fd, 0xffffff] as const
const LIGHT_PARTICLE_COLORS = [0x6366f1, 0xec4899, 0x3b82f6] as const

export function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      return
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const particleCount = window.innerWidth < 768 ? 250 : 550

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    )
    camera.position.z = 20

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const colorIndices = new Uint8Array(particleCount)
    const color = new THREE.Color()

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
      colorIndices[i] = Math.floor(Math.random() * 3)
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const colorAttribute = new THREE.BufferAttribute(colors, 3)
    geometry.setAttribute('color', colorAttribute)

    const material = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const applyThemePalette = (isDark: boolean) => {
      const palette = isDark ? DARK_PARTICLE_COLORS : LIGHT_PARTICLE_COLORS
      for (let i = 0; i < particleCount; i++) {
        color.set(palette[colorIndices[i]])
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b
      }
      colorAttribute.needsUpdate = true
      material.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending
      material.opacity = isDark ? 0.65 : 0.4
      material.needsUpdate = true
    }

    applyThemePalette(document.documentElement.classList.contains('dark'))

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    let animationFrameId: number | null = null
    let isRunning = false

    const renderFrame = () => {
      points.rotation.y += 0.0006
      points.rotation.x += 0.0002
      renderer.render(scene, camera)
    }

    const animate = () => {
      renderFrame()
      animationFrameId = requestAnimationFrame(animate)
    }

    const startLoop = () => {
      if (isRunning) return
      isRunning = true
      animate()
    }

    const stopLoop = () => {
      isRunning = false
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }

    if (prefersReducedMotion) {
      renderer.render(scene, camera)
    } else {
      startLoop()
    }

    const observer = new MutationObserver(() => {
      applyThemePalette(document.documentElement.classList.contains('dark'))
      if (prefersReducedMotion) {
        renderer.render(scene, camera)
      }
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      if (prefersReducedMotion) renderer.render(scene, camera)
    }
    window.addEventListener('resize', handleResize)

    const handleVisibilityChange = () => {
      if (prefersReducedMotion) return
      if (document.visibilityState === 'visible') {
        startLoop()
      } else {
        stopLoop()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      stopLoop()
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  )
}
