"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapView } from "@/components/map-view"
import { ReportForm } from "@/components/report-form"
import { getReportsByCategory, type Report } from "@/lib/reports"
import { getNewsByCategory, type NewsReport } from "@/lib/news"
import { ArrowLeft, Plus } from "lucide-react"

export default function SafetyPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [newsReports, setNewsReports] = useState<NewsReport[]>([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadReports()
    loadNews()
  }, [])

  const loadReports = () => {
    const safetyReports = getReportsByCategory("safety")
    setReports(safetyReports)
  }

  const loadNews = () => {
    const safetyNews = getNewsByCategory("safety")
    setNewsReports(safetyNews)
  }

  const handleReportSuccess = () => {
    loadReports()
    setShowForm(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">治安・事件情報</h1>
                <p className="text-sm text-muted-foreground">
                  ユーザー投稿: {reports.length}件 / ニュース: {newsReports.length}件
                </p>
              </div>
            </div>
            <Button onClick={() => setShowForm(!showForm)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              投稿
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {showForm && (
          <div className="container mx-auto px-4 py-4">
            <ReportForm category="safety" onSuccess={handleReportSuccess} onCancel={() => setShowForm(false)} />
          </div>
        )}

        <div className="flex-1 relative">
          <MapView reports={reports} newsReports={newsReports} onReportDeleted={loadReports} />
        </div>
      </main>
    </div>
  )
}
