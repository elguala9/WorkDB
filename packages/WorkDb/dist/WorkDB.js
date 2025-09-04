import { promises as fs } from "fs";
import { join } from "path";
export class NodeWorkDB {
    async create(input) {
        const { collection, id, item, createdAt } = input;
        const dirPath = join(process.cwd(), collection);
        const filePath = join(dirPath, `${id}.json`);
        try {
            await fs.access(filePath);
            throw new Error("Item already exists.");
        }
        catch {
            // File does not exist, continue
        }
        const data = JSON.stringify({ item, createdAt }, null, 2);
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(filePath, data, "utf8");
    }
    async createMultiple(inputs) {
        for (const input of inputs) {
            await this.create(input);
        }
    }
    async update(input) {
        // Overwrite the file if it exists, otherwise throw
        const { collection, id, item, createdAt } = input;
        const dirPath = join(process.cwd(), collection);
        const filePath = join(dirPath, `${id}.json`);
        try {
            await fs.access(filePath);
        }
        catch {
            throw new Error("Item does not exist.");
        }
        const data = JSON.stringify({ item, createdAt }, null, 2);
        await fs.writeFile(filePath, data, "utf8");
    }
    async retrieve(input) {
        const { collection, id } = input;
        const filePath = join(process.cwd(), collection, `${id}.json`);
        try {
            const data = await fs.readFile(filePath, "utf8");
            return JSON.parse(data);
        }
        catch {
            return null;
        }
    }
    async retrieveMultiple(ids) {
        const results = [];
        for (const id of ids) {
            results.push(await this.retrieve(id));
        }
        return results;
    }
    async delete(input) {
        const { collection, id } = input;
        const filePath = join(process.cwd(), collection, `${id}.json`);
        try {
            await fs.unlink(filePath);
        }
        catch {
            throw new Error("Item does not exist or cannot be deleted.");
        }
    }
}
//# sourceMappingURL=WorkDB.js.map