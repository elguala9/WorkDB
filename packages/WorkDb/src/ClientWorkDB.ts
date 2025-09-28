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

	async createOrUpdate(input: Item & ItemId): Promise<void> {
		const path = this.getItemPath(input);
		// Check if item exists, create or update accordingly
		if(await this.workDbInternal.exist(path)) {
			// Item exists, update it
			await this.workDbInternal.writeFile(path, { item: input.item });
		} else {
			// Item doesn't exist, create it
			await this.workDbInternal.writeFile(path, { item: input.item });
		}
	}

	async createOrUpdateMultiple(inputs: (ItemId & Item)[]): Promise<void> {
		for (const input of inputs) {
			await this.createOrUpdate(input);
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

	async getItemsInCollection(collection: string): Promise<string[]> {
		const path = this.getCollectionPath(collection);
		const files = await this.workDbInternal.ls(path);
		// Restituisce solo gli id degli item nella collection
		return files.map(f => f.replace(path + '/', ''));
	}

	async getCollections(): Promise<string[]> {
		const path = this.getRoot();
		const files = await this.workDbInternal.ls(path);
		// Restituisce solo i nomi delle collection (primo livello)
		const collections = new Set<string>();
		for (const f of files) {
			const rel = f.replace(path + '/', '');
			const col = rel.split('/')[0];
			if (col) collections.add(col);
		}
		return Array.from(collections);
	}
}

