import { PapiClient } from '@pepperi-addons/papi-sdk';
import fetch from 'node-fetch';

export class ElasticSearchService {
    constructor(public papiClient: PapiClient) { }

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

    getTotals(type, agg) {
        return this.papiClient.post('/elasticsearch/totals/' + type + agg);
    }

    whereClause(fields, clause) {
        return this.papiClient.post('/elasticsearch/all_activities?fields=' + fields + '&where=' + clause);
    }

    postUpdateData(terms, field, update) {
        const updateData = {
            query: { bool: { must: { terms: terms } } },
            script: { source: `ctx._source[${field}]${update}` }
        };
        return this.papiClient.post('/elasticsearch/update/all_activities', updateData);
    }

    postSearchData(search, size, sort?) {
        let searchData
        switch (sort) {
            case undefined:
                searchData = {
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
                };
                return this.papiClient.post('/elasticsearch/search/all_activities', searchData);
                
            default:
                searchData = {
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
                    sort: [sort],
                };
                return this.papiClient.post('/elasticsearch/search/all_activities', searchData);
        }
         
    }

    clearIndex(type) {
        return this.papiClient.get('/elasticsearch/clear/' + type);
    }
}
