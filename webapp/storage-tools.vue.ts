Vue.component('storage-tools', {
  props: ['storagekind', 'save'],
  template: `
  <div class="storage-tools">
    <span class="storage-status alert" v-bind:class="{ visible: storagekind == 'url' }">
      View mode, changes are not saved.
      <a v-on:click.prevent="save" href="/"
         title="Save this diagram to localStorage">save</a>
      <a href="#" title="Discard this diagram">close</a>
    </span>
    
    <span class="storage-status alert" v-bind:class="{ visible: storagekind == 'local_file' }">
      Editing local file
      <a href="#" title="Exit from this file">close</a>
    </span>
    
    <span class="storage-status alert" v-bind:class="{ visible: storagekind == 'cloud' }">
      Editing cloud file
      <a href="#" title="Exit from this file">close</a>
    </span>
  </div>`
})