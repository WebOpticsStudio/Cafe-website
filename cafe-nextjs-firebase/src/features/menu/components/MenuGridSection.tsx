'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Plus, Check, Coffee, Search, Utensils, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils/format';
import { siteConfig } from '@/config/site';
import type { MenuCategory, MenuItem } from '@/schemas/menu';

interface MenuGridSectionProps {
  categories: MenuCategory[];
  items: MenuItem[];
}

export function MenuGridSection({ categories, items }: MenuGridSectionProps) {
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedId, setAddedId] = useState<string | null>(null);

  // Active filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Category filter: if 'all', show all mixed items; otherwise match categoryId
      if (activeCategory !== 'all' && item.categoryId !== activeCategory) {
        return false;
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }

      return true;
    });
  }, [items, activeCategory, searchQuery]);

  const handleAddToCart = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    addItem(item);
    setAddedId(item.id);
    setTimeout(() => {
      setAddedId(null);
    }, 1200);
  };

  return (
    <div className="w-full">
      {/* ── Single-Line Filter & Search Bar ── */}
      <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b border-[#E5DDD1] pb-4">
        {/* Category Filter Pills (All Items, Coffee, Fast Food, Beverages, Desserts) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {/* "All" button: Lists all mixed items */}
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
              activeCategory === 'all'
                ? 'bg-[#1C1510] text-white shadow-xs'
                : 'bg-white text-[#1C1510] border border-[#E5DDD1] hover:bg-[#F4EFE6] hover:border-[#C47935]'
            }`}
          >
            <span>All</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                activeCategory === 'all' ? 'bg-[#C47935] text-white' : 'bg-[#F4EFE6] text-[#6B5E52]'
              }`}
            >
              {items.length}
            </span>
          </button>

          {/* Dynamic Categories */}
          {categories.map((category) => {
            const count = items.filter((it) => it.categoryId === category.id).length;
            const isSelected = activeCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                  isSelected
                    ? 'bg-[#1C1510] text-white shadow-xs'
                    : 'bg-white text-[#1C1510] border border-[#E5DDD1] hover:bg-[#F4EFE6] hover:border-[#C47935]'
                }`}
              >
                <span>{category.name}</span>
                {count > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                      isSelected ? 'bg-[#C47935] text-white' : 'bg-[#F4EFE6] text-[#6B5E52]'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Bar in the Same Line */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-[#9C8F80]" />
          <input
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-[#E5DDD1] bg-white py-2 pl-9 pr-8 text-xs text-[#1C1510] placeholder:text-[#9C8F80] focus:border-[#C47935] focus:outline-none shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C8F80] hover:text-[#1C1510] cursor-pointer"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      </div>

      {/* ── Side-by-Side Menu Grid (Same as Specials Section, No Dietary Badges) ── */}
      {filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-[#E5DDD1] bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#F4EFE6] text-[#C47935] mb-3">
            <Utensils className="size-6" />
          </div>
          <h3 className="font-editorial text-lg font-bold text-[#1C1510]">
            No menu items found
          </h3>
          <p className="mt-1 text-xs text-[#6B5E52]">
            Try searching for something else or reset your filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#1C1510] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#C47935] transition-all cursor-pointer"
          >
            Show All Items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-3.5 lg:gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#E5DDD1] bg-white p-3 shadow-2xs hover:shadow-md hover:border-[#C47935]/40 transition-all"
            >
              {/* Product Image without dietary badges */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#F4EFE6]">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1280px) 240px, (min-width: 1024px) 200px, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#F4EFE6] text-[#C47935]">
                    <Coffee className="size-8" />
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex flex-1 flex-col justify-between pt-3">
                <div>
                  <h3 className="font-editorial text-sm sm:text-base font-bold text-[#1C1510] group-hover:text-[#C47935] transition-colors leading-tight truncate">
                    {item.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 min-h-[32px] text-xs text-[#6B5E52] leading-tight">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Bar: Price & Add to Cart button */}
                <div className="mt-3 flex items-center justify-between border-t border-[#F4EFE6] pt-2.5">
                  <span className="font-bold text-xs sm:text-sm text-[#1C1510] tabular-nums">
                    {formatPrice(item.priceMinor, siteConfig.currency, siteConfig.locale)}
                  </span>

                  {/* Circular Plus Button matching Specials Section */}
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(e, item)}
                    aria-label={`Add ${item.name} to cart`}
                    className={`flex size-7 items-center justify-center rounded-full text-white transition-all active:scale-90 cursor-pointer ${
                      addedId === item.id
                        ? 'bg-emerald-600'
                        : 'bg-[#1C1510] hover:bg-[#C47935]'
                    }`}
                  >
                    {addedId === item.id ? (
                      <Check className="size-3.5" />
                    ) : (
                      <Plus className="size-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
