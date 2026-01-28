
export interface Member {
  id: string;
  name: string;
  joinDate: string;
  avatar: string;
  status: 'active' | 'on-leave';
  vacationDays: number;
  personalHealthFundUSD: number;
  debtUSD: number;
}

export interface Location {
  id: string;
  name: string;
  address: string;
}

export interface Shift {
  id: string;
  memberId: string;
  locationId: string;
  date: string; // ISO string YYYY-MM-DD
  status: 'pending' | 'on-site' | 'absent';
  checkInTime?: string;
}

export interface DailyReport {
  id: string;
  date: string;
  content: string;
  summary: string;
  metrics: {
    totalSalesUSD: number;
    topLocation: string;
    criticalStockItem: string;
    wastageLossUSD?: number;
    netUtilityUSD?: number;
  };
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  priceUSD: number;
  supplierCostUSD: number;
  stockRuizPineda: number;
  stockPuebloNuevo: number;
  image: string;
  lastModifiedBy: string;
}

export interface IntakeLog {
  id: string;
  productName: string;
  quantity: number;
  costUSD: number;
  supplier: string;
  locationId: string;
  memberId: string;
  timestamp: string;
  sheetRowIndex?: number;
}

export interface WastageLog {
  id: string;
  productName: string;
  quantity: number;
  costUSD: number;
  category: 'Vencimiento' | 'Deterioro' | 'Merma Operativa' | 'Error de Inventario';
  description: string;
  locationId: string;
  memberId: string;
  memberName: string;
  timestamp: string;
  sheetRowIndex?: number;
}

export interface InventoryTransfer {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  fromLocationId: string;
  toLocationId: string;
  memberId: string;
  memberName: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  memberId: string;
  memberName: string;
  action: string;
  details: string;
  isCritical: boolean;
}

export interface Infraction {
  id: string;
  memberId: string;
  memberName: string;
  type: 'Leve' | 'Grave' | 'Gravísima';
  description: string;
  date: string;
  reporterName: string;
}

export interface AccountingTransaction {
  id: string;
  type: 'Ingreso' | 'Egreso' | 'Transferencia';
  category: 'Compra Charcutería' | 'Pago Servicios' | 'Salud' | 'Nómina' | 'Mantenimiento' | 'Venta POS' | 'Ajuste por Merma' | 'Otro';
  amountUSD: number;
  amountVES: number;
  descriptionTechnical: string;
  aiExplanation?: string;
  memberExecutor: string;
  locationId?: string;
  timestamp: string;
}

export interface FinancialInsight {
  status: 'Verde' | 'Amarillo' | 'Rojo';
  summary: string;
  recommendation: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'info' | 'warning';
  timestamp: string;
}

export interface QueueEntry {
  id: string;
  turnNumber: number;
  clientName: string;
  phoneNumber: string;
  orderPreview: string;
  timestamp: string;
  status: 'waiting' | 'serving' | 'ready';
  serverName?: string;
  lastNotificationSent?: string;
}

export interface Meeting {
  id: string;
  date: string;
  title: string;
  summaryIA: string;
  decisions: string[];
  fullMinutes: string;
  attendees: string[];
  isCritical: boolean;
}

export interface SupplierOffer {
  id: string;
  supplierName: string;
  productName: string;
  priceUSD: number;
  deliveryTimeDays: number;
  qualityRating: number;
}
