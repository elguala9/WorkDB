import { MigrateResult, PreferencesPlugin } from "@capacitor/preferences";

export class MockPreferencesPlugin implements PreferencesPlugin {
  private store = new Map<string, string>();

  async configure() {
    // No configuration needed for mock
    return;
  }

  async get({ key }: { key: string }) {
    return { value: this.store.get(key) ?? null };
  }

  async set({ key, value }: { key: string, value: string }) {
    this.store.set(key, value);
    return;
  }

  async remove({ key }: { key: string }) {
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

  async migrate(): Promise<MigrateResult> {
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