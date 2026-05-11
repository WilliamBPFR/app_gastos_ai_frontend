"use client"

import { 
  useState,
  useEffect
} from "react"
import { format } from "date-fns"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardData } from "@/types/dashboard_types"
import { dashboardService } from "@/services/dashboardService"
import { useDateRange } from "@/hooks/use-date-range"

type CategoryExpense = DashboardData["gastos_por_categoria"][number]

type PieLabelProps = {
  payload?: CategoryExpense
  percent?: number
  cx?: number
  cy?: number
  midAngle?: number
  outerRadius?: number
}

type PieTooltipProps = {
  active?: boolean
  payload?: Array<{ payload?: CategoryExpense }>
}

type LineTooltipProps = {
  active?: boolean
  payload?: Array<{ name?: string; value?: string | number; color?: string }>
  label?: string
}

const renderExpenseLabel = ({ payload, percent = 0, cx = 0, cy = 0, midAngle = 0, outerRadius = 0 }: PieLabelProps) => {
  if (!payload) {
    return null
  }

  const RADIAN = Math.PI / 180
  const radius = outerRadius + 25
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill={payload.color}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${payload.category_name} ${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const renderExpensesTooltip = ({ active, payload }: PieTooltipProps) => {
  const category = payload?.[0]?.payload

  if (!active || !category) {
    return null
  }

  return (
    <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
      <p className="font-medium">{category.category_name}</p>
      <p className="text-sm text-muted-foreground">
        ${category.total_gastos.toLocaleString()}
      </p>
    </div>
  )
}

const renderLegendLabel = (value: string) => (
  <span className="text-xs text-foreground ml-1">{value}</span>
)

const renderLineTooltip = ({ active, payload, label }: LineTooltipProps) => {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry) => (
        <p
          key={entry.name}
          className="text-sm"
          style={{ color: entry.color }}
        >
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

const renderLineLegendLabel = (value: string) => (
  <span className="text-xs text-foreground ml-1">{value}</span>
)
// Icons
const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
)

const TrendingDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
    <polyline points="16 17 22 17 22 11" />
  </svg>
)

const MailCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    <path d="m16 19 2 2 4-4" />
  </svg>
)

const ArrowRightLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m16 3 4 4-4 4" />
    <path d="M20 7H4" />
    <path d="m8 21-4-4 4-4" />
    <path d="M4 17h16" />
  </svg>
)

// Sample data for pie chart
const expensesByCategory = [
  {
  category_name: "Food",
  category_id: 1,
  total_gastos: 800,
  color: "#3b82f6"
},
{
  category_name: "Transport",
  category_id: 2,
  total_gastos: 450,
  color: "#10b981"
},
{
  category_name: "Entertainment",
  category_id: 3,
  total_gastos: 300,
  color: "#ef4444"
},
{
  category_name: "Utilities",
  category_id: 4,
  total_gastos: 200,
  color: "#f59e0b"
},
{
  category_name: "Health",
  category_id: 5,
  total_gastos: 150,
  color: "#8b5cf6"
}
]

  // analisis_por_dia: {
  //     date: string;
  //     ingresos: number;
  //     egresos: number;
  // }[];
// Sample data for line chart
const emailAnalysisData = [
  {
  date: "2024-06-01",
  correos_analizados: 20,
  correos_transaccion: 15
},
{
  date: "2024-06-02",
  correos_analizados: 25,
  correos_transaccion: 18
},
{
  date: "2024-06-03",
  correos_analizados: 30,
  correos_transaccion: 22
},
{
  date: "2024-06-04",
  correos_analizados: 28,
  correos_transaccion: 20
},
{
  date: "2024-06-05",
  correos_analizados: 35,
  correos_transaccion: 30
},
{
  date: "2024-06-06",
  correos_analizados: 40,
  correos_transaccion: 32
},
{
  date: "2024-06-07",
  correos_analizados: 45,
  correos_transaccion: 38
},
{
  date: "2024-06-08",
  correos_analizados: 50,
  correos_transaccion: 42
}
]

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null as DashboardData | null)
  const { dateRange } = useDateRange()

  const formatDateForApi = (date: Date | undefined) => {
    if (!date) {
      return undefined
    }

    return format(date, "yyyy-MM-dd")
  }

  useEffect(() => {
    dashboardService.getDashboardData({
      fechadesde: formatDateForApi(dateRange?.from),
      fechahasta: formatDateForApi(dateRange?.to),
    }).then((response) => {
      setDashboardData(response)
    }).catch((error) => {
      console.error("Error fetching dashboard data:", error)
    })
  }, [dateRange?.from, dateRange?.to])

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Income Card */}
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Income</p>
                <p className="text-2xl font-bold text-emerald-600">
                  ${dashboardData.total_ingresos.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">{dashboardData.porcentaje_cambio_ingresos !== null ? `${dashboardData.porcentaje_cambio_ingresos.toFixed(1)}% from last period` : 'No data for last period'} </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <TrendingUpIcon className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Card */}
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  ${dashboardData.total_egresos.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">{dashboardData.porcentaje_cambio_egresos !== null ? `${dashboardData.porcentaje_cambio_egresos.toFixed(1)}% from last period` : 'No data for last period'}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <TrendingDownIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analyzed Emails Card */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Analyzed Emails</p>
                <p className="text-2xl font-bold text-foreground">{dashboardData.total_correos_analizados}</p>
                <p className="text-xs text-muted-foreground">This period</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <MailCheckIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registered Transactions Card */}
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Registered Transactions</p>
                <p className="text-2xl font-bold text-foreground">{dashboardData.total_transacciones_registradas}</p>
                <p className="text-xs text-muted-foreground">{((dashboardData.total_correos_analizados / dashboardData.total_transacciones_registradas) * 100).toFixed(1) || 0}% conversion rate</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <ArrowRightLeftIcon className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Expenses by Category */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardData.gastos_por_categoria}
                    nameKey="category_name"
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="total_gastos"
                    label={renderExpenseLabel}
                    labelLine={false}
                  >
                    {dashboardData.gastos_por_categoria.map((entry, index) => (
                      <Cell key={entry.category_id} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={renderExpensesTooltip} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    formatter={renderLegendLabel}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Line Chart - Email Analysis by Day */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Email Analysis by Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dashboardData.analisis_por_dia}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <RechartsTooltip content={renderLineTooltip} />
                  <Line
                    type="monotone"
                    dataKey="correos_analizados"
                    name="Analyzed Emails"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="correos_transaccion"
                    name="Converted to Transactions"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    formatter={renderLineLegendLabel}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
