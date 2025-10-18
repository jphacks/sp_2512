export type ReportCategory = "safety" | "accident"

export interface Report {
  id: string
  category: ReportCategory
  latitude: number
  longitude: number
  title: string
  description: string
  createdAt: string
  userId: string
  userEmail: string
  userName: string
}

const STORAGE_KEY = "safety_map_reports"

export function getReports(): Report[] {
  if (typeof window === "undefined") return []

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Failed to load reports:", error)
    return []
  }
}

export function getReportsByCategory(category: ReportCategory): Report[] {
  return getReports().filter((report) => report.category === category)
}

export function addReport(report: Omit<Report, "id" | "createdAt">): Report {
  const newReport: Report = {
    ...report,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }

  const reports = getReports()
  reports.push(newReport)

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
  } catch (error) {
    console.error("Failed to save report:", error)
    throw error
  }

  return newReport
}

export function deleteReport(id: string): void {
  const reports = getReports().filter((report) => report.id !== id)

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
  } catch (error) {
    console.error("Failed to delete report:", error)
    throw error
  }
}
