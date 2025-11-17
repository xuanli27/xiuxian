/**
 * 本地存储工具函数
 */

/**
 * 存储数据到localStorage
 */
export function setLocalStorage<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value)
    localStorage.setItem(key, serialized)
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

/**
 * 从localStorage读取数据
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Failed to read from localStorage:', error)
    return defaultValue
  }
}

/**
 * 从localStorage删除数据
 */
export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Failed to remove from localStorage:', error)
  }
}

/**
 * 清空localStorage
 */
export function clearLocalStorage(): void {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('Failed to clear localStorage:', error)
  }
}

/**
 * 检查localStorage中是否存在某个key
 */
export function hasLocalStorage(key: string): boolean {
  return localStorage.getItem(key) !== null
}

/**
 * 存储数据到sessionStorage
 */
export function setSessionStorage<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value)
    sessionStorage.setItem(key, serialized)
  } catch (error) {
    console.error('Failed to save to sessionStorage:', error)
  }
}

/**
 * 从sessionStorage读取数据
 */
export function getSessionStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = sessionStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Failed to read from sessionStorage:', error)
    return defaultValue
  }
}