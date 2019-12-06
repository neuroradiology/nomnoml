Vue.component('alert-popup', {
  props: { app: App, notices: Array },
  template: `
  <div class=alert-list>
    <div v-for="item in notices" class=alert>
      {{item.text}}
      <a class=alert-close v-on:click.prevent="app.closeNotice(item)">&times;</a>
    </div>
  </div>`
})
