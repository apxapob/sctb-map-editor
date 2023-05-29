export const debounce = (func, delay = 300) => {
  let inDebounce
  return (...args) => {
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func.apply(this, args), delay)
  }
}

export const throttle = (func, limit = 300) => {
  let lastFunc
  let lastRan
  return (...args) => {
    if (!lastRan) {
      func.apply(this, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(this, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}
