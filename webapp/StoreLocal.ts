class StoreLocal implements GraphStore {
  kind: StoreKind = 'local_file'
  storageKey: string
  constructor(public name: string) {
    this.storageKey = 'nomnoml.files/' + name
  }
  async files(): Promise<FileEntry[]> {
    return JSON.parse(localStorage['nomnoml.file_index'] || '[]') as FileEntry[]
  }
  async read(): Promise<string> {
    return localStorage[this.storageKey]
  }
  async insert(source: string): Promise<void> {
    var entry: FileEntry = new FileEntry(this.name, 'local_file')
    var index = await this.files()
    if (!nomnoml.skanaar.find(index, e => e.name === this.name)) {
      index.push(entry)
      index.sort((a,b) => a.name.localeCompare(b.name))
      localStorage['nomnoml.file_index'] = JSON.stringify(index)
    }
    localStorage[this.storageKey] = source
  }
  async save(source: string): Promise<void> {
    localStorage[this.storageKey] = source
  }
  async clear(): Promise<void> {
    localStorage.removeItem(this.storageKey)
    var files = await this.files()
    var index = files.filter(e => e.name != this.name)
    localStorage['nomnoml.file_index'] = JSON.stringify(index)
  }
}