import { Preferences } from "@capacitor/preferences";
export class CapacitorWorkDB {
    constructor(preferences = Preferences) {
        this._preferences = preferences;
    }
    getKey(collection, id) {
        return `${collection}/${id}.json`;
    }
    async renameFile(oldInput, newInput) {
        const oldFile = await this.getFile(oldInput);
        await this.writeFile({ ...newInput, item: oldFile.item });
        await this.deleteFile(oldInput);
    }
    async exist(input) {
        const key = this.getKey(input.collection, input.id);
        const { value } = await this._preferences.get({ key });
        return value !== null;
    }
    async writeFile(input) {
        const key = this.getKey(input.collection, input.id);
        const data = JSON.stringify(input.item, null, 2);
        await this._preferences.set({ key, value: data });
    }
    async getFile(input) {
        const key = this.getKey(input.collection, input.id);
        const { value } = await this._preferences.get({ key });
        if (value === null)
            throw new Error("Item does not exist");
        return { item: JSON.parse(value) };
    }
    async deleteFile(input) {
        const key = this.getKey(input.collection, input.id);
        await this._preferences.remove({ key });
    }
}
//# sourceMappingURL=CapacitorWorkDB.js.map