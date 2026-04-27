"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import {
  PlusIcon,
  SearchIcon,
  MoreHorizontalIcon,
  ArrowUpDownIcon,
  XIcon,
  DownloadIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Sample data
const sampleAccounts = [
  {
    id: "ACC-001",
    name: "Bank Account",
    description: "Primary checking account for daily expenses",
    active: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "ACC-002",
    name: "Credit Card",
    description: "Visa card for online purchases",
    active: true,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "ACC-003",
    name: "Cash Wallet",
    description: "Physical cash tracking",
    active: true,
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "ACC-004",
    name: "Savings Account",
    description: "Emergency fund and savings",
    active: true,
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "ACC-005",
    name: "Payroll Account",
    description: "Salary deposits",
    active: true,
    createdAt: new Date("2024-02-15"),
  },
  {
    id: "ACC-006",
    name: "Main Checking",
    description: "Secondary bank account",
    active: false,
    createdAt: new Date("2024-03-01"),
  },
  {
    id: "ACC-007",
    name: "Investment Account",
    description: "Stock and ETF investments",
    active: true,
    createdAt: new Date("2024-03-10"),
  },
  {
    id: "ACC-008",
    name: "Travel Card",
    description: "Credit card for travel expenses",
    active: false,
    createdAt: new Date("2024-03-15"),
  },
  {
    id: "ACC-009",
    name: "Business Account",
    description: "Freelance income deposits",
    active: true,
    createdAt: new Date("2024-03-20"),
  },
  {
    id: "ACC-010",
    name: "Petty Cash",
    description: "Small daily expenses",
    active: true,
    createdAt: new Date("2024-04-01"),
  },
  {
    id: "ACC-011",
    name: "Joint Account",
    description: "Shared household expenses",
    active: true,
    createdAt: new Date("2024-04-05"),
  },
  {
    id: "ACC-012",
    name: "Rewards Card",
    description: "Cashback credit card",
    active: false,
    createdAt: new Date("2024-04-10"),
  },
]

