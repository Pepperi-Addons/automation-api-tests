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

export class PFSService {
    papiClient: PapiClient;
    generalService: GeneralService;

    constructor(public service: GeneralService) {
        this.papiClient = service.papiClient;
        this.generalService = service;
    }

    postFile(schemaName, file: any) {
        return this.papiClient.post('/addons/pfs/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' + schemaName, file);
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
        return this.papiClient.post('/addons/pfs/', file);
    }

    deleteFile(schemaName, key: any) {
        return this.papiClient.post('/addons/pfs/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' + schemaName, {
            Key: key,
            Hidden: 'true',
        });
    }

    getFile(schemaName, path: string) {
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

    async putPresignedURL(url, body) {
        return await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'image/jpeg',
            },
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
            },
        });
    }

    postFileFailAfterLock(schemaName, file: any) {
        return this.papiClient.post(
            '/addons/pfs/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' + schemaName + '?testing_transaction=stop_after_lock',
            file,
        );
    }

    postFileFailAfterS3(schemaName, file: any) {
        return this.papiClient.post(
            '/addons/pfs/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' + schemaName + '?testing_transaction=stop_after_S3',
            file,
        );
    }

    postFileFailAfterADAL(schemaName, file: any) {
        return this.papiClient.post(
            '/addons/pfs/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' + schemaName + '?testing_transaction=stop_after_ADAL',
            file,
        );
    }

    rollBack(schemaName, file: any) {
        return this.papiClient.post(
            '/addons/pfs/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/' + schemaName + '?testRollback=true',
            file,
        );
    }
}
