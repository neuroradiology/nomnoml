function AppTools(selector: string, app: App) {
  return new Vue({
    el: selector,

    mounted() {
      app.filesystem.signals.on('updated', (src: string) => this.$forceUpdate())
    },

    data: { app: app, panner: app.panner }

  })
}