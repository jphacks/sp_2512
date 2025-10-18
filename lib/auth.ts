export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

interface StoredUser extends User {
  passwordHash: string
}

const AUTH_STORAGE_KEY = "safety_map_user"
const USERS_STORAGE_KEY = "safety_map_users"

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

function getAllUsers(): Record<string, StoredUser> {
  if (typeof window === "undefined") return {}

  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error("[v0] Failed to load users:", error)
    return {}
  }
}

function saveAllUsers(users: Record<string, StoredUser>): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  } catch (error) {
    console.error("[v0] Failed to save users:", error)
    throw error
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("[v0] Failed to load user:", error)
    return null
  }
}

export async function signup(email: string, name: string, password: string): Promise<User> {
  const users = getAllUsers()

  // Check if user already exists
  if (users[email]) {
    throw new Error("このメールアドレスは既に登録されています")
  }

  const passwordHash = await hashPassword(password)
  const user: User = {
    id: crypto.randomUUID(),
    email,
    name,
    createdAt: new Date().toISOString(),
  }

  const storedUser: StoredUser = {
    ...user,
    passwordHash,
  }

  users[email] = storedUser
  saveAllUsers(users)

  // Set current user
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  } catch (error) {
    console.error("[v0] Failed to save current user:", error)
    throw error
  }

  console.log("[v0] User signed up:", email)
  return user
}

export async function login(email: string, password: string): Promise<User> {
  const users = getAllUsers()
  const storedUser = users[email]

  if (!storedUser) {
    throw new Error("メールアドレスまたはパスワードが正しくありません")
  }

  const passwordHash = await hashPassword(password)
  if (passwordHash !== storedUser.passwordHash) {
    throw new Error("メールアドレスまたはパスワードが正しくありません")
  }

  const user: User = {
    id: storedUser.id,
    email: storedUser.email,
    name: storedUser.name,
    createdAt: storedUser.createdAt,
  }

  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  } catch (error) {
    console.error("[v0] Failed to save current user:", error)
    throw error
  }

  console.log("[v0] User logged in:", email)
  return user
}

export function logout(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    console.log("[v0] User logged out")
  } catch (error) {
    console.error("[v0] Failed to logout:", error)
    throw error
  }
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null
}
