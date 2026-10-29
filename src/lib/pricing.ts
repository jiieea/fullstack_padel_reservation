import { ADDONS, MAX_DISCOUNT_PCT } from '@/constants';
import type { Config, Court } from '@/types';
import { fromIso } from './format';

export function getDynamicPrice(config: Config, court: Court, dateStr: string, hour: number): number {
  const day = fromIso(dateStr).getDay();
  const p = config.pricing;
  let mult = 1;
  if (hour >= p.peakStart && hour < p.peakEnd) mult += p.peakPct / 100;
  else if (hour >= 7 && hour < 10) mult -= p.earlyPct / 100;
  if (day === 0 || day === 6) mult += p.weekendPct / 100;
  return Math.round((court.price * mult) / 1000) * 1000;
}

export const isPeakHour = (config: Config, hour: number): boolean =>
  hour >= config.pricing.peakStart && hour < config.pricing.peakEnd;

export interface OrderInput {
  court?: Court; hours: number[]; dateStr: string; config: Config;
  addonIds: string[]; memberDiscPct: number; promoPct: number;
}
export interface OrderTotals { base: number; extra: number; disc: number; totalDiscPct: number; total: number }

export function calcOrderTotals(i: OrderInput): OrderTotals {
  const base = i.court ? i.hours.reduce((s, h) => s + getDynamicPrice(i.config, i.court!, i.dateStr, h), 0) : 0;
  const extra = ADDONS.filter(a => i.addonIds.includes(a.id)).reduce((s, a) => s + a.p, 0);
  const totalDiscPct = Math.min(MAX_DISCOUNT_PCT, i.memberDiscPct + i.promoPct);
  const disc = Math.round(base * (totalDiscPct / 100));
  return { base, extra, disc, totalDiscPct, total: Math.max(0, base + extra - disc) };
}
