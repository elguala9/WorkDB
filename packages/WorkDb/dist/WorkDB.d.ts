import { IWorkDb, Item, ItemId, ItemOutput } from "iworkdb";
export declare class NodeWorkDB implements IWorkDb {
    create(input: Item & ItemId): Promise<void>;
    createMultiple(inputs: (ItemId & Item)[]): Promise<void>;
    update(input: Item & ItemId): Promise<void>;
    retrieve(input: ItemId): Promise<ItemOutput | null>;
    retrieveMultiple(ids: ItemId[]): Promise<(ItemOutput | null)[]>;
    delete(input: ItemId): Promise<void>;
}
