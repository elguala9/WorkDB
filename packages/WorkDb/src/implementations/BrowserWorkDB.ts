import { IWorkFileSystem, Item, ItemId, ItemOutput } from "iworkdb/IWorkDb";

export class BrowserWorkDB implements IWorkFileSystem {

    private _localStorage: Storage;

    constructor(localStorage: Storage = window.localStorage) {
        this._localStorage = localStorage;
    }

    async writeFile(path: string, input: Item): Promise<void> {
        const data = JSON.stringify(input.item, null, 2);
        this._localStorage.setItem(path, data);
    }

    async getFile(path: string): Promise<ItemOutput> {
        const data = this._localStorage.getItem(path);
        if (data === null) throw new Error("File does not exist");
        return { item: JSON.parse(data) };
    }

    async deleteFile(path: string): Promise<void> {
        this._localStorage.removeItem(path);
    }

    async deleteFolder(folderPath: string): Promise<void> {
        const keysToRemove: string[] = [];
        for (let i = 0; i < this._localStorage.length; i++) {
            const key = this._localStorage.key(i);
            if (key && key.startsWith(folderPath)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => this._localStorage.removeItem(key));
    }

    async exist(path: string): Promise<boolean> {
        return this._localStorage.getItem(path) !== null;
    }

    async renameFile(oldPath: string, newPath: string): Promise<void> {
        const data = this._localStorage.getItem(oldPath);
        if (data === null) throw new Error("File does not exist");
        this._localStorage.setItem(newPath, data);
        this._localStorage.removeItem(oldPath);
    }
}