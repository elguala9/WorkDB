import { IWorkDbInternal, Item, ItemId, ItemOutput } from "iworkdb/IWorkDb";
import { Filesystem , Directory, Encoding, FilesystemPlugin } from "@capacitor/filesystem";

export class CapacitorWorkDB implements IWorkDbInternal {
    private _filesystem: FilesystemPlugin;

    constructor(filesystem: FilesystemPlugin = Filesystem) {
        this._filesystem = filesystem;
    }

    private getFilePath(collection: string, id: string): string {
        return `./WorkDB/${collection}/${id}`;
    }

    async renameFile(oldInput: ItemId, newInput: ItemId): Promise<void> {
        const from = this.getFilePath(oldInput.collection, oldInput.id);
        const to = this.getFilePath(newInput.collection, newInput.id);
        await this._filesystem.rename({ from, to, directory: Directory.Data });
    }

    async exist(input: ItemId): Promise<boolean> {
        const path = this.getFilePath(input.collection, input.id);
        try {
            await this._filesystem.stat({ path, directory: Directory.Data });
            return true;
        } catch {
            return false;
        }
    }

    async writeFile(input: Item & ItemId): Promise<void> {
        const path = this.getFilePath(input.collection, input.id);
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

    async getFile(input: ItemId): Promise<ItemOutput> {
        const path = this.getFilePath(input.collection, input.id);
        const result = await this._filesystem.readFile({ path, directory: Directory.Data, encoding: Encoding.UTF8 });
        const stats = await this._filesystem.stat({ path, directory: Directory.Data });
        const data = typeof result.data === 'string' ? result.data : await (result.data as Blob).text();
        return { item: JSON.parse(data), createdAt: stats.ctime ? new Date(stats.ctime).toISOString() : undefined };
    }

    async deleteFile(input: ItemId): Promise<void> {
        const path = this.getFilePath(input.collection, input.id);
        await this._filesystem.deleteFile({ path, directory: Directory.Data });
    }
}