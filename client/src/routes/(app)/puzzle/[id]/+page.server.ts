import { loadNewPuzzle } from '$lib/stores/currentPuzzle.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  const res = await loadNewPuzzle(params.id)
  if(res) return

	error(404, 'Not found');
}

export const prerender = false