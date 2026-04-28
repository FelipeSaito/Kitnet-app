import { useState, useEffect, useCallback } from 'react';
import { getProperties, getPropertyById } from '../services/propertiesService';
import { getTenants } from '../services/tenantsService';
import { getPaymentsByMonth, getFinancialSummary } from '../services/paymentsService';
import { getUtilityBillsByMonth } from '../services/utilityService';
import { PropertyFull, Tenant, Payment, UtilityBill, FinancialSummary } from '../types';

// ─── useProperties ────────────────────────────────────────────

export function useProperties(regionName?: string) {
  const [data, setData]       = useState<PropertyFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Buscando região:', regionName);
      const result = await getProperties(regionName);
      console.log('Resultado:', JSON.stringify(result));
      setData(result);
    } catch (e: any) {
      console.log('ERRO:', e.message, e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [regionName]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ─── useProperty ──────────────────────────────────────────────

export function useProperty(id: string) {
  const [data, setData]       = useState<PropertyFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getPropertyById(id);
      setData(result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ─── useTenants ───────────────────────────────────────────────

export function useTenants() {
  const [data, setData]       = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getTenants();
      setData(result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ─── usePayments ──────────────────────────────────────────────

export function usePayments(month?: string) {
  const [data, setData]       = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Buscando pagamentos mês:', month);
      const result = await getPaymentsByMonth(month);
      console.log('Pagamentos:', JSON.stringify(result));
      setData(result);
    } catch (e: any) {
      console.log('ERRO pagamentos:', e.message);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ─── useUtilityBills ──────────────────────────────────────────

export function useUtilityBills(month?: string) {
  const [data, setData]       = useState<UtilityBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getUtilityBillsByMonth(month);
      setData(result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ─── useFinancialSummary ──────────────────────────────────────

export function useFinancialSummary(month?: string) {
  const [data, setData]       = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getFinancialSummary(month);
      setData(result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
