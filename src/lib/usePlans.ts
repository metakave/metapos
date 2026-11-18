import { useEffect, useState } from 'react';
import { PRICING_PLANS, type Plan } from '../data/publisherData';
import { api } from './api';

interface PlanPrice {
  id: string;
  priceMonthly: number;
  priceYearly: number;
}

let cache: PlanPrice[] | null = null;

/**
 * The static plan data, with prices overridden by whatever the admin set in
 * the dashboard. Falls back to the static prices if the API is unreachable.
 */
export function usePlans(): Plan[] {
  const [prices, setPrices] = useState<PlanPrice[] | null>(cache);

  useEffect(() => {
    if (cache) return;
    let cancelled = false;
    api<{ plans: PlanPrice[] }>('/plans')
      .then(({ plans }) => {
        cache = plans;
        if (!cancelled) setPrices(plans);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!prices) return PRICING_PLANS;
  return PRICING_PLANS.map((plan) => {
    const p = prices.find((x) => x.id === plan.id);
    return p ? { ...plan, priceMonthly: p.priceMonthly, priceYearly: p.priceYearly } : plan;
  });
}
