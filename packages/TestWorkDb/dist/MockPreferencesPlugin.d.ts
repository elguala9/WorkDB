import { MigrateResult, PreferencesPlugin } from "@capacitor/preferences";
export declare class MockPreferencesPlugin implements PreferencesPlugin {
    private store;
    configure(): Promise<void>;
    get({ key }: {
        key: string;
    }): Promise<{
        value: string | null;
    }>;
    set({ key, value }: {
        key: string;
        value: string;
    }): Promise<void>;
    remove({ key }: {
        key: string;
    }): Promise<void>;
    clear(): Promise<void>;
    keys(): Promise<{
        keys: string[];
    }>;
    migrate(): Promise<MigrateResult>;
    removeOld(): Promise<void>;
}
