import { PapiClient } from '@pepperi-addons/papi-sdk';

interface NestedObjectData {
    InternalID?: number;
    UUID?: string;
    ExternalID?: string;
}

interface NestedObject {
    Data?: NestedObjectData;
    URI?: string;
}

export interface Inventory {
    InternalID?: number;
    InStockQuantity: number;
    ModificationDateTime?: string;
    Item: NestedObject;
}

export class InventoryService {
    constructor(public papiClient: PapiClient) {}

    getInventoryByItemExternalID(externalID: string): Promise<Inventory[]> {
        return this.papiClient.get(`/inventory?where=Item.ExternalID='${externalID}'`);
    }

    getInventory(): Promise<Inventory[]> {
        return this.papiClient.get('/inventory');
    }

    postInventory(inventory: Inventory): Promise<Inventory> {
        return this.papiClient.post('/inventory', inventory);
    }
}
