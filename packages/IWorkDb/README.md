# IWorkDb

TypeScript interfaces and types for the WorkDB cross-platform database system.

## Overview

IWorkDb provides the core interfaces and type definitions for a lightweight, cross-platform database system that works seamlessly across Node.js, browser, and Capacitor environments.

## Installation

```bash
npm install iworkdb
```

## Types and Interfaces

### Core Types

```typescript
// JSON-serializable object type
export type JsonObject = { [key: string]: JsonValue }; 
export type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];

// Item identification
export type ItemId = {
    id: string;
    collection: string;
};

// Item data structure
export type Item = {
    item: JsonObject;
}

// Item with metadata
export type ItemOutput = Item & {
    createdAt?: string;
}
```

### IWorkDb Interface

Main interface for database operations:

```typescript
interface IWorkDb {
    // CRUD Operations
    create(input: Item & ItemId): Promise<void>;
    createMultiple(input: (ItemId & Item)[]): Promise<void>;
    update(input: Item & ItemId): Promise<void>;
    retrieve(input: ItemId): Promise<ItemOutput | null>;
    retrieveMultiple(ids: ItemId[]): Promise<(ItemOutput | null)[]>;
    delete(input: ItemId): Promise<void>;
    
    // Collection Management
    deleteCollection(collection: string): Promise<void>;
    clearDatabase(): Promise<void>;
    getItemsInCollection(collection: string): Promise<string[]>;
    getCollections(): Promise<string[]>;
    
    // File System Operations
    ls(path: string): Promise<string[]>;
}
```

### IWorkFileSystem Interface

Low-level file system abstraction:

```typescript
interface IWorkFileSystem {
    writeFile(path: string, input: Item): Promise<void>;
    getFile(path: string): Promise<ItemOutput>;
    deleteFile(path: string): Promise<void>;
    deleteFolder(folderPath: string): Promise<void>;
    exist(path: string): Promise<boolean>;
    renameFile(oldPath: string, newPath: string): Promise<void>;
    ls(path: string): Promise<string[]>;
}
```

## Usage Examples

### Basic Item Operations

```typescript
import { IWorkDb, ItemId, Item } from 'iworkdb';

// Create an item
const itemId: ItemId = { id: 'user1', collection: 'users' };
const item: Item = { item: { name: 'John', age: 30 } };
await workDb.create({ ...itemId, ...item });

// Retrieve an item
const result = await workDb.retrieve(itemId);
console.log(result?.item); // { name: 'John', age: 30 }

// Update an item
await workDb.update({ ...itemId, item: { name: 'John', age: 31 } });

// Delete an item
await workDb.delete(itemId);
```

### Collection Management

```typescript
// Get all collections
const collections = await workDb.getCollections();

// Get items in a collection
const userIds = await workDb.getItemsInCollection('users');

// Delete entire collection
await workDb.deleteCollection('users');

// Clear entire database
await workDb.clearDatabase();
```

### Multiple Operations

```typescript
// Create multiple items
const items = [
    { id: 'user1', collection: 'users', item: { name: 'John' } },
    { id: 'user2', collection: 'users', item: { name: 'Jane' } }
];
await workDb.createMultiple(items);

// Retrieve multiple items
const ids = [
    { id: 'user1', collection: 'users' },
    { id: 'user2', collection: 'users' }
];
const results = await workDb.retrieveMultiple(ids);
```

## Data Structure

- **Collections**: Logical groupings of related items (similar to tables in SQL)
- **Items**: Individual data objects within collections
- **IDs**: Unique identifiers for items within their collection
- **Path Structure**: `./WorkDB/{collection}/{id}`

## Error Handling

The database will throw errors for:
- Creating items that already exist
- Updating items that don't exist
- Deleting items that don't exist
- Invalid IDs or collection names
- Non-serializable data

## TypeScript Support

Full TypeScript support with strict typing for:
- JSON-serializable data validation
- Required fields enforcement
- Return type guarantees
- Interface compliance checking

## License

LGPL-3.0-or-later