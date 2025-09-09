import { PluginListenerHandle } from "@capacitor/core";
import { FilesystemPlugin, Directory, Encoding, FileInfo, AppendFileOptions, CallbackID, CopyOptions, CopyResult, DownloadFileOptions, DownloadFileResult, GetUriOptions, GetUriResult, MkdirOptions, PermissionStatus, ProgressListener, ReaddirOptions, ReaddirResult, ReadFileInChunksCallback, ReadFileInChunksOptions, RenameOptions, RmdirOptions } from "@capacitor/filesystem";
export declare class MockCapacitorFS implements FilesystemPlugin {
    private store;
    private directories;
    private listeners;
    checkPermissions(): Promise<PermissionStatus>;
    requestPermissions(): Promise<PermissionStatus>;
    readFileInChunks(options: ReadFileInChunksOptions, callback: ReadFileInChunksCallback): Promise<CallbackID>;
    appendFile(options: AppendFileOptions): Promise<void>;
    mkdir(options: MkdirOptions): Promise<void>;
    rmdir(options: RmdirOptions): Promise<void>;
    readdir(options: ReaddirOptions): Promise<ReaddirResult>;
    getUri(options: GetUriOptions): Promise<GetUriResult>;
    rename(options: RenameOptions): Promise<void>;
    copy(options: CopyOptions): Promise<CopyResult>;
    downloadFile(options: DownloadFileOptions): Promise<DownloadFileResult>;
    addListener(eventName: "progress", listenerFunc: ProgressListener): Promise<PluginListenerHandle>;
    removeAllListeners(): Promise<void>;
    writeFile({ path, data, directory, encoding, }: {
        path: string;
        data: string;
        directory?: Directory;
        encoding?: Encoding;
    }): Promise<{
        uri: string;
    }>;
    readFile({ path, directory, encoding, }: {
        path: string;
        directory?: Directory;
        encoding?: Encoding;
    }): Promise<{
        data: string;
    }>;
    deleteFile({ path, directory, }: {
        path: string;
        directory?: Directory;
    }): Promise<void>;
    stat({ path, directory, }: {
        path: string;
        directory?: Directory;
    }): Promise<FileInfo>;
}
