import { PapiClient } from '@pepperi-addons/papi-sdk';
import fetch from 'node-fetch';
import GeneralService from './general.service';

interface QueryOptions {
    select?: string[];
    group_by?: string;
    fields?: string[];
    where?: string;
    order_by?: string;
    page?: number;
    page_size?: number;
    include_nested?: boolean;
    full_mode?: boolean;
    include_deleted?: boolean;
    is_distinct?: boolean;
}

const indexingHeader = { 'x-pepperi-await-indexing': true };

export class PFSService {
    papiClient: PapiClient;
    generalService: GeneralService;

    constructor(public service: GeneralService) {
        this.papiClient = service.papiClient;
        this.generalService = service;
    }

    postFile(schemaName, file: any) {
        return this.papiClient.post(
            '/addons/pfs/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' + schemaName,
            file,
            indexingHeader,
        );
    }

    async createTempCSVFileFromArrayOfObjects(arrayOfObjects: Record<string, unknown>[]) {
        //HOW TO USE:[Hagit]
        //const pfsService = new PFSService(generalService); // create PFS Service
        //const linkToCSV = await pfsService.createTempCSVFileFromArrayOfObjects(array); // call createTempCSVFileFromArrayOfObjects function which will return link to PFS Temp File
        //1. create CSV textual object using the JSON & create a buffer out of the textual value
        const csvTextualObject = this.generalService.convertArrayOfObjectsToPFSTempFile(arrayOfObjects);
        const buf1 = Buffer.from(csvTextualObject, 'utf-8');
        //2. create temp PFS file
        const fileName = 'TempFile' + this.generalService.generateRandomString(8) + '.csv';
        const mime = 'text/csv';
        const tempFileResponse = await this.postTempFile({
            FileName: fileName,
            MIME: mime,
        });
        //2.1. validate it was created successfully
        if (!tempFileResponse.PutURL) {
            throw new Error(`Error: Creating PFS Temp File Failed - No Put URL - Response:${tempFileResponse}`);
        }
        if (!tempFileResponse.TemporaryFileURL) {
            throw new Error(
                `Error: Creating PFS Temp File Failed - No Temporary File URL - Response:${tempFileResponse}`,
            );
        }
        if (!tempFileResponse.TemporaryFileURL.includes('pfs.')) {
            throw new Error(
                `Error: Creating PFS Temp File Failed - Temporary File URL is Broken - Response:${tempFileResponse}`,
            );
        }
        //3. PUT the file to newly created PFS temp file
        const putResponsePart1 = await this.putPresignedURL(tempFileResponse.PutURL, buf1);
        //3. validate PUT was successfull
        if (putResponsePart1.ok !== true) {
            throw new Error(
                `Error: PUT Data To Temp File URL - ${tempFileResponse.PutURL}, Failed, OK: FALSE, Response:${putResponsePart1}`,
            );
        }
        if (putResponsePart1.status !== 200) {
            throw new Error(
                `Error: PUT Data To Temp File URL - ${tempFileResponse.PutURL}, Failed, Status IS NOT 200, Response:${putResponsePart1}`,
            );
        }
        console.log(`CSV File Created In: ${tempFileResponse.TemporaryFileURL}`);
        return tempFileResponse.TemporaryFileURL;
    }

    postTempFile(body) {
        return this.papiClient.post(
            '/addons/api/00000000-0000-0000-0000-0000000f11e5/api/temporary_file',
            body,
            indexingHeader,
        );
    }

    invalidate(schemaName, key) {
        return this.papiClient.post(
            '/addons/pfs/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' + schemaName + '/' + key + '/invalidate',
        );
    }

    postFileSDK(schemaName, file: any) {
        return this.papiClient.addons.pfs.uuid('eb26afcd-3cf2-482e-9ab1-b53c41a6adbe').schema(schemaName).post(file);
    }

    postFileNegative(file: any) {
        return this.papiClient.post('/addons/pfs/', file, indexingHeader);
    }

    deleteFile(schemaName, key: any) {
        return this.papiClient.post(
            '/addons/pfs/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' + schemaName,
            {
                Key: key,
                Hidden: 'true',
            },
            indexingHeader,
        );
    }

    getFile(schemaName, path: string) {
        // this.generalService.sleep(1000);
        return this.papiClient.get(`/addons/pfs/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/${schemaName}/${path}`);
    }

    getFileSDK(schemaName, path: string) {
        return this.papiClient.addons.pfs
            .uuid('eb26afcd-3cf2-482e-9ab1-b53c41a6adbe')
            .schema(schemaName)
            .key(path)
            .get();
    }

