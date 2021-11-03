import { Client, Request } from '@pepperi-addons/debug-server';
import GeneralService from './services/general.service';
import { ADALService } from './services/adal.service';
import { v4 as uuidv4 } from 'uuid';

export async function insert_pns(client: Client, request: Request): Promise<any> {
    return insertNUCLog(client, request, 'Insert');
}

export async function update_pns(client: Client, request: Request): Promise<any> {
    return insertNUCLog(client, request, 'Update');
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

export async function index_test_attachment(client: Client, request: Request): Promise<any> {
    return indexLog(client, request, 'TSATestIndexAttachment');
}

export async function index_test_check_box(client: Client, request: Request): Promise<any> {
    return indexLog(client, request, 'TSATestIndexCheckbox');
}

export async function index_test_number(client: Client, request: Request): Promise<any> {
    return indexLog(client, request, 'TSATestIndexNumber');
}

export async function index_test_decimal_number(client: Client, request: Request): Promise<any> {
    return indexLog(client, request, 'TSATestIndexDecimalNumber');
}

export async function insert_object_pns(client: Client, request: Request): Promise<any> {
    return insertObjectLog(client, request, 'Insert');
}

export async function update_object_pns(client: Client, request: Request): Promise<any> {
    return insertObjectLog(client, request, 'Update');
}

export async function update_pns_test(client: Client, request: Request): Promise<any> {
    return insertPNSLog(client, request, 'Update');
}

export async function sync_pns_test(client: Client, request: Request): Promise<any> {
    const generalService = new GeneralService(client);
    const PepperiOwnerID = generalService.papiClient['options'].addonUUID;
    const adalService = new ADALService(generalService.papiClient);
    const schemaName = 'PNS Sync Test';
    let logUUID = uuidv4().replace(/-/g, '_');
    await adalService.postDataToSchema(PepperiOwnerID, schemaName, {
        Key: `Log_${schemaName.replace(/ /g, '_')}_${generalService.getServer()}_${logUUID}`,
        Body: request.body,
        Path: request.path,
        Description: 'This schema update created synchronically',
    });
    generalService.sleep(40000);
    logUUID = uuidv4().replace(/-/g, '_');
    await adalService.postDataToSchema(PepperiOwnerID, schemaName, {
        Key: `Log_${schemaName.replace(/ /g, '_')}_${generalService.getServer()}_${logUUID}`,
        Body: request.body,
        Path: request.path,
        Description: 'This schema update created after 40 seconds of sleep',
    });
    return true;
}

async function insertPNSLog(client: Client, request: Request, type: string) {
    const generalService = new GeneralService(client);
    const schemaName = 'PNS Test';
    const logUUID = uuidv4().replace(/-/g, '_');
    const insertedObject = {
        Key: `Log_${type}_PNS_Test_${generalService.getServer()}_${logUUID}`,
        Message: request.body,
    };
    return sendResponse(client, schemaName, insertedObject);
}

async function insertNUCLog(client: Client, request: Request, type: string) {
    const generalService = new GeneralService(client);
    const schemaName = 'NUC Test';
    const logUUID = uuidv4().replace(/-/g, '_');
    const insertedObject = {
        Key: `Log_${type}_Transaction_Line_${generalService.getServer()}_${logUUID}`,
        Message: request.body,
    };
    return sendResponse(client, schemaName, insertedObject);
}

async function insertObjectLog(client: Client, request: Request, type: string) {
    const generalService = new GeneralService(client);
    const schemaName = 'PNS Objects Test';
    const logUUID = uuidv4().replace(/-/g, '_');
    const insertedObject = {
        Key: `Log_${type}_${generalService.getServer()}_${logUUID}`,
        Message: request.body,
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
