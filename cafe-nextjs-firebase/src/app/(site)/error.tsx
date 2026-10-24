'use client';

import { useEffect } from 'react';
import { Button, ButtonLink } from '@/components/ui/Button';
import { StateMessage } from '@/components/ui/StateMessage';

/** Route-level error boundary: the header and footer stay put, only the page body is replaced. */
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StateMessage
      role="alert"
      title="Something went wrong"
      actions={
        <>
          <Button onClick={reset}>Try again</Button>
          <ButtonLink href="/" variant="outline">
            Back to home
          </ButtonLink>
        </>
      }
    >
      We could not load this page. Please try again in a moment.
    </StateMessage>
  );
}
