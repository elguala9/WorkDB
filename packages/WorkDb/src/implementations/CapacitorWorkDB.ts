import { IWorkFileSystem, Item, ItemId, ItemOutput } from "iworkdb/IWorkDb";
import { Filesystem , Directory, Encoding, FilesystemPlugin } from "@capacitor/filesystem";

export class CapacitorWorkDB implements IWorkFileSystem {
    private _filesystem: FilesystemPlugin;

    constructor(filesystem: FilesystemPlugin = Filesystem) {
        this._filesystem = filesystem;
    }

    async writeFile(path: string, input: Item): Promise<void> {
        let data: string;
        if (typeof input.item === "string") {
            data = input.item;
        } else if (input.item instanceof Blob) {
            data = await input.item.text();
        } else {
            data = JSON.stringify(input.item, null, 2);
        }
        await this._filesystem.writeFile({ path, data, directory: Directory.Data, encoding: Encoding.UTF8 });
    }

    async getFile(path: string): Promise<ItemOutput> {
        const result = await this._filesystem.readFile({ path, directory: Directory.Data, encoding: Encoding.UTF8 });
        const stats = await this._filesystem.stat({ path, directory: Directory.Data });
        const data = typeof result.data === 'string' ? result.data : await (result.data as Blob).text();
        return { item: JSON.parse(data), createdAt: stats.ctime ? new Date(stats.ctime).toISOString() : undefined };
    }

    async deleteFile(path: string): Promise<void> {
        await this._filesystem.deleteFile({ path, directory: Directory.Data });
    }

    async deleteFolder(folderPath: string): Promise<void> {
        await this._filesystem.rmdir({ path: folderPath, directory: Directory.Data });
    }

    async exist(path: string): Promise<boolean> {
        try {
            await this._filesystem.stat({ path, directory: Directory.Data });
            return true;
        } catch {
            return false;
        }
    }

    async renameFile(oldPath: string, newPath: string): Promise<void> {
        await this._filesystem.rename({ from: oldPath, to: newPath, directory: Directory.Data });
    }
}