export default function AccountsPage() {
  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [activeStatus, setActiveStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newAccount, setNewAccount] = useState({
    name: "",
    description: "",
    type: "bank_account",
    initialBalance: "",
    active: true,
  })

  const resetNewAccount = () => {
    setNewAccount({
      name: "",
      description: "",
      type: "bank_account",
      initialBalance: "",
      active: true,
    })
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsCreateDialogOpen(open)
    if (!open) {
      resetNewAccount()
    }
  }

  const handleCreateAccount = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    setIsCreateDialogOpen(false)
    resetNewAccount()
  }

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Check if any filters are active
  const hasActiveFilters = searchQuery !== "" || activeStatus !== "all"

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setActiveStatus("all")
    setCurrentPage(1)
  }

  // Filter and sort accounts
  const filteredAccounts = useMemo(() => {
    let result = [...sampleAccounts]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (account) =>
          account.id.toLowerCase().includes(query) ||
          account.name.toLowerCase().includes(query) ||
          account.description.toLowerCase().includes(query)
      )
    }

    // Active status filter
    if (activeStatus !== "all") {
      const isActive = activeStatus === "active"
      result = result.filter((account) => account.active === isActive)
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case "oldest":
        result.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        break
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
    }

    return result
  }, [searchQuery, activeStatus, sortBy])

  // Pagination calculations
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage)
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchQuery, activeStatus])

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={handleDialogOpenChange}>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Accounts</h1>
          <p className="text-muted-foreground">
            Manage the accounts used to register income and expenses
          </p>
        </div>
        <DialogTrigger asChild>
          <Button className="w-full sm:w-auto">
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Account
          </Button>
        </DialogTrigger>
      </div>

      {/* Filters Card */}
      <Card>
        <CardContent className="p-4 space-y-3">
          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            {/* Active Status Filter */}
            <Select value={activeStatus} onValueChange={setActiveStatus}>
              <SelectTrigger className="w-[130px] h-9 text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px] h-9 text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
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

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredAccounts.length} of {sampleAccounts.length} accounts
      </p>

      {/* Accounts Table */}
      <Card className="overflow-hidden">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
              <TableHead className="w-[12%] px-4 py-3 font-semibold text-foreground">
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  Account ID
                  <ArrowUpDownIcon className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="w-[18%] px-4 py-3 font-semibold text-foreground">
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  Account Name
                  <ArrowUpDownIcon className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="w-[35%] px-4 py-3 font-semibold text-foreground">
                Description
              </TableHead>
              <TableHead className="w-[10%] px-4 py-3 font-semibold text-foreground text-center">
                Active
              </TableHead>
              <TableHead className="w-[15%] px-4 py-3 font-semibold text-foreground">
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  Created At
                  <ArrowUpDownIcon className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="w-[5%] px-4 py-3"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAccounts.map((account) => (
              <TableRow
                key={account.id}
                className="group border-b border-border last:border-b-0 hover:bg-muted/30"
              >
                <TableCell className="w-[12%] px-4 py-3 font-mono text-sm text-muted-foreground">
                  {account.id}
                </TableCell>
                <TableCell className="w-[18%] px-4 py-3 font-medium text-sm">
                  {account.name}
                </TableCell>
                <TableCell className="w-[35%] px-4 py-3 text-sm text-muted-foreground truncate">
                  {account.description}
                </TableCell>
                <TableCell className="w-[10%] px-4 py-3 text-center">
                  <Badge
                    variant="outline"
                    className={
                      account.active
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
                        : "bg-gray-100 text-gray-500 border-gray-200 text-xs"
                    }
                  >
                    {account.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="w-[15%] px-4 py-3 text-sm text-muted-foreground">
                  {format(account.createdAt, "MMM d, yyyy")}
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
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {paginatedAccounts.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-muted-foreground"
                >
                  No accounts found matching your filters.
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
            Showing{" "}
            {filteredAccounts.length > 0
              ? (currentPage - 1) * itemsPerPage + 1
              : 0}{" "}
            to {Math.min(currentPage * itemsPerPage, filteredAccounts.length)}{" "}
            of {filteredAccounts.length} accounts
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

      <DialogContent className="p-0 sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleCreateAccount} className="space-y-0">
          <DialogHeader className="border-b px-6 pt-6 pb-4">
            <DialogTitle>Create Account</DialogTitle>
            <DialogDescription>
              Add an account used to track income and expenses.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="account-name">Account Name</Label>
                <Input
                  id="account-name"
                  placeholder="e.g. Main Checking, Credit Card, Cash Wallet"
                  value={newAccount.name}
                  onChange={(event) =>
                    setNewAccount((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className="h-10"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="account-description">Description</Label>
                <Textarea
                  id="account-description"
                  placeholder="Describe what this account is used for..."
                  value={newAccount.description}
                  onChange={(event) =>
                    setNewAccount((prev) => ({ ...prev, description: event.target.value }))
                  }
                  className="min-h-[96px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-type">Account Type</Label>
                <Select
                  value={newAccount.type}
                  onValueChange={(value) =>
                    setNewAccount((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger id="account-type" className="h-10">
                    <SelectValue placeholder="Choose account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_account">Bank Account</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-initial-balance">Initial Balance</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <Input
                    id="account-initial-balance"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={newAccount.initialBalance}
                    onChange={(event) =>
                      setNewAccount((prev) => ({ ...prev, initialBalance: event.target.value }))
                    }
                    className="h-10 pl-7"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Label htmlFor="account-active">Active</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Inactive accounts stay visible in history but are not suggested for new transactions.
                  </p>
                </div>
                <Switch
                  id="account-active"
                  checked={newAccount.active}
                  onCheckedChange={(checked) =>
                    setNewAccount((prev) => ({ ...prev, active: checked }))
                  }
                />
              </div>
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
