'use client';

import dynamic from 'next/dynamic';

const MiniKitProvider = dynamic(() => import("@/components/minikit-provider"), {
  ssr: false,
});

const NextAuthProvider = dynamic(() => import("@/components/next-auth-provider"), {
  ssr: false,
});

const ErudaProvider = dynamic(
  () => import("../components/Eruda").then((c) => c.ErudaProvider),
  { ssr: false }
);

const ErrorBoundary = dynamic(
  () => import("@/components/error-boundary").then(mod => mod.ErrorBoundary),
  { ssr: false }
);

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <NextAuthProvider>
        <MiniKitProvider>
          <ErudaProvider>
            {children}
          </ErudaProvider>
        </MiniKitProvider>
      </NextAuthProvider>
    </ErrorBoundary>
  );
} 