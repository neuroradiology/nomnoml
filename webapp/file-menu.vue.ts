Vue.component('file-list', {

  props: ['app', 'storage', 'basepath'],

  data() {
    return { items: [] }
  },

  template: `
  <div>
    <div class="file-tools">
      <button v-on:click.prevent="saveAs()">Save as...</button>
    </div>
    <div v-for="item in items" v-bind:class="{ 'file-entry': true, 'active': isActive(item) }">
      <a v-bind:href="itemPath(item)">{{item.name}}</a>
      <a v-on:click="discard(item)" title="Discard this diagram">
        <icon id=trash></icon>
      </a>
    </div>
  </div>`,

  mounted() {
    this.storage.files().then((items: FileEntry[]) => { this.items = items })
    this.app.filesystem.signals.on('updated', (src: string) => {
      this.storage.files().then((items: FileEntry[]) => { this.items = items })
    })
  },

  methods: {

    isActive(item: FileEntry): boolean {
      var isActiveStorage = (this.app.filesystem.storage.kind === this.storage.kind)
      return isActiveStorage && this.app.filesystem.activeFile.name === item.name
    },

    itemPath(item: FileEntry) {
      return this.basepath + encodeURIComponent(item.name).replace(/%20/g, '+')
    },

    saveAs() {
      var name = prompt('Name your diagram')
      if (name) {
        if (this.items.some((e: FileEntry) => e.name === name)) {
          this.notify('A file named '+name+' already exists.')
          return
        }
        this.app.filesystem.moveToStorage(this.storage, name, this.app.currentSource()).then(() => {
          location.href = this.basepath + encodeURIComponent(name)
        })
      }
    },

    discard(item: FileEntry) {
      if (confirm('Permanently delete "' + item.name + '"'))
        this.app.filesystem.discard(item)
    }
  }

})

function FileMenu(selector: string, app: App, storage: GraphStore): Vue {
  return new Vue({
    el: selector,

    data: { app: app, storage: storage },

    methods: {

      showHomeFileEntry(): boolean {
        return storage.kind === 'local_file'
      },

      isAtHome() {
        return app.filesystem.storage.kind === 'local_default'
      },

      loadSvg(e: Event) {
        var files = (e.target as HTMLInputElement).files
        app.handleOpeningFiles(files)
      }
    }

  })
}