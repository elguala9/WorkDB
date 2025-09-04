import { promises as fs } from "fs";
import { join } from "path";
export class NodeWorkDB {
    constructor(pathDb) {
        if (pathDb) {
            this._pathDB = pathDb;
        }
        else {
            this._pathDB = process.cwd();
        }
    }
    async exist(input) {
        const { collection, id } = input;
        const filePath = join(this._pathDB, collection, `${id}.json`);
        try {
            await fs.access(filePath);
            return true;
        }
        catch {
            return false;
        }
    }
    async writeFile(input) {
        const { collection, id, item } = input;
        const dirPath = join(this._pathDB, collection);
        const filePath = join(dirPath, `${id}.json`);
        const data = JSON.stringify(item, null, 2);
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(filePath, data, "utf8");
    }
    async getFile(input) {
        const { collection, id } = input;
        const filePath = join(this._pathDB, collection, `${id}.json`);
        const data = await fs.readFile(filePath, "utf8");
        const stats = await fs.stat(filePath);
        return { item: JSON.parse(data), createdAt: stats.birthtime.toISOString() };
    }
    async deleteFile(input) {
        const { collection, id } = input;
        const filePath = join(this._pathDB, collection, `${id}.json`);
        await fs.unlink(filePath);
    }
}
//# sourceMappingURL=NodeWorkDB.js.map