import { Kitnet, Payment, Tenant } from '../types';

export const KITNETS: Kitnet[] = [
  {
    id: 1,
    name: 'Kitnet 1',
    region: 'Campo Limpo',
    address: 'Rua das Flores, 45 — Campo Limpo, SP',
    status: 'available',
    price: 850,
    paymentStatus: 'empty',
    featured: false,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
  },
  {
    id: 2,
    name: 'Kitnet 2',
    region: 'Campo Limpo',
    address: 'Rua das Flores, 47 — Campo Limpo, SP',
    status: 'occupied',
    price: 900,
    tenant: 'Maria Silva',
    phone: '(11) 99234-5678',
    dueDate: '05/05/2025',
    paymentStatus: 'paid',
    featured: true,
    notes: 'Contrato renovado em jan/2025. Inquilina exemplar.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    avatar: 'https://i.pravatar.cc/150?u=maria',
  },
  {
    id: 3,
    name: 'Kitnet 3',
    region: 'Campo Limpo',
    address: 'Av. Principal, 120 — Campo Limpo, SP',
    status: 'overdue',
    price: 780,
    tenant: 'Carlos Souza',
    phone: '(11) 98765-4321',
    dueDate: '02/04/2025',
    paymentStatus: 'overdue',
    notes: 'Pagamento de abril em atraso há 15 dias.',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    avatar: 'https://i.pravatar.cc/150?u=carlos',
  },
  {
    id: 4,
    name: 'Kitnet 4',
    region: 'Campo Limpo',
    address: 'Av. Principal, 122 — Campo Limpo, SP',
    status: 'maintenance',
    price: 750,
    paymentStatus: 'empty',
    notes: 'Reforma do banheiro e pintura. Previsão: 3 semanas.',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
  },
  {
    id: 5,
    name: 'Kitnet 5',
    region: 'Mitsutani',
    address: 'Rua Mitsutani, 8 — Mitsutani, SP',
    status: 'overdue',
    price: 800,
    tenant: 'Ana Ferreira',
    phone: '(11) 97654-3210',
    dueDate: '01/04/2025',
    paymentStatus: 'overdue',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    avatar: 'https://i.pravatar.cc/150?u=ana',
  },
  {
    id: 6,
    name: 'Kitnet 6',
    region: 'Mitsutani',
    address: 'Rua Mitsutani, 10 — Mitsutani, SP',
    status: 'occupied',
    price: 850,
    tenant: 'Pedro Lima',
    phone: '(11) 91234-5678',
    dueDate: '10/05/2025',
    paymentStatus: 'paid',
    featured: true,
    image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
    avatar: 'https://i.pravatar.cc/150?u=pedro',
  },
  {
    id: 7,
    name: 'Kitnet 7',
    region: 'Mitsutani',
    address: 'Rua Mitsutani, 12 — Mitsutani, SP',
    status: 'available',
    price: 820,
    paymentStatus: 'empty',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
  },
  {
    id: 8,
    name: 'Kitnet 8',
    region: 'Mitsutani',
    address: 'Rua Mitsutani, 14 — Mitsutani, SP',
    status: 'occupied',
    price: 900,
    tenant: 'Juliana Costa',
    phone: '(11) 95678-1234',
    dueDate: '15/05/2025',
    paymentStatus: 'paid',
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
    avatar: 'https://i.pravatar.cc/150?u=juliana',
  },
];

export const PAYMENTS: Payment[] = [
  { id: 1, kitnetId: 2, kitnetName: 'Kitnet 2', tenantName: 'Maria Silva',   amount: 900, date: '01/04/2025', status: 'paid',    month: 'Abril 2025' },
  { id: 2, kitnetId: 6, kitnetName: 'Kitnet 6', tenantName: 'Pedro Lima',    amount: 850, date: '01/04/2025', status: 'paid',    month: 'Abril 2025' },
  { id: 3, kitnetId: 8, kitnetName: 'Kitnet 8', tenantName: 'Juliana Costa', amount: 900, date: '02/04/2025', status: 'paid',    month: 'Abril 2025' },
  { id: 4, kitnetId: 3, kitnetName: 'Kitnet 3', tenantName: 'Carlos Souza',  amount: 780, date: '02/04/2025', status: 'overdue', month: 'Abril 2025' },
  { id: 5, kitnetId: 5, kitnetName: 'Kitnet 5', tenantName: 'Ana Ferreira',  amount: 800, date: '01/04/2025', status: 'overdue', month: 'Abril 2025' },
];

export const TENANTS: Tenant[] = KITNETS
  .filter(k => k.tenant)
  .map(k => ({
    id: k.id,
    name: k.tenant!,
    kitnetId: k.id,
    kitnetName: k.name,
    region: k.region,
    phone: k.phone!,
    paymentStatus: k.paymentStatus as any,
  }));

export const FINANCIAL_SUMMARY = {
  previsaoMensal: KITNETS
    .filter(k => k.status === 'occupied' || k.status === 'overdue')
    .reduce((sum, k) => sum + k.price, 0),
  recebido: PAYMENTS
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0),
  emAtraso: PAYMENTS
    .filter(p => p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0),
  ocupadas: KITNETS
    .filter(k => k.status === 'occupied' || k.status === 'overdue')
    .length,
  total: KITNETS.length,
};