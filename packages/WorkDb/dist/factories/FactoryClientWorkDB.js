import { ClientWorkDB } from "../ClientWorkDB.js";
import { NodeWorkDB } from "../implementations/NodeWorkDB.js";
import { BrowserWorkDB } from "../implementations/BrowserWorkDB.js";
import { CapacitorWorkDB } from "../implementations/CapacitorWorkDB.js";
/**
 * Factory method to create ClientWorkDB instance based on platform detection or explicit configuration
 * @param config Configuration object specifying platform and options
 * @returns ClientWorkDB instance configured for the target platform
 */
export function createWorkDB(config = {}) {
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
    forNode: (dataPath = './data') => {
        return createWorkDB({ platform: 'node', dataPath });
    },
    /**
     * Create WorkDB for Browser environment
     */
    forBrowser: (storage) => {
        return createWorkDB({ platform: 'browser', localStorage: storage });
    },
    /**
     * Create WorkDB for Capacitor environment
     */
    forCapacitor: (filesystem) => {
        return createWorkDB({ platform: 'capacitor', filesystem });
    }
};
//# sourceMappingURL=FactoryClientWorkDB.js.map