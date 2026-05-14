"use client"

import { useState, useEffect, useRef } from "react"
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
import { cn } from "@/lib/utils"

import { AccountBase, AccountTypeBase } from "@/types/account_types"
import { accountsService } from "@/services/accountsService"
import { toast } from "sonner"

const tableColumnOrder = ["id", "name", "type", "description", "createdAt", "status", "actions"] as const
type TableColumnKey = (typeof tableColumnOrder)[number]

const minimumColumnWidths: Record<TableColumnKey, number> = {
  id: 8,
  name: 16,
  type: 14,
  description: 24,
  createdAt: 12,
  status: 10,
  actions: 8,
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<AccountBase[]>([])
  const [accountTypes, setAccountTypes] = useState<AccountTypeBase[]>([])
  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [activeStatus, setActiveStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  // Check if any filters are active
  const hasActiveFilters = searchQuery !== "" || activeStatus !== "all"
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingAccount, setEditingAccount] = useState<AccountBase | null>(null)
  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [accountToView, setAccountToView] = useState<AccountBase | null>(null)
  const [accountToToggle, setAccountToToggle] = useState<AccountBase | null>(null)
  const [isToggling, setIsToggling] = useState(false)
  const [columnWidths, setColumnWidths] = useState<Record<TableColumnKey, number>>({
    id: 10,
    name: 18,
    type: 14,
    description: 24,
    createdAt: 14,
    status: 10,
    actions: 10,
  })
  const tableContainerRef = useRef<HTMLDivElement | null>(null)
  const resizeStateRef = useRef<{
    column: TableColumnKey
    nextColumn: TableColumnKey
    startX: number
    startWidths: Record<TableColumnKey, number>
  } | null>(null)
  const [newAccount, setNewAccount] = useState({
    name: "",
    description: "",
    account_type: "0",
    initialBalance: "",
    active: true,
  })

  const fetchAccountTypes = async () => {
    try {
      console.log("Fetching account types...")
      const accountTypes = await accountsService.getAccountTypes()
      setAccountTypes(accountTypes)
    } catch (error) {
      console.error("Error fetching account types:", error)
    }
  }

  useEffect(() => {
    fetchAccountTypes()
  }, [])

  const fetchAccounts = async () => {
    try {
      const accounts = await accountsService.getAllAccounts({
        account_name: searchQuery || undefined,
        status: activeStatus === "all" ? undefined : activeStatus === "true",
        page_number: currentPage,
        page_size: itemsPerPage,
      })
      console.log("Fetched accounts:", accounts)
      setAccounts(accounts.accounts)
      setTotalItems(accounts.total_accounts)
    } catch (error) {
      console.error("Error fetching accounts:", error)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [searchQuery, activeStatus, currentPage, itemsPerPage])

  const resetNewAccount = () => {
    setNewAccount({
      name: "",
      description: "",
      account_type: "0",
      initialBalance: "",
      active: true,
    })
    setIsEditMode(false)
    setEditingAccount(null)
  }

  const handleDialogOpenChange = (open: boolean) => {
    if (isCreating) {
      return
    }

    setIsCreateDialogOpen(open)
    if (!open) {
      resetNewAccount()
    }
  }

  const handleOpenEditDialog = (account: AccountBase) => {
    setEditingAccount(account)
    setIsEditMode(true)
    setIsCreateDialogOpen(true)
    setNewAccount({
      name: account.account_name || "",
      description: account.account_description || "",
      account_type: account.account_type?.account_type_id
        ? String(account.account_type.account_type_id)
        : "0",
      initialBalance: "",
      active: !!account.active,
    })
  }

  const handleCreateAccount = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    const accountTypeId = Number(newAccount.account_type)
    if (!newAccount.name.trim() || !newAccount.description.trim() || Number.isNaN(accountTypeId) || accountTypeId <= 0) {
      toast.error("Please complete the account name, description and type.", {
        duration: 2500,
      })
      return
    }

    try {
      setIsCreating(true)
      await accountsService.createAccount({
        account_name: newAccount.name.trim(),
        account_description: newAccount.description.trim(),
        active: newAccount.active,
        account_type: {
          account_type_id: accountTypeId
        }
      })

      await fetchAccounts()
      toast.success(`Account "${newAccount.name.trim()}" was created successfully.`, {
        duration: 2500,
      })
      setIsCreateDialogOpen(false)
      resetNewAccount()
    } catch (error) {
      console.error("Error creating account:", error)
      toast.error("An error occurred while creating the account. Please try again.", {
        duration: 2500,
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleEditAccount = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    if (!editingAccount?.account_id) {
      return
    }

    const accountTypeId = Number(newAccount.account_type)
    if (!newAccount.name.trim() || !newAccount.description.trim() || Number.isNaN(accountTypeId) || accountTypeId <= 0) {
      toast.error("Please complete the account name, description and type.", {
        duration: 2500,
      })
      return
    }

    try {
      setIsCreating(true)
      await accountsService.updateAccount(editingAccount.account_id, {
        account_name: newAccount.name.trim(),
        account_description: newAccount.description.trim(),
        active: newAccount.active,
        account_type: {
          account_type_id: accountTypeId,
        },
      })

      await fetchAccounts()
      toast.success(`Account "${newAccount.name.trim()}" was updated successfully.`, {
        duration: 2500,
      })
      setIsCreateDialogOpen(false)
      resetNewAccount()
    } catch (error) {
      console.error("Error editing account:", error)
      toast.error("An error occurred while updating the account. Please try again.", {
        duration: 2500,
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleOpenToggleDialog = (account: AccountBase) => {
    setAccountToToggle(account)
    setIsToggleDialogOpen(true)
  }

  const handleOpenViewDialog = (account: AccountBase) => {
    setAccountToView(account)
    setIsViewDialogOpen(true)
  }

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false)
    setAccountToView(null)
  }

  const handleCloseToggleDialog = () => {
    if (isToggling) {
      return
    }
    setIsToggleDialogOpen(false)
    setAccountToToggle(null)
  }

  const handleToggleAccount = async () => {
    if (!accountToToggle) {
      return
    }

    try {
      setIsToggling(true)
      const newActiveStatus = !accountToToggle.active

      if (newActiveStatus) {
        await accountsService.activateAccount(accountToToggle.account_id ?? 0)
      } else {
        await accountsService.deactivateAccount(accountToToggle.account_id ?? 0)
      }

      await fetchAccounts()
      const action = newActiveStatus ? "activated" : "deactivated"
      toast.success(`Account "${accountToToggle.account_name}" was ${action} successfully.`, {
        duration: 2500,
      })
      setIsToggleDialogOpen(false)
      setAccountToToggle(null)
    } catch (error) {
      console.error("Error toggling account:", error)
      toast.error("An error occurred while updating the account. Please try again.", {
        duration: 2500,
      })
    } finally {
      setIsToggling(false)
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setActiveStatus("all")
    setCurrentPage(1)
  }

  const handleColumnResizePointerMove = (moveEvent: PointerEvent) => {
    const resizeState = resizeStateRef.current
    const containerWidth = tableContainerRef.current?.clientWidth ?? 0

    if (!resizeState || containerWidth === 0) {
      return
    }

    const deltaPercent = ((moveEvent.clientX - resizeState.startX) / containerWidth) * 100
    const currentStartWidth = resizeState.startWidths[resizeState.column]
    const nextStartWidth = resizeState.startWidths[resizeState.nextColumn]
    const pairTotalWidth = currentStartWidth + nextStartWidth
    const minCurrentWidth = minimumColumnWidths[resizeState.column]
    const minNextWidth = minimumColumnWidths[resizeState.nextColumn]
    const proposedCurrentWidth = currentStartWidth + deltaPercent
    const nextColumnWidth = Math.max(minNextWidth, pairTotalWidth - proposedCurrentWidth)
    const currentColumnWidth = Math.max(minCurrentWidth, pairTotalWidth - nextColumnWidth)

    setColumnWidths((prevWidths) => ({
      ...prevWidths,
      [resizeState.column]: currentColumnWidth,
      [resizeState.nextColumn]: pairTotalWidth - currentColumnWidth,
    }))
  }

  const handleColumnResizePointerUp = () => {
    resizeStateRef.current = null
    globalThis.removeEventListener("pointermove", handleColumnResizePointerMove)
    globalThis.removeEventListener("pointerup", handleColumnResizePointerUp)
  }

  const startColumnResize = (column: TableColumnKey) => (event: React.PointerEvent<HTMLDivElement>) => {
    const columnIndex = tableColumnOrder.indexOf(column)
    const nextColumn = tableColumnOrder[columnIndex + 1]

    if (!nextColumn) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    resizeStateRef.current = {
      column,
      nextColumn,
      startX: event.clientX,
      startWidths: columnWidths,
    }

    globalThis.addEventListener("pointermove", handleColumnResizePointerMove)
    globalThis.addEventListener("pointerup", handleColumnResizePointerUp)
  }

  // Pagination calculations
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  let submitButtonLabel = "Create"
  if (isEditMode) {
    submitButtonLabel = isCreating ? "Updating..." : "Save changes"
  } else if (isCreating) {
    submitButtonLabel = "Creating..."
  }

  // Reset to page 1 when filters change
  useEffect(() => {
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
              <SelectTrigger className="w-32.5 h-9 text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            {/* <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-37.5 h-9 text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
              </SelectContent>
            </Select> */}

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
        Showing {accounts.length} of {totalItems} accounts
      </p>

      {/* Accounts Table */}
      <Card className="overflow-hidden">
        <div ref={tableContainerRef} className="w-full overflow-hidden">
          <Table className="mx-auto w-full table-fixed">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                <TableHead className="relative px-3 py-3 font-semibold text-foreground overflow-hidden" style={{ width: `${columnWidths.id}%` }}>
                  <button className="flex max-w-full items-center gap-1 overflow-hidden whitespace-nowrap text-left hover:text-primary transition-colors">
                    Account ID
                    <ArrowUpDownIcon className="w-3 h-3" />
                  </button>
                  <div onPointerDown={startColumnResize("id")} className="absolute right-0 top-0 h-full w-4 cursor-col-resize touch-none" aria-hidden="true">
                    <span className="absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2 bg-border/60 transition-colors hover:bg-primary/50" />
                  </div>
                </TableHead>
                <TableHead className="relative px-3 py-3 font-semibold text-foreground overflow-hidden" style={{ width: `${columnWidths.name}%` }}>
                  <button className="flex max-w-full items-center gap-1 overflow-hidden whitespace-nowrap text-left hover:text-primary transition-colors">
                    Account Name
                    <ArrowUpDownIcon className="w-3 h-3" />
                  </button>
                  <div onPointerDown={startColumnResize("name")} className="absolute right-0 top-0 h-full w-4 cursor-col-resize touch-none" aria-hidden="true">
                    <span className="absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2 bg-border/60 transition-colors hover:bg-primary/50" />
                  </div>
                </TableHead>
                <TableHead className="relative px-3 py-3 font-semibold text-foreground overflow-hidden" style={{ width: `${columnWidths.type}%` }}>
                  <button className="flex max-w-full items-center gap-1 overflow-hidden whitespace-nowrap text-left hover:text-primary transition-colors">
                    Account Type
                    <ArrowUpDownIcon className="w-3 h-3" />
                  </button>
                  <div onPointerDown={startColumnResize("type")} className="absolute right-0 top-0 h-full w-4 cursor-col-resize touch-none" aria-hidden="true">
                    <span className="absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2 bg-border/60 transition-colors hover:bg-primary/50" />
                  </div>
                </TableHead>
                <TableHead className="relative px-3 py-3 font-semibold text-foreground overflow-hidden" style={{ width: `${columnWidths.description}%` }}>
                  Description
                  <div onPointerDown={startColumnResize("description")} className="absolute right-0 top-0 h-full w-4 cursor-col-resize touch-none" aria-hidden="true">
                    <span className="absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2 bg-border/60 transition-colors hover:bg-primary/50" />
                  </div>
                </TableHead>
                <TableHead className="relative px-3 py-3 font-semibold text-foreground overflow-hidden" style={{ width: `${columnWidths.createdAt}%` }}>
                  <button className="flex max-w-full items-center gap-1 overflow-hidden whitespace-nowrap text-left hover:text-primary transition-colors">
                    Created At
                    <ArrowUpDownIcon className="w-3 h-3" />
                  </button>
                  <div onPointerDown={startColumnResize("createdAt")} className="absolute right-0 top-0 h-full w-4 cursor-col-resize touch-none" aria-hidden="true">
                    <span className="absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2 bg-border/60 transition-colors hover:bg-primary/50" />
                  </div>
                </TableHead>
                <TableHead className="relative px-3 py-3 font-semibold text-foreground overflow-hidden" style={{ width: `${columnWidths.status}%` }}>
                  Status
                  <div onPointerDown={startColumnResize("status")} className="absolute right-0 top-0 h-full w-4 cursor-col-resize touch-none" aria-hidden="true">
                    <span className="absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2 bg-border/60 transition-colors hover:bg-primary/50" />
                  </div>
                </TableHead>
                <TableHead className="px-3 py-3 overflow-hidden" style={{ width: `${columnWidths.actions}%` }}>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow
                  key={account.account_id}
                  className="group border-b border-border last:border-b-0 hover:bg-muted/30"
                  onDoubleClick={() => handleOpenViewDialog(account)}
                >
                  <TableCell className="px-3 py-3 text-sm text-muted-foreground font-mono overflow-hidden whitespace-nowrap" style={{ width: `${columnWidths.id}%` }}>
                    {account.account_id}
                  </TableCell>
                  <TableCell className="px-3 py-3 font-medium text-sm overflow-hidden truncate" style={{ width: `${columnWidths.name}%` }}>
                    {account.account_name}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-sm text-muted-foreground overflow-hidden truncate" style={{ width: `${columnWidths.type}%` }}>
                    {account.account_type?.account_type_name ?? "-"}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-sm text-muted-foreground overflow-hidden truncate" style={{ width: `${columnWidths.description}%` }}>
                    {account.account_description}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-sm text-muted-foreground whitespace-nowrap overflow-hidden" style={{ width: `${columnWidths.createdAt}%` }}>
                    {format(new Date(account.creation_date ?? new Date()), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="px-3 py-3 overflow-hidden" style={{ width: `${columnWidths.status}%` }}>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-medium text-xs",
                        account.active
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      )}
                    >
                      {account.active ? "Activated" : "Deactivated"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-3 py-3 overflow-hidden" style={{ width: `${columnWidths.actions}%` }}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <MoreHorizontalIcon className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenViewDialog(account)}>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenEditDialog(account)}>
                          Edit {account.account_name}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleOpenToggleDialog(account)}
                          className={account.active ? "text-destructive" : "text-emerald-600"}
                        >
                          {account.active ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {accounts.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No accounts found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            {accounts.length > 0
              ? (currentPage - 1) * itemsPerPage + 1
              : 0}{" "}
            to {Math.min(currentPage * itemsPerPage, totalItems)}{" "}
            of {totalItems} accounts
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
              <SelectTrigger className="w-17.5 h-8 text-sm">
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

      <DialogContent className="p-0 sm:max-w-2xl max-h-[90vh] overflow-y-auto" aria-description="" aria-describedby="">
        <form
          onSubmit={(event) => {
            if (isEditMode) {
              handleEditAccount(event)
            } else {
              handleCreateAccount(event)
            }
          }}
          className="space-y-0"
        >
          <DialogHeader className="border-b px-6 pt-6 pb-4">
            <DialogTitle>
              {isEditMode ? `Edit Account ${editingAccount?.account_name ?? ""}` : "Create Account"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode ? "Edit the selected account." : "Add an account used to track income and expenses."}
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
                  className="min-h-24"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-type">Account Type</Label>
                <Select
                  value={newAccount.account_type}
                  onValueChange={(value) =>
                    setNewAccount((prev) => ({ ...prev, account_type: value }))
                  }
                >
                  <SelectTrigger id="account-type" className="h-10">
                    <SelectValue placeholder="Choose account type" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypes.map((type) => (
                      <SelectItem key={type.account_type_id} value={String(type.account_type_id)}>
                        {type.account_type_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
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
            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isCreating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {submitButtonLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      <Dialog open={isViewDialogOpen} onOpenChange={handleCloseViewDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Account Details</DialogTitle>
            <DialogDescription>
              Read-only account information.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div className="space-y-1">
              <Label>Account ID</Label>
              <p className="text-sm text-muted-foreground">{accountToView?.account_id ?? "-"}</p>
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <p className="text-sm text-muted-foreground">{accountToView?.active ? "Activated" : "Deactivated"}</p>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label>Account Name</Label>
              <p className="text-sm text-muted-foreground">{accountToView?.account_name ?? "-"}</p>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label>Description</Label>
              <p className="text-sm text-muted-foreground wrap-break-word">{accountToView?.account_description ?? "-"}</p>
            </div>
            <div className="space-y-1">
              <Label>Account Type</Label>
              <p className="text-sm text-muted-foreground">{accountToView?.account_type?.account_type_name ?? "-"}</p>
            </div>
            <div className="space-y-1">
              <Label>Created At</Label>
              <p className="text-sm text-muted-foreground">
                {accountToView?.creation_date ? format(new Date(accountToView.creation_date), "MMM d, yyyy") : "-"}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseViewDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isToggleDialogOpen} onOpenChange={handleCloseToggleDialog}>
        <DialogContent
          className="p-0 sm:max-w-md"
          onEscapeKeyDown={(event) => {
            if (isToggling) {
              event.preventDefault()
            }
          }}
          onPointerDownOutside={(event) => {
            if (isToggling) {
              event.preventDefault()
            }
          }}
        >
          <DialogHeader className="border-b px-6 pt-6 pb-4">
            <DialogTitle>
              {accountToToggle?.active ? "Deactivate" : "Activate"} Account
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-medium text-foreground">{accountToToggle?.account_name}</span>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-2">
              <p className="text-sm font-medium text-amber-900">
                {accountToToggle?.active
                  ? "Deactivating this account"
                  : "Activating this account"}
              </p>
              <p className="text-sm text-amber-800">
                {accountToToggle?.active
                  ? "This account will not be deleted but won't be considered for future transactions."
                  : "This account will be available and considered for future transactions."}
              </p>
            </div>
          </div>

          <DialogFooter className="border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseToggleDialog}
              disabled={isToggling}
            >
              Cancel
            </Button>
            <Button
              onClick={handleToggleAccount}
              disabled={isToggling}
              variant={accountToToggle?.active ? "destructive" : "default"}
            >
              {(() => {
                if (isToggling) return "Updating..."
                return accountToToggle?.active ? "Deactivate" : "Activate"
              })()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
