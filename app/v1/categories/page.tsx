"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  PlusIcon,
  SearchIcon,
  DownloadIcon,
  XIcon,
  ArrowUpDownIcon,
  MoreHorizontalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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

// Sample categories data
const categoriesData = [
  {
    id: "CAT-001",
    name: "Food",
    description: "Restaurants, groceries, and dining expenses",
    createdAt: new Date(2025, 0, 15),
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "CAT-002",
    name: "Transport",
    description: "Gas, public transit, rideshare, and vehicle maintenance",
    createdAt: new Date(2025, 0, 15),
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "CAT-003",
    name: "Bills",
    description: "Utilities, subscriptions, and recurring payments",
    createdAt: new Date(2025, 0, 16),
    color: "bg-red-100 text-red-700",
  },
  {
    id: "CAT-004",
    name: "Entertainment",
    description: "Movies, games, streaming services, and leisure activities",
    createdAt: new Date(2025, 0, 18),
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "CAT-005",
    name: "Health",
    description: "Medical expenses, pharmacy, gym, and wellness",
    createdAt: new Date(2025, 0, 20),
    color: "bg-pink-100 text-pink-700",
  },
  {
    id: "CAT-006",
    name: "Shopping",
    description: "Clothing, electronics, and general retail purchases",
    createdAt: new Date(2025, 1, 5),
    color: "bg-amber-100 text-amber-700",
  },
  {
    id: "CAT-007",
    name: "Education",
    description: "Courses, books, certifications, and learning materials",
    createdAt: new Date(2025, 1, 10),
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "CAT-008",
    name: "Salary",
    description: "Monthly salary and regular employment income",
    createdAt: new Date(2025, 1, 12),
    color: "bg-teal-100 text-teal-700",
  },
  {
    id: "CAT-009",
    name: "Freelance",
    description: "Income from freelance work and side projects",
    createdAt: new Date(2025, 2, 1),
    color: "bg-cyan-100 text-cyan-700",
  },
  {
    id: "CAT-010",
    name: "Investments",
    description: "Dividends, capital gains, and investment returns",
    createdAt: new Date(2025, 2, 15),
    color: "bg-lime-100 text-lime-700",
  },
  {
    id: "CAT-011",
    name: "Housing",
    description: "Rent, mortgage, repairs, and home maintenance",
    createdAt: new Date(2025, 3, 1),
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: "CAT-012",
    name: "Travel",
    description: "Flights, hotels, and vacation expenses",
    createdAt: new Date(2025, 3, 10),
    color: "bg-sky-100 text-sky-700",
  },
]

