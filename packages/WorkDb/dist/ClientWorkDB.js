export class ClientWorkDB {
    constructor(workDbInternal) {
        this.workDbInternal = workDbInternal;
    }
    deleteCollection(collection) {
        return this.workDbInternal.deleteFolder(this.getCollectionPath(collection));
    }
    clearDatabase() {
        return this.workDbInternal.deleteFolder(this.getRoot());
    }
    ;
    getItemPath(itemId) {
        return this.getCollectionPath(itemId.collection) + `/${itemId.id}`;
    }
    getCollectionPath(collection) {
        return this.getRoot() + `/${collection}`;
    }
    getRoot() {
        return `./WorkDB`;
    }
    /**
     * Returns the singleton instance of ClientWorkDB.
     * If not created, it will instantiate with the provided IWorkFileSystem.
     */
    static getInstance(workDbInternal) {
        if (!ClientWorkDB.instance) {
            ClientWorkDB.instance = new ClientWorkDB(workDbInternal);
        }
        return ClientWorkDB.instance;
    }
    async create(input) {
        const path = this.getItemPath(input);
        if (await this.workDbInternal.exist(path) === false) {
            await this.workDbInternal.writeFile(path, { item: input.item });
        }
        else {
            throw new Error(`Item with id ${input.id} in collection ${input.collection} already exists.`);
        }
    }
    async createMultiple(inputs) {
        for (const input of inputs) {
            await this.create(input);
        }
    }
    async update(input) {
        const path = this.getItemPath(input);
        if (await this.workDbInternal.exist(path)) {
            await this.workDbInternal.writeFile(path, { item: input.item });
        }
        else {
            throw new Error(`Item with id ${input.id} in collection ${input.collection} does not exist.`);
        }
    }
    async retrieve(input) {
        const path = this.getItemPath(input);
        if (await this.workDbInternal.exist(path)) {
            return await this.workDbInternal.getFile(path);
        }
        return null;
    }
    async retrieveMultiple(ids) {
        const results = [];
        for (const id of ids) {
            results.push(await this.retrieve(id));
        }
        return results;
    }
    async delete(input) {
        const path = this.getItemPath(input);
        if (await this.workDbInternal.exist(path)) {
            await this.workDbInternal.deleteFile(path);
        }
        else {
            throw new Error(`Item with id ${input.id} in collection ${input.collection} does not exist.`);
        }
    }
}
ClientWorkDB.instance = null;
//# sourceMappingURL=ClientWorkDB.js.map