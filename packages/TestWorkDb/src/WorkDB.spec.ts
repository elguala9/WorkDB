import { expect } from "chai";
import { IWorkDb, Item, ItemId } from "iworkdb/index";
import { eqMessageData } from "./Utility.ts";

export type MessageWithId = {
    id: number;
};
export type MessageData = MessageDataGeneric<Uint8Array> & MessageWithId & {};
export type MessageDataGeneric<DataType> = MessageWithId & {
    data: DataType;
};
export const examplesMessageData: MessageData[] = Array.from({ length: 10 }, (_, i) => ({
  id: 61 + i,
  data: new Uint8Array([61 + i, 62 + i, 63 + i])
}));


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

            it('should handle message data with Uint8Array', async () => {
                const messageData = examplesMessageData[0];
                const uniqueId = `single_${Date.now()}_msg_${messageData.id}`;
                const itemId: ItemId = { id: uniqueId, collection: 'messages_single' };
                const item: Item = { 
                    item: { 
                        id: messageData.id,
                        data: Array.from(messageData.data), // Convert Uint8Array to regular array for JSON serialization
                        timestamp: new Date().toISOString()
                    } 
                };
                
                await workDb.create({ ...itemId, ...item });
                const result = await workDb.retrieve(itemId);
                
                expect(result).to.not.be.null;
                
                // Reconstruct MessageData from stored item
                const retrievedMessageData: MessageData = {
                    id: result!.item.id as number,
                    data: new Uint8Array(result!.item.data as number[])
                };
                
                // Use eqMessageData for precise comparison
                expect(eqMessageData(messageData, retrievedMessageData)).to.be.true;
            });

            it('should create and retrieve multiple message data items', async () => {
                const testMessages = examplesMessageData.slice(0, 5);
                const uniquePrefix = `multi_${Date.now()}`;
                const items: (ItemId & Item)[] = testMessages.map(msg => ({
                    id: `${uniquePrefix}_msg_${msg.id}`,
                    collection: 'messages_multi',
                    item: {
                        id: msg.id,
                        data: Array.from(msg.data),
                        size: msg.data.length,
                        created: new Date().toISOString()
                    }
                }));

                await workDb.createMultiple(items);
                
                const ids = items.map(item => ({ id: item.id, collection: item.collection }));
                const results = await workDb.retrieveMultiple(ids);
                
                expect(results).to.have.lengthOf(5);
                results.forEach((result, index) => {
                    expect(result).to.not.be.null;
                    
                    // Reconstruct MessageData from stored item
                    const retrievedMessageData: MessageData = {
                        id: result!.item.id as number,
                        data: new Uint8Array(result!.item.data as number[])
                    };
                    
                    // Use eqMessageData for precise comparison
                    expect(eqMessageData(testMessages[index], retrievedMessageData)).to.be.true;
                });
            });

            it('should update message data', async () => {
                const originalMessage = examplesMessageData[2];
                const uniqueId = `update_${Date.now()}_msg_${originalMessage.id}`;
                const itemId: ItemId = { id: uniqueId, collection: 'messages_update' };
                const item: Item = { 
                    item: { 
                        id: originalMessage.id,
                        data: Array.from(originalMessage.data),
                        version: 1
                    } 
                };
                
                await workDb.create({ ...itemId, ...item });
                
                // Update with new data
                const updatedMessage: MessageData = {
                    id: originalMessage.id,
                    data: new Uint8Array([100, 101, 102])
                };
                
                const updatedItem: Item = {
                    item: {
                        id: updatedMessage.id,
                        data: Array.from(updatedMessage.data),
                        version: 2,
                        updated: new Date().toISOString()
                    }
                };
                
                await workDb.update({ ...itemId, ...updatedItem });
                const result = await workDb.retrieve(itemId);
                
                expect(result).to.not.be.null;
                
                // Reconstruct MessageData from stored item
                const retrievedMessageData: MessageData = {
                    id: result!.item.id as number,
                    data: new Uint8Array(result!.item.data as number[])
                };
                
                // Use eqMessageData to verify the update
                expect(eqMessageData(updatedMessage, retrievedMessageData)).to.be.true;
                expect(result!.item.version).to.equal(2);
            });

            it('should handle large message collection operations', async () => {
                // Create all example messages with unique IDs
                const uniquePrefix = `large_${Date.now()}`;
                const items: (ItemId & Item)[] = examplesMessageData.map(msg => ({
                    id: `${uniquePrefix}_msg_${msg.id}`,
                    collection: 'largeMessages',
                    item: {
                        id: msg.id,
                        data: Array.from(msg.data),
                        checksum: msg.data.reduce((sum, byte) => sum + byte, 0)
                    }
                }));

                await workDb.createMultiple(items);
                
                // Verify all messages were created
                const messageIds = await (workDb as any).getItemsInCollection('largeMessages');
                expect(messageIds.length).to.be.greaterThanOrEqual(examplesMessageData.length);
                
                // Delete half of the messages
                const toDelete = items.slice(0, Math.floor(items.length / 2));
                for (const item of toDelete) {
                    await workDb.delete({ id: item.id, collection: item.collection });
                }
                
                // Verify remaining messages
                const remainingIds = await (workDb as any).getItemsInCollection('largeMessages');
                expect(remainingIds.length).to.be.lessThan(messageIds.length);
            });

            it('should preserve binary data integrity', async () => {
                const messageData = examplesMessageData[5];
                const itemId: ItemId = { id: `integrity_${messageData.id}`, collection: 'integrity' };
                const originalArray = Array.from(messageData.data);
                
                const item: Item = { 
                    item: { 
                        originalData: originalArray,
                        metadata: {
                            length: messageData.data.length,
                            firstByte: messageData.data[0],
                            lastByte: messageData.data[messageData.data.length - 1]
                        }
                    } 
                };
                
                await workDb.create({ ...itemId, ...item });
                const result = await workDb.retrieve(itemId);
                
                expect(result).to.not.be.null;
                expect(result?.item.originalData).to.deep.equal(originalArray);
                
                const metadata = result!.item.metadata as any;
                expect(metadata.length).to.equal(messageData.data.length);
                expect(metadata.firstByte).to.equal(messageData.data[0]);
                expect(metadata.lastByte).to.equal(messageData.data[messageData.data.length - 1]);
                
                // Verify we can reconstruct the Uint8Array
                const reconstructed = new Uint8Array(result!.item.originalData as number[]);
                expect(reconstructed).to.deep.equal(messageData.data);
            });

            it('should validate message data equality using eqMessageData', async () => {
                const testMessages = examplesMessageData.slice(6, 9);
                
                // Store all test messages
                for (const msg of testMessages) {
                    const itemId: ItemId = { id: `eq_test_${msg.id}`, collection: 'equality_test' };
                    const item: Item = { 
                        item: { 
                            id: msg.id,
                            data: Array.from(msg.data)
                        } 
                    };
                    await workDb.create({ ...itemId, ...item });
                }
                
                // Retrieve and compare each message
                for (const originalMsg of testMessages) {
                    const itemId: ItemId = { id: `eq_test_${originalMsg.id}`, collection: 'equality_test' };
                    const result = await workDb.retrieve(itemId);
                    
                    expect(result).to.not.be.null;
                    
                    const retrievedMsg: MessageData = {
                        id: result!.item.id as number,
                        data: new Uint8Array(result!.item.data as number[])
                    };
                    
                    // This will use eqMessageData internally and show detailed diff if they don't match
                    expect(eqMessageData(originalMsg, retrievedMsg)).to.be.true;
                }
                
                // Test that different messages are correctly identified as not equal
                if (testMessages.length >= 2) {
                    const firstResult = await workDb.retrieve({ id: `eq_test_${testMessages[0].id}`, collection: 'equality_test' });
                    const secondOriginal = testMessages[1];
                    
                    const firstRetrieved: MessageData = {
                        id: firstResult!.item.id as number,
                        data: new Uint8Array(firstResult!.item.data as number[])
                    };
                    
                    // This should be false and will show the differences via notEqual function
                    expect(eqMessageData(firstRetrieved, secondOriginal)).to.be.false;
                }
            });
    });
}
