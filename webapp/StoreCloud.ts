class StoreCloud implements GraphStore {
  isMappedToFileEntry: boolean = true
  kind: StoreKind = 'cloud'
  baseRevision: number = 0
  constructor(public baseUrl: string) {}

  async files(): Promise<FileEntry[]> {
    return fetch('/api/files').then(e => e.json())
  }

  async read(name: string): Promise<string> {
    return fetch(this.baseUrl + name).then(e => e.json()).then(e => {
      this.baseRevision = e.baseRevision
      return e.source
    })
  }

  async insert(name: string, source: string): Promise<void> {
    await fetch(this.baseUrl+name, this.postBody({
      source: source,
      baseRevision: 0,
      collaborators: []
    }))
  }

  async save(name: string, source: string): Promise<void> {
    await fetch(this.baseUrl+name, this.postBody({
      source: source,
      baseRevision: this.baseRevision,
      collaborators: []
    }))
  }

  async clear(name: string, ): Promise<void> {
    await fetch(this.baseUrl + name, { method: 'DELETE', credentials: 'same-origin' })
  }

  private postBody(payload: any): RequestInit {
    return {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
  }
}
