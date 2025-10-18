"use client"

import { useEffect, useRef, useState } from "react"
import type { Report } from "@/lib/reports"
import { getDangerLevelColor, getDangerLevelLabel } from "@/lib/reports"
import type { NewsReport } from "@/lib/news"
import { getCurrentUser } from "@/lib/auth"
import { hasUserLiked, getLikeCount } from "@/lib/likes"
import { Loader2 } from "lucide-react"
import { getLocation } from "@/lib/geolocation"

interface MapViewProps {
  reports: Report[]
  newsReports?: NewsReport[]
  center?: [number, number]
  zoom?: number
  onMapClick?: (lat: number, lng: number) => void
  onReportDeleted?: () => void
}

export function MapView({
  reports,
  newsReports = [],
  center = [35.6762, 139.6503],
  zoom = 13,
  onMapClick,
  onReportDeleted,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const userMarkerRef = useRef<any>(null)
  const directionSectorRef = useRef<any>(null)
  const LeafletRef = useRef<any>(null)
  const watchIdRef = useRef<number | null>(null)
  const [heading, setHeading] = useState<number | null>(null)
  const reportMarkersRef = useRef<any[]>([])
  const newsMarkersRef = useRef<any[]>([])

  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation")
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation)
        setUserLocation(location)
        console.log("[v0] Loaded user location from localStorage:", location)
      } catch (e) {
        console.error("[v0] Failed to parse saved location:", e)
      }
    }
  }, [])

  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation")

    if (!savedLocation) {
      console.log("[v0] No saved location found, attempting auto-detection...")

      getLocation().then((locationData) => {
        if (locationData) {
          console.log("[v0] ✅ Auto-detected location successfully!")
          console.log("[v0] Latitude:", locationData.latitude)
          console.log("[v0] Longitude:", locationData.longitude)
          if (locationData.city) {
            console.log("[v0] City:", locationData.city)
          }

          const location: [number, number] = [locationData.latitude, locationData.longitude]
          setUserLocation(location)

          if (locationData.accuracy < 500) {
            localStorage.setItem("userLocation", JSON.stringify(location))
            console.log("[v0] Location saved to localStorage (accuracy:", locationData.accuracy, "m)")
          } else {
            console.log("[v0] Location NOT saved (low accuracy:", locationData.accuracy, "m)")
          }
        } else {
          console.log("[v0] ❌ Auto-detection failed - user can manually set location")
        }
      })
    } else {
      console.log("[v0] Using saved location from localStorage")
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        const compassHeading = event.alpha
        console.log("[v0] Device heading:", compassHeading, "degrees")
        setHeading(compassHeading)
      }
    }

    if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      ;(DeviceOrientationEvent as any)
        .requestPermission()
        .then((permissionState: string) => {
          if (permissionState === "granted") {
            window.addEventListener("deviceorientation", handleOrientation)
            console.log("[v0] Device orientation permission granted")
          } else {
            console.log("[v0] Device orientation permission denied")
          }
        })
        .catch((error: any) => {
          console.error("[v0] Error requesting device orientation permission:", error)
        })
    } else {
      window.addEventListener("deviceorientation", handleOrientation)
      console.log("[v0] Device orientation listener added")
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation)
    }
  }, [])

  const addUserLocationMarker = (L: any, map: any, location: [number, number]) => {
    // Remove existing marker group completely
    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current)
      userMarkerRef.current = null
    }
    if (directionSectorRef.current) {
      map.removeLayer(directionSectorRef.current)
      directionSectorRef.current = null
    }

    // Create all layers
    const layers: any[] = []

    // Accuracy circle
    const accuracyCircle = L.circle(location, {
      color: "#4285F4",
      fillColor: "#4285F4",
      fillOpacity: 0.15,
      weight: 2,
      radius: 50,
    })
    layers.push(accuracyCircle)

    // Location dot
    const locationDot = L.circleMarker(location, {
      color: "#FFFFFF",
      fillColor: "#4285F4",
      fillOpacity: 1,
      weight: 3,
      radius: 10,
    })
    layers.push(locationDot)

    // Direction sector (if heading is available)
    if (heading !== null) {
      const sectorAngle = 45
      const sectorRadius = 80

      const startAngle = heading - sectorAngle / 2
      const endAngle = heading + sectorAngle / 2

      const points: [number, number][] = [location]

      for (let angle = startAngle; angle <= endAngle; angle += 5) {
        const rad = (angle * Math.PI) / 180
        const dx = sectorRadius * Math.sin(rad)
        const dy = sectorRadius * Math.cos(rad)

        const latOffset = dy / 111320
        const lngOffset = dx / (111320 * Math.cos((location[0] * Math.PI) / 180))

        points.push([location[0] + latOffset, location[1] + lngOffset])
      }

      points.push(location)

      const directionSector = L.polygon(points, {
        color: "#4285F4",
        fillColor: "#4285F4",
        fillOpacity: 0.3,
        weight: 0,
      })
      layers.push(directionSector)
      directionSectorRef.current = directionSector
    }

    // Create a single layer group containing all layers
    userMarkerRef.current = L.layerGroup(layers).addTo(map)

    // Add popup to the location dot
    locationDot.bindPopup(
      '<div style="text-align: center; font-size: 16px; font-weight: 600; padding: 8px;">📍 現在地</div>',
    )

    console.log("[v0] ✅ User location marker added (single marker group)")
  }

  useEffect(() => {
    console.log("[v0] Starting automatic real-time location tracking...")

    if (!("geolocation" in navigator)) {
      console.error("[v0] Geolocation is not supported by this browser")
      return
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        console.log("[v0] 📍 Location updated!")
        console.log("[v0] Latitude:", position.coords.latitude)
        console.log("[v0] Longitude:", position.coords.longitude)
        console.log("[v0] Accuracy:", position.coords.accuracy, "meters")

        const location: [number, number] = [position.coords.latitude, position.coords.longitude]
        setUserLocation(location)

        if (position.coords.accuracy < 500) {
          localStorage.setItem("userLocation", JSON.stringify(location))
          console.log("[v0] Location saved to localStorage (accuracy:", position.coords.accuracy, "m)")
        } else {
          console.log("[v0] Location NOT saved (low accuracy:", position.coords.accuracy, "m)")
        }

        if (mapInstanceRef.current && LeafletRef.current) {
          const L = LeafletRef.current
          addUserLocationMarker(L, mapInstanceRef.current, location)
        }
      },
      (error) => {
        console.error("[v0] ❌ Tracking error:", error.code, error.message)

        getLocation().then((locationData) => {
          if (locationData) {
            console.log("[v0] ✅ Fallback to IP-based location")
            const location: [number, number] = [locationData.latitude, locationData.longitude]
            setUserLocation(location)

            console.log("[v0] IP-based location NOT saved (low accuracy:", locationData.accuracy, "m)")
            console.log("[v0] ⚠️ IP-based location marker NOT added (waiting for accurate GPS)")
            // Don't add marker for IP-based location - wait for accurate GPS
          }
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )

    console.log("[v0] Watch ID:", watchIdRef.current)

    return () => {
      if (watchIdRef.current !== null) {
        console.log("[v0] Stopping automatic location tracking...")
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return

    const initMap = async () => {
      try {
        console.log("[v0] Initializing map...")

        const L = (await import("leaflet")).default
        LeafletRef.current = L

        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        })

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
        }

        let initialCenter = center
        let initialZoom = zoom

        const savedLocation = localStorage.getItem("userLocation")
        if (savedLocation) {
          try {
            const location = JSON.parse(savedLocation)
            initialCenter = location
            initialZoom = 15
            console.log("[v0] Using saved user location as initial center:", location)
          } catch (e) {
            console.error("[v0] Failed to parse saved location:", e)
          }
        }

        const map = L.map(mapRef.current).setView(initialCenter, initialZoom)
        mapInstanceRef.current = map

        console.log("[v0] Map created successfully")

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map)

        map.on("click", (e: any) => {
          if (onMapClick) {
            onMapClick(e.latlng.lat, e.latlng.lng)
          }
        })
        ;(window as any).toggleReportLike = (reportId: string) => {
          const { toggleLike } = require("@/lib/likes")
          const user = getCurrentUser()
          if (user) {
            toggleLike(reportId, user.id)
            if (onReportDeleted) {
              onReportDeleted()
            }
          }
        }
        ;(window as any).deleteReport = (reportId: string) => {
          const { deleteReport } = require("@/lib/reports")
          if (confirm("この投稿を削除しますか？")) {
            deleteReport(reportId)
            if (onReportDeleted) {
              onReportDeleted()
            }
          }
        }

        if (userLocation) {
          console.log("[v0] Adding initial user location marker...")
          addUserLocationMarker(L, mapInstanceRef.current, userLocation)
        }

        setIsLoading(false)
      } catch (err) {
        console.error("[v0] Map initialization error:", err)
        setError("地図の読み込みに失敗しました")
        setIsLoading(false)
      }
    }

    initMap()

    return () => {
      delete (window as any).deleteReport
      delete (window as any).toggleReportLike
      if (userMarkerRef.current) {
        userMarkerRef.current.remove()
        userMarkerRef.current = null
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, []) // Empty dependency array - initialize only once

  useEffect(() => {
    if (!mapInstanceRef.current || !LeafletRef.current) return

    const L = LeafletRef.current
    const map = mapInstanceRef.current

    // Remove existing markers
    reportMarkersRef.current.forEach((marker) => map.removeLayer(marker))
    reportMarkersRef.current = []
    newsMarkersRef.current.forEach((marker) => map.removeLayer(marker))
    newsMarkersRef.current = []

    const currentUser = getCurrentUser()

    // Add report markers
    reports.forEach((report) => {
      const color = getDangerLevelColor(report.dangerLevel)

      const circle = L.circle([report.latitude, report.longitude], {
        color: color,
        fillColor: color,
        fillOpacity: 0.3,
        radius: 100,
      }).addTo(map)

      const likeCount = getLikeCount(report.id)
      const isLiked = currentUser ? hasUserLiked(report.id, currentUser.id) : false

      const likeButton = currentUser
        ? `<button 
            onclick="window.toggleReportLike('${report.id}')" 
            style="
              display: flex;
              align-items: center;
              gap: 8px;
              width: 100%;
              padding: 8px 12px;
              background-color: ${isLiked ? "#ef4444" : "#f3f4f6"};
              color: ${isLiked ? "white" : "#374151"};
              border: 1px solid ${isLiked ? "#ef4444" : "#d1d5db"};
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
              margin-top: 8px;
              justify-content: center;
              font-weight: 500;
            "
          >
            <span style="font-size: 18px;">${isLiked ? "❤️" : "🤍"}</span>
            <span>いいね</span>
            ${likeCount > 0 ? `<span style="font-weight: 700; font-size: 16px;">${likeCount}</span>` : ""}
          </button>`
        : `<div style="
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background-color: #f3f4f6;
            border-radius: 6px;
            font-size: 14px;
            margin-top: 8px;
            justify-content: center;
            color: #6b7280;
          ">
            <span style="font-size: 18px;">🤍</span>
            <span>いいね</span>
            ${likeCount > 0 ? `<span style="font-weight: 700; font-size: 16px; color: #374151;">${likeCount}</span>` : ""}
          </div>`

      const canDelete = currentUser && currentUser.id === report.userId
      const deleteButton = canDelete
        ? `<button 
            onclick="window.deleteReport('${report.id}')" 
            style="
              width: 100%;
              padding: 8px 12px;
              background-color: #ef4444;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
              margin-top: 8px;
              font-weight: 500;
            "
          >
            削除
          </button>`
        : ""

      const dangerLevelBadge = `<div style="display: inline-block; background-color: ${color}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-bottom: 8px;">${getDangerLevelLabel(report.dangerLevel)}</div>`

      const popupContent = `
        <div style="padding: 8px; min-width: 200px;">
          <div style="display: inline-block; background-color: #fef2f2; color: #991b1b; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-bottom: 8px; margin-right: 4px;">ユーザー投稿</div>
          ${dangerLevelBadge}
          <h3 style="font-weight: bold; margin-bottom: 4px; font-size: 16px;">${report.title}</h3>
          <p style="font-size: 14px; color: #666; margin-bottom: 8px;">${report.description}</p>
          <p style="font-size: 12px; color: #999; margin-bottom: 4px;">投稿者: ${report.userName}</p>
          <p style="font-size: 12px; color: #999;">${new Date(report.createdAt).toLocaleDateString("ja-JP")}</p>
          ${likeButton}
          ${deleteButton}
        </div>
      `

      circle.bindPopup(popupContent)
      reportMarkersRef.current.push(circle)
    })

    // Add news markers
    newsReports.forEach((news) => {
      let markerColor = "green"
      if (news.dangerLevel === "high") {
        markerColor = "red"
      } else if (news.dangerLevel === "medium") {
        markerColor = "orange"
      } else if (news.dangerLevel === "low") {
        markerColor = "yellow"
      }

      const newsIcon = L.icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${markerColor}.png`,
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })

      const marker = L.marker([news.latitude, news.longitude], { icon: newsIcon }).addTo(map)

      const publishedDate = new Date(news.publishedAt)
      const now = new Date()
      const diffMs = now.getTime() - publishedDate.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffHours / 24)

      let timeAgo = ""
      if (diffHours < 1) {
        timeAgo = "1時間以内"
      } else if (diffHours < 24) {
        timeAgo = `${diffHours}時間前`
      } else {
        timeAgo = `${diffDays}日前`
      }

      const dangerColor = getDangerLevelColor(news.dangerLevel)
      const dangerLevelBadge = `<div style="display: inline-block; background-color: ${dangerColor}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-bottom: 8px;">${getDangerLevelLabel(news.dangerLevel)}</div>`

      const popupContent = `
        <div style="padding: 8px; min-width: 250px;">
          <div style="display: inline-block; background-color: #ecfdf5; color: #059669; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-bottom: 8px; margin-right: 4px;">📰 ニュース</div>
          ${dangerLevelBadge}
          <h3 style="font-weight: bold; margin-bottom: 4px; font-size: 16px;">${news.title}</h3>
          <p style="font-size: 14px; color: #666; margin-bottom: 8px;">${news.description}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <p style="font-size: 12px; color: #059669; font-weight: 600;">出典: ${news.source}</p>
            <p style="font-size: 12px; color: #999;">${timeAgo}</p>
          </div>
          <a href="${news.url}" target="_blank" rel="noopener noreferrer" style="
            display: block;
            width: 100%;
            padding: 8px 12px;
            background-color: #059669;
            color: white;
            text-align: center;
            border-radius: 6px;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
          ">
            記事を読む →
          </a>
        </div>
      `

      marker.bindPopup(popupContent)
      newsMarkersRef.current.push(marker)
    })

    console.log("[v0] Updated markers:", reports.length, "reports,", newsReports.length, "news")
  }, [reports, newsReports, onReportDeleted])

  useEffect(() => {
    if (userLocation && mapInstanceRef.current && LeafletRef.current && heading !== null) {
      console.log("[v0] Updating direction sector with new heading:", heading)
      addUserLocationMarker(LeafletRef.current, mapInstanceRef.current, userLocation)
    }
  }, [heading])

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: "400px" }} />
    </div>
  )
}
