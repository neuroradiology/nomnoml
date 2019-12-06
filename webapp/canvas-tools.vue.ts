Vue.component('canvas-tools', {
  props: { panner: CanvasPanner },
  template: `
  <div class=canvas-tools id=canvas-tools>
    <div class=canvas-button>
      <a v-on:click.prevent="panner.magnify(2)" title="Zoom in"><icon id=plus></icon></a>
    </div>
    <div class=canvas-button>
      <a v-on:click.prevent="panner.reset()" title="Reset zoom and panning"><icon id=equals></icon></a>
    </div>
    <div class=canvas-button>
      <a v-on:click.prevent="panner.magnify(-2)" title="Zoom out"><icon id=minus></icon></a>
    </div>
  </div>`
})