    getFilesList(schemaName, path: string, options?: QueryOptions) {
        let url = `/addons/pfs/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/${schemaName}?folder=${path}`;
        if (options) {
            url = this.addQueryAndOptions(url, options);
        }
        return this.papiClient.get(url);
    }

    getDistributor() {
        return this.papiClient.get(`/distributor`);
    }

    addQueryAndOptions(url: string, options: QueryOptions = {}) {
        const optionsArr: string[] = [];
        Object.keys(options).forEach((key) => {
            optionsArr.push(key + '=' + encodeURIComponent(options[key]));
        });
        const query = optionsArr.join('&');
        return query ? url + '&' + query : url;
    }

    async getFileFromURL(url) {
        const response = await fetch(url, { method: `GET` });
        const arrayData = await response.arrayBuffer();
        const buf = Buffer.from(arrayData);
        return buf;
    }

    async getFileFromURLNoBuffer(url) {
        const response = await this.generalService.fetchStatus(url, { method: `GET` });
        return response;
    }

    async putPresignedURL(url, body, ContentType?) {
        return await fetch(url, {
            method: 'PUT',
            ...(ContentType && {
                headers: {
                    'Content-Type': ContentType,
                },
            }),
            body: body,
        });
    }

    async getFileAfterDelete(url) {
        return await this.generalService
            .fetchStatus(url, {
                method: 'GET',
            })
            .then((res) => res.Body);
    }

    async getPFSSchema(pfsSchemaName) {
        return await this.generalService.fetchStatus('/addons/data/schemes/' + pfsSchemaName, {
            method: 'GET',
            headers: {
                'X-Pepperi-OwnerID': '00000000-0000-0000-0000-0000000f11e5',
            },
        });
    }

    async hardDelete(distUUID, addonUUID, addonSecretKey, fileKey) {
        return await this.generalService.fetchStatus(
            '/addons/api/00000000-0000-0000-0000-00000000ada1/api/hard_delete?addon_uuid=00000000-0000-0000-0000-0000000f11e5&table=S3ObjectsMetadata&key=' +
                distUUID +
                '/' +
                addonUUID +
                '/' +
                fileKey,
            {
                method: 'POST',
                body: JSON.stringify({ Force: true }),
                headers: {
                    'X-Pepperi-OwnerID': '00000000-0000-0000-0000-0000000f11e5',
                    'X-Pepperi-SecretKey': addonSecretKey,
                },
            },
        );
    }

    async getLockTable(key, addonSecretKey) {
        return await this.generalService
            .fetchStatus(`/addons/data/00000000-0000-0000-0000-0000000f11e5/PfsLockTable?where=Key='` + key + `'`, {
                method: 'GET',
                headers: {
                    'X-Pepperi-OwnerID': '00000000-0000-0000-0000-0000000f11e5',
                    'X-Pepperi-SecretKey': addonSecretKey,
                },
            })
            .then((res) => res.Body);
    }

    async negativePOST(schemaName, key) {
        return await this.generalService.fetchStatus('/addons/pfs/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' + schemaName, {
            method: 'POST',
            body: JSON.stringify({
                Key: 'ListFolder42319/',
                URI: 'data:file/plain;base64,VGhpcyBpcyBteSBzaW1wbGUgdGV4dCBmaWxlLiBJdCBoYXMgdmVyeSBsaXR0bGUgaW5mb3JtYXRpb24u',
                MIME: 'image/jpeg',
            }),
            headers: {
                'X-Pepperi-OwnerID': '00000000-0000-0000-0000-0000000f11e5',
                'X-Pepperi-SecretKey': key,
                'x-pepperi-await-indexing': 'true',
            },
        });
    }

    postFileFailAfterLock(schemaName, file: any) {
        return this.papiClient.post(
            '/addons/pfs/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' + schemaName + '?testing_transaction=stop_after_lock',
            file,
            indexingHeader,
        );
    }

    postFileFailAfterS3(schemaName, file: any) {
        return this.papiClient.post(
            '/addons/pfs/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' + schemaName + '?testing_transaction=stop_after_S3',
            file,
            indexingHeader,
        );
    }

    postFileFailAfterADAL(schemaName, file: any) {
        return this.papiClient.post(
            '/addons/pfs/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' + schemaName + '?testing_transaction=stop_after_ADAL',
            file,
            indexingHeader,
        );
    }

    rollBack(schemaName, file: any) {
        return this.papiClient.post(
            '/addons/pfs/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' + schemaName + '?testRollback=true',
            file,
            indexingHeader,
        );
    }
}
