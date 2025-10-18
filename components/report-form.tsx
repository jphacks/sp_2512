"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { addReport, type ReportCategory, type DangerLevel } from "@/lib/reports"
import { getCurrentUser } from "@/lib/auth"
import { MapPin, X } from "lucide-react"
import { LocationPicker } from "./location-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ReportFormProps {
  category: ReportCategory
  onSuccess?: () => void
  onCancel?: () => void
}

export function ReportForm({ category, onSuccess, onCancel }: ReportFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState<[number, number] | null>(null)
  const [dangerLevel, setDangerLevel] = useState<DangerLevel>("medium")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [showLocationPicker, setShowLocationPicker] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      if (!location) {
        setError("地図上で場所を選択してください")
        setIsSubmitting(false)
        return
      }

      if (!title.trim() || !description.trim()) {
        setError("タイトルと説明を入力してください")
        setIsSubmitting(false)
        return
      }

      const user = getCurrentUser()
      if (!user) {
        setError("ログインが必要です")
        setIsSubmitting(false)
        return
      }

      addReport({
        category,
        latitude: location[0],
        longitude: location[1],
        title: title.trim(),
        description: description.trim(),
        dangerLevel,
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
      })

      setTitle("")
      setDescription("")
      setLocation(null)
      setDangerLevel("medium")

      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError("投稿に失敗しました")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation([lat, lng])
    setError("")
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>新しい情報を投稿</CardTitle>
              <CardDescription>
                {category === "safety"
                  ? "治安・事件情報"
                  : category === "accident"
                    ? "交通事故情報"
                    : "複雑な交差点情報"}
                を共有
              </CardDescription>
            </div>
            {onCancel && (
              <Button variant="ghost" size="icon" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例: 夜間の路地裏は注意"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">詳細・根拠</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="具体的な状況や根拠を記入してください"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dangerLevel">危険度</Label>
              <Select value={dangerLevel} onValueChange={(value) => setDangerLevel(value as DangerLevel)}>
                <SelectTrigger id="dangerLevel">
                  <SelectValue placeholder="危険度を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span>低 - 注意が必要</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <span>中 - 警戒が必要</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span>高 - 非常に危険</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>場所</Label>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowLocationPicker(true)}
                className="w-full bg-transparent"
              >
                <MapPin className="w-4 h-4 mr-2" />
                {location ? "選択した場所を変更" : "地図上で場所を選択"}
              </Button>
              {location && (
                <p className="text-sm text-muted-foreground">
                  選択済み: 緯度 {location[0].toFixed(6)}, 経度 {location[1].toFixed(6)}
                </p>
              )}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "投稿中..." : "投稿する"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <LocationPicker
        open={showLocationPicker}
        onOpenChange={setShowLocationPicker}
        onLocationSelect={handleLocationSelect}
        initialLocation={location || undefined}
      />
    </>
  )
}
