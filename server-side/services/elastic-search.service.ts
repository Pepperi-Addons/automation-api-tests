import { PapiClient } from '@pepperi-addons/papi-sdk';
import fetch from 'node-fetch';

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

function addQueryAndOptions(url: string, options: QueryOptions = {}) {
    const optionsArr: string[] = [];
    Object.keys(options).forEach((key) => {
        optionsArr.push(key + '=' + encodeURIComponent(options[key]));
    });
    const query = optionsArr.join('&');
    return query ? url + '?' + query : url;
}

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

    getTotals(type, options: QueryOptions = {}) {
        let url = `/elasticsearch/totals/${type}`;
        url = addQueryAndOptions(url, options);
        return this.papiClient.get(url);
    }

    getElasticSearch(type, options: QueryOptions = {}) {
        let url = `/elasticsearch/${type}`;
        url = addQueryAndOptions(url, options);
        return this.papiClient.get(url);
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
}
