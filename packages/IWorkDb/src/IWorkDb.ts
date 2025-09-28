
export type JsonObject = { [key: string]: JsonValue }; 
export type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];

export type ItemId = {
    id: string;
    collection: string;
};

export type Item = {
    item: JsonObject;
}

export type ItemOutput = Item & {
    createdAt?: string;
}

export interface IWorkDb {
    /**
     * Creates a new item in the specified collection with the given id.
     * @param input The item data and its collection/id information.
     */
    create: (input: Item & ItemId) => Promise<void>;

    /**
     * Creates multiple items in their respective collections with the given ids.
     * @param input Array of item data and their collection/id information.
     */
    createMultiple: (input: (ItemId & Item)[]) => Promise<void>;

    /**
     * Updates an existing item in the specified collection with the given id.
     * @param input The updated item data and its collection/id information.
     */
    update: (input: Item & ItemId) => Promise<void>;

    /**
     * Creates a new item or updates an existing one in the specified collection.
     * If the item exists, it will be updated; if not, it will be created.
     * @param input The item data and its collection/id information.
     */
    createOrUpdate: (input: Item & ItemId) => Promise<void>;

    /**
     * Creates new items or updates existing ones in their respective collections.
     * For each item: if it exists, it will be updated; if not, it will be created.
     * @param input Array of item data and their collection/id information.
     */
    createOrUpdateMultiple: (input: (ItemId & Item)[]) => Promise<void>;

    /**
     * Retrieves an item's data from the specified collection and id.
     * Returns the item data and creation date, or null if not found.
     * @param input The collection and id of the item to retrieve.
     */
    retrieve: (input: ItemId) => Promise<ItemOutput | null>;

    /**
     * Retrieves multiple items' data from their specified collections and ids.
     * Returns an array of item data and creation dates, or null for items not found.
     * @param ids Array of collection/id pairs for the items to retrieve.
     */
    retrieveMultiple: (ids: ItemId[]) => Promise<(ItemOutput | null)[]>;

    /**
     * Deletes an item from the specified collection with the given id.
     * @param input The collection and id of the item to delete.
     */
    delete: (input: ItemId) => Promise<void>;

    /**
     * Deletes a collection
     * @param collection The name of the collection to delete.
     */
    deleteCollection: (collection: string) => Promise<void>;

    /**
     * completely clears the database
     */
    clearDatabase: () => Promise<void>;
    
    getItemsInCollection: (collection: string) => Promise<string[]>;

    getCollections: () => Promise<string[]>;
}


export interface IWorkFileSystem {
    writeFile: (path: string, input: Item) => Promise<void>;
    getFile: (path: string) => Promise<ItemOutput>;
    deleteFile: (path: string) => Promise<void>;
    deleteFolder: (folderPath: string) => Promise<void>;
    exist: (path: string) => Promise<boolean>;
    renameFile: (oldPath: string, newPath: string) => Promise<void>;
    // list of file in a folder
    ls(path: string): Promise<string[]>;
}