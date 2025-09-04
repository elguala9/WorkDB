import { IWorkDb, IWorkDbInternal, Item, ItemId, ItemOutput } from "iworkdb";

export class ClientWorkDB implements IWorkDb {

	private workDbInternal : IWorkDbInternal;

    constructor(workDbInternal : IWorkDbInternal) {
		this.workDbInternal = workDbInternal;
    }

	async create(input: Item & ItemId): Promise<void> {
		if(await this.workDbInternal.exist(input)) {
			await this.workDbInternal.writeFile(input);
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
		let temp: Item & ItemId= {...input, id: input.id + "_tmp"}
		await this.workDbInternal.renameFile(input, temp);
		// maybe we need to handle an error here
		await this.workDbInternal.writeFile(input);
		await this.delete(temp);
	}

	async retrieve(input: ItemId): Promise<ItemOutput | null> {
		if(await this.workDbInternal.exist(input)) {
			return await this.workDbInternal.getFile(input);
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
		if(await this.workDbInternal.exist(input)) {
			await this.workDbInternal.deleteFile(input);
		} else {
			throw new Error(`Item with id ${input.id} in collection ${input.collection} does not exist.`);
		}
	}
}