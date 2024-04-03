<script lang="ts">
  export let size: number;
  export let color: string;
</script>

<svg id='loader' fill={color} width={size} viewBox="-5 -5 130 113.92304845413263">
  <polygon
    points="0,51.96152422706631 30,0 90,0 120,51.96152422706631 90,103.92304845413263 30,103.92304845413263">
  </polygon>
</svg>

<style>
  #loader {
    animation: load 2s infinite cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
  }

  @keyframes load {
    0% {
      transform: rotate(0) scale(1);
    } 50% {
      transform: rotate(180deg) scale(0.667);
    } 100% {
      transform: rotate(360deg) scale(1);
    }
  }
</style>