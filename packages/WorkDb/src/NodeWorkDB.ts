import { IWorkDbInternal, Item, ItemId, ItemOutput } from "iworkdb";
import { promises as fs } from "fs";
import { join } from "path";
import { ClientWorkDB } from "./ClientWorkDB.js";

export class NodeWorkDB implements IWorkDbInternal {

    private _pathDB: string;

    constructor(pathDb: string) {
        if (pathDb) {
            this._pathDB = pathDb;
        } else {
            this._pathDB = process.cwd();
        }
    }
    
    async renameFile(oldInput: ItemId, newInput: ItemId): Promise<void> {
        const { collection: oldCollection, id: oldId } = oldInput;
        const { collection: newCollection, id: newId } = newInput;
        
        const oldFilePath = join(this._pathDB, oldCollection, `${oldId}.json`);
        const newDirPath = join(this._pathDB, newCollection);
        const newFilePath = join(newDirPath, `${newId}.json`);
        
        // Read the file content
        const fileContent = await fs.readFile(oldFilePath, "utf8");
        
        // Write to new location
        await fs.mkdir(newDirPath, { recursive: true });
        await fs.writeFile(newFilePath, fileContent, "utf8");
        
        // Delete the old file
        await fs.unlink(oldFilePath);
    }

    async exist(input: ItemId): Promise<boolean> {
        const { collection, id } = input;
        const filePath = join(this._pathDB, collection, `${id}.json`);
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }
    
	async writeFile(input: Item & ItemId): Promise<void> {
		const { collection, id, item } = input;
		const dirPath = join(this._pathDB, collection);
		const filePath = join(dirPath, `${id}.json`);
		const data = JSON.stringify(item , null, 2);
		await fs.mkdir(dirPath, { recursive: true });
		await fs.writeFile(filePath, data, "utf8");
	}

	async getFile(input: ItemId): Promise<ItemOutput> {
		const { collection, id } = input;
		const filePath = join(this._pathDB, collection, `${id}.json`);
        const data = await fs.readFile(filePath, "utf8");
        const stats = await fs.stat(filePath);
        return { item: JSON.parse(data), createdAt: stats.birthtime.toISOString() };
	}

	async deleteFile(input: ItemId): Promise<void> {
		const { collection, id } = input;
		const filePath = join(this._pathDB, collection, `${id}.json`);
		await fs.unlink(filePath);
	}
}