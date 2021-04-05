import { ObjectsService } from './services/objects.service';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from './services/general.service';
import { ADALService } from './services/adal.service';

export async function insert_pns(client: Client): Promise<any> {
    return insertLog(client, 'Insert');
}

export async function update_pns(client: Client): Promise<any> {
    return insertLog(client, 'Updaet');
}

async function insertLog(client: Client, type: string) {
    const generalService = new GeneralService(client);
    const adalService = new ADALService(generalService.papiClient);
    const objectsService = new ObjectsService(generalService.papiClient);
    const PepperiOwnerID = generalService.papiClient['options'].addonUUID;
    const schemaName = `PNS Test`;
    const lastTransactionLine = await objectsService.getTransactionLines({
        include_deleted: true,
        page_size: 1,
        order_by: 'ModificationDateTime DESC',
    });

    const insertedObject = {
        Key: `${type} Transaction ${generalService.getServer()} ${generalService.getTime()} ${generalService.getDate()}`,
        TransactioInfo: {
            ModificationDateTime: lastTransactionLine[0].ModificationDateTime,
            InternalID: lastTransactionLine[0].InternalID,
            Hidden: lastTransactionLine[0].Hidden,
            ItemData: lastTransactionLine[0].Item.Data,
            UnitsQuantity: lastTransactionLine[0].UnitsQuantity,
        },
        ClientInfo: {
            CurrentServerHost: client.AssetsBaseUrl,
            ServerBaseURL: client.BaseURL,
        },
    };

    //This might be needed later but for now ill use the same schema every test
    //const createNewSchema = await adalService.postSchema({ Name: schemaName });
    //console.log({ createNewSchema: createNewSchema });
    await adalService.postDataToSchema(PepperiOwnerID, schemaName, insertedObject);
    return {
        'PNS Insertion Logged': {
            'Pepperi Owner ID': PepperiOwnerID,
            'Schema Name': schemaName,
            'Inserted Object': insertedObject,
        },
    };
}
