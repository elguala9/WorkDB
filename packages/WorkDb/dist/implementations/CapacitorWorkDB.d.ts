import { IWorkFileSystem, Item, ItemOutput } from "iworkdb/IWorkDb";
import { FilesystemPlugin } from "@capacitor/filesystem";
export declare class CapacitorWorkDB implements IWorkFileSystem {
    ls(path: string): Promise<string[]>;
    private _filesystem;
    constructor(filesystem?: FilesystemPlugin);
    writeFile(path: string, input: Item): Promise<void>;
    getFile(path: string): Promise<ItemOutput>;
    deleteFile(path: string): Promise<void>;
    deleteFolder(folderPath: string): Promise<void>;
    exist(path: string): Promise<boolean>;
    renameFile(oldPath: string, newPath: string): Promise<void>;
}
