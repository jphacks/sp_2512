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

    const initMap = async () => {
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
        const map = L.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          touchZoom: true,
          dragging: true,
        }).setView(center, 16)
        mapInstanceRef.current = map

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map)

        console.log("[v0] LocationPicker: Map created successfully")

        if (selectedLocation) {
          markerRef.current = L.marker(selectedLocation).addTo(map)
          console.log("[v0] LocationPicker: Initial marker added")
        }

        map.on("click", (e: any) => {
          const { lat, lng } = e.latlng
          console.log("[v0] LocationPicker: ✅ Map clicked at:", lat, lng)
          setSelectedLocation([lat, lng])

          if (markerRef.current) {
            markerRef.current.remove()
          }

          markerRef.current = L.marker([lat, lng]).addTo(map)
          console.log("[v0] LocationPicker: Marker updated to clicked location")
        })

        setTimeout(() => {
          map.invalidateSize()
          console.log("[v0] LocationPicker: Map size invalidated")
        }, 200)

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
          mapInstanceRef.current.setView([lat, lng], 16)

          if (markerRef.current) {
            markerRef.current.remove()
          }

          markerRef.current = LeafletRef.current.marker([lat, lng]).addTo(mapInstanceRef.current)
          console.log("[v0] LocationPicker: Marker updated to current location")
        }
      },
      (error) => {
        console.error("[v0] LocationPicker: ❌ Geolocation error occurred!")
        console.error("[v0] LocationPicker: Error code:", error.code)
        console.error("[v0] LocationPicker: Error message:", error.message)

        let errorMessage = "位置情報の取得に失敗しました"

        switch (error.code) {
          case 1:
            errorMessage = "位置情報の使用が許可されていません。ブラウザの設定を確認してください。"
            break
          case 2:
            errorMessage = "位置情報を取得できませんでした。しばらくしてから再度お試しください。"
            break
          case 3:
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
      <DialogContent className="max-w-3xl h-[75vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-4 pb-2 shrink-0 border-b">
          <DialogTitle className="text-lg">地図上で場所を選択</DialogTitle>
          <DialogDescription className="text-sm">
            地図をタップまたはクリックして場所を選択してください
          </DialogDescription>
        </DialogHeader>
        <div className="px-3 py-3 flex-1 overflow-hidden">
          <div
            className="relative w-full rounded-lg overflow-hidden"
            style={{
              height: "45vh",
              minHeight: "300px",
              touchAction: "auto",
              WebkitTouchCallout: "none",
              WebkitUserSelect: "none",
            }}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted z-[1000] rounded-lg">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            )}
            <div
              ref={mapRef}
              className="w-full h-full rounded-lg"
              style={{
                zIndex: 1,
                touchAction: "auto",
              }}
            />
          </div>
        </div>
        <div className="px-4 pb-4 pt-3 shrink-0 border-t bg-background sticky bottom-0">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleGetCurrentLocation}
              className="flex-1 h-12 text-base font-medium bg-transparent"
            >
              <MapPin className="w-5 h-5 mr-2" />
              現在地を取得
            </Button>
            <Button onClick={handleConfirm} disabled={!selectedLocation} className="flex-1 h-12 text-base font-medium">
              この場所に決定
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
