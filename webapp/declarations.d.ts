declare interface Notice { text: string }

declare type StoreKind = 'local_default' | 'local_file' | 'cloud' | 'url'

declare interface FileEntry {
  date: string
  collaborators: string[]
  name: string
  revision: number
}

declare interface GraphStore {
  isMappedToFileEntry: boolean
  files(): Promise<FileEntry[]>
  read(name: string): Promise<string>
  insert(name: string, src: string): Promise<void>
  save(name: string, src: string): Promise<void>
  clear(name: string): Promise<void>
  kind: StoreKind
}
