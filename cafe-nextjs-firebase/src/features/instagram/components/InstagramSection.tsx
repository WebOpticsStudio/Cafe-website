import Image from 'next/image';
import { Section } from '@/components/ui/Section';
import { Skeleton } from '@/components/ui/Skeleton';
import { ButtonLink } from '@/components/ui/Button';
import { InstagramIcon } from '@/components/ui/icons';
import { truncate } from '@/lib/utils/format';
import { getInstagramFeed } from '../server/instagram.service';

/**
 * Async Server Component. Shows recent posts when a provider returns some; otherwise a
 * profile-link card; and nothing at all if there is neither a feed nor a handle.
 */
export async function InstagramSection() {
  const feed = await getInstagramFeed(6);

  if (feed.status === 'fallback') {
    if (!feed.profileUrl) return null;
    return (
      <Section title="Follow along" description="See what is fresh from the bar and the oven.">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-forest-50 p-8">
          <p className="max-w-md text-lg">
            Photos, daily specials and news live on our Instagram page.
          </p>
          <ButtonLink href={feed.profileUrl} variant="primary">
            <InstagramIcon />
            Follow @{feed.handle}
          </ButtonLink>
        </div>
      </Section>
    );
  }

  return (
    <Section title="From our Instagram" description={feed.handle ? `@${feed.handle}` : undefined}>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {feed.posts.map((post) => (
          <li key={post.id}>
            <a
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden rounded-lg bg-forest-50"
            >
              <Image
                src={post.imageUrl}
                alt={post.caption ? truncate(post.caption, 100) : 'Instagram post'}
                fill
                sizes="(min-width: 1152px) 360px, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
              />
              <span className="sr-only">
                {post.isVideo ? 'Watch on Instagram' : 'View on Instagram'} (opens in a new tab)
              </span>
            </a>
          </li>
        ))}
      </ul>
      {feed.profileUrl ? (
        <div className="mt-8">
          <ButtonLink href={feed.profileUrl} variant="outline">
            <InstagramIcon />
            Follow @{feed.handle}
          </ButtonLink>
        </div>
      ) : null}
    </Section>
  );
}

export function InstagramSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
      aria-hidden="true"
    >
      <Skeleton className="h-10 w-64" />
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="aspect-square" />
        ))}
      </div>
    </div>
  );
}
