import { ClientWorkDB } from "../ClientWorkDB.js";
import { NodeWorkDB } from "../implementations/NodeWorkDB.js";
import { BrowserWorkDB } from "../implementations/BrowserWorkDB.js";
import { CapacitorWorkDB } from "../implementations/CapacitorWorkDB.js";

export type PlatformType = 'node' | 'browser' | 'capacitor';

export interface WorkDBConfig {
    platform?: PlatformType;
    dataPath?: string;
    localStorage?: Storage;
    filesystem?: any; // FilesystemPlugin from @capacitor/filesystem
}

/**
 * Factory method to create ClientWorkDB instance based on platform detection or explicit configuration
 * @param config Configuration object specifying platform and options
 * @returns ClientWorkDB instance configured for the target platform
 */
export function createWorkDB(config: WorkDBConfig = {}): ClientWorkDB {
    const { platform, dataPath = './data', localStorage, filesystem } = config;
    
    let targetPlatform = platform;
    
    switch (targetPlatform) {
        case 'node': {
            const nodeImpl = new NodeWorkDB(dataPath);
            return ClientWorkDB.getInstance(nodeImpl);
        }
        
        case 'browser': {
            const browserImpl = new BrowserWorkDB(localStorage);
            return ClientWorkDB.getInstance(browserImpl);
        }
        
        case 'capacitor': {
            const capacitorImpl = new CapacitorWorkDB(filesystem);
            return ClientWorkDB.getInstance(capacitorImpl);
        }
        
        default:
            throw new Error(`Unsupported platform: ${targetPlatform}`);
    }
}

/**
 * Quick factory methods for specific platforms
 */
export const WorkDBFactory = {
    /**
     * Create WorkDB for Node.js environment
     */
    forNode: (dataPath: string = './data'): ClientWorkDB => {
        return createWorkDB({ platform: 'node', dataPath });
    },
    
    /**
     * Create WorkDB for Browser environment
     */
    forBrowser: (storage?: Storage): ClientWorkDB => {
        return createWorkDB({ platform: 'browser', localStorage: storage });
    },
    
    /**
     * Create WorkDB for Capacitor environment
     */
    forCapacitor: (filesystem?: any): ClientWorkDB => {
        return createWorkDB({ platform: 'capacitor', filesystem });
    }
};
