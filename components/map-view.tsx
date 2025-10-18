"use client"

import { useEffect, useRef, useState } from "react"
import type { Report } from "@/lib/reports"
import { deleteReport } from "@/lib/reports"
import { getCurrentUser } from "@/lib/auth"
import { Loader2, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MapViewProps {
  reports: Report[]
  center?: [number, number]
  zoom?: number
  onMapClick?: (lat: number, lng: number) => void
  onReportDeleted?: () => void
}

export function MapView({
  reports,
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
  const LeafletRef = useRef<any>(null)

  const getUserLocation = () => {
    console.log("[v0] Getting user location...")
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("[v0] Location obtained:", position.coords.latitude, position.coords.longitude)
          const location: [number, number] = [position.coords.latitude, position.coords.longitude]
          setUserLocation(location)

          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView(location, 15)
            console.log("[v0] Map view updated to user location")
          }
        },
        (error) => {
          console.error("[v0] Geolocation error code:", error.code)
          console.error("[v0] Geolocation error message:", error.message)

          let errorMessage = "位置情報の取得に失敗しました。"

          switch (error.code) {
            case 1: // PERMISSION_DENIED
              errorMessage = "位置情報の使用が許可されていません。ブラウザの設定を確認してください。"
              break
            case 2: // POSITION_UNAVAILABLE
              errorMessage = "位置情報を取得できませんでした。しばらくしてから再度お試しください。"
              break
            case 3: // TIMEOUT
              errorMessage = "位置情報の取得がタイムアウトしました。再度お試しください。"
              break
            default:
              errorMessage = `位置情報の取得に失敗しました: ${error.message || "不明なエラー"}`
          }

          alert(errorMessage)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    } else {
      console.error("[v0] Geolocation not supported")
      alert("このブラウザは位置情報に対応していません")
    }
  }

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

        const map = L.map(mapRef.current).setView(center, zoom)
        mapInstanceRef.current = map

        console.log("[v0] Map created successfully")

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map)

        if (onMapClick) {
          map.on("click", (e: any) => {
            onMapClick(e.latlng.lat, e.latlng.lng)
          })
        }

        const currentUser = getCurrentUser()

        reports.forEach((report) => {
          const circle = L.circle([report.latitude, report.longitude], {
            color: "#ef4444",
            fillColor: "#ef4444",
            fillOpacity: 0.3,
            radius: 100,
          }).addTo(map)

          const canDelete = currentUser && currentUser.id === report.userId
          const deleteButton = canDelete
            ? `<button 
                onclick="window.deleteReport('${report.id}')" 
                style="
                  width: 100%;
                  padding: 6px 12px;
                  background-color: #ef4444;
                  color: white;
                  border: none;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 14px;
                  margin-top: 8px;
                "
              >
                削除
              </button>`
            : ""

          const popupContent = `
            <div style="padding: 8px; min-width: 200px;">
              <h3 style="font-weight: bold; margin-bottom: 4px;">${report.title}</h3>
              <p style="font-size: 14px; color: #666; margin-bottom: 8px;">${report.description}</p>
              <p style="font-size: 12px; color: #999; margin-bottom: 4px;">投稿者: ${report.userName}</p>
              <p style="font-size: 12px; color: #999;">${new Date(report.createdAt).toLocaleDateString("ja-JP")}</p>
              ${deleteButton}
            </div>
          `

          circle.bindPopup(popupContent)
        })

        console.log("[v0] Added", reports.length, "reports to map")
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
      if (userMarkerRef.current) {
        userMarkerRef.current.remove()
        userMarkerRef.current = null
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [reports, center, zoom, onMapClick, onReportDeleted])

  useEffect(() => {
    if (!userLocation || !mapInstanceRef.current || !LeafletRef.current) return

    console.log("[v0] Adding user location marker...")

    const L = LeafletRef.current

    // 既存のマーカーを削除
    if (userMarkerRef.current) {
      userMarkerRef.current.remove()
    }

    // 青いマーカーアイコンを作成
    const userIcon = L.icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    })

    // 新しいマーカーを追加
    userMarkerRef.current = L.marker(userLocation, { icon: userIcon }).addTo(mapInstanceRef.current).bindPopup("現在地")

    console.log("[v0] User location marker added")
  }, [userLocation])
  ;(window as any).deleteReport = (id: string) => {
    if (confirm("この投稿を削除しますか？")) {
      deleteReport(id)
      if (onReportDeleted) {
        onReportDeleted()
      }
    }
  }

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
      <Button
        onClick={getUserLocation}
        className="absolute top-4 right-4 z-[1000] shadow-lg"
        size="icon"
        variant="secondary"
      >
        <Navigation className="h-4 w-4" />
      </Button>
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: "400px" }} />
    </div>
  )
}
