"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, MapPin } from "lucide-react"

interface LocationPickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLocationSelect: (lat: number, lng: number) => void
  initialLocation?: [number, number]
}

export function LocationPicker({ open, onOpenChange, onLocationSelect, initialLocation }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const LeafletRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(
    initialLocation || [35.6762, 139.6503],
  )

  useEffect(() => {
    console.log("[v0] LocationPicker open state:", open)
    console.log("[v0] LocationPicker mapRef.current:", !!mapRef.current)

    if (!open || typeof window === "undefined") {
      console.log("[v0] LocationPicker: Not initializing (open=false or no window)")
      return
    }

    // Wait for DOM to be ready
    const initMap = async () => {
      // Wait a bit for the dialog to fully render
      await new Promise((resolve) => setTimeout(resolve, 100))

      if (!mapRef.current) {
        console.log("[v0] LocationPicker: mapRef.current is null after timeout")
        setIsLoading(false)
        return
      }

      try {
        console.log("[v0] LocationPicker: Starting map initialization...")
        const L = (await import("leaflet")).default
        LeafletRef.current = L

        // Fix for default marker icon
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        })

        if (mapInstanceRef.current) {
          console.log("[v0] LocationPicker: Removing existing map instance")
          mapInstanceRef.current.remove()
        }

        const center = selectedLocation || [35.6762, 139.6503]
        console.log("[v0] LocationPicker: Creating map with center:", center)
        const map = L.map(mapRef.current).setView(center, 15)
        mapInstanceRef.current = map

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map)

        console.log("[v0] LocationPicker: Map created successfully")

        // Add initial marker if location is set
        if (selectedLocation) {
          markerRef.current = L.marker(selectedLocation).addTo(map)
          console.log("[v0] LocationPicker: Initial marker added")
        }

        // Handle map clicks
        map.on("click", (e: any) => {
          const { lat, lng } = e.latlng
          console.log("[v0] LocationPicker: Map clicked at:", lat, lng)
          setSelectedLocation([lat, lng])

          // Remove old marker
          if (markerRef.current) {
            markerRef.current.remove()
          }

          // Add new marker
          markerRef.current = L.marker([lat, lng]).addTo(map)
        })

        setIsLoading(false)
        console.log("[v0] LocationPicker: Initialization complete")
      } catch (err) {
        console.error("[v0] LocationPicker: Map initialization error:", err)
        setIsLoading(false)
      }
    }

    initMap()

    return () => {
      console.log("[v0] LocationPicker: Cleaning up map")
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      markerRef.current = null
    }
  }, [open])

  const handleConfirm = () => {
    if (selectedLocation) {
      console.log("[v0] LocationPicker: Location confirmed:", selectedLocation)
      onLocationSelect(selectedLocation[0], selectedLocation[1])
      onOpenChange(false)
    }
  }

  const handleGetCurrentLocation = () => {
    console.log("[v0] LocationPicker: Getting current location...")

    if (!navigator.geolocation) {
      console.error("[v0] LocationPicker: Geolocation not available")
      alert("お使いのブラウザは位置情報に対応していません")
      return
    }

    console.log("[v0] LocationPicker: Geolocation available, requesting position...")

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        const accuracy = position.coords.accuracy

        console.log("[v0] LocationPicker: ✅ Location obtained successfully!")
        console.log("[v0] LocationPicker: Latitude:", lat)
        console.log("[v0] LocationPicker: Longitude:", lng)
        console.log("[v0] LocationPicker: Accuracy:", accuracy, "meters")

        setSelectedLocation([lat, lng])

        if (mapInstanceRef.current && LeafletRef.current) {
          mapInstanceRef.current.setView([lat, lng], 15)

          // Remove old marker
          if (markerRef.current) {
            markerRef.current.remove()
          }

          // Add new marker
          markerRef.current = LeafletRef.current.marker([lat, lng]).addTo(mapInstanceRef.current)
          console.log("[v0] LocationPicker: Marker updated to current location")
        }
      },
      (error) => {
        console.error("[v0] LocationPicker: ❌ Geolocation error occurred!")
        console.error("[v0] LocationPicker: Error code:", error.code)
        console.error("[v0] LocationPicker: Error message:", error.message)
        console.error(
          "[v0] LocationPicker: Full error object:",
          JSON.stringify({
            code: error.code,
            message: error.message,
            PERMISSION_DENIED: error.code === 1,
            POSITION_UNAVAILABLE: error.code === 2,
            TIMEOUT: error.code === 3,
          }),
        )

        let errorMessage = "位置情報の取得に失敗しました"

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
        }

        alert(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>地図上で場所を選択</DialogTitle>
          <DialogDescription>地図をクリックして危険な場所を選択してください</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 h-full">
          <div className="relative flex-1">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            )}
            <div ref={mapRef} className="w-full h-full rounded-lg" style={{ minHeight: "400px" }} />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleGetCurrentLocation}
              className="flex-1 bg-transparent"
            >
              <MapPin className="w-4 h-4 mr-2" />
              現在地を取得
            </Button>
            <Button onClick={handleConfirm} disabled={!selectedLocation} className="flex-1">
              この場所に決定
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
