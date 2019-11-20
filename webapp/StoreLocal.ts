class StoreLocal implements GraphStore {
  isMappedToFileEntry: boolean = true
  kind: StoreKind = 'local_file'
  prefix: string = 'nomnoml.files/'
  async files(): Promise<FileEntry[]> {
    return JSON.parse(localStorage['nomnoml.file_index'] || '[]') as FileEntry[]
  }
  async read(name: string): Promise<string> {
    return localStorage[this.prefix+name]
  }
  async insert(name: string, source: string): Promise<void> {
    var entry: FileEntry = new FileEntry(name, 'local_file')
    var index = await this.files()
    if (!nomnoml.skanaar.find(index, e => e.name === name)) {
      index.push(entry)
      index.sort((a,b) => a.name.localeCompare(b.name))
      localStorage['nomnoml.file_index'] = JSON.stringify(index)
    }
    localStorage[this.prefix+name] = source
  }
  async save(name: string, source: string): Promise<void> {
    localStorage[this.prefix+name] = source
  }
  async clear(name: string): Promise<void> {
    localStorage.removeItem(this.prefix+name)
    var files = await this.files()
    var index = files.filter(e => e.name != name)
    localStorage['nomnoml.file_index'] = JSON.stringify(index)
  }
}