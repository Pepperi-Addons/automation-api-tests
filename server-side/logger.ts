import { ObjectsService } from './services/objects.service';
import { Client, Request } from '@pepperi-addons/debug-server';
import GeneralService from './services/general.service';
import { ADALService } from './services/adal.service';
import { v4 as uuidv4 } from 'uuid';

export async function insert_pns(client: Client): Promise<any> {
    return insertLog(client, 'Insert');
}

export async function update_pns(client: Client): Promise<any> {
    return insertLog(client, 'Update');
}

export async function index_test_string(client: Client, request: Request): Promise<any> {
    return indexLog(client, request, 'TSATestIndexString');
}

export async function index_test_time(client: Client, request: Request): Promise<any> {
    return indexLog(client, request, 'TSATestIndexTime');
}

export async function index_test_calculated(client: Client, request: Request): Promise<any> {
    return indexLog(client, request, 'TSATestIndexCalculated');
}

export async function index_test_check_box(client: Client, request: Request): Promise<any> {
    return indexLog(client, request, 'TSATestIndexAttachment');
}

export async function index_test_attachment(client: Client, request: Request): Promise<any> {
    return indexLog(client, request, 'TSATestIndexCheckbox');
}

export async function index_test_number(client: Client, request: Request): Promise<any> {
    return indexLog(client, request, 'TSATestIndexNumber');
}

export async function index_test_decimal_number(client: Client, request: Request): Promise<any> {
    return indexLog(client, request, 'TSATestIndexDecimalNumber');
}

async function insertLog(client: Client, type: string) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    const schemaName = 'PNS Test';
    const logUUID = uuidv4().replace(/-/g, '_');
    const lastTransactionLine = await objectsService.getTransactionLines({
        include_deleted: true,
        page_size: 1,
        order_by: 'ModificationDateTime DESC',
    });

    const insertedObject = {
        Key: `Log_${type}_Transaction_${generalService.getServer()}_${logUUID}`,
        TransactioInfo: {
            ModificationDateTime: lastTransactionLine[0].ModificationDateTime,
            InternalID: lastTransactionLine[0].InternalID,
            Hidden: lastTransactionLine[0].Hidden,
            ItemData: lastTransactionLine[0].Item?.Data,
            UnitsQuantity: lastTransactionLine[0].UnitsQuantity,
        },
    };
    return sendResponse(client, schemaName, insertedObject);
}

async function indexLog(client: Client, request: Request, type: string) {
    const generalService = new GeneralService(client);
    const schemaName = 'Index Logs';
    const logUUID = uuidv4().replace(/-/g, '_');
    const insertedObject = {
        Key: `Log_${type}_PNS_Message_${generalService.getServer()}_${logUUID}`,
        Message: request.body,
    };
    return sendResponse(client, schemaName, insertedObject);
}

async function sendResponse(client: Client, schemaName: string, insertedObject) {
    const generalService = new GeneralService(client);
    const PepperiOwnerID = generalService.papiClient['options'].addonUUID;
    const adalService = new ADALService(generalService.papiClient);

    insertedObject.ClientInfo = {
        CurrentServerHost: client.AssetsBaseUrl,
        ServerBaseURL: client.BaseURL,
        ServerTime: `${generalService.getServer()} ${generalService.getTime()} ${generalService.getDate()}`,
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
