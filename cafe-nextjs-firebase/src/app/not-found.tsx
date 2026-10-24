import { SiteShell } from '@/components/layout/SiteShell';
import { ButtonLink } from '@/components/ui/Button';
import { StateMessage } from '@/components/ui/StateMessage';

export default function NotFound() {
  return (
    <SiteShell>
      <StateMessage
        title="Page not found"
        actions={
          <>
            <ButtonLink href="/">Back to home</ButtonLink>
            <ButtonLink href="/menu" variant="outline">
              See the menu
            </ButtonLink>
          </>
        }
      >
        That page does not exist. It may have moved.
      </StateMessage>
    </SiteShell>
  );
}
