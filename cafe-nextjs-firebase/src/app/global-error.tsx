'use client';

/** Last-resort boundary (errors in the root layout). Must render its own <html>/<body>. */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          display: 'grid',
          placeItems: 'center',
          minHeight: '100vh',
          margin: 0,
          textAlign: 'center',
        }}
      >
        <main role="alert">
          <h1>Something went wrong</h1>
          <p>Please try again in a moment.</p>
          <button
            type="button"
            onClick={reset}
            style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
