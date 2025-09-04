import { IWorkDb, IWorkDbInternal, Item, ItemId, ItemOutput } from "iworkdb";
export declare class ClientWorkDB implements IWorkDb {
    private static instance;
    private workDbInternal;
    private constructor();
    /**
     * Returns the singleton instance of ClientWorkDB.
     * If not created, it will instantiate with the provided IWorkDbInternal.
     */
    static getInstance(workDbInternal: IWorkDbInternal): ClientWorkDB;
    create(input: Item & ItemId): Promise<void>;
    createMultiple(inputs: (ItemId & Item)[]): Promise<void>;
    update(input: Item & ItemId): Promise<void>;
    retrieve(input: ItemId): Promise<ItemOutput | null>;
    retrieveMultiple(ids: ItemId[]): Promise<(ItemOutput | null)[]>;
    delete(input: ItemId): Promise<void>;
}
