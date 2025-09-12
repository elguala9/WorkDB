import { expect } from "chai";
import { IWorkDb, Item, ItemId } from "iworkdb/index";




export function testIWorkDB(workDb: IWorkDb) {
    describe('WorkDB Tests', () => {
        it('should create and retrieve an item', async () => {
            const itemId: ItemId = { id: 'test1', collection: 'testCollection' };
            const item: Item = { item: { foo: 'bar' } };
            await workDb.create({ ...itemId, ...item });
            const result = await workDb.retrieve(itemId);
            expect(result).to.not.be.null;
            expect(result?.item.foo).to.equal('bar');
        });

        it('should not create duplicate items', async () => {
            const itemId: ItemId = { id: 'test2', collection: 'testCollection' };
            const item: Item = { item: { foo: 'baz' } };
            await workDb.create({ ...itemId, ...item });
            try {
                await workDb.create({ ...itemId, ...item });
                throw new Error('Duplicate creation did not throw');
            } catch (e) {
                expect(e).to.be.instanceOf(Error);
            }
        });

        it('should update an item', async () => {
            const itemId: ItemId = { id: 'test3', collection: 'testCollection' };
            const item: Item = { item: { foo: 'old' } };
            await workDb.create({ ...itemId, ...item });
            const updated: Item = { item: { foo: 'new' } };
            await workDb.update({ ...itemId, ...updated });
            const result = await workDb.retrieve(itemId);
            expect(result?.item.foo).to.equal('new');
        });

        it('should delete an item', async () => {
            const itemId: ItemId = { id: 'test4', collection: 'testCollection' };
            const item: Item = { item: { foo: 'delete' } };
            await workDb.create({ ...itemId, ...item });
            await workDb.delete(itemId);
            const result = await workDb.retrieve(itemId);
            expect(result).to.be.null;
        });

        it('should create and retrieve multiple items', async () => {
            const items: (ItemId & Item)[] = [
                { id: 'multi1', collection: 'testCollection', item: { foo: 1 } },
                { id: 'multi2', collection: 'testCollection', item: { foo: 2 } }
            ];
            await workDb.createMultiple(items);
            const results = await workDb.retrieveMultiple(items.map(i => ({ id: i.id, collection: i.collection })));
            expect(results[0]?.item.foo).to.equal(1);
            expect(results[1]?.item.foo).to.equal(2);
        });

        it('should return null for non-existent item', async () => {
            const itemId: ItemId = { id: 'notfound', collection: 'testCollection' };
            const result = await workDb.retrieve(itemId);
            expect(result).to.be.null;
        });

        it('should throw when updating non-existent item', async () => {
            const itemId: ItemId = { id: 'noitem', collection: 'testCollection' };
            const item: Item = { item: { foo: 'fail' } };
            try {
                await workDb.update({ ...itemId, ...item });
                throw new Error('Update of non-existent item did not throw');
            } catch (e) {
                expect(e).to.be.instanceOf(Error);
            }
        });

        it('should throw when deleting non-existent item', async () => {
            const itemId: ItemId = { id: 'noitem', collection: 'testCollection' };
            try {
                await workDb.delete(itemId);
                throw new Error('Delete of non-existent item did not throw');
            } catch (e) {
                expect(e).to.be.instanceOf(Error);
            }
        });

        it('should not create item with empty id or collection', async () => {
            const invalids = [
                { id: '', collection: 'testCollection', item: { foo: 'bad' } },
                { id: 'bad', collection: '', item: { foo: 'bad' } }
            ];
            for (const input of invalids) {
                try {
                    await workDb.create(input);
                    throw new Error('Creation with invalid id/collection did not throw');
                } catch (e) {
                    expect(e).to.be.instanceOf(Error);
                }
            }
        });

        it('should handle update after delete', async () => {
            const itemId: ItemId = { id: 'delupdate', collection: 'testCollection' };
            const item: Item = { item: { foo: 'first' } };
            await workDb.create({ ...itemId, ...item });
            await workDb.delete(itemId);
            try {
                await workDb.update({ ...itemId, ...item });
                throw new Error('Update after delete did not throw');
            } catch (e) {
                expect(e).to.be.instanceOf(Error);
            }
        });

        it('should retrieve multiple with some missing', async () => {
            const items: (ItemId & Item)[] = [
                { id: 'multiA', collection: 'testCollection', item: { foo: 'A' } },
                { id: 'multiB', collection: 'testCollection', item: { foo: 'B' } }
            ];
            await workDb.createMultiple(items);
            const ids = [
                { id: 'multiA', collection: 'testCollection' },
                { id: 'notfound', collection: 'testCollection' },
                { id: 'multiB', collection: 'testCollection' }
            ];
            const results = await workDb.retrieveMultiple(ids);
            expect(results[0]?.item.foo).to.equal('A');
            expect(results[1]).to.be.null;
            expect(results[2]?.item.foo).to.equal('B');
        });

        it('should delete multiple items', async () => {
            const items: (ItemId & Item)[] = [
                { id: 'del1', collection: 'testCollection', item: { foo: 1 } },
                { id: 'del2', collection: 'testCollection', item: { foo: 2 } }
            ];
            await workDb.createMultiple(items);
            for (const item of items) {
                await workDb.delete({ id: item.id, collection: item.collection });
            }
            const results = await workDb.retrieveMultiple(items.map(i => ({ id: i.id, collection: i.collection })));
            expect(results[0]).to.be.null;
            expect(results[1]).to.be.null;
        });

        it('should not create item with non-serializable data', async () => {
            const itemId: ItemId = { id: 'badjson', collection: 'testCollection' };
            const item: Item = { item: { foo: "" } };
            try {
                await workDb.create({ ...itemId, ...item });
                throw new Error('Creation with non-serializable data did not throw');
            } catch (e) {
                expect(e).to.be.instanceOf(Error);
            }
        });

            it('should delete a collection', async () => {
                const items: (ItemId & Item)[] = [
                    { id: 'col1', collection: 'toDelete', item: { foo: 1 } },
                    { id: 'col2', collection: 'toDelete', item: { foo: 2 } },
                    { id: 'col3', collection: 'toKeep', item: { foo: 3 } }
                ];
                await workDb.createMultiple(items);
                await workDb.deleteCollection('toDelete');
                const results = await workDb.retrieveMultiple([
                    { id: 'col1', collection: 'toDelete' },
                    { id: 'col2', collection: 'toDelete' },
                    { id: 'col3', collection: 'toKeep' }
                ]);
                expect(results[0]).to.be.null;
                expect(results[1]).to.be.null;
                expect(results[2]?.item.foo).to.equal(3);
            });

            it('should clear the database', async () => {
                const items: (ItemId & Item)[] = [
                    { id: 'db1', collection: 'colA', item: { foo: 'A' } },
                    { id: 'db2', collection: 'colB', item: { foo: 'B' } }
                ];
                await workDb.createMultiple(items);
                await workDb.clearDatabase();
                const results = await workDb.retrieveMultiple([
                    { id: 'db1', collection: 'colA' },
                    { id: 'db2', collection: 'colB' }
                ]);
                expect(results[0]).to.be.null;
                expect(results[1]).to.be.null;
            });

            it('should list items in a collection', async () => {
                const items: (ItemId & Item)[] = [
                    { id: 'item10', collection: 'colA', item: { foo: 1 } },
                    { id: 'item20', collection: 'colA', item: { foo: 2 } },
                    { id: 'item30', collection: 'colB', item: { foo: 3 } }
                ];
                await workDb.createMultiple(items);
                const idsA = await (workDb as any).getItemsInCollection('colA');
                expect(idsA).to.include('item10');
                expect(idsA).to.include('item20');
                expect(idsA).to.not.include('item30');
            });

            it('should list all collections', async () => {
                const items: (ItemId & Item)[] = [
                    { id: 'item11', collection: 'colA', item: { foo: 1 } },
                    { id: 'item21', collection: 'colB', item: { foo: 2 } },
                    { id: 'item31', collection: 'colC', item: { foo: 3 } }
                ];
                await workDb.createMultiple(items);
                const collections = await (workDb as any).getCollections();
                expect(collections).to.include('colA');
                expect(collections).to.include('colB');
                expect(collections).to.include('colC');
            });
    });
}
