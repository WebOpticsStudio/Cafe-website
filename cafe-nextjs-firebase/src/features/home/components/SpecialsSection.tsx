'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Check, Coffee } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils/format';
import { siteConfig } from '@/config/site';
import type { MenuItem } from '@/schemas/menu';

interface SpecialsSectionProps {
  items?: MenuItem[];
}

const signatureSpecials: MenuItem[] = [
  {
    id: 'cappuccino',
    categoryId: 'coffee',
    name: 'Cappuccino',
    description: 'Smooth double espresso with steamed milk.',
    priceMinor: 220,
    imageUrl: '/images/cappuccino.jpg',
    dietaryTags: ['vegetarian'],
    isFeatured: true,
    isAvailable: true,
    sortOrder: 10,
  },
  {
    id: 'iced-latte',
    categoryId: 'coffee',
    name: 'Iced Latte',
    description: 'Chilled espresso with fresh milk over ice.',
    priceMinor: 240,
    imageUrl: '/images/iced-latte.jpg',
    dietaryTags: ['vegetarian'],
    isFeatured: true,
    isAvailable: true,
    sortOrder: 20,
  },
  {
    id: 'french-fries',
    categoryId: 'fast-food',
    name: 'Crispy French Fries',
    description: 'Thin-cut golden fries with house dip.',
    priceMinor: 160,
    imageUrl: '/images/french-fries.jpg',
    dietaryTags: ['vegan'],
    isFeatured: true,
    isAvailable: true,
    sortOrder: 30,
  },
  {
    id: 'cafe-cheeseburger',
    categoryId: 'fast-food',
    name: 'Café Cheeseburger',
    description: 'Juicy patty, cheddar & secret sauce.',
    priceMinor: 290,
    imageUrl: '/images/burger.jpg',
    dietaryTags: [],
    isFeatured: true,
    isAvailable: true,
    sortOrder: 40,
  },
  {
    id: 'margherita-pizza',
    categoryId: 'fast-food',
    name: 'Margherita Pizza',
    description: 'Buffalo mozzarella, tomato sauce & basil.',
    priceMinor: 360,
    imageUrl: '/images/pizza.jpg',
    dietaryTags: ['vegetarian'],
    isFeatured: true,
    isAvailable: true,
    sortOrder: 50,
  },
  {
    id: 'chocolate-cake',
    categoryId: 'desserts',
    name: 'Chocolate Fudge Cake',
    description: 'Rich dark chocolate cake with ganache.',
    priceMinor: 240,
    imageUrl: '/images/chocolate-cake.jpg',
    dietaryTags: ['vegetarian'],
    isFeatured: true,
    isAvailable: true,
    sortOrder: 60,
  },
];

export function SpecialsSection({ items }: SpecialsSectionProps) {
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  // Use provided items if available, or fall back to signature specials matching the reference
  const displayItems = items && items.length >= 6 ? items.slice(0, 6) : signatureSpecials;

  const handleAddToCart = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    addItem(item);
    setAddedId(item.id);
    setTimeout(() => {
      setAddedId(null);
    }, 1200);
  };

  return (
    <section id="specials" className="scroll-mt-16 pt-5 pb-12 sm:pt-6 sm:pb-16 bg-[#FAF7F2]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Centered Section Header ── */}
        <div className="text-center mx-auto max-w-2xl mb-5 sm:mb-6">
          <p className="font-editorial italic text-xs text-[#C47935] uppercase tracking-widest font-semibold">
            — Our Specials —
          </p>
          <h2 className="mt-1 font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1510] tracking-tight">
            Handcrafted with <span className="italic font-normal text-[#C47935]">love</span>, Just for you.
          </h2>
        </div>

        {/* ── 6 Specials Cards in a Clean Responsive Grid (No Arrows) ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#E5DDD1] bg-white p-2.5 shadow-2xs hover:shadow-md hover:border-[#C47935]/40 transition-all"
            >
              {/* Product Image */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#F4EFE6]">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1280px) 190px, (min-width: 1024px) 160px, (min-width: 640px) 220px, 45vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#F4EFE6] text-[#C47935]">
                    <Coffee className="size-6" />
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex flex-1 flex-col justify-between pt-2.5">
                <div>
                  <h3 className="font-editorial text-sm font-bold text-[#1C1510] group-hover:text-[#C47935] transition-colors leading-tight truncate">
                    {item.name}
                  </h3>
                  <p className="mt-0.5 line-clamp-2 min-h-[28px] text-[11px] text-[#6B5E52] leading-tight">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#F4EFE6] pt-2">
                  <span className="font-bold text-xs sm:text-sm text-[#1C1510] tabular-nums">
                    {formatPrice(item.priceMinor, siteConfig.currency, siteConfig.locale)}
                  </span>

                  {/* Circular Plus Button matching reference */}
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(e, item)}
                    aria-label={`Add ${item.name} to cart`}
                    className={`flex size-6 items-center justify-center rounded-full text-white transition-all active:scale-90 cursor-pointer ${
                      addedId === item.id
                        ? 'bg-emerald-600'
                        : 'bg-[#1C1510] hover:bg-[#C47935]'
                    }`}
                  >
                    {addedId === item.id ? (
                      <Check className="size-3" />
                    ) : (
                      <Plus className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
