import { ObjectsService } from './services/objects.service';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from './services/general.service';
import { ADALService } from './services/adal.service';

export async function insert_pns(client: Client) {
    const service = new GeneralService(client);
    const adalService = new ADALService(service.papiClient);
    const objectsService = new ObjectsService(service.papiClient);

    const PepperiOwnerID = service.papiClient['options'].addonUUID;
    const schemaName = `PNS Test`;
    const lastTransactionLine = await objectsService.getTransactionLines({
        include_deleted: true,
        page_size: 1,
        order_by: 'ModificationDateTime DESC',
    });

    const insertedObject = {
        Key: `Transaction ${service.getServer()} ${service.getTime()} ${service.getDate()}`,
        TransactioInfo: {
            ModificationDateTime: lastTransactionLine[0].ModificationDateTime,
            Hidden: lastTransactionLine[0].Hidden,
            ItemData: lastTransactionLine[0].Item.Data as any,
            UnitsQuantity: lastTransactionLine[0].UnitsQuantity,
        },
    };

    //This might be needed later but for now ill use the same schema every test
    // const createNewSchema = await adalService.postSchema({ Name: schemaName });
    // console.log({ createNewSchema: createNewSchema });
    await adalService.postDataToSchema(PepperiOwnerID, schemaName, insertedObject);
    return {
        'PNS Insertion Logged': {
            'Pepperi Owner ID': PepperiOwnerID,
            'Schema Name': schemaName,
            'Inserted Object': insertedObject,
        },
    };
}
