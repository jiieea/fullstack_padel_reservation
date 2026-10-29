import { useEffect, useState } from 'react';
import { fromPricingDraft, toPricingDraft, type PricingDraft } from '@/actions/admin.actions';
import { useAuth } from '@/providers/AuthProvider';
import { useData } from '@/providers/DataProvider';

export function useAdminPricing() {
  const { isAdmin } = useAuth();
  const { config, dispatch } = useData();
  const [basePrices, setBasePrices] = useState<Record<number, string>>({});
  const [pricing, setPricing] = useState<PricingDraft>(toPricingDraft(config.pricing));
  const [promoForm, setPromoForm] = useState({ code: '', pct: '' });

  // keep the editable drafts in sync with the saved config
  useEffect(() => {
    setBasePrices(Object.fromEntries(config.courts.map(c => [c.id, String(c.price)])));
    setPricing(toPricingDraft(config.pricing));
  }, [config.courts, config.pricing]);

  return {
    courts: config.courts, promos: config.promos, basePrices, pricing, promoForm,
    setBasePrice: (id: number, v: string) => setBasePrices(p => ({ ...p, [id]: v })),
    setPricingField: (k: keyof PricingDraft, v: string) => setPricing(p => ({ ...p, [k]: v })),
    setPromoForm: (patch: Partial<typeof promoForm>) => setPromoForm(f => ({ ...f, ...patch })),
    save: () => {
      if (!isAdmin) return;
      dispatch({
        type: 'SAVE_PRICING', pricing: fromPricingDraft(pricing),
        basePrices: Object.fromEntries(Object.entries(basePrices).map(([id, v]) => [Number(id), Number(v)])),
      });
    },
    addPromo: () => {
      if (!isAdmin) return;
      const code = promoForm.code.trim().toUpperCase(), pct = Number(promoForm.pct);
      if (!code || !pct) return;
      dispatch({ type: 'ADD_PROMO', promo: { code, pct } });
      setPromoForm({ code: '', pct: promoForm.pct });
    },
    removePromo: (code: string) => { if (isAdmin) dispatch({ type: 'REMOVE_PROMO', code }); },
  };
}
