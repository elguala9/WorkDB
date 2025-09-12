import { PluginListenerHandle } from "@capacitor/core";
import { FilesystemPlugin, Directory, Encoding, FileInfo, AppendFileOptions, CallbackID, CopyOptions, CopyResult, DownloadFileOptions, DownloadFileResult, GetUriOptions, GetUriResult, MkdirOptions, PermissionStatus, ProgressListener, ReaddirOptions, ReaddirResult, ReadFileInChunksCallback, ReadFileInChunksOptions, RenameOptions, RmdirOptions } from "@capacitor/filesystem";

export class MockCapacitorFS implements FilesystemPlugin {
  async ls(path: string): Promise<string[]> {
    const files: string[] = [];
    for (const filePath of this.store.keys()) {
      if (filePath === path || filePath.startsWith(path + '/')) {
        files.push(filePath);
      }
    }
    return files;
  }
  private store = new Map<string, string>();
  private directories = new Set<string>();
  private listeners: Map<string, ProgressListener[]> = new Map();
  
  checkPermissions(): Promise<PermissionStatus> {
    return Promise.resolve({ publicStorage: 'granted' });
  }
  
  requestPermissions(): Promise<PermissionStatus> {
    return Promise.resolve({ publicStorage: 'granted' });
  }
  
  readFileInChunks(options: ReadFileInChunksOptions, callback: ReadFileInChunksCallback): Promise<CallbackID> {
    const { path, chunkSize = 4096 } = options;
    const content = this.store.get(path) || '';
    const callbackId = Math.random().toString(36).substring(2, 15);
    
    setTimeout(() => {
      const totalChunks = Math.ceil(content.length / chunkSize);
      for (let i = 0; i < totalChunks; i++) {
        const chunk = content.substring(i * chunkSize, (i + 1) * chunkSize);
        callback({ data: chunk }, (i + 1) / totalChunks);
      }
    }, 0);
    
    return Promise.resolve(callbackId);
  }
  
  appendFile(options: AppendFileOptions): Promise<void> {
    const { path, data } = options;
    const existingData = this.store.get(path) || '';
    this.store.set(path, existingData + data);
    return Promise.resolve();
  }
  
  mkdir(options: MkdirOptions): Promise<void> {
    const { path } = options;
    this.directories.add(path);
    return Promise.resolve();
  }
  
  rmdir(options: RmdirOptions): Promise<void> {
    const { path } = options;
    // Elimina tutti i file che iniziano con path (simulazione directory flat)
    for (const filePath of Array.from(this.store.keys())) {
      if (filePath === path || filePath.startsWith(path + '/')) {
        this.store.delete(filePath);
      }
    }
    // Elimina anche le "directory" virtuali
    for (const dir of Array.from(this.directories)) {
      if (dir === path || dir.startsWith(path + '/')) {
        this.directories.delete(dir);
      }
    }
    return Promise.resolve();
  }
  
  readdir(options: ReaddirOptions): Promise<ReaddirResult> {
    const { path } = options;
    const entries: FileInfo[] = [];
    // File flat: tutti i file che iniziano con path
    for (const filePath of this.store.keys()) {
      if (filePath === path || filePath.startsWith(path + '/')) {
        const name = filePath.substring(path.length + 1);
        entries.push({
          name,
          type: 'file',
          uri: filePath,
          mtime: Date.now(),
          ctime: Date.now(),
          size: this.store.get(filePath)?.length || 0
        });
      }
    }
    return Promise.resolve({ files: entries });
  }
  
  getUri(options: GetUriOptions): Promise<GetUriResult> {
    return Promise.resolve({ uri: 'file://mock/' + options.path });
  }
  
  rename(options: RenameOptions): Promise<void> {
    const { from, to } = options;
    const content = this.store.get(from);
    if (content !== undefined) {
      this.store.set(to, content);
      this.store.delete(from);
    }
    if (this.directories.has(from)) {
      this.directories.delete(from);
      this.directories.add(to);
    }
    return Promise.resolve();
  }
  
  copy(options: CopyOptions): Promise<CopyResult> {
    const { from, to } = options;
    const content = this.store.get(from);
    if (content !== undefined) {
      this.store.set(to, content);
      return Promise.resolve({ uri: to });
    }
    throw new Error("File not found");
  }
  
  downloadFile(options: DownloadFileOptions): Promise<DownloadFileResult> {
    const { path, url } = options;
    this.store.set(path, `Mock content from ${url}`);
    const listeners = this.listeners.get('progress');
    if (listeners) {
      listeners.forEach(listener => listener({
        url: "",
        bytes: 0,
        contentLength: 0
      }));
    }
    return Promise.resolve({ path });
  }
  
  addListener(eventName: "progress", listenerFunc: ProgressListener): Promise<PluginListenerHandle> {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName)?.push(listenerFunc);
    
    return Promise.resolve({
      remove: async () => {
        const listeners = this.listeners.get(eventName) || [];
        const index = listeners.indexOf(listenerFunc);
        if (index !== -1) {
          listeners.splice(index, 1);
        }
      }
    });
  }
  
  removeAllListeners(): Promise<void> {
    this.listeners.clear();
    return Promise.resolve();
  }

  async writeFile({
    path,
    data,
    directory,
    encoding,
  }: {
    path: string;
    data: string;
    directory?: Directory;
    encoding?: Encoding;
  }) {
    this.store.set(path, data);
    return { uri: path };
  }

  async readFile({
    path,
    directory,
    encoding,
  }: {
    path: string;
    directory?: Directory;
    encoding?: Encoding;
  }) {
    const value = this.store.get(path);
    return { data: value ?? "" };
  }

  async deleteFile({
    path,
    directory,
  }: {
    path: string;
    directory?: Directory;
  }): Promise<void> {
    this.store.delete(path);
    // No return needed
  }

  async stat({
    path,
    directory,
  }: {
    path: string;
    directory?: Directory;
  }): Promise<FileInfo> {
    const value = this.store.get(path);
    if (value === undefined) {
      throw new Error("File not found");
    }
    return {
      uri: path,
      name: path.split("/").pop() ?? path,
      type: "file",
      ctime: Date.now(),
      mtime: Date.now(),
      size: value.length,
    };
  }
}