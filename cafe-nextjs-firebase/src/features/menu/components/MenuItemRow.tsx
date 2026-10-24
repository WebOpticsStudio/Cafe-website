'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils/format';
import type { MenuItem } from '@/schemas/menu';
import { DietaryBadges } from './DietaryBadges';

/**
 * One menu entry, laid out like a high-end printed cafe menu:
 * image, item name, dotted leader line, formatted price, Add to Cart action, and dietary tags.
 */
export function MenuItemRow({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const soldOut = !item.isAvailable;

  const handleAdd = () => {
    if (soldOut) return;
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <li
      className={cn(
        'flex gap-4 sm:gap-5 py-4 px-3 rounded-2xl transition-all duration-200 hover:bg-white hover:shadow-xs border border-transparent hover:border-[#E5DDD1]',
        soldOut && 'opacity-60'
      )}
    >
      {item.imageUrl ? (
        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-[#F4EFE6] border border-[#E5DDD1] shadow-2xs sm:size-24">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 sm:gap-3">
          <h3 className="font-editorial text-base sm:text-lg font-bold text-[#1C1510]">
            {item.name}
          </h3>
          <span
            aria-hidden="true"
            className="hidden sm:inline min-w-6 flex-1 -translate-y-1 border-b-2 border-dotted border-[#E5DDD1]"
          />
          <div className="ml-auto flex items-center gap-2.5">
            <span className="font-editorial text-sm sm:text-base font-bold tabular-nums text-[#1C1510]">
              {formatPrice(item.priceMinor, siteConfig.currency, siteConfig.locale)}
            </span>

            {!soldOut && (
              <button
                type="button"
                onClick={handleAdd}
                aria-label={`Add ${item.name} to cart`}
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#1C1510] text-white hover:bg-[#C47935] active:scale-95'
                }`}
              >
                {added ? (
                  <>
                    <Check className="size-3" />
                    <span className="hidden sm:inline">Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="size-3 text-[#C47935]" />
                    <span>Add</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {item.description ? (
          <p className="mt-1 max-w-prose text-xs sm:text-sm text-[#6B5E52] leading-relaxed">
            {item.description}
          </p>
        ) : null}

        {item.dietaryTags.length > 0 || soldOut ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <DietaryBadges tags={item.dietaryTags} />
            {soldOut ? (
              <span className="text-xs font-semibold text-red-700">Sold out today</span>
            ) : null}
          </div>
        ) : null}
      </div>
    </li>
  );
}