export default function CategoriesPage() {
  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    type: "expense",
    color: "emerald",
    active: true,
  })

  const colorOptions = [
    { value: "emerald", label: "Emerald", dotClass: "bg-emerald-500", badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    { value: "blue", label: "Blue", dotClass: "bg-blue-500", badgeClass: "bg-blue-100 text-blue-700 border-blue-200" },
    { value: "purple", label: "Purple", dotClass: "bg-purple-500", badgeClass: "bg-purple-100 text-purple-700 border-purple-200" },
    { value: "orange", label: "Orange", dotClass: "bg-orange-500", badgeClass: "bg-orange-100 text-orange-700 border-orange-200" },
    { value: "red", label: "Red", dotClass: "bg-red-500", badgeClass: "bg-red-100 text-red-700 border-red-200" },
    { value: "pink", label: "Pink", dotClass: "bg-pink-500", badgeClass: "bg-pink-100 text-pink-700 border-pink-200" },
    { value: "gray", label: "Gray", dotClass: "bg-gray-500", badgeClass: "bg-gray-100 text-gray-700 border-gray-200" },
  ]

  const selectedColor =
    colorOptions.find((option) => option.value === newCategory.color) ?? colorOptions[0]

  const resetNewCategory = () => {
    setNewCategory({
      name: "",
      description: "",
      type: "expense",
      color: "emerald",
      active: true,
    })
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsCreateDialogOpen(open)
    if (!open) {
      resetNewCategory()
    }
  }

  const handleCreateCategory = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    setIsCreateDialogOpen(false)
    resetNewCategory()
  }

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Check if any filters are active
  const hasActiveFilters = searchQuery !== "" || sortOrder !== "all"

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setSortOrder("all")
    setCurrentPage(1)
  }

  // Filter categories
  const filteredCategories = categoriesData.filter((category) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        category.id.toLowerCase().includes(query) ||
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }

    return true
  })

  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortOrder === "name-asc") return a.name.localeCompare(b.name)
    if (sortOrder === "name-desc") return b.name.localeCompare(a.name)
    if (sortOrder === "date-asc") return a.createdAt.getTime() - b.createdAt.getTime()
    if (sortOrder === "date-desc") return b.createdAt.getTime() - a.createdAt.getTime()
    return 0
  })

  // Pagination
  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage)
  const paginatedCategories = sortedCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={handleDialogOpenChange}>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage transaction categories used across the application
          </p>
        </div>
        <DialogTrigger asChild>
          <Button className="w-full sm:w-auto">
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Category
          </Button>
        </DialogTrigger>
      </div>

      {/* Filters Card */}
      <Card>
        <CardContent className="p-4 space-y-3">
          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            {/* Sort Order */}
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[160px] h-9 text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Default Order</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                <SelectItem value="date-desc">Date (Newest)</SelectItem>
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
      <div className="text-sm text-muted-foreground px-1">
        Showing {sortedCategories.length} of {categoriesData.length} categories
      </div>

      {/* Categories Table */}
      <Card className="overflow-hidden">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
              <TableHead className="w-[12%] px-4 py-3 font-semibold text-foreground">
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  ID
                  <ArrowUpDownIcon className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="w-[20%] px-4 py-3 font-semibold text-foreground">
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  Category Name
                  <ArrowUpDownIcon className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="w-[40%] px-4 py-3 font-semibold text-foreground">
                Description
              </TableHead>
              <TableHead className="w-[18%] px-4 py-3 font-semibold text-foreground">
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  Created At
                  <ArrowUpDownIcon className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="w-[10%] px-4 py-3"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCategories.map((category) => (
              <TableRow
                key={category.id}
                className="group border-b border-border last:border-b-0 hover:bg-muted/30"
              >
                <TableCell className="w-[12%] px-4 py-3 text-sm text-muted-foreground font-mono">
                  {category.id}
                </TableCell>
                <TableCell className="w-[20%] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", category.color.split(" ")[0])} />
                    <span className="font-medium text-sm">{category.name}</span>
                  </div>
                </TableCell>
                <TableCell className="w-[40%] px-4 py-3 text-sm text-muted-foreground truncate">
                  {category.description}
                </TableCell>
                <TableCell className="w-[18%] px-4 py-3 text-sm text-muted-foreground">
                  {format(category.createdAt, "MMM d, yyyy")}
                </TableCell>
                <TableCell className="w-[10%] px-4 py-3">
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
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {paginatedCategories.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No categories found matching your search.
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
            Showing {sortedCategories.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} to {Math.min(currentPage * itemsPerPage, sortedCategories.length)} of {sortedCategories.length} categories
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

      <DialogContent className="p-0 sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleCreateCategory} className="space-y-0">
          <DialogHeader className="border-b px-6 pt-6 pb-4">
            <DialogTitle>Create Category</DialogTitle>
            <DialogDescription>
              Add a new category to organize your transactions.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                placeholder="e.g. Food, Transport, Subscriptions"
                value={newCategory.name}
                onChange={(event) =>
                  setNewCategory((prev) => ({ ...prev, name: event.target.value }))
                }
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-description">Description</Label>
              <Textarea
                id="category-description"
                placeholder="Describe what this category is used for..."
                value={newCategory.description}
                onChange={(event) =>
                  setNewCategory((prev) => ({ ...prev, description: event.target.value }))
                }
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category-type">Category Type</Label>
                <Select
                  value={newCategory.type}
                  onValueChange={(value) =>
                    setNewCategory((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger id="category-type" className="h-10">
                    <SelectValue placeholder="Choose category type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-color">Color</Label>
                <Select
                  value={newCategory.color}
                  onValueChange={(value) =>
                    setNewCategory((prev) => ({ ...prev, color: value }))
                  }
                >
                  <SelectTrigger id="category-color" className="h-10">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((colorOption) => (
                      <SelectItem key={colorOption.value} value={colorOption.value}>
                        <span className="flex items-center gap-2">
                          <span className={cn("h-2.5 w-2.5 rounded-full", colorOption.dotClass)} />
                          {colorOption.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Label htmlFor="category-active">Active</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Active categories appear when creating new transactions.
                  </p>
                </div>
                <Switch
                  id="category-active"
                  checked={newCategory.active}
                  onCheckedChange={(checked) =>
                    setNewCategory((prev) => ({ ...prev, active: checked }))
                  }
                />
              </div>
            </div>

            <div className="rounded-lg border px-4 py-3 bg-background">
              <p className="text-xs text-muted-foreground mb-2">Live preview</p>
              <Badge variant="outline" className={cn("font-medium", selectedColor.badgeClass)}>
                {newCategory.name.trim() || "New Category"}
              </Badge>
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
