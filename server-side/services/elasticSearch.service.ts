import { PapiClient } from '@pepperi-addons/papi-sdk';
import fetch from 'node-fetch';

export class ElasticSearchService {
    constructor(public papiClient: PapiClient) {}

    async uploadTempFile(body: any) {
        const tempFileURLs = await this.papiClient.post('/file_storage/tmp');
        const tempFileResult = await fetch(tempFileURLs.UploadURL, {
            method: 'PUT',
            body: JSON.stringify(body),
        }).then((response) => {
            if (response.ok) {
                return tempFileURLs.DownloadURL;
            } else {
                return 'temp file upload failed ' + response.status;
            }
        });
        return tempFileResult;
    }

    postBulkData(type, body) {
        return this.papiClient.post('/elasticsearch/bulk/' + type, body);
    }

    postDeleteData(type, body) {
        const deleteData = { query: { bool: { must: { match: body } } } };
        return this.papiClient.post('/elasticsearch/delete/' + type, deleteData);
    }

    postSearchData(search, size) {
        const searchData = {
            size: size,
            from: 0,
            track_total_hits: true,
            query: {
                bool: {
                    must: [
                        {
                            match: search,
                        },
                    ],
                },
            },
            sort: [{ Sort: { order: 'asc' } }],
        };
        return this.papiClient.post('/elasticsearch/search/open_catalog', searchData);
    }

    //Stop using this, you have this:
    //generalService.getClientData('DistributorUUID')
    //it have options in it for your selection
    // getDistUUID() {
    //     const token = this.papiClient['options'].token;
    //     const decodedToken = jwt_decode(token);
    //     return decodedToken['pepperi.distributoruuid'];
    // }
}
