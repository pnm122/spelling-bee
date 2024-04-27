<script lang="ts">
  import { type PuzzlePreview } from "$shared/interfaces/Puzzle";
	import Hexagon from "../shared/Hexagon.svelte";

  export let puzzle: PuzzlePreview
</script>

<a 
  class="preview"
  data-sveltekit-preload-data="tap"
  href="/puzzle/{puzzle.id}">
  <div class="info">
    <h2 class="date">{puzzle.date}</h2>
    <!-- <h3 class="state">Not started</h3> -->
  </div>
  <div class="puzzle-letters">
    <Hexagon
    largeText
    width='28%'
    textColor='var(--dark)'
    fill='var(--primary)'
    letter={puzzle.centerLetter}
    class='letter-button center-letter-hexagon'
    />
    <Hexagon
    largeText
    width='28%'
    textColor='var(--heading)'
    fill='var(--gray)'
    letter={puzzle.outsideLetters[0]}
    class='letter-button top-middle-letter'
    />
    <Hexagon
    largeText
    width='28%'
    textColor='var(--heading)'
    fill='var(--gray)'
    letter={puzzle.outsideLetters[1]}
    class='letter-button top-right-letter'
    />
    <Hexagon
    largeText
    width='28%'
    textColor='var(--heading)'
    fill='var(--gray)'
    letter={puzzle.outsideLetters[2]}
    class='letter-button bottom-right-letter'
    />
    <Hexagon
    largeText
    width='28%'
    textColor='var(--heading)'
    fill='var(--gray)'
    letter={puzzle.outsideLetters[3]}
    class='letter-button bottom-middle-letter'
    />
    <Hexagon
    largeText
    width='28%'
    textColor='var(--heading)'
    fill='var(--gray)'
    letter={puzzle.outsideLetters[4]}
    class='letter-button bottom-left-letter'
    />
    <Hexagon
    largeText
    width='28%'
    textColor='var(--heading)'
    fill='var(--gray)'
    letter={puzzle.outsideLetters[5]}
    class='letter-button top-left-letter'
    />
  </div>
</a>

<style>
  .preview {
    --hover-delay: 0.05s;

    width: 100%;
    aspect-ratio: 1;
    background-color: var(--bg-secondary);
    border: 1px solid var(--gray);
    border-radius: 0.25rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .date {
    font: var(--h-xl);
  }

  .puzzle-letters {
    position: relative;
    width: 100%;
    flex: 1;
  }

  .preview :global(.letter-button polygon),
  .preview :global(.letter-button text) {
    transition-property: fill;
    transition-timing-function: var(--timing-function);
  }

  .preview:hover :global(.letter-button:not(.center-letter-hexagon) polygon) {
    fill: var(--primary);
  }

  .preview:hover :global(.letter-button:not(.center-letter-hexagon) text) {
    fill: var(--dark);
  }

  .preview :global(.letter-button:nth-of-type(3) polygon),
  .preview :global(.letter-button:nth-of-type(3) text) {
    transition-delay: var(--hover-delay);
  }

  .preview :global(.letter-button:nth-of-type(4) polygon),
  .preview :global(.letter-button:nth-of-type(4) text) {
    transition-delay: calc(var(--hover-delay) * 2);
  }

  .preview :global(.letter-button:nth-of-type(5) polygon),
  .preview :global(.letter-button:nth-of-type(5) text) {
    transition-delay: calc(var(--hover-delay) * 3);
  }

  .preview :global(.letter-button:nth-of-type(6) polygon),
  .preview :global(.letter-button:nth-of-type(6) text) {
    transition-delay: calc(var(--hover-delay) * 4);
  }

  .preview :global(.letter-button:nth-of-type(7) polygon),
  .preview :global(.letter-button:nth-of-type(7) text) {
    transition-delay: calc(var(--hover-delay) * 5);
  }
</style>