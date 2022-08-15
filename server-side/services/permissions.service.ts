import GeneralService from './general.service';
import { PapiClient } from '@pepperi-addons/papi-sdk';

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

export class PermissionsService {
    papiClient: PapiClient;
    generalService: GeneralService;

    constructor(public service: GeneralService) {
        this.papiClient = service.papiClient;
        this.generalService = service;
    }

    addQueryAndOptions(url: string, options: QueryOptions = {}) {
        const optionsArr: string[] = [];
        Object.keys(options).forEach((key) => {
            optionsArr.push(key + '=' + encodeURIComponent(options[key]));
        });
        const query = optionsArr.join('&');
        return query ? url + '?' + query : url;
    }

    createPolicy(body) {
        return this.papiClient.post('/policies', body);
    }

    createProfile(body) {
        return this.papiClient.post('/policy_profiles', body);
    }

    deletePolicy(body) {
        return this.papiClient.post('/policies', body);
    }

    deleteProfile(body) {
        return this.papiClient.post('/policy_profiles', body);
    }

    getPolicies(options?: QueryOptions) {
        let url = '/policies';
        if (options) {
            url = this.addQueryAndOptions(url, options);
        }
        return this.papiClient.get(url);
    }

    getProfiles(options?: QueryOptions) {
        let url = '/policy_profiles';
        if (options) {
            url = this.addQueryAndOptions(url, options);
        }
        return this.papiClient.get(url);
    }

    deleteUser(type, ID) {
        switch (type) {
            case 'UUID':
                return this.papiClient
                    .delete('/users/uuid/' + ID)
                    .then((res) => res.text())
                    .then((res) => (res ? JSON.parse(res) : ''));
            case 'ExternalID':
                return this.papiClient
                    .delete('/users/externalid/' + ID)
                    .then((res) => res.text())
                    .then((res) => (res ? JSON.parse(res) : ''));
            case 'InternalID':
                return this.papiClient
                    .delete('/users/' + ID)
                    .then((res) => res.text())
                    .then((res) => (res ? JSON.parse(res) : ''));
        }
    }
}
