import { loadDailyPuzzle } from '$lib/stores/currentPuzzle.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load() {
  const res = await loadDailyPuzzle()
  if(res) return

	error(404, "We couldn't find this puzzle.");
}

export const prerender = false