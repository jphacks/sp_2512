// 位置情報取得ユーティリティ

export interface LocationData {
  latitude: number
  longitude: number
  accuracy?: number
  city?: string
  country?: string
}

/**
 * IPアドレスから位置情報を取得
 * ipapi.coの無料APIを使用（1日1000リクエストまで）
 */
export async function getLocationFromIP(): Promise<LocationData | null> {
  try {
    console.log("[v0] Fetching location from IP address...")

    const response = await fetch("https://ipapi.co/json/")

    if (!response.ok) {
      console.error("[v0] IP location API error:", response.status)
      return null
    }

    const data = await response.json()

    console.log("[v0] IP location data received:", {
      city: data.city,
      country: data.country_name,
      latitude: data.latitude,
      longitude: data.longitude,
    })

    if (!data.latitude || !data.longitude) {
      console.error("[v0] Invalid location data from IP API")
      return null
    }

    return {
      latitude: data.latitude,
      longitude: data.longitude,
      accuracy: 5000, // IPベースの位置情報は精度が低い（約5km）
      city: data.city,
      country: data.country_name,
    }
  } catch (error) {
    console.error("[v0] Error fetching location from IP:", error)
    return null
  }
}

/**
 * ブラウザのGeolocation APIから位置情報を取得
 */
export function getLocationFromBrowser(options?: PositionOptions): Promise<LocationData> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
      },
      (error) => {
        reject(error)
      },
      options,
    )
  })
}

/**
 * 位置情報を取得（ブラウザAPI → IPベースの順に試行）
 */
export async function getLocation(): Promise<LocationData | null> {
  console.log("[v0] Attempting to get location...")

  // まずブラウザのGeolocation APIを試す
  try {
    console.log("[v0] Trying browser Geolocation API...")
    const location = await getLocationFromBrowser({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    })
    console.log("[v0] ✅ Location obtained from browser:", location)
    return location
  } catch (error) {
    console.log("[v0] Browser Geolocation failed, trying IP-based location...")

    // ブラウザAPIが失敗した場合、IPベースの位置情報を取得
    const ipLocation = await getLocationFromIP()

    if (ipLocation) {
      console.log("[v0] ✅ Location obtained from IP:", ipLocation)
      return ipLocation
    }

    console.error("[v0] ❌ All location methods failed")
    return null
  }
}
