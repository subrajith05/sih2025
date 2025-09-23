"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, MapPin, Search, Bookmark, Send } from "lucide-react"

const jobRecommendations: Array<any> = []
const jobStats = [
  { label: "Total Matches", value: "0", change: "" },
  { label: "Applications Sent", value: "0", change: "" },
  { label: "Saved Jobs", value: "0", change: "" },
]
const savedJobs: Array<any> = []

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [jobTypeFilter, setJobTypeFilter] = useState("all")
  const [remoteFilter, setRemoteFilter] = useState("all")
  const [savedJobIds, setSavedJobIds] = useState(new Set<number>())

  const jobTypes = ["all", "Full-time", "Contract", "Part-time", "Internship"]
  const remoteOptions = ["all", "Remote", "On-site", "Hybrid"]

  const toggleSaveJob = (jobId: number) => {
    setSavedJobIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(jobId)) {
        newSet.delete(jobId)
      } else {
        newSet.add(jobId)
      }
      return newSet
    })
  }

  const filteredJobs = jobRecommendations.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase())
    const matchesType = jobTypeFilter === "all" || job.type === jobTypeFilter
    const matchesRemote =
      remoteFilter === "all" || (remoteFilter === "Remote" && job.remote) || (remoteFilter === "On-site" && !job.remote)

    return matchesSearch && matchesLocation && matchesType && matchesRemote
  })

  const getMatchColor = (match: number) => {
    if (match >= 90) return "text-green-600 dark:text-green-400"
    if (match >= 80) return "text-blue-600 dark:text-blue-400"
    if (match >= 70) return "text-yellow-600 dark:text-yellow-400"
    return "text-gray-600 dark:text-gray-400"
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Job Opportunities</h1>
            <p className="text-muted-foreground mt-1">Add skills/job information</p>
          </div>
          <Button disabled>
            <Send className="w-4 h-4 mr-2" />
            Job Alerts
          </Button>
        </div>

        {/* Job Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {jobStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change || "Add skills/job information"}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="recommendations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="saved">Saved Jobs ({savedJobIds.size})</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="relative lg:col-span-2">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search jobs or companies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Location"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={jobTypeFilter}
                    onChange={(e) => setJobTypeFilter(e.target.value)}
                    className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>
                        {type === "all" ? "All Types" : type}
                      </option>
                    ))}
                  </select>
                  <select
                    value={remoteFilter}
                    onChange={(e) => setRemoteFilter(e.target.value)}
                    className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    {remoteOptions.map((option) => (
                      <option key={option} value={option}>
                        {option === "all" ? "All Locations" : option}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Job Listings */}
            <div className="text-sm text-muted-foreground text-center py-6">Add skills/job information</div>
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bookmark className="w-5 h-5 text-primary" />
                  <span>Saved Jobs</span>
                </CardTitle>
                <CardDescription>Jobs you've bookmarked for later review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No saved jobs yet</h3>
                  <p className="text-muted-foreground">Add skills/job information</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="w-5 h-5 text-primary" />
                  <span>Job Applications</span>
                </CardTitle>
                <CardDescription>Add skills/job information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground text-center py-6">Add skills/job information</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
