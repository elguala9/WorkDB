
export type JsonObject = { [key: string]: JsonValue }; 
export type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];

export type ItemId = {
    id: string;
    collection: string;
};

export type Item = {
    item: JsonObject;
    createdAt?: string;
}

export type ItemOutput = Item & {
    createdAt?: string;
}

export interface IWorkDb {
    create: (input: Item & ItemId) => Promise<void>;
    createMultiple: (idinputs: (ItemId & Item)[]) => Promise<void>;
    update: (input: Item & ItemId) => Promise<void>;
    retrieve: (input: ItemId) => Promise<ItemOutput | null>;
    retrieveMultiple: (ids: ItemId[]) => Promise<(ItemOutput | null)[]>;
    delete: (input: ItemId) => Promise<void>;
}