"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapView } from "@/components/map-view"
import { ReportForm } from "@/components/report-form"
import { getReportsByCategory, type Report } from "@/lib/reports"
import { getNewsByCategory, type NewsReport } from "@/lib/news"
import { ArrowLeft, Plus, Navigation } from "lucide-react"

export default function ComplexIntersectionPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [newsReports, setNewsReports] = useState<NewsReport[]>([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadReports()
    loadNews()
  }, [])

  const loadReports = () => {
    const complexReports = getReportsByCategory("complex_intersection")
    setReports(complexReports)
  }

  const loadNews = () => {
    const complexNews = getNewsByCategory("complex_intersection")
    setNewsReports(complexNews)
  }

  const handleReportSuccess = () => {
    loadReports()
    setShowForm(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-gradient-to-r from-amber-500 via-orange-600 to-red-500 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 transition-all hover:scale-105"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg border border-white/30">
                  <Navigation className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">複雑な交差点情報</h1>
                  <p className="text-sm text-white/90 font-medium">
                    ユーザー投稿: {reports.length}件 / ニュース: {newsReports.length}件
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-white text-amber-600 hover:bg-white/90 font-semibold shadow-md transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              投稿
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {showForm && (
          <div className="container mx-auto px-4 py-4">
            <ReportForm
              category="complex_intersection"
              onSuccess={handleReportSuccess}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <div className="flex-1 relative">
          <MapView reports={reports} newsReports={newsReports} onReportDeleted={loadReports} />
        </div>
      </main>
    </div>
  )
}
