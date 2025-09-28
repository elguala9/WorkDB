import { IWorkDb, IWorkFileSystem, Item, ItemId, ItemOutput } from "iworkdb/IWorkDb";
export declare class ClientWorkDB implements IWorkDb {
    private static instance;
    private workDbInternal;
    private constructor();
    deleteCollection(collection: string): Promise<void>;
    clearDatabase(): Promise<void>;
    private getItemPath;
    private getCollectionPath;
    private getRoot;
    /**
     * Returns the singleton instance of ClientWorkDB.
     * If not created, it will instantiate with the provided IWorkFileSystem.
     */
    static getInstance(workDbInternal: IWorkFileSystem): ClientWorkDB;
    create(input: Item & ItemId): Promise<void>;
    createMultiple(inputs: (ItemId & Item)[]): Promise<void>;
    update(input: Item & ItemId): Promise<void>;
    createOrUpdate(input: Item & ItemId): Promise<void>;
    createOrUpdateMultiple(inputs: (ItemId & Item)[]): Promise<void>;
    retrieve(input: ItemId): Promise<ItemOutput | null>;
    retrieveMultiple(ids: ItemId[]): Promise<(ItemOutput | null)[]>;
    delete(input: ItemId): Promise<void>;
    getItemsInCollection(collection: string): Promise<string[]>;
    getCollections(): Promise<string[]>;
}
