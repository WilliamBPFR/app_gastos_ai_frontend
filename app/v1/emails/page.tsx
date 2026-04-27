"use client"

import * as React from "react"
import { useState } from "react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Icons
const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
)

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

const MoreHorizontalIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
)

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
)

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
)

const ArrowUpDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21 16-4 4-4-4" />
    <path d="M17 20V4" />
    <path d="m3 8 4-4 4 4" />
    <path d="M7 4v16" />
  </svg>
)

// Sample email run data
const sampleEmailRuns = [
  {
    id: 1,
    runDate: new Date(2026, 3, 25, 14, 30),
    emailsAnalyzed: 45,
    txnMatches: 12,
    attachments: 8,
    retrievalTime: 2.4,
    analysisTime: 8.7,
  },
  {
    id: 2,
    runDate: new Date(2026, 3, 24, 10, 15),
    emailsAnalyzed: 38,
    txnMatches: 9,
    attachments: 5,
    retrievalTime: 1.8,
    analysisTime: 6.2,
  },
  {
    id: 3,
    runDate: new Date(2026, 3, 23, 16, 45),
    emailsAnalyzed: 52,
    txnMatches: 15,
    attachments: 11,
    retrievalTime: 3.1,
    analysisTime: 12.1,
  },
  {
    id: 4,
    runDate: new Date(2026, 3, 22, 9, 0),
    emailsAnalyzed: 29,
    txnMatches: 7,
    attachments: 3,
    retrievalTime: 1.5,
    analysisTime: 4.8,
  },
  {
    id: 5,
    runDate: new Date(2026, 3, 21, 11, 30),
    emailsAnalyzed: 61,
    txnMatches: 18,
    attachments: 14,
    retrievalTime: 4.2,
    analysisTime: 15.3,
  },
  {
    id: 6,
    runDate: new Date(2026, 3, 20, 15, 0),
    emailsAnalyzed: 33,
    txnMatches: 8,
    attachments: 6,
    retrievalTime: 2.0,
    analysisTime: 5.9,
  },
  {
    id: 7,
    runDate: new Date(2026, 3, 19, 8, 45),
    emailsAnalyzed: 47,
    txnMatches: 11,
    attachments: 9,
    retrievalTime: 2.8,
    analysisTime: 9.4,
  },
  {
    id: 8,
    runDate: new Date(2026, 3, 18, 13, 20),
    emailsAnalyzed: 55,
    txnMatches: 14,
    attachments: 7,
    retrievalTime: 3.5,
    analysisTime: 11.2,
  },
  {
    id: 9,
    runDate: new Date(2026, 3, 17, 17, 10),
    emailsAnalyzed: 41,
    txnMatches: 10,
    attachments: 4,
    retrievalTime: 2.2,
    analysisTime: 7.1,
  },
  {
    id: 10,
    runDate: new Date(2026, 3, 16, 10, 5),
    emailsAnalyzed: 36,
    txnMatches: 6,
    attachments: 2,
    retrievalTime: 1.9,
    analysisTime: 5.4,
  },
  {
    id: 11,
    runDate: new Date(2026, 3, 15, 14, 55),
    emailsAnalyzed: 58,
    txnMatches: 16,
    attachments: 12,
    retrievalTime: 3.8,
    analysisTime: 13.6,
  },
  {
    id: 12,
    runDate: new Date(2026, 3, 14, 9, 30),
    emailsAnalyzed: 27,
    txnMatches: 5,
    attachments: 1,
    retrievalTime: 1.3,
    analysisTime: 3.9,
  },
]

