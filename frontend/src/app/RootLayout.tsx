import { Outlet, ScrollRestoration } from 'react-router';
import { RestrictionsBanner } from '../features/session/components/RestrictionsBanner';
import { SessionGate } from '../features/session/components/SessionGate';
import { UserSummary } from '../features/session/components/UserSummary';
import { Footer } from '../shared/components/Footer';
import { Header } from '../shared/components/Header';
import { SkipLink } from '../shared/components/SkipLink';

const MAIN_ID = 'main-content';

export function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink targetId={MAIN_ID} />
      <Header userSlot={<UserSummary />} />
      <main
        id={MAIN_ID}
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8"
      >
        <SessionGate>
          <div className="flex flex-col gap-6">
            <RestrictionsBanner />
            <Outlet />
          </div>
        </SessionGate>
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
