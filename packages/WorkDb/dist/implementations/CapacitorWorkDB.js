import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
export class CapacitorWorkDB {
    constructor(filesystem = Filesystem) {
        this._filesystem = filesystem;
    }
    getFilePath(collection, id) {
        return `./WorkDB/${collection}/${id}`;
    }
    async renameFile(oldInput, newInput) {
        const from = this.getFilePath(oldInput.collection, oldInput.id);
        const to = this.getFilePath(newInput.collection, newInput.id);
        await this._filesystem.rename({ from, to, directory: Directory.Data });
    }
    async exist(input) {
        const path = this.getFilePath(input.collection, input.id);
        try {
            await this._filesystem.stat({ path, directory: Directory.Data });
            return true;
        }
        catch {
            return false;
        }
    }
    async writeFile(input) {
        const path = this.getFilePath(input.collection, input.id);
        let data;
        if (typeof input.item === "string") {
            data = input.item;
        }
        else if (input.item instanceof Blob) {
            data = await input.item.text();
        }
        else {
            data = JSON.stringify(input.item, null, 2);
        }
        await this._filesystem.writeFile({ path, data, directory: Directory.Data, encoding: Encoding.UTF8 });
    }
    async getFile(input) {
        const path = this.getFilePath(input.collection, input.id);
        const result = await this._filesystem.readFile({ path, directory: Directory.Data, encoding: Encoding.UTF8 });
        const stats = await this._filesystem.stat({ path, directory: Directory.Data });
        const data = typeof result.data === 'string' ? result.data : await result.data.text();
        return { item: JSON.parse(data), createdAt: stats.ctime ? new Date(stats.ctime).toISOString() : undefined };
    }
    async deleteFile(input) {
        const path = this.getFilePath(input.collection, input.id);
        await this._filesystem.deleteFile({ path, directory: Directory.Data });
    }
}
//# sourceMappingURL=CapacitorWorkDB.js.map