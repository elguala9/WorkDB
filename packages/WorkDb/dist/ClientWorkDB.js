export class ClientWorkDB {
    constructor(workDbInternal) {
        this.workDbInternal = workDbInternal;
    }
    /**
     * Returns the singleton instance of ClientWorkDB.
     * If not created, it will instantiate with the provided IWorkDbInternal.
     */
    static getInstance(workDbInternal) {
        if (!ClientWorkDB.instance) {
            ClientWorkDB.instance = new ClientWorkDB(workDbInternal);
        }
        return ClientWorkDB.instance;
    }
    async create(input) {
        if (await this.workDbInternal.exist(input)) {
            await this.workDbInternal.writeFile(input);
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
        let temp = { ...input, id: input.id + "_tmp" };
        await this.workDbInternal.renameFile(input, temp);
        // maybe we need to handle an error here
        await this.workDbInternal.writeFile(input);
        await this.delete(temp);
    }
    async retrieve(input) {
        if (await this.workDbInternal.exist(input)) {
            return await this.workDbInternal.getFile(input);
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
        if (await this.workDbInternal.exist(input)) {
            await this.workDbInternal.deleteFile(input);
        }
        else {
            throw new Error(`Item with id ${input.id} in collection ${input.collection} does not exist.`);
        }
    }
}
ClientWorkDB.instance = null;
//# sourceMappingURL=ClientWorkDB.js.map