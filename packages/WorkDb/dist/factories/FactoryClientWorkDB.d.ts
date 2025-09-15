import { ClientWorkDB } from "../ClientWorkDB.js";
export type PlatformType = 'node' | 'browser' | 'capacitor';
export interface WorkDBConfig {
    platform?: PlatformType;
    dataPath?: string;
    localStorage?: Storage;
    filesystem?: any;
}
/**
 * Factory method to create ClientWorkDB instance based on platform detection or explicit configuration
 * @param config Configuration object specifying platform and options
 * @returns ClientWorkDB instance configured for the target platform
 */
export declare function createWorkDB(config?: WorkDBConfig): ClientWorkDB;
/**
 * Quick factory methods for specific platforms
 */
export declare const WorkDBFactory: {
    /**
     * Create WorkDB for Node.js environment
     */
    forNode: (dataPath?: string) => ClientWorkDB;
    /**
     * Create WorkDB for Browser environment
     */
    forBrowser: (storage?: Storage) => ClientWorkDB;
    /**
     * Create WorkDB for Capacitor environment
     */
    forCapacitor: (filesystem?: any) => ClientWorkDB;
};
