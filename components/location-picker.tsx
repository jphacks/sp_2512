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
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(
    initialLocation || [35.6762, 139.6503],
  )

  useEffect(() => {
    if (!open || typeof window === "undefined" || !mapRef.current) return

    const initMap = async () => {
      try {
        const L = (await import("leaflet")).default

        // Fix for default marker icon
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        })

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
        }

        const map = L.map(mapRef.current).setView(selectedLocation || [35.6762, 139.6503], 15)
        mapInstanceRef.current = map

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map)

        // Add initial marker if location is set
        if (selectedLocation) {
          markerRef.current = L.marker(selectedLocation).addTo(map)
        }

        // Handle map clicks
        map.on("click", (e: any) => {
          const { lat, lng } = e.latlng
          setSelectedLocation([lat, lng])

          // Remove old marker
          if (markerRef.current) {
            markerRef.current.remove()
          }

          // Add new marker
          markerRef.current = L.marker([lat, lng]).addTo(map)
        })

        setIsLoading(false)
      } catch (err) {
        console.error("Map initialization error:", err)
        setIsLoading(false)
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      markerRef.current = null
    }
  }, [open])

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation[0], selectedLocation[1])
      onOpenChange(false)
    }
  }

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("お使いのブラウザは位置情報に対応していません")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        setSelectedLocation([lat, lng])

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng], 15)

          // Remove old marker
          if (markerRef.current) {
            markerRef.current.remove()
          }

          // Add new marker
          const L = require("leaflet")
          markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current)
        }
      },
      (error) => {
        alert("位置情報の取得に失敗しました")
        console.error(error)
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
