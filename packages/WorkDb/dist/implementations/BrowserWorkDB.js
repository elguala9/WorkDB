export class BrowserWorkDB {
    async ls(path) {
        const files = [];
        for (let i = 0; i < this._localStorage.length; i++) {
            const key = this._localStorage.key(i);
            if (key && (key === path || key.startsWith(path + '/'))) {
                files.push(key);
            }
        }
        return files;
    }
    constructor(localStorage = window.localStorage) {
        this._localStorage = localStorage;
    }
    async writeFile(path, input) {
        const data = JSON.stringify(input.item, null, 2);
        this._localStorage.setItem(path, data);
    }
    async getFile(path) {
        const data = this._localStorage.getItem(path);
        if (data === null)
            throw new Error("File does not exist");
        return { item: JSON.parse(data) };
    }
    async deleteFile(path) {
        this._localStorage.removeItem(path);
    }
    async deleteFolder(folderPath) {
        const keysToRemove = [];
        for (let i = 0; i < this._localStorage.length; i++) {
            const key = this._localStorage.key(i);
            if (key && key.startsWith(folderPath)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => this._localStorage.removeItem(key));
    }
    async exist(path) {
        return this._localStorage.getItem(path) !== null;
    }
    async renameFile(oldPath, newPath) {
        const data = this._localStorage.getItem(oldPath);
        if (data === null)
            throw new Error("File does not exist");
        this._localStorage.setItem(newPath, data);
        this._localStorage.removeItem(oldPath);
    }
}
//# sourceMappingURL=BrowserWorkDB.js.map