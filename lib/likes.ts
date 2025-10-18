const LIKES_STORAGE_KEY = "safety_map_likes"

export interface LikesData {
  [reportId: string]: string[] // reportId -> array of userIds who liked
}

export function getLikesData(): LikesData {
  if (typeof window === "undefined") return {}

  try {
    const data = localStorage.getItem(LIKES_STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error("Failed to load likes data:", error)
    return {}
  }
}

function saveLikesData(data: LikesData): void {
  try {
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("Failed to save likes data:", error)
    throw error
  }
}

export function toggleLike(reportId: string, userId: string): boolean {
  const likesData = getLikesData()

  if (!likesData[reportId]) {
    likesData[reportId] = []
  }

  const userIndex = likesData[reportId].indexOf(userId)

  if (userIndex > -1) {
    // Unlike
    likesData[reportId].splice(userIndex, 1)
    saveLikesData(likesData)
    return false
  } else {
    // Like
    likesData[reportId].push(userId)
    saveLikesData(likesData)
    return true
  }
}

export function hasUserLiked(reportId: string, userId: string): boolean {
  const likesData = getLikesData()
  return likesData[reportId]?.includes(userId) || false
}

export function getLikeCount(reportId: string): number {
  const likesData = getLikesData()
  return likesData[reportId]?.length || 0
}
