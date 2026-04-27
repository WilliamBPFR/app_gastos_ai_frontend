"use client"

import * as React from "react"
import { useState } from "react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
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

// Sample transaction data
const sampleTransactions = [
  {
    id: 1,
    type: "expense",
    date: new Date(2026, 3, 24),
    account: "Bank Account",
    amount: 45.50,
    category: "Food",
    processingType: "telegram_audio",
    description: "Lunch at restaurant",
  },
  {
    id: 2,
    type: "income",
    date: new Date(2026, 3, 23),
    account: "Bank Account",
    amount: 2500.00,
    category: "Salary",
    processingType: "email",
    description: "Monthly salary deposit",
  },
  {
    id: 3,
    type: "expense",
    date: new Date(2026, 3, 22),
    account: "Credit Card",
    amount: 120.00,
    category: "Shopping",
    processingType: "user_entered",
    description: "Online shopping",
  },
  {
    id: 4,
    type: "expense",
    date: new Date(2026, 3, 21),
    account: "Cash Wallet",
    amount: 35.00,
    category: "Transport",
    processingType: "telegram_message",
    description: "Taxi ride",
  },
  {
    id: 5,
    type: "expense",
    date: new Date(2026, 3, 20),
    account: "Credit Card",
    amount: 89.99,
    category: "Bills",
    processingType: "email",
    description: "Internet bill",
  },
  {
    id: 6,
    type: "income",
    date: new Date(2026, 3, 19),
    account: "Bank Account",
    amount: 150.00,
    category: "Freelance",
    processingType: "user_entered",
    description: "Freelance project payment",
  },
  {
    id: 7,
    type: "expense",
    date: new Date(2026, 3, 18),
    account: "Credit Card",
    amount: 65.00,
    category: "Entertainment",
    processingType: "telegram_audio",
    description: "Concert tickets",
  },
  {
    id: 8,
    type: "expense",
    date: new Date(2026, 3, 17),
    account: "Cash Wallet",
    amount: 28.50,
    category: "Food",
    processingType: "telegram_message",
    description: "Groceries",
  },
  {
    id: 9,
    type: "expense",
    date: new Date(2026, 3, 16),
    account: "Bank Account",
    amount: 200.00,
    category: "Health",
    processingType: "email",
    description: "Doctor visit",
  },
  {
    id: 10,
    type: "expense",
    date: new Date(2026, 3, 15),
    account: "Credit Card",
    amount: 55.00,
    category: "Shopping",
    processingType: "user_entered",
    description: "Clothing purchase",
  },
]

