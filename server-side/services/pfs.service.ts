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

    postFile(file: any) {
        return this.papiClient.post('/addons/files/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe', file);
    }

    postFileNegative(file: any) {
        return this.papiClient.post('/addons/files/', file);
    }

    deleteFile(key: any) {
        return this.papiClient.post('/addons/files/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe', {
            Key: key,
            Hidden: 'true',
        });
    }

    getFile(path: string) {
        return this.papiClient.get(`/addons/files/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/${path}`);
    }

    getFilesList(path: string, options?: QueryOptions) {
        let url = `/addons/files/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe?folder=${path}`;
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

    async hardDelete(distUUID, addonUUID, fileKey) {
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
                    'X-Pepperi-SecretKey': await this.generalService.getSecretKey(
                        '00000000-0000-0000-0000-0000000f11e5',
                    ),
                },
            },
        );
    }

    async getLockTable(key) {
        return await this.generalService.fetchStatus(
            `/addons/data/00000000-0000-0000-0000-0000000f11e5/PfsLockTable?where=Key='` + key + `'`,
            {
                method: 'GET',
                headers: {
                    'X-Pepperi-OwnerID': '00000000-0000-0000-0000-0000000f11e5',
                    'X-Pepperi-SecretKey': await this.generalService.getSecretKey(
                        '00000000-0000-0000-0000-0000000f11e5',
                    ),
                },
            }).then((res) => res.Body);
    }

    async negativePOST(key) {
        return await this.generalService.fetchStatus('/addons/files/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe', {
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



    postFileFailAfterLock(file: any) {
        return this.papiClient.post('/addons/files/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe?testing_transaction=stop_after_lock', file);
    }

    postFileFailAfterS3(file: any) {
        return this.papiClient.post('/addons/files/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe?testing_transaction=stop_after_S3', file);
    }

    postFileFailAfterADAL(file: any) {
        return this.papiClient.post('/addons/files/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe?testing_transaction=stop_after_ADAL', file);
    }

    rollBack(file: any) {
        return this.papiClient.post('/addons/files/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe?testRollback=true', file);
    }

}
