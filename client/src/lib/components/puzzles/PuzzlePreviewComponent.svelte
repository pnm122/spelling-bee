<script lang="ts">
  import { type PuzzlePreview } from "$backend_interfaces/Puzzle";
	import Hexagon from "../shared/Hexagon.svelte";

  export let puzzle: PuzzlePreview
</script>

<a 
  class="preview"
  href="/puzzle/{puzzle.id}">
  <div class="info">
    <h2 class="date">{puzzle.date}</h2>
    <h3 class="state">Not started</h3>
  </div>
  <div class="puzzle-letters">
    <Hexagon
      largeText
      width={24}
      textColor='var(--dark)'
      fill='var(--primary)'
      letter={puzzle.centerLetter}
      class='letter-button center-letter-hexagon'
    />
    <Hexagon
      largeText
      width={24}
      textColor='var(--heading)'
      fill='var(--gray)'
      letter={puzzle.outsideLetters[0]}
      class='letter-button top-middle-letter'
    />
    <Hexagon
      largeText
      width={24}
      textColor='var(--heading)'
      fill='var(--gray)'
      letter={puzzle.outsideLetters[1]}
      class='letter-button top-right-letter'
    />
    <Hexagon
      largeText
      width={24}
      textColor='var(--heading)'
      fill='var(--gray)'
      letter={puzzle.outsideLetters[2]}
      class='letter-button bottom-right-letter'
    />
    <Hexagon
      largeText
      width={24}
      textColor='var(--heading)'
      fill='var(--gray)'
      letter={puzzle.outsideLetters[3]}
      class='letter-button bottom-middle-letter'
    />
    <Hexagon
      largeText
      width={24}
      textColor='var(--heading)'
      fill='var(--gray)'
      letter={puzzle.outsideLetters[4]}
      class='letter-button bottom-left-letter'
    />
    <Hexagon
      largeText
      width={24}
      textColor='var(--heading)'
      fill='var(--gray)'
      letter={puzzle.outsideLetters[5]}
      class='letter-button top-left-letter'
    />
  </div>
</a>

<style>
  .preview {
    width: 100%;
    background-color: var(--bg-secondary);
    border: 1px solid var(--gray);
    border-radius: 0.25rem;
    padding: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .date {
    font: var(--h-xl);
  }

  .state {
    color: var(--mediumgray);
    font: var(--body);
    font-style: italic;
    line-height: 1;
  }

  .puzzle-letters {
    height: calc(21.03px * 3);
    width: calc(21.03px * 3);
    position: relative;
  }
</style>