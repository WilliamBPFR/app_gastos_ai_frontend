

export interface DashboardData {
  message: string;
  total_ingresos: number;
  total_ingresos_count: number;
  total_egresos: number;
  total_egresos_count: number;
  porcentaje_cambio_ingresos: number | null;
  porcentaje_cambio_egresos: number | null;
  total_transacciones_registradas: number;
  total_correos_analizados: number;
  gastos_por_categoria: {
      category_name: string;
      category_id: number;
      total_gastos: number;
      color: string;
  }[];
  analisis_por_dia: {
      date: string;
      correos_analizados: number;
      correos_transaccion: number;
  }[];
}

export interface DashboardDataRequest {
    fechadesde: string | undefined;
    fechahasta: string | undefined;
}