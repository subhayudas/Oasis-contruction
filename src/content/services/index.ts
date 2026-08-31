import type { ServiceKey } from '@/lib/routes';
import { paveUni } from './pave-uni';
import { muret } from './muret';
import { margelle } from './margelle';
import { drainage } from './drainage';
import { lavageSousPression } from './lavage-sous-pression';
import { amenagementExterieur } from './amenagement-exterieur';
import type { Service } from './types';

export type { Service, ServiceCopy, ProcessStep, Faq } from './types';

/**
 * Order matters: this is the order services appear in the navigation
 * dropdown, the overview grid and the footer. Repair-led services come
 * first because they are what the diagnostic positioning is built on.
 */
export const services: Service[] = [
  paveUni,
  muret,
  margelle,
  drainage,
  lavageSousPression,
  amenagementExterieur,
];

export function serviceByKey(key: ServiceKey): Service | undefined {
  return services.find((s) => s.key === key);
}
