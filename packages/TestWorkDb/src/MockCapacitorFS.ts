import { PluginListenerHandle } from "@capacitor/core";
import { FilesystemPlugin, Directory, Encoding, FileInfo, AppendFileOptions, CallbackID, CopyOptions, CopyResult, DownloadFileOptions, DownloadFileResult, GetUriOptions, GetUriResult, MkdirOptions, PermissionStatus, ProgressListener, ReaddirOptions, ReaddirResult, ReadFileInChunksCallback, ReadFileInChunksOptions, RenameOptions, RmdirOptions } from "@capacitor/filesystem";

export class MockCapacitorFS implements FilesystemPlugin {
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
    const { path, recursive } = options;
    if (recursive) {
      const parts = path.split('/').filter(Boolean);
      let currentPath = '';
      for (const part of parts) {
        currentPath += '/' + part;
        this.directories.add(currentPath);
      }
    } else {
      this.directories.add(path);
    }
    return Promise.resolve();
  }
  
  rmdir(options: RmdirOptions): Promise<void> {
    const { path, recursive } = options;
    if (recursive) {
      // Delete directory and all contained files/subdirectories
      this.directories.delete(path);
      for (const dir of Array.from(this.directories)) {
        if (dir.startsWith(path + '/')) {
          this.directories.delete(dir);
        }
      }
      for (const filePath of Array.from(this.store.keys())) {
        if (filePath.startsWith(path + '/')) {
          this.store.delete(filePath);
        }
      }
    } else {
      this.directories.delete(path);
    }
    return Promise.resolve();
  }
  
  readdir(options: ReaddirOptions): Promise<ReaddirResult> {
    const { path } = options;
    const entries: FileInfo[] = [];
    
    // Get directories
    for (const dir of this.directories) {
      if (dir.startsWith(path + '/') && dir !== path) {
        const dirName = dir.substring(path.length + 1).split('/')[0];
        const dirPath = path + '/' + dirName;
        if (this.directories.has(dirPath)) {
          entries.push({
            name: dirName,
            type: 'directory',
            uri: dirPath,
            mtime: Date.now(),
            ctime: Date.now(),
            size: 0
          });
        }
      }
    }
    
    // Get files
    for (const filePath of this.store.keys()) {
      if (filePath.startsWith(path + '/')) {
        const fileName = filePath.substring(path.length + 1).split('/')[0];
        if (!filePath.substring(path.length + 1).includes('/')) {
          entries.push({
            name: fileName,
            type: 'file',
            uri: filePath,
            mtime: Date.now(),
            ctime: Date.now(),
            size: this.store.get(filePath)?.length || 0
          });
        }
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