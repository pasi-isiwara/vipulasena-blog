'use client';

import { usePathname } from 'next/navigation';
import type { VisitTotals } from '@/lib/types';
import { PageBackground } from './art/PageBackground';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { SkipLink } from './SkipLink';

/** Everything that wraps a page. The admin area hides the site header and
 *  footer and dims the background, the way the prototype's .is-admin class did;
 *  here the route decides, so the chrome is simply never rendered rather than
 *  rendered and then hidden. */
export function Chrome({
  isAdmin,
  totals,
  children,
}: {
  isAdmin: boolean;
  totals: VisitTotals | null;
  children: React.ReactNode;
}) {
  const onAdminPage = usePathname().startsWith('/admin');

  return (
    <div className={onAdminPage ? 'is-admin' : undefined}>
      <PageBackground />
      {!onAdminPage && <SkipLink />}
      {!onAdminPage && <SiteHeader />}
      <main id="main">{children}</main>
      {!onAdminPage && <SiteFooter isAdmin={isAdmin} totals={totals} />}
    </div>
  );
}
