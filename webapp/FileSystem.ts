class FileSystem {
  signals: Observable = new Observable()
  activeFile: FileEntry
  storage: GraphStore = new StoreDefaultBuffer()

  async moveToFileStorage(name: string, source: string) {
    var fileStore = new StoreLocal(name)
    fileStore.insert(source)
    this.signals.trigger('updated')
  }

  async moveToLocalStorage(source: string): Promise<void> {
    this.storage = new StoreDefaultBuffer()
    await this.storage.save(source)
  }

  async discard(entry: FileEntry): Promise<void> {
    var fileStore = new StoreLocal(entry.name)
    await fileStore.clear()
    this.signals.trigger('updated')
  }

  async configureByRoute(path: string) {
    var route = Route.from(path)
    this.storage = this.routedStorage(route)
    var index = await this.storage.files()
    this.activeFile = nomnoml.skanaar.find(index, e => e.name === route.path) || new FileEntry(route.path, 'local_file')
    this.signals.trigger('updated')
  }

  routedStorage(route: Route): GraphStore {
    if (route.context === 'view') {
      return new StoreUrl(decodeURIComponent(route.path))
    }
    if (route.context === 'file') {
      return new StoreLocal(route.path)
    }
    return new StoreDefaultBuffer()
  }
}

type StoreKind = 'local_default' | 'local_file' | 'cloud' | 'url'

class FileEntry {
  date: string = (new Date()).toISOString()
  collaborators: string[] = []
  constructor(
    public name: string,
    public backingStore: StoreKind
  ) {}
}

interface GraphStore {
  files(): Promise<FileEntry[]>
  read(): Promise<string>
  insert(src: string): Promise<void>
  save(src: string): Promise<void>
  clear(): Promise<void>
  kind: StoreKind
}
