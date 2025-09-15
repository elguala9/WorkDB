# WorkDb

Cross-platform database implementation for Node.js, Browser, and Capacitor environments.

## Overview

WorkDb provides concrete implementations of the IWorkDb interface for different platforms, enabling seamless data persistence across desktop, web, and mobile applications.

## Installation

```bash
npm install workdb
```

## Implementations

### NodeWorkDB
File system-based implementation for Node.js environments.

```typescript
import { NodeWorkDB, ClientWorkDB } from 'workdb';

const nodeImpl = new NodeWorkDB('./data');
const workDb = ClientWorkDB.getInstance(nodeImpl);
```

### BrowserWorkDB
localStorage-based implementation for web browsers.

```typescript
import { BrowserWorkDB, ClientWorkDB } from 'workdb';

const browserImpl = new BrowserWorkDB(window.localStorage);
const workDb = ClientWorkDB.getInstance(browserImpl);
```

### CapacitorWorkDB
Capacitor Filesystem plugin implementation for mobile apps.

```typescript
import { CapacitorWorkDB, ClientWorkDB } from 'workdb';
import { Filesystem } from '@capacitor/filesystem';

const capacitorImpl = new CapacitorWorkDB(Filesystem);
const workDb = ClientWorkDB.getInstance(capacitorImpl);
```

## ClientWorkDB (Singleton)

The main client class that provides a unified interface across all platforms:

```typescript
import { ClientWorkDB } from 'workdb';
import { YourPlatformImplementation } from 'workdb';

// Initialize with platform-specific implementation
const impl = new YourPlatformImplementation();
const workDb = ClientWorkDB.getInstance(impl);

// Now use the standard IWorkDb interface
await workDb.create({ id: 'item1', collection: 'test', item: { data: 'value' } });
```

## Platform-Specific Features

### Node.js Features
- File system persistence
- Configurable data directory
- JSON file storage with `.json` extension
- Recursive directory creation
- File-based operations

```typescript
const nodeDb = new NodeWorkDB('./my-data-folder');
```

### Browser Features
- localStorage persistence
- No file system dependencies
- Automatic JSON serialization
- Key-based storage using collection/id pattern

```typescript
const browserDb = new BrowserWorkDB(localStorage);
// Or use sessionStorage
const sessionDb = new BrowserWorkDB(sessionStorage);
```

### Capacitor Features
- Native file system access
- Cross-platform mobile support
- Directory.Data storage location
- UTF-8 encoding
- Creation time metadata support

```typescript
import { Filesystem } from '@capacitor/filesystem';
const capacitorDb = new CapacitorWorkDB(Filesystem);
```

## Usage Examples

### Basic Setup

```typescript
// Choose your platform implementation
import { NodeWorkDB, ClientWorkDB } from 'workdb';

const fileSystem = new NodeWorkDB('./database');
const db = ClientWorkDB.getInstance(fileSystem);

// Standard database operations
const user = {
    id: 'user123',
    collection: 'users',
    item: {
        name: 'John Doe',
        email: 'john@example.com',
        created: new Date().toISOString()
    }
};

await db.create(user);
```

### Cross-Platform Factory Pattern

```typescript
// factory.ts
import { ClientWorkDB, NodeWorkDB, BrowserWorkDB, CapacitorWorkDB } from 'workdb';
import { Filesystem } from '@capacitor/filesystem';

export function createWorkDB(): ClientWorkDB {
    if (typeof window !== 'undefined') {
        // Browser environment
        const impl = new BrowserWorkDB(window.localStorage);
        return ClientWorkDB.getInstance(impl);
    } else if (typeof process !== 'undefined') {
        // Node.js environment
        const impl = new NodeWorkDB('./data');
        return ClientWorkDB.getInstance(impl);
    } else {
        // Capacitor environment
        const impl = new CapacitorWorkDB(Filesystem);
        return ClientWorkDB.getInstance(impl);
    }
}
```

### Collection Management

```typescript
// Get all collections
const collections = await db.getCollections();
console.log('Available collections:', collections);

// Get items in a collection
const userIds = await db.getItemsInCollection('users');
console.log('User IDs:', userIds);

// List files/directories
const files = await db.ls('./WorkDB/users');
console.log('Files in users collection:', files);
```

### Batch Operations

```typescript
// Create multiple users
const users = [
    { id: 'user1', collection: 'users', item: { name: 'Alice' } },
    { id: 'user2', collection: 'users', item: { name: 'Bob' } },
    { id: 'user3', collection: 'users', item: { name: 'Charlie' } }
];

await db.createMultiple(users);

// Retrieve multiple users
const userIds = [
    { id: 'user1', collection: 'users' },
    { id: 'user2', collection: 'users' },
    { id: 'user3', collection: 'users' }
];

const results = await db.retrieveMultiple(userIds);
results.forEach((user, index) => {
    if (user) {
        console.log(`User ${index + 1}: ${user.item.name}`);
    }
});
```

## File Structure

### Node.js File Layout
```
./data/
  WorkDB/
    users/
      user1.json
      user2.json
    posts/
      post1.json
      post2.json
```

### Browser Storage Keys
```
localStorage keys:
- "./WorkDB/users/user1"
- "./WorkDB/users/user2"
- "./WorkDB/posts/post1"
```

### Capacitor File Structure
```
Data Directory:
  ./WorkDB/
    users/
      user1
      user2
    posts/
      post1
```

## Error Handling

```typescript
try {
    await db.create({ id: 'existing', collection: 'test', item: { data: 'value' } });
    await db.create({ id: 'existing', collection: 'test', item: { data: 'value' } }); // Throws
} catch (error) {
    console.error('Item already exists:', error.message);
}

try {
    await db.update({ id: 'nonexistent', collection: 'test', item: { data: 'value' } }); // Throws
} catch (error) {
    console.error('Item not found:', error.message);
}
```

## Testing

The package includes comprehensive test suites and mocks for all platforms:

```typescript
import { testIWorkDB } from 'workdb/test';
import { MockCapacitorFS } from 'workdb/test';

// Test your implementation
const mockFs = new MockCapacitorFS();
const impl = new CapacitorWorkDB(mockFs);
const db = ClientWorkDB.getInstance(impl);

testIWorkDB(db); // Runs complete test suite
```

## API Reference

See the [IWorkDb README](../IWorkDb/README.md) for complete API documentation.

## Dependencies

- **Node.js**: `fs/promises`, `path`
- **Browser**: Native localStorage/sessionStorage
- **Capacitor**: `@capacitor/filesystem`

## License

LGPL-3.0-or-later