const processingTypeConfig: Record<string, { label: string; className: string }> = {
  telegram_audio: {
    label: "Telegram Audio",
    className: "bg-cyan-100 text-cyan-700 border-cyan-200",
  },
  telegram_message: {
    label: "Telegram Message",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  email: {
    label: "Email Processing",
    className: "bg-purple-100 text-purple-700 border-purple-200",
  },
  user_entered: {
    label: "User Entered",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
}

const categoryColors: Record<string, string> = {
  Food: "bg-emerald-100 text-emerald-700",
  Transport: "bg-blue-100 text-blue-700",
  Shopping: "bg-amber-100 text-amber-700",
  Bills: "bg-red-100 text-red-700",
  Entertainment: "bg-purple-100 text-purple-700",
  Health: "bg-pink-100 text-pink-700",
  Salary: "bg-green-100 text-green-700",
  Freelance: "bg-teal-100 text-teal-700",
}

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [transactionType, setTransactionType] = useState<string>("all")
  const [account, setAccount] = useState<string>("all")
  const [category, setCategory] = useState<string>("all")
  const [processingType, setProcessingType] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    type: "expense",
    date: format(new Date(), "yyyy-MM-dd"),
    sourceAccount: "Bank Account",
    amount: "",
    category: "Food",
    description: "",
    processingType: "user_entered",
  })

  const expenseCategoryOptions = [
    "Food",
    "Transport",
    "Bills",
    "Entertainment",
    "Health",
    "Shopping",
    "Education",
  ]

  const incomeCategoryOptions = ["Salary", "Freelance", "Investments", "Bonus"]

  const currentCategoryOptions =
    newTransaction.type === "income" ? incomeCategoryOptions : expenseCategoryOptions

  const resetNewTransaction = () => {
    setNewTransaction({
      type: "expense",
      date: format(new Date(), "yyyy-MM-dd"),
      sourceAccount: "Bank Account",
      amount: "",
      category: "Food",
      description: "",
      processingType: "user_entered",
    })
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsCreateDialogOpen(open)
    if (!open) {
      resetNewTransaction()
    }
  }

  const handleCreateTransaction = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    setIsCreateDialogOpen(false)
    resetNewTransaction()
  }

  // Filter logic
  const filteredTransactions = sampleTransactions.filter((tx) => {
    if (searchQuery && !tx.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (transactionType !== "all" && tx.type !== transactionType) {
      return false
    }
    if (account !== "all" && tx.account !== account) {
      return false
    }
    if (category !== "all" && tx.category !== category) {
      return false
    }
    if (processingType !== "all" && tx.processingType !== processingType) {
      return false
    }
    if (dateRange?.from && tx.date < dateRange.from) {
      return false
    }
    if (dateRange?.to && tx.date > dateRange.to) {
      return false
    }
    return true
  })

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const hasActiveFilters =
    searchQuery ||
    dateRange ||
    transactionType !== "all" ||
    account !== "all" ||
    category !== "all" ||
    processingType !== "all"

  const clearFilters = () => {
    setSearchQuery("")
    setDateRange(undefined)
    setTransactionType("all")
    setAccount("all")
    setCategory("all")
    setProcessingType("all")
    setCurrentPage(1)
  }

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={handleDialogOpenChange}>
      <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Transactions</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage and review all registered transactions
          </p>
        </div>
        <DialogTrigger asChild>
          <Button className="w-full sm:w-auto">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </DialogTrigger>
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
                placeholder="Search transactions..."
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
            {/* Transaction Type */}
            <Select value={transactionType} onValueChange={setTransactionType}>
              <SelectTrigger className="w-[120px] h-9 text-sm">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>

            {/* Account */}
            <Select value={account} onValueChange={setAccount}>
              <SelectTrigger className="w-[140px] h-9 text-sm">
                <SelectValue placeholder="Account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                <SelectItem value="Bank Account">Bank Account</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Cash Wallet">Cash Wallet</SelectItem>
              </SelectContent>
            </Select>

            {/* Category */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[150px] h-9 text-sm">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Transport">Transport</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
                <SelectItem value="Bills">Bills</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Salary">Salary</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>

            {/* Processing Type */}
            <Select value={processingType} onValueChange={setProcessingType}>
              <SelectTrigger className="w-[140px] h-9 text-sm">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="telegram_audio">Telegram Audio</SelectItem>
                <SelectItem value="telegram_message">Telegram Message</SelectItem>
                <SelectItem value="email">Email Processing</SelectItem>
                <SelectItem value="user_entered">User Entered</SelectItem>
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
          Showing {paginatedTransactions.length} of {filteredTransactions.length} transactions
        </p>
      </div>

      {/* Transactions Table */}
      <Card className="overflow-hidden">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
              <TableHead className="w-[10%] px-4 py-3 font-semibold text-foreground">
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  Type
                  <ArrowUpDownIcon className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="w-[12%] px-4 py-3 font-semibold text-foreground">
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  Date
                  <ArrowUpDownIcon className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="w-[15%] px-4 py-3 font-semibold text-foreground">Source Account</TableHead>
              <TableHead className="w-[12%] px-4 py-3 text-right font-semibold text-foreground">
                <button className="flex items-center gap-1 ml-auto hover:text-primary transition-colors">
                  Amount
                  <ArrowUpDownIcon className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="w-[14%] px-4 py-3 font-semibold text-foreground">Category</TableHead>
              <TableHead className="w-[17%] px-4 py-3 font-semibold text-foreground">Processing Type</TableHead>
              <TableHead className="w-[5%] px-4 py-3"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.map((tx) => (
              <TableRow key={tx.id} className="group border-b border-border last:border-b-0 hover:bg-muted/30">
                <TableCell className="w-[10%] px-4 py-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium text-xs",
                      tx.type === "income"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    )}
                  >
                    {tx.type === "income" ? "Income" : "Expense"}
                  </Badge>
                </TableCell>
                <TableCell className="w-[12%] px-4 py-3 text-muted-foreground text-sm">
                  {format(tx.date, "MMM d, yyyy")}
                </TableCell>
                <TableCell className="w-[15%] px-4 py-3 font-medium text-sm truncate">{tx.account}</TableCell>
                <TableCell
                  className={cn(
                    "w-[12%] px-4 py-3 text-right font-semibold text-sm",
                    tx.type === "income" ? "text-emerald-600" : "text-red-600"
                  )}
                >
                  {tx.type === "income" ? "+" : "-"}${tx.amount.toFixed(2)}
                </TableCell>
                <TableCell className="w-[14%] px-4 py-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-normal text-xs border-transparent",
                      categoryColors[tx.category] || "bg-gray-100 text-gray-700"
                    )}
                  >
                    {tx.category}
                  </Badge>
                </TableCell>
                <TableCell className="w-[17%] px-4 py-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-normal text-xs",
                      processingTypeConfig[tx.processingType]?.className
                    )}
                  >
                    {processingTypeConfig[tx.processingType]?.label}
                  </Badge>
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
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {paginatedTransactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No transactions found matching your filters.
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
            Showing {filteredTransactions.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
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
            disabled={currentPage === totalPages}
            className="h-8"
          >
            Next
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
      </div>

      <DialogContent className="p-0 sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleCreateTransaction} className="space-y-0">
          <DialogHeader className="border-b px-6 pt-6 pb-4">
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>
              Register a new income or expense manually.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transaction-type">Transaction Type</Label>
                <Select
                  value={newTransaction.type}
                  onValueChange={(value) =>
                    setNewTransaction((prev) => ({
                      ...prev,
                      type: value,
                      category: value === "income" ? "Salary" : "Food",
                    }))
                  }
                >
                  <SelectTrigger id="transaction-type" className="h-10">
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transaction-date">Date</Label>
                <Input
                  id="transaction-date"
                  type="date"
                  value={newTransaction.date}
                  onChange={(event) =>
                    setNewTransaction((prev) => ({ ...prev, date: event.target.value }))
                  }
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transaction-account">Source Account</Label>
                <Select
                  value={newTransaction.sourceAccount}
                  onValueChange={(value) =>
                    setNewTransaction((prev) => ({ ...prev, sourceAccount: value }))
                  }
                >
                  <SelectTrigger id="transaction-account" className="h-10">
                    <SelectValue placeholder="Choose source account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bank Account">Bank Account</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Cash Wallet">Cash Wallet</SelectItem>
                    <SelectItem value="Savings Account">Savings Account</SelectItem>
                    <SelectItem value="Payroll Account">Payroll Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transaction-amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <Input
                    id="transaction-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={newTransaction.amount}
                    onChange={(event) =>
                      setNewTransaction((prev) => ({ ...prev, amount: event.target.value }))
                    }
                    className="h-10 pl-7"
                  />
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="transaction-category">Category</Label>
                <Select
                  value={newTransaction.category}
                  onValueChange={(value) =>
                    setNewTransaction((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger id="transaction-category" className="h-10">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentCategoryOptions.map((categoryOption) => (
                      <SelectItem key={categoryOption} value={categoryOption}>
                        {categoryOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="transaction-description">Description</Label>
                <Textarea
                  id="transaction-description"
                  placeholder="Add a short description..."
                  value={newTransaction.description}
                  onChange={(event) =>
                    setNewTransaction((prev) => ({ ...prev, description: event.target.value }))
                  }
                  className="min-h-[96px]"
                />
              </div>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="transaction-processing-type">Processing Type</Label>
                <Badge
                  variant="outline"
                  className="bg-emerald-100 text-emerald-700 border-emerald-200"
                >
                  User Entered
                </Badge>
              </div>
              <Select value={newTransaction.processingType} disabled>
                <SelectTrigger id="transaction-processing-type" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user_entered">User Entered</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Transactions created here are marked as User Entered for manual tracking.
              </p>
            </div>
          </div>

          <DialogFooter className="border-t px-6 py-4">
            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
