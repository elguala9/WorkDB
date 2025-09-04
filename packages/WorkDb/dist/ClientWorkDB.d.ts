import { IWorkDb, IWorkDbInternal, Item, ItemId, ItemOutput } from "iworkdb";
export declare class ClientWorkDB implements IWorkDb {
    private workDbInternal;
    constructor(workDbInternal: IWorkDbInternal);
    create(input: Item & ItemId): Promise<void>;
    createMultiple(inputs: (ItemId & Item)[]): Promise<void>;
    update(input: Item & ItemId): Promise<void>;
    retrieve(input: ItemId): Promise<ItemOutput | null>;
    retrieveMultiple(ids: ItemId[]): Promise<(ItemOutput | null)[]>;
    delete(input: ItemId): Promise<void>;
}
