export interface ThrottleOptions {
  leading?: boolean
  trailing?: boolean
}

function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: ThrottleOptions = {}
): T & { cancel: () => void; flush: () => ReturnType<T> | undefined } {
  let lastArgs: any
  let lastThis: any
  let result: ReturnType<T>
  // @ts-ignore
  let timerId: NodeJS.Timeout | undefined
  let lastCallTime: number = 0

  const leading = options.leading !== false
  const trailing = options.trailing !== false

  const invokeFunc = (time: number): ReturnType<T> => {
    lastArgs = lastThis = undefined
    lastCallTime = time
    result = func.apply(lastThis, lastArgs)

    return result
  }

  const startTimer = (pendingFunc: () => void, wait: number): void => {
    timerId = setTimeout(pendingFunc, wait)
  }

  const leadingEdge = (time: number): ReturnType<T> => {
    lastCallTime = time
    startTimer(timerExpired, wait)

    return leading ? invokeFunc(time) : result
  }

  const remainingWait = (time: number): number => {
    const timeSinceLastCall = time - lastCallTime

    return wait - timeSinceLastCall
  }

  const shouldInvoke = (time: number): boolean => {
    const timeSinceLastCall = time - lastCallTime

    return lastCallTime === 0 || timeSinceLastCall >= wait
  }

  const timerExpired = (): void => {
    const time = Date.now()

    if (shouldInvoke(time)) {
      trailingEdge(time)
    } else {
      startTimer(timerExpired, remainingWait(time))
    }
  }

  const trailingEdge = (time: number): ReturnType<T> | undefined => {
    timerId = undefined
    if (trailing && lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = lastThis = undefined

    return result
  }

  const throttled = function (
    this: any,
    ...args: any[]
  ): ReturnType<T> | undefined {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    lastThis = this

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(time)
      }
    }

    if (timerId === undefined) {
      startTimer(timerExpired, wait)
    }

    return result
  } as T & { cancel: () => void; flush: () => ReturnType<T> | undefined }

  throttled.cancel = (): void => {
    if (timerId !== undefined) {
      clearTimeout(timerId)
    }
    lastCallTime = 0
    lastArgs = lastThis = timerId = undefined
  }

  throttled.flush = (): ReturnType<T> | undefined => {
    return timerId === undefined ? result : trailingEdge(Date.now())
  }

  return throttled
}
