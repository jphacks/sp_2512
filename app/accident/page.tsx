"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapView } from "@/components/map-view"
import { ReportForm } from "@/components/report-form"
import { getReportsByCategory, type Report } from "@/lib/reports"
import { ArrowLeft, Plus } from "lucide-react"

export default function AccidentPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = () => {
    const accidentReports = getReportsByCategory("accident")
    setReports(accidentReports)
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
                <h1 className="text-xl font-bold">交通事故情報</h1>
                <p className="text-sm text-muted-foreground">{reports.length}件の報告</p>
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
            <ReportForm category="accident" onSuccess={handleReportSuccess} onCancel={() => setShowForm(false)} />
          </div>
        )}

        <div className="flex-1 relative">
          <MapView reports={reports} onReportDeleted={loadReports} />
        </div>
      </main>
    </div>
  )
}
