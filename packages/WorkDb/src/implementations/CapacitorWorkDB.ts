import { IWorkDbInternal, Item, ItemId, ItemOutput } from "iworkdb/IWorkDb";
import { Preferences, PreferencesPlugin } from "@capacitor/preferences";

export class CapacitorWorkDB implements IWorkDbInternal {

    private _preferences: PreferencesPlugin;

    constructor(preferences: PreferencesPlugin = Preferences) {
        this._preferences = preferences;
    }

    private getKey(collection: string, id: string): string {
        return `${collection}/${id}.json`;
    }

    async renameFile(oldInput: ItemId, newInput: ItemId): Promise<void> {
        const oldFile = await this.getFile(oldInput);
        await this.writeFile({ ...newInput, item: oldFile.item });
        await this.deleteFile(oldInput);
    }

    async exist(input: ItemId): Promise<boolean> {
        const key = this.getKey(input.collection, input.id);
        const { value } = await this._preferences.get({ key });
        return value !== null;
    }

    async writeFile(input: Item & ItemId): Promise<void> {
        const key = this.getKey(input.collection, input.id);
        const data = JSON.stringify(input.item, null, 2);
        await this._preferences.set({ key, value: data });
    }

    async getFile(input: ItemId): Promise<ItemOutput> {
        const key = this.getKey(input.collection, input.id);
        const { value } = await this._preferences.get({ key });
        if (value === null) throw new Error("Item does not exist");
        return { item: JSON.parse(value) };
    }

    async deleteFile(input: ItemId): Promise<void> {
        const key = this.getKey(input.collection, input.id);
        await this._preferences.remove({ key });
    }
}