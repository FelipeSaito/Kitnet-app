// ============================================================
// TIPOS — Casas Kitnet Manager
// ============================================================

export type PropertyStatus  = 'available' | 'occupied' | 'maintenance' | 'overdue';
export type PaymentStatus   = 'paid' | 'pending' | 'overdue' | 'waived';
export type TenantStatus    = 'active' | 'inactive' | 'evicted';
export type UtilityType     = 'water' | 'energy';
export type WaterType       = 'included' | 'individual';
export type MaintenanceStatus = 'pending' | 'in_progress' | 'done' | 'cancelled';
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent';

// ─── Region ──────────────────────────────────────────────────

export interface Region {
  id: string;
  name: string;
  city: string;
  state: string;
  created_at: string;
}

// ─── Property ────────────────────────────────────────────────

export interface Property {
  id: string;
  region_id: string;
  name: string;
  address: string;
  type: string;
  area_m2?: number;
  rent_value: number;
  due_day: number;
  status: PropertyStatus;
  water_type: WaterType;
  energy_type: WaterType;
  internet: boolean;
  image_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyInsert extends Omit<Property, 'id' | 'created_at' | 'updated_at'> {}
export interface PropertyUpdate extends Partial<PropertyInsert> {}

// ─── Tenant ──────────────────────────────────────────────────

export interface Tenant {
  id: string;
  property_id?: string;
  full_name: string;
  cpf?: string;
  phone: string;
  email?: string;
  avatar_url?: string;
  contract_start?: string;
  contract_end?: string;
  deposit_value?: number;
  deposit_paid: boolean;
  status: TenantStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TenantInsert extends Omit<Tenant, 'id' | 'created_at' | 'updated_at'> {}
export interface TenantUpdate extends Partial<TenantInsert> {}

// ─── Payment ─────────────────────────────────────────────────

export interface Payment {
  id: string;
  property_id: string;
  tenant_id?: string;
  reference_month: string;            // '2025-04'
  amount: number;
  due_date: string;
  paid_date?: string;
  paid_amount?: number;
  status: PaymentStatus;
  payment_method?: string;
  receipt_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentInsert extends Omit<Payment, 'id' | 'created_at' | 'updated_at'> {}
export interface PaymentUpdate extends Partial<PaymentInsert> {}

// ─── UtilityBill ─────────────────────────────────────────────

export interface UtilityBill {
  id: string;
  property_id: string;
  tenant_id?: string;
  type: UtilityType;
  reference_month: string;
  amount: number;
  due_date: string;
  paid_date?: string;
  status: PaymentStatus;
  reading_start?: number;
  reading_end?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface UtilityBillInsert extends Omit<UtilityBill, 'id' | 'created_at' | 'updated_at'> {}
export interface UtilityBillUpdate extends Partial<UtilityBillInsert> {}

// ─── MaintenanceRequest ───────────────────────────────────────

export interface MaintenanceRequest {
  id: string;
  property_id: string;
  title: string;
  description?: string;
  cost?: number;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  requested_at: string;
  completed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceInsert extends Omit<MaintenanceRequest, 'id' | 'created_at' | 'updated_at'> {}

// ─── AppSettings ─────────────────────────────────────────────

export interface AppSettings {
  id: string;
  owner_name: string;
  owner_phone?: string;
  pix_key?: string;
  whatsapp_msg_rent: string;
  whatsapp_msg_water: string;
  whatsapp_msg_energy: string;
  created_at: string;
  updated_at: string;
}

// ─── Views ───────────────────────────────────────────────────

export interface PropertyFull extends Property {
  region_name: string;
  tenant_id?: string;
  tenant_name?: string;
  tenant_phone?: string;
  tenant_avatar?: string;
  contract_start?: string;
  contract_end?: string;
  payment_status?: PaymentStatus;
  payment_amount?: number;
  payment_due_date?: string;
  payment_paid_date?: string;
}

export interface FinancialSummary {
  reference_month: string;
  paid_count: number;
  pending_count: number;
  overdue_count: number;
  total_received: number;
  total_pending: number;
  total_overdue: number;
  total_expected: number;
}
