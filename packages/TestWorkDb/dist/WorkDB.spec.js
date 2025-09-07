import { expect } from "chai";
export function testIWorkDB(workDb) {
    describe('WorkDB Tests', () => {
        it('should create and retrieve an item', async () => {
            const itemId = { id: 'test1', collection: 'testCollection' };
            const item = { item: { foo: 'bar' } };
            await workDb.create({ ...itemId, ...item });
            const result = await workDb.retrieve(itemId);
            expect(result).to.not.be.null;
            expect(result?.item.foo).to.equal('bar');
        });
        it('should not create duplicate items', async () => {
            const itemId = { id: 'test2', collection: 'testCollection' };
            const item = { item: { foo: 'baz' } };
            await workDb.create({ ...itemId, ...item });
            try {
                await workDb.create({ ...itemId, ...item });
                throw new Error('Duplicate creation did not throw');
            }
            catch (e) {
                expect(e).to.be.instanceOf(Error);
            }
        });
        it('should update an item', async () => {
            const itemId = { id: 'test3', collection: 'testCollection' };
            const item = { item: { foo: 'old' } };
            await workDb.create({ ...itemId, ...item });
            const updated = { item: { foo: 'new' } };
            await workDb.update({ ...itemId, ...updated });
            const result = await workDb.retrieve(itemId);
            expect(result?.item.foo).to.equal('new');
        });
        it('should delete an item', async () => {
            const itemId = { id: 'test4', collection: 'testCollection' };
            const item = { item: { foo: 'delete' } };
            await workDb.create({ ...itemId, ...item });
            await workDb.delete(itemId);
            const result = await workDb.retrieve(itemId);
            expect(result).to.be.null;
        });
        it('should create and retrieve multiple items', async () => {
            const items = [
                { id: 'multi1', collection: 'testCollection', item: { foo: 1 } },
                { id: 'multi2', collection: 'testCollection', item: { foo: 2 } }
            ];
            await workDb.createMultiple(items);
            const results = await workDb.retrieveMultiple(items.map(i => ({ id: i.id, collection: i.collection })));
            expect(results[0]?.item.foo).to.equal(1);
            expect(results[1]?.item.foo).to.equal(2);
        });
    });
}
//# sourceMappingURL=WorkDB.spec.js.map