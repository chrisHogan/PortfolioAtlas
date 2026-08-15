// The six /retire-on portfolio tiers — the single source of truth.
// The tier routes, tier-page props, and the city-page sidebar link all import
// this list. The $1.5M slug is deliberately '1-5m' (a dot would break URLs).

export interface PortfolioTier {
  slug: string;
  label: string;
  value: number;
  titlePrefix: string;
}

export const PORTFOLIO_TIERS: PortfolioTier[] = [
  { slug: '500k',  label: '$500K',  value: 500_000,    titlePrefix: 'Retire Abroad on $500K' },
  { slug: '750k',  label: '$750K',  value: 750_000,    titlePrefix: 'Retire Abroad on $750K' },
  { slug: '1m',    label: '$1M',    value: 1_000_000,  titlePrefix: 'Retire on $1 Million' },
  { slug: '1-5m',  label: '$1.5M',  value: 1_500_000,  titlePrefix: 'Retire on $1.5M Abroad' },
  { slug: '2m',    label: '$2M',    value: 2_000_000,  titlePrefix: 'Retire on $2 Million' },
  { slug: '3m',    label: '$3M',    value: 3_000_000,  titlePrefix: 'Fat FIRE Abroad on $3M' },
];
