export class BrowserWorkDB {
    constructor(localStorage = window.localStorage) {
        this._localStorage = localStorage;
    }
    getKey(collection, id) {
        return `${collection}/${id}`;
    }
    async renameFile(oldInput, newInput) {
        // Usa i metodi già esistenti per rinominare
        const oldFile = await this.getFile(oldInput);
        await this.writeFile({ ...newInput, item: oldFile.item });
        await this.deleteFile(oldInput);
    }
    async exist(input) {
        const key = this.getKey(input.collection, input.id);
        return this._localStorage.getItem(key) !== null;
    }
    async writeFile(input) {
        const key = this.getKey(input.collection, input.id);
        const data = JSON.stringify(input.item, null, 2);
        this._localStorage.setItem(key, data);
    }
    async getFile(input) {
        const key = this.getKey(input.collection, input.id);
        const data = this._localStorage.getItem(key);
        if (data === null)
            throw new Error("File does not exist");
        // localStorage does not store creation time, so we omit it
        return { item: JSON.parse(data) };
    }
    async deleteFile(input) {
        const key = this.getKey(input.collection, input.id);
        this._localStorage.removeItem(key);
    }
}
//# sourceMappingURL=BrowserWorkDB.js.map