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
    async createOrUpdate(input) {
        const path = this.getItemPath(input);
        // Check if item exists, create or update accordingly
        if (await this.workDbInternal.exist(path)) {
            // Item exists, update it
            await this.workDbInternal.writeFile(path, { item: input.item });
        }
        else {
            // Item doesn't exist, create it
            await this.workDbInternal.writeFile(path, { item: input.item });
        }
    }
    async createOrUpdateMultiple(inputs) {
        for (const input of inputs) {
            await this.createOrUpdate(input);
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
    async getItemsInCollection(collection) {
        const path = this.getCollectionPath(collection);
        const files = await this.workDbInternal.ls(path);
        // Restituisce solo gli id degli item nella collection
        return files.map(f => f.replace(path + '/', ''));
    }
    async getCollections() {
        const path = this.getRoot();
        const files = await this.workDbInternal.ls(path);
        // Restituisce solo i nomi delle collection (primo livello)
        const collections = new Set();
        for (const f of files) {
            const rel = f.replace(path + '/', '');
            const col = rel.split('/')[0];
            if (col)
                collections.add(col);
        }
        return Array.from(collections);
    }
}
ClientWorkDB.instance = null;
//# sourceMappingURL=ClientWorkDB.js.map