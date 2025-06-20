"use client"

// Detect if the device is low-end based on various factors
export function isLowEndDevice(): boolean {
  if (typeof window === "undefined") return false

  // Check for hardware concurrency (CPU cores)
  const lowConcurrency = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4

  // Check for device memory if available
  const lowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4

  // Check for save-data mode
  const saveData = (navigator as any).connection && (navigator.connection as any).saveData === true

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  // Check for battery saving mode if available
  let lowBattery = false
  if ("getBattery" in navigator) {
    ;(navigator as any)
      .getBattery?.()
      .then((battery: any) => {
        lowBattery = battery.level < 0.15 && !battery.charging
      })
      .catch(() => {
        // Ignore errors
      })
  }

  // Return true if any of these conditions are met
  return !!(lowConcurrency || lowMemory || saveData || prefersReducedMotion || lowBattery)
}

// Get animation settings based on device capabilities
export function getAnimationSettings() {
  const isLowEnd = isLowEndDevice()

  return {
    // Use smoother easing for high-end devices, linear for low-end
    easing: isLowEnd ? "ease-out" : "cubic-bezier(0.16, 1, 0.3, 1)",

    // Reduce duration for low-end devices
    durationMultiplier: isLowEnd ? 0.7 : 1,

    // Reduce complexity for low-end devices
    complexity: isLowEnd ? "simple" : "full",

    // Use simpler transforms for low-end devices
    useSimpleTransforms: isLowEnd,

    // Disable parallax effects on low-end devices
    enableParallax: !isLowEnd,

    // Limit the number of concurrent animations on low-end devices
    maxConcurrentAnimations: isLowEnd ? 3 : 10,

    // Use hardware acceleration
    useHardwareAcceleration: true,
  }
}

// Optimize animation properties based on device capabilities
export function optimizeAnimationProps(props: any) {
  const isLowEnd = isLowEndDevice()
  const settings = getAnimationSettings()

  return {
    ...props,
    duration: props.duration * settings.durationMultiplier,
    delay: isLowEnd ? Math.min(props.delay || 0, 100) : props.delay,
    easing: settings.easing,
    useHardwareAcceleration: settings.useHardwareAcceleration,
  }
}

// Check if the browser supports a specific animation feature
export function supportsAnimationFeature(feature: string): boolean {
  if (typeof document === "undefined") return false

  const featureSupport: Record<string, boolean> = {
    webAnimations: "animate" in document.createElement("div"),
    motionPath: CSS.supports("offset-path", 'path("M 0 0 L 100 100")'),
    waapi: typeof Element.prototype.animate === "function",
    customProperties: CSS.supports("--custom-property", "value"),
  }

  return featureSupport[feature] || false
}

// Get the appropriate animation strategy based on browser support and device capabilities
export function getAnimationStrategy() {
  const isLowEnd = isLowEndDevice()
  const supportsWAAPI = supportsAnimationFeature("webAnimations")

  if (isLowEnd) {
    return "minimal" // Minimal animations for low-end devices
  } else if (supportsWAAPI) {
    return "waapi" // Web Animations API for modern browsers
  } else {
    return "css" // Fallback to CSS animations
  }
}

// Determine if animations should be enabled based on user preferences and device capabilities
export function shouldEnableAnimations(): boolean {
  if (typeof window === "undefined") return false

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  // Check for user preference in localStorage if available
  let userPreference = true
  try {
    const storedPreference = localStorage.getItem("ethr-animations-enabled")
    if (storedPreference !== null) {
      userPreference = storedPreference === "true"
    }
  } catch (e) {
    // Ignore localStorage errors
  }

  // Disable animations if user prefers reduced motion or has explicitly disabled them
  return !prefersReducedMotion && userPreference
}

// Utility to throttle function calls
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let inThrottle = false
  let lastResult: ReturnType<T> | undefined

  return function (this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
    if (!inThrottle) {
      lastResult = func.apply(this, args)
      inThrottle = true

      setTimeout(() => {
        inThrottle = false
      }, limit)
    }

    return lastResult
  }
}
