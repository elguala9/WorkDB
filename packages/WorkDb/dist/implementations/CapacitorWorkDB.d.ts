import { IWorkDbInternal, Item, ItemId, ItemOutput } from "iworkdb/IWorkDb";
import { PreferencesPlugin } from "@capacitor/preferences";
export declare class CapacitorWorkDB implements IWorkDbInternal {
    private _preferences;
    constructor(preferences?: PreferencesPlugin);
    private getKey;
    renameFile(oldInput: ItemId, newInput: ItemId): Promise<void>;
    exist(input: ItemId): Promise<boolean>;
    writeFile(input: Item & ItemId): Promise<void>;
    getFile(input: ItemId): Promise<ItemOutput>;
    deleteFile(input: ItemId): Promise<void>;
}
