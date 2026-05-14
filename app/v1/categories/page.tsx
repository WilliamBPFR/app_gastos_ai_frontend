"use client"

import { useEffect, useRef, useState } from "react"
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
import { categoryService } from "@/services/categoryService"
import { Category } from "@/types/category_types"
import { toast } from "sonner"

const tableColumnOrder = ["id", "name", "description", "createdAt", "status", "actions"] as const
type TableColumnKey = (typeof tableColumnOrder)[number]

const minimumColumnWidths: Record<TableColumnKey, number> = {
  id: 8,
  name: 18,
  description: 30,
  createdAt: 14,
  status: 10,
  actions: 6,
}

export default function CategoriesPage() {
  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [categoryToView, setCategoryToView] = useState<Category | null>(null)
  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false)
  const [categoryToToggle, setCategoryToToggle] = useState<Category | null>(null)
  const [isToggling, setIsToggling] = useState(false)
    // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  // Total Pages
  const [totalPages, setTotalPages] = useState(1)
  const [totalCategories, setTotalCategories] = useState(0)
  //All categories state
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [columnWidths, setColumnWidths] = useState<Record<TableColumnKey, number>>({
    id: 8,
    name: 24,
    description: 28,
    createdAt: 16,
    status: 12,
    actions: 12,
  })
  const [categoryErrors, setCategoryErrors] = useState({
    name: "",
    description: "",
    color: "",
  })
  const tableContainerRef = useRef<HTMLDivElement | null>(null)
  const resizeStateRef = useRef<{
    column: TableColumnKey
    nextColumn: TableColumnKey
    startX: number
    startWidths: Record<TableColumnKey, number>
  } | null>(null)
  
  const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories({
          page_number: currentPage,
          page_size: itemsPerPage,
          category_name: searchQuery,
        })
        console.log("Fetched categories:", response)
        setAllCategories(response.categories)
        setTotalCategories(response.total_categories)
        setTotalPages(Math.ceil(response.total_categories / itemsPerPage))
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }
  // Fetch categories on mount
  useEffect(() => {
    fetchCategories()
  }, [])
  
  // Fetch when name is updated, pagination changes or page changes
  useEffect(() => {
    fetchCategories()
  }, [searchQuery, currentPage, itemsPerPage])



  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    color: "#10b981",
    active: true,
  })

  const validateCategoryForm = (category = newCategory) => {
    const isHexColor = /^#[0-9A-Fa-f]{6}$/.test(category.color.trim())

    const errors = {
      name: category.name.trim() ? "" : "Category name is required.",
      description: category.description.trim() ? "" : "Description is required.",
      color: isHexColor ? "" : "Color must be a valid HEX value (e.g. #10b981).",
    }

    setCategoryErrors(errors)

    return Object.values(errors).every((error) => error === "")
  }

  useEffect(() => {
    validateCategoryForm(newCategory)
  }, [newCategory])

  const resetNewCategory = () => {
    setNewCategory({
      name: "",
      description: "",
      color: "#10b981",
      active: true,
    })
    setCategoryErrors({
      name: "",
      description: "",
      color: "",
    })
    setIsEditMode(false)
    setEditingCategory(null)
  }

  const handleDialogOpenChange = (open: boolean) => {
    if (isCreating) {
      return
    }

    setIsCreateDialogOpen(open)
    if (!open) {
      resetNewCategory()
    }
  }

  const handleOpenEditDialog = (category: Category) => {
    // Populate the modal with the category data and switch to edit mode
    setEditingCategory(category)
    setIsEditMode(true)
    setIsCreateDialogOpen(true)
    setNewCategory({
      name: category.category_name || "",
      description: category.category_description || "",
      color: /^#[0-9A-Fa-f]{6}$/.test(String(category.color)) ? String(category.color) : "#10b981",
      active: !!category.active,
    })
  }

  const handleCreateCategory = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!validateCategoryForm(newCategory)) {
      return
    }

    try {
      setIsCreating(true)
      await categoryService.createCategory(
        newCategory.name.trim(),
        newCategory.description.trim(),
        newCategory.color.trim() ?? "#10b981",
        newCategory.active
      )
      await fetchCategories()
      toast.success(`Category "${newCategory.name.trim() || "New Category"}" was created successfully.`, {
        duration: 2500,
      })
      setIsCreateDialogOpen(false)
      resetNewCategory()
    } catch (error) {
      console.error("Error creating category:", error)
      toast.error("An error occurred while creating the category. Please try again.", {
        duration: 2500,
      })
    } finally {
      setIsCreating(false)
    }
  }

  // Skeleton for edit submit handler
  const handleEditCategory = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!editingCategory) return
    if (!validateCategoryForm(newCategory)) {
      return
    }

    try {
      setIsCreating(true)
      // TODO: implement actual update call in categoryService
      // Example (uncomment once implemented):
      console.log("Updating category with ID:", editingCategory.category_id)
      console.log("New category data:", newCategory)
      await categoryService.updateCategory(
        editingCategory.category_id,
        newCategory.name.trim(),
        newCategory.description.trim(),
        newCategory.color.trim(),
        newCategory.active
      )

      await fetchCategories()
      toast.success(`Categoría "${newCategory.name.trim() || "Categoria"}" modificada correctamente.`, {
        duration: 2500,
      })
      setIsCreateDialogOpen(false)
      resetNewCategory()
      setIsEditMode(false)
      setEditingCategory(null)
    } catch (error) {
      console.error("Error editing category:", error)
      toast.error("An error occurred while updating the category. Please try again.", {
        duration: 2500,
      })
    } finally {
      setIsCreating(false)
    }
  }

  const updateCategoryField = <K extends keyof typeof newCategory>(field: K, value: (typeof newCategory)[K]) => {
    const nextCategory = { ...newCategory, [field]: value }
    setNewCategory(nextCategory)
    validateCategoryForm(nextCategory)
  }

  const handleToggleCategory = async () => {
    if (!categoryToToggle) return

    try {
      setIsToggling(true)
      const newActiveStatus = !categoryToToggle.active
      
      if (newActiveStatus) {
        await categoryService.activateCategory(categoryToToggle.category_id)
      } else {
        await categoryService.deactivateCategory(categoryToToggle.category_id)
      }
      
      await fetchCategories()
      const action = newActiveStatus ? "activated" : "deactivated"
      toast.success(`Category "${categoryToToggle.category_name}" was ${action} successfully.`, {
        duration: 2500,
      })
      setIsToggleDialogOpen(false)
      setCategoryToToggle(null)
    } catch (error) {
      console.error("Error toggling category:", error)
      toast.error("An error occurred while updating the category. Please try again.", {
        duration: 2500,
      })
    } finally {
      setIsToggling(false)
    }
  }

  const handleOpenToggleDialog = (category: Category) => {
    setCategoryToToggle(category)
    setIsToggleDialogOpen(true)
  }

  const handleOpenViewDialog = (category: Category) => {
    setCategoryToView(category)
    setIsViewDialogOpen(true)
  }

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false)
    setCategoryToView(null)
  }

  const handleCloseToggleDialog = () => {
    if (isToggling) {
      return
    }
    setIsToggleDialogOpen(false)
    setCategoryToToggle(null)
  }
  const hasActiveFilters = searchQuery !== "" || sortOrder !== "all"

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setSortOrder("all")
    setCurrentPage(1)
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

    const handlePointerMove = (moveEvent: PointerEvent) => {
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

    const handlePointerUp = () => {
      resizeStateRef.current = null
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)
  }

  return (
    <>
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
              <SelectTrigger className="w-40 h-9 text-sm">
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
        Showing {allCategories.length} categories
      </div>

      {/* Categories Table */}
      <Card className="overflow-hidden">
        <div ref={tableContainerRef} className="w-full overflow-hidden">
          <Table className="mx-auto w-full table-fixed">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                <TableHead className="relative px-3 py-3 font-semibold text-foreground overflow-hidden" style={{ width: `${columnWidths.id}%` }}>
                  <button className="flex max-w-full items-center gap-1 overflow-hidden whitespace-nowrap text-left hover:text-primary transition-colors">
                    ID
                    <ArrowUpDownIcon className="w-3 h-3" />
                  </button>
                  <div onPointerDown={startColumnResize("id")} className="absolute right-0 top-0 h-full w-4 cursor-col-resize touch-none" aria-hidden="true">
                    <span className="absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2 bg-border/60 transition-colors hover:bg-primary/50" />
                  </div>
                </TableHead>
                <TableHead className="relative px-3 py-3 font-semibold text-foreground overflow-hidden" style={{ width: `${columnWidths.name}%` }}>
                  <button className="flex max-w-full items-center gap-1 overflow-hidden whitespace-nowrap text-left hover:text-primary transition-colors">
                    Category Name
                    <ArrowUpDownIcon className="w-3 h-3" />
                  </button>
                  <div onPointerDown={startColumnResize("name")} className="absolute right-0 top-0 h-full w-4 cursor-col-resize touch-none" aria-hidden="true">
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
              {allCategories.map((category) => (
                <TableRow
                  key={category.category_id}
                  className="group border-b border-border last:border-b-0 hover:bg-muted/30"
                  onDoubleClick={() => handleOpenViewDialog(category)}
                >
                  <TableCell className="px-3 py-3 text-sm text-muted-foreground font-mono overflow-hidden whitespace-nowrap" style={{ width: `${columnWidths.id}%` }}>
                    {category.category_id}
                  </TableCell>
                  <TableCell className="px-3 py-3 overflow-hidden" style={{ width: `${columnWidths.name}%` }}>
                    <div className="flex min-w-0 items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full")} style={{ backgroundColor: category.color }} />
                      <span className="min-w-0 truncate font-medium text-sm">{category.category_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-3 text-sm text-muted-foreground truncate overflow-hidden" style={{ width: `${columnWidths.description}%` }}>
                    {category.category_description}
                  </TableCell>
                  <TableCell className="px-3 py-3 text-sm text-muted-foreground whitespace-nowrap overflow-hidden" style={{ width: `${columnWidths.createdAt}%` }}>
                    {format(category.creation_date, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="px-3 py-3 overflow-hidden" style={{ width: `${columnWidths.status}%` }}>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-medium text-xs",
                        category.active
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      )}
                    >
                      {category.active ? "Activated" : "Deactivated"}
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
                        <DropdownMenuItem onClick={() => handleOpenViewDialog(category)}>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenEditDialog(category)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleOpenToggleDialog(category)}
                          style={{color: category.active ? "red" : "green"}}
                        >
                          {category.active ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {allCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No categories found matching your search.
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
            Showing {allCategories.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} to {Math.min(currentPage * itemsPerPage, totalCategories)} of {totalCategories} categories
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

      <DialogContent
        className="p-0 sm:max-w-xl max-h-[90vh] overflow-y-auto"
        onEscapeKeyDown={(event) => {
          if (isCreating) {
            event.preventDefault()
          }
        }}
        onPointerDownOutside={(event) => {
          if (isCreating) {
            event.preventDefault()
          }
        }}
      >
        <form
          onSubmit={(e) => {
            if (isEditMode) {
              handleEditCategory(e)
            } else {
              handleCreateCategory(e)
            }
          }}
          className="space-y-0"
        >
          <DialogHeader className="border-b px-6 pt-6 pb-4">
            <DialogTitle>
              {isEditMode ? `Modificando categoría ${editingCategory?.category_name ?? ""}` : "Create Category"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode ? `Editar la categoría seleccionada.` : "Add a new category to organize your transactions."}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="category-name">
                Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="category-name"
                placeholder="e.g. Food, Transport, Subscriptions"
                value={newCategory.name}
                onChange={(event) => updateCategoryField("name", event.target.value)}
                className={cn("h-10", categoryErrors.name && "border-red-500 focus-visible:ring-red-500")}
              />
              {categoryErrors.name && (
                <p className="text-xs text-red-500">{categoryErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="category-description"
                placeholder="Describe what this category is used for..."
                value={newCategory.description}
                onChange={(event) => updateCategoryField("description", event.target.value)}
                className={cn(
                  "min-h-25",
                  categoryErrors.description && "border-red-500 focus-visible:ring-red-500"
                )}
              />
              {categoryErrors.description && (
                <p className="text-xs text-red-500">{categoryErrors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="space-y-2">
                <Label htmlFor="category-color">
                  Color <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="category-color"
                    type="color"
                    value={/^#[0-9A-Fa-f]{6}$/.test(newCategory.color) ? newCategory.color : "#000000"}
                    onChange={(event) => updateCategoryField("color", event.target.value)}
                    className={cn(
                      "h-10 w-16 cursor-pointer p-1",
                      categoryErrors.color && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  <Input
                    aria-label="Hex color"
                    value={newCategory.color}
                    onChange={(event) => updateCategoryField("color", event.target.value)}
                    placeholder="#10b981"
                    className={cn(
                      "h-10 font-mono uppercase",
                      categoryErrors.color && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                </div>
                {categoryErrors.color && (
                  <p className="text-xs text-red-500">{categoryErrors.color}</p>
                )}
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
              <Badge
                variant="outline"
                className="font-medium"
                style={{
                  borderColor: newCategory.color,
                  color: newCategory.color,
                }}
              >
                {newCategory.name.trim() || "New Category"}
              </Badge>
            </div>
          </div>

          <DialogFooter className="border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? (isEditMode ? "Modificando..." : "Enviando...") : (isEditMode ? "Guardar cambios" : "Create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <Dialog open={isViewDialogOpen} onOpenChange={handleCloseViewDialog}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Category Details</DialogTitle>
          <DialogDescription>
            Read-only category information.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          <div className="space-y-1">
            <Label>Category ID</Label>
            <p className="text-sm text-muted-foreground">{categoryToView?.category_id ?? "-"}</p>
          </div>
          <div className="space-y-1">
            <Label>Status</Label>
            <p className="text-sm text-muted-foreground">{categoryToView?.active ? "Activated" : "Deactivated"}</p>
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label>Category Name</Label>
            <p className="text-sm text-muted-foreground">{categoryToView?.category_name ?? "-"}</p>
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label>Description</Label>
            <p className="text-sm text-muted-foreground wrap-break-word">{categoryToView?.category_description ?? "-"}</p>
          </div>
          <div className="space-y-1">
            <Label>Color</Label>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full border" style={{ backgroundColor: categoryToView?.color }} />
              <p className="text-sm text-muted-foreground">{categoryToView?.color ?? "-"}</p>
            </div>
          </div>
          <div className="space-y-1">
            <Label>Created At</Label>
            <p className="text-sm text-muted-foreground">
              {categoryToView?.creation_date ? format(new Date(categoryToView.creation_date), "MMM d, yyyy") : "-"}
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
            {categoryToToggle?.active ? "Deactivate" : "Activate"} Category
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: categoryToToggle?.color }}
            />
            <span className="font-medium text-foreground">{categoryToToggle?.category_name}</span>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-2">
            <p className="text-sm font-medium text-amber-900">
              {categoryToToggle?.active
                ? "Deactivating this category"
                : "Activating this category"}
            </p>
            <p className="text-sm text-amber-800">
              {categoryToToggle?.active
                ? "This category will not be deleted but won't be considered for future transactions."
                : "This category will be available and considered for future transactions."}
            </p>
          </div>
        </div>

        <DialogFooter className="border-t px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleCloseToggleDialog()}
            disabled={isToggling}
          >
            Cancel
          </Button>
          <Button
            onClick={handleToggleCategory}
            disabled={isToggling}
            variant={categoryToToggle?.active ? "destructive" : "default"}
          >
            {(() => {
              if (isToggling) return "Updating..."
              return categoryToToggle?.active ? "Deactivate" : "Activate"
            })()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}
