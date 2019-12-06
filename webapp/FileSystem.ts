class FileSystem {
  signals: Observable = new Observable()
  activeFile: FileEntry = {
    date: '',
    collaborators: [],
    name: null,
    revision: 0,
  }
  storage: GraphStore = new StoreDefaultBuffer()
  stores = {
    local_default: new StoreDefaultBuffer(),
    local_file: new StoreLocal(),
    cloud: new StoreCloud('/api/files/'),
    url: new StoreUrl('')
  }

  async read(): Promise<string> {
    return await this.storage.read(this.activeFile.name)
  }

  async save(source: string): Promise<void> {
    await this.storage.save(this.activeFile.name, source)
  }

  async moveToStorage(storage: GraphStore, name: string, source: string) {
    await storage.insert(name, source)
    this.signals.trigger('updated')
  }

  async moveToLocalStorage(source: string): Promise<void> {
    this.storage = new StoreDefaultBuffer()
    await this.storage.save(null, source)
  }

  async discard(entry: FileEntry): Promise<void> {
    await this.storage.clear(entry.name)
    this.signals.trigger('updated')
  }

  async configureByRoute(path: string) {
    var route = Route.from(path)
    this.storage = this.stores[this.routedStoreKind(route)]
    if (this.storage.kind === 'url') {
      this.storage.save('url', route.path)
    }
    var index = await this.storage.files()
    var ephemeralFile: FileEntry = {
      name: 'ephemeral',
      collaborators: [],
      revision: 0,
      date: (new Date()).toISOString(),
    }
    if (this.storage.isMappedToFileEntry)
      this.activeFile = nomnoml.skanaar.find(index, e => e.name === route.path) || ephemeralFile
    else
      this.activeFile = ephemeralFile
    this.signals.trigger('updated')
  }

  private routedStoreKind(route: Route): StoreKind {
    if (route.context === 'view') return 'url'
    if (route.context === 'file') return 'local_file'
    if (route.context === 'cloud') return 'cloud'
    return 'local_default'
  }
}