export default function EmailsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [emailsFilter, setEmailsFilter] = useState<string>("all")
  const [txnMatchesFilter, setTxnMatchesFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Filter logic
  const filteredRuns = sampleEmailRuns.filter((run) => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      const dateStr = format(run.runDate, "MMM d, yyyy h:mm a").toLowerCase()
      if (!dateStr.includes(searchLower)) {
        return false
      }
    }
    if (dateRange?.from && run.runDate < dateRange.from) {
      return false
    }
    if (dateRange?.to) {
      const endOfDay = new Date(dateRange.to)
      endOfDay.setHours(23, 59, 59, 999)
      if (run.runDate > endOfDay) {
        return false
      }
    }
    if (emailsFilter !== "all") {
      if (emailsFilter === "low" && run.emailsAnalyzed >= 30) return false
      if (emailsFilter === "medium" && (run.emailsAnalyzed < 30 || run.emailsAnalyzed >= 50)) return false
      if (emailsFilter === "high" && run.emailsAnalyzed < 50) return false
    }
    if (txnMatchesFilter !== "all") {
      if (txnMatchesFilter === "low" && run.txnMatches >= 10) return false
      if (txnMatchesFilter === "medium" && (run.txnMatches < 10 || run.txnMatches >= 15)) return false
      if (txnMatchesFilter === "high" && run.txnMatches < 15) return false
    }
    return true
  })

  const totalPages = Math.ceil(filteredRuns.length / itemsPerPage)
  const paginatedRuns = filteredRuns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const hasActiveFilters =
    searchQuery ||
    dateRange ||
    emailsFilter !== "all" ||
    txnMatchesFilter !== "all"

  const clearFilters = () => {
    setSearchQuery("")
    setDateRange(undefined)
    setEmailsFilter("all")
    setTxnMatchesFilter("all")
    setCurrentPage(1)
  }

  // Helper to get badge styling based on value thresholds
  const getEmailsBadge = (count: number) => {
    if (count >= 50) return "bg-emerald-100 text-emerald-700"
    if (count >= 30) return "bg-blue-100 text-blue-700"
    return "bg-gray-100 text-gray-600"
  }

  const getTxnMatchesBadge = (count: number) => {
    if (count >= 15) return "bg-emerald-100 text-emerald-700"
    if (count >= 10) return "bg-amber-100 text-amber-700"
    return "bg-gray-100 text-gray-600"
  }

  const getTimeBadge = (seconds: number) => {
    if (seconds <= 3) return "text-emerald-600"
    if (seconds <= 8) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Emails</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Review email processing runs and analysis results
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <RefreshIcon className="w-4 h-4 mr-2" />
          Run Analysis
        </Button>
      </div>

      {/* Filters Card */}
      <Card>
        <CardContent className="p-4 space-y-3">
          {/* First Row: Search and Date */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search email runs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            {/* Date Range */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "justify-start text-left font-normal w-full sm:w-auto h-9",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM d, yyyy")
                    )
                  ) : (
                    <span>Select date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Second Row: Filter Selects and Export */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Emails Analyzed Filter */}
            <Select value={emailsFilter} onValueChange={setEmailsFilter}>
              <SelectTrigger className="w-[150px] h-9 text-sm">
                <SelectValue placeholder="Emails" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Emails</SelectItem>
                <SelectItem value="low">{"< 30 emails"}</SelectItem>
                <SelectItem value="medium">30-49 emails</SelectItem>
                <SelectItem value="high">50+ emails</SelectItem>
              </SelectContent>
            </Select>

            {/* Txn Matches Filter */}
            <Select value={txnMatchesFilter} onValueChange={setTxnMatchesFilter}>
              <SelectTrigger className="w-[150px] h-9 text-sm">
                <SelectValue placeholder="Matches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Matches</SelectItem>
                <SelectItem value="low">{"< 10 matches"}</SelectItem>
                <SelectItem value="medium">10-14 matches</SelectItem>
                <SelectItem value="high">15+ matches</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-9 text-muted-foreground hover:text-foreground"
              >
                <XIcon className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}

            {/* Export Button */}
            <Button variant="outline" size="sm" className="h-9 ml-auto">
              <DownloadIcon className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {paginatedRuns.length} of {filteredRuns.length} email runs
        </p>
      </div>

      {/* Email Runs Table */}
      <Card className="overflow-hidden">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
              <TableHead className="w-[20%] px-4 py-3 font-semibold text-foreground">
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  Run Date
                  <ArrowUpDownIcon className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="w-[14%] px-4 py-3 text-center font-semibold text-foreground">
                <button className="flex items-center gap-1 justify-center hover:text-primary transition-colors">
                  Emails
                  <ArrowUpDownIcon className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="w-[14%] px-4 py-3 text-center font-semibold text-foreground">
                <button className="flex items-center gap-1 justify-center hover:text-primary transition-colors">
                  Matches
                  <ArrowUpDownIcon className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="w-[14%] px-4 py-3 text-center font-semibold text-foreground">
                Attachments
              </TableHead>
              <TableHead className="w-[14%] px-4 py-3 text-center font-semibold text-foreground">
                Retrieval
              </TableHead>
              <TableHead className="w-[14%] px-4 py-3 text-center font-semibold text-foreground">
                Analysis
              </TableHead>
              <TableHead className="w-[5%] px-4 py-3"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRuns.map((run) => (
              <TableRow key={run.id} className="group border-b border-border last:border-b-0 hover:bg-muted/30">
                <TableCell className="w-[20%] px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm text-foreground">
                      {format(run.runDate, "MMM d, yyyy")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(run.runDate, "h:mm a")}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="w-[14%] px-4 py-3 text-center">
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium text-xs border-transparent",
                      getEmailsBadge(run.emailsAnalyzed)
                    )}
                  >
                    {run.emailsAnalyzed}
                  </Badge>
                </TableCell>
                <TableCell className="w-[14%] px-4 py-3 text-center">
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium text-xs border-transparent",
                      getTxnMatchesBadge(run.txnMatches)
                    )}
                  >
                    {run.txnMatches}
                  </Badge>
                </TableCell>
                <TableCell className="w-[14%] px-4 py-3 text-center text-sm text-muted-foreground">
                  {run.attachments}
                </TableCell>
                <TableCell className={cn("w-[14%] px-4 py-3 text-center text-sm font-medium", getTimeBadge(run.retrievalTime))}>
                  {run.retrievalTime.toFixed(1)}s
                </TableCell>
                <TableCell className={cn("w-[14%] px-4 py-3 text-center text-sm font-medium", getTimeBadge(run.analysisTime))}>
                  {run.analysisTime.toFixed(1)}s
                </TableCell>
                <TableCell className="w-[5%] px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontalIcon className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>View Transactions</DropdownMenuItem>
                      <DropdownMenuItem>Re-run Analysis</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {paginatedRuns.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No email runs found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredRuns.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredRuns.length)} of {filteredRuns.length} runs
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-[70px] h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-8"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="h-8"
          >
            Next
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
