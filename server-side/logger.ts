import { Client } from '@pepperi-addons/debug-server';
import GeneralService from './services/general.service';
import { ADALService } from './services/adal.service';

export async function insert_pns(client: Client) {
    const service = new GeneralService(client);
    const adalService = new ADALService(service.papiClient);
    //adalService.postDataToSchema()
    const PepperiOwnerID = service.papiClient['options'].addonUUID;
    const schemaName = `Oren111`;
    const insertedObject = {
        Key: `Transaction ${service.getServer()} ${service.getTime()} ${service.getDate()}`,
        Column1: ['I', 'did', 'it'],
    };

    const updateSchemaResponse = await adalService.postDataToSchema(PepperiOwnerID, schemaName, insertedObject);
    console.log({ updateSchemaResponse: updateSchemaResponse });
    return {
        'PNS Insertion Logged': {
            'Pepperi Owner ID': PepperiOwnerID,
            'Schema Name': schemaName,
            'Inserted Object': insertedObject,
        },
    };
}
