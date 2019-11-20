class StoreDefaultBuffer implements GraphStore {
  isMappedToFileEntry: boolean = false
  kind: StoreKind = 'local_default'
  storageKey: string = 'nomnoml.lastSource'
  async files(): Promise<FileEntry[]> {
    return JSON.parse(localStorage['nomnoml.file_index'] || '[]') as FileEntry[]
  }
  async read(name: string): Promise<string> { return localStorage[this.storageKey] }
  async insert(name: string, source: string): Promise<void> { }
  async save(name: string, source: string): Promise<void> {
    localStorage[this.storageKey] = source
  }
  async clear(name: string): Promise<void> { }
}
