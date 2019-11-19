class StoreDefaultBuffer implements GraphStore {
  kind: StoreKind = 'local_default'
  storageKey: string = 'nomnoml.lastSource'
  async files(): Promise<FileEntry[]> {
    return JSON.parse(localStorage['nomnoml.file_index'] || '[]') as FileEntry[]
  }
  async read(): Promise<string> { return localStorage[this.storageKey] }
  async insert(source: string): Promise<void> { }
  async save(source: string): Promise<void> {
    localStorage[this.storageKey] = source
  }
  async clear(): Promise<void> { }
}
