import { IWorkDb, IWorkFileSystem, Item, ItemId, ItemOutput } from "iworkdb/IWorkDb";


export class ClientWorkDB implements IWorkDb {
	private static instance: ClientWorkDB | null = null;
	private workDbInternal: IWorkFileSystem;

	private constructor(workDbInternal: IWorkFileSystem) {
		this.workDbInternal = workDbInternal;
	}

	deleteCollection (collection: string): Promise<void> {
		return this.workDbInternal.deleteFolder(this.getCollectionPath(collection));
	}

	clearDatabase (): Promise<void> {
		return this.workDbInternal.deleteFolder(this.getRoot());
	};

	private getItemPath(itemId: ItemId): string {
        return this.getCollectionPath(itemId.collection) + `/${itemId.id}`;
    }

	private getCollectionPath(collection: string): string {
        return this.getRoot() + `/${collection}`;
    }

	private getRoot(): string {
        return `./WorkDB`;
    }

	/**
	 * Returns the singleton instance of ClientWorkDB.
	 * If not created, it will instantiate with the provided IWorkFileSystem.
	 */
	static getInstance(workDbInternal: IWorkFileSystem): ClientWorkDB {
		if (!ClientWorkDB.instance) {
			ClientWorkDB.instance = new ClientWorkDB(workDbInternal);
		}
		return ClientWorkDB.instance;
	}

	async create(input: Item & ItemId): Promise<void> {
		const path = this.getItemPath(input);
		if(await this.workDbInternal.exist(path) === false) {
			await this.workDbInternal.writeFile(path, { item: input.item });
		} else {
			throw new Error(`Item with id ${input.id} in collection ${input.collection} already exists.`);
		}
	}

	async createMultiple(inputs: (ItemId & Item)[]): Promise<void> {
		for (const input of inputs) {
			await this.create(input);
		}
	}

	async update(input: Item & ItemId): Promise<void> {
		const path = this.getItemPath(input);
		if(await this.workDbInternal.exist(path)) {
			await this.workDbInternal.writeFile(path, { item: input.item });
		} else {
			throw new Error(`Item with id ${input.id} in collection ${input.collection} does not exist.`);
		}
	}

	async retrieve(input: ItemId): Promise<ItemOutput | null> {
		const path = this.getItemPath(input);
		if(await this.workDbInternal.exist(path)) {
			return await this.workDbInternal.getFile(path);
		}
		return null;
	}

	async retrieveMultiple(ids: ItemId[]): Promise<(ItemOutput | null)[]> {
		const results: (ItemOutput | null)[] = [];
		for (const id of ids) {
			results.push(await this.retrieve(id));
		}
		return results;
	}

	async delete(input: ItemId): Promise<void> {
		const path = this.getItemPath(input);
		if(await this.workDbInternal.exist(path)) {
			await this.workDbInternal.deleteFile(path);
		} else {
			throw new Error(`Item with id ${input.id} in collection ${input.collection} does not exist.`);
		}
	}
}

