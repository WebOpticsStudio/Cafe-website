'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_LOGIN_PATH, SESSION_COOKIE_NAME } from '@/features/auth/constants';
import { requireAdmin } from '@/features/auth/server/session';
import { setMenuItemAvailability } from '@/features/menu/server/menu.repository';
import { logger } from '@/lib/utils/logger';
import { setAvailabilityInputSchema } from '@/schemas/menu';
import type { ActionResult } from '@/types';

/**
 * Server Actions are public HTTP endpoints: each one re-checks authentication and validates
 * its input, regardless of which page rendered the form that calls it.
 */
export async function setItemAvailabilityAction(
  _previous: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = setAvailabilityInputSchema.safeParse({
    itemId: formData.get('itemId'),
    isAvailable: formData.get('isAvailable'),
  });
  if (!parsed.success) return { ok: false, error: 'That request was not valid.' };

  try {
    await setMenuItemAvailability(parsed.data.itemId, parsed.data.isAvailable);
  } catch (error) {
    logger.error('Failed to update menu item availability', error, { itemId: parsed.data.itemId });
    return { ok: false, error: 'Could not update this item. Please try again.' };
  }

  revalidatePath('/');
  revalidatePath('/menu');
  revalidatePath('/admin');
  return { ok: true };
}

export async function signOutAction(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE_NAME);
  redirect(ADMIN_LOGIN_PATH);
}
