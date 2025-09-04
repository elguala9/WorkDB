export class ClientWorkDB {
    constructor(workDbInternal) {
        this.workDbInternal = workDbInternal;
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
        await this.delete(input);
        await this.workDbInternal.writeFile(input);
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
//# sourceMappingURL=ClientWorkDB.js.map