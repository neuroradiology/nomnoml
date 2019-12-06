var icon = (function() {
  return Vue.component('icon', {
    data: function () {
      return { svg: '' }
    },
    props: ['id'],
    mounted() {
      var header = '<svg version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">'
      var path = (window as any).icons_lib[this.id]
      if (!path) throw new Error('Could not find icon ['+this.id+']')
      this.svg = header + path + '</svg>'
    },
    template: '<i v-html="svg"></i>'
  })
})();