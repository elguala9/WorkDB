import { IWorkDbInternal, Item, ItemId, ItemOutput } from "iworkdb/IWorkDb";

export class BrowserWorkDB implements IWorkDbInternal {

    private _localStorage: Storage;

    constructor(localStorage: Storage = window.localStorage) {
        this._localStorage = localStorage;
    }

    private getKey(collection: string, id: string): string {
        return `${collection}/${id}`;
    }

    async renameFile(oldInput: ItemId, newInput: ItemId): Promise<void> {
        // Usa i metodi già esistenti per rinominare
        const oldFile = await this.getFile(oldInput);
        await this.writeFile({ ...newInput, item: oldFile.item });
        await this.deleteFile(oldInput);
    }

    async exist(input: ItemId): Promise<boolean> {
        const key = this.getKey(input.collection, input.id);
        return this._localStorage.getItem(key) !== null;
    }

    async writeFile(input: Item & ItemId): Promise<void> {
        const key = this.getKey(input.collection, input.id);
        const data = JSON.stringify(input.item, null, 2);
        this._localStorage.setItem(key, data);
    }

    async getFile(input: ItemId): Promise<ItemOutput> {
        const key = this.getKey(input.collection, input.id);
        const data = this._localStorage.getItem(key);
        if (data === null) throw new Error("File does not exist");
        // localStorage does not store creation time, so we omit it
        return { item: JSON.parse(data) };
    }

    async deleteFile(input: ItemId): Promise<void> {
        const key = this.getKey(input.collection, input.id);
        this._localStorage.removeItem(key);
    }
}