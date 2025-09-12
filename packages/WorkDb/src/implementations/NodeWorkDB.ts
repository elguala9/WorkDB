import { IWorkFileSystem, Item, ItemId, ItemOutput } from "iworkdb/IWorkDb";
import { promises as fs } from "fs";
import { join } from "path";

export class NodeWorkDB implements IWorkFileSystem {
    
    private _pathDB: string;

    constructor(pathDb: string) {
        if (pathDb) {
            this._pathDB = pathDb;
        } else {
            this._pathDB = process.cwd();
        }
    }

    async ls(path: string): Promise<string[]> {
        const dirPath = join(this._pathDB, path);
        let files: string[] = [];
        try {
            const filesList = await fs.readdir(dirPath);
            files = filesList;
        } catch {
            // directory does not exist
        }
        return files;
    }



    async writeFile(path: string, input: Item): Promise<void> {
        const dirPath = join(this._pathDB, path.split('/').slice(0, -1).join('/'));
        const filePath = join(this._pathDB, path);
        const data = JSON.stringify(input.item, null, 2);
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(filePath, data, "utf8");
    }

    async getFile(path: string): Promise<ItemOutput> {
        const filePath = join(this._pathDB, path);
        const data = await fs.readFile(filePath, "utf8");
        return { item: JSON.parse(data) };
    }

    async deleteFile(path: string): Promise<void> {
        const filePath = join(this._pathDB, path);
        await fs.unlink(filePath);
    }

    async deleteFolder(folderPath: string): Promise<void> {
        const fullPath = join(this._pathDB, folderPath);
        await fs.rm(fullPath, { recursive: true, force: true });
    }

    async exist(path: string): Promise<boolean> {
        const filePath = join(this._pathDB, path);
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    async renameFile(oldPath: string, newPath: string): Promise<void> {
        const oldFilePath = join(this._pathDB, oldPath);
        const newDirPath = join(this._pathDB, newPath.split('/').slice(0, -1).join('/'));
        const newFilePath = join(this._pathDB, newPath);
        await fs.mkdir(newDirPath, { recursive: true });
        await fs.rename(oldFilePath, newFilePath);
    }

	
}