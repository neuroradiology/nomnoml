class StoreCloud implements GraphStore {
  isMappedToFileEntry: boolean = true
  kind: StoreKind = 'cloud'
  baseRevision: number = 0
  cachedSource: string = null
  constructor(public baseUrl: string) {}

  async files(): Promise<FileEntry[]> {
    var response = await fetch('/api/files')
    var entries: any[] = await response.json()
    return entries
  }

  async read(name: string): Promise<string> {
    return fetch(this.baseUrl + name).then(e => e.json()).then(e => {
      this.baseRevision = e.revision || 0
      this.cachedSource = e.source
      return e.source
    })
  }

  async insert(name: string, source: string): Promise<void> {
    var response = await fetch(this.baseUrl+name, this.postBody({
      source: source,
      baseRevision: 0,
      collaborators: []
    }))
    var receipt = await response.json()
    this.baseRevision = receipt.revision
  }

  async save(name: string, source: string): Promise<void> {
    if (this.cachedSource === source) return
    var response = await fetch(this.baseUrl+name, this.postBody({
      source: source,
      baseRevision: this.baseRevision,
      collaborators: []
    }))
    var receipt = await response.json()
    this.baseRevision = receipt.revision
  }

  async clear(name: string): Promise<void> {
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
