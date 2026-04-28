export type Region = 'Campo Limpo' | 'Mitsutani';

export type KitnetStatus = 'available' | 'occupied' | 'maintenance' | 'overdue';

export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'empty';

export interface Kitnet {
  id: number;
  name: string;
  region: Region;
  address: string;
  status: KitnetStatus;
  price: number;
  image?: string;
  avatar?: string;
  tenant?: string;
  phone?: string;
  dueDate?: string;
  paymentStatus?: PaymentStatus;
  notes?: string;
  featured?: boolean;
}

export interface Payment {
  id: number;
  kitnetId: number;
  kitnetName: string;
  tenantName: string;
  amount: number;
  date: string;
  status: PaymentStatus;
  month: string;
}

export interface Tenant {
  id: number;
  name: string;
  kitnetId: number;
  kitnetName: string;
  region: Region;
  phone: string;
  paymentStatus: PaymentStatus;
}
