class FileSystem {
  signals: Observable = new Observable()
  activeFile: FileEntry = new FileEntry(null, 'local_default')
  storage: GraphStore= new StoreDefaultBuffer()
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
    storage.insert(name, source)
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
    var index = await this.storage.files()
    var ephemeralFile = new FileEntry(decodeURIComponent(route.path), this.storage.kind)
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

type StoreKind = 'local_default' | 'local_file' | 'cloud' | 'url'

class FileEntry {
  date: string = (new Date()).toISOString()
  collaborators: string[] = []
  baseRevision: number = 0
  constructor(
    public name: string,
    public backingStore: StoreKind
  ) {}
}

interface GraphStore {
  isMappedToFileEntry: boolean
  files(): Promise<FileEntry[]>
  read(name: string): Promise<string>
  insert(name: string, src: string): Promise<void>
  save(name: string, src: string): Promise<void>
  clear(name: string): Promise<void>
  kind: StoreKind
}
