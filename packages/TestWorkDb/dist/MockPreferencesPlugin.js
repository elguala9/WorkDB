export class MockPreferencesPlugin {
    constructor() {
        this.store = new Map();
    }
    async configure() {
        // No configuration needed for mock
        return;
    }
    async get({ key }) {
        return { value: this.store.get(key) ?? null };
    }
    async set({ key, value }) {
        this.store.set(key, value);
        return;
    }
    async remove({ key }) {
        this.store.delete(key);
        return;
    }
    async clear() {
        this.store.clear();
        return;
    }
    async keys() {
        return { keys: Array.from(this.store.keys()) };
    }
    async migrate() {
        // No migration needed for mock
        return {
            migrated: [],
            existing: []
        };
    }
    async removeOld() {
        // No old data to remove for mock
        return;
    }
}
//# sourceMappingURL=MockPreferencesPlugin.js.map