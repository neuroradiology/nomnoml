class StoreUrl implements GraphStore {
  isMappedToFileEntry: boolean = false
  kind: StoreKind = 'url'
  constructor(public source: string) {}
  async files(): Promise<FileEntry[]> {
    return JSON.parse(localStorage['nomnoml.file_index'] || '[]') as FileEntry[]
  }
  async read(name: string): Promise<string> { return this.source }
  async insert(name: string, source: string): Promise<void> { }
  async save(name: string, source: string): Promise<void> { this.source = source }
  async clear(name: string): Promise<void> { return null }
}
