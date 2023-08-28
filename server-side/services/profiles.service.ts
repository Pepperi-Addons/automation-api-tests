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

export class ProfilesService {
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

    postProfile(body) {
        return this.papiClient.post('/profiles', body);
    }

    deleteProfile(body) {
        return this.papiClient.post('/profiles', body);
    }

    getProfiles(options?: QueryOptions) {
        let url = '/profiles';
        if (options) {
            url = this.addQueryAndOptions(url, options);
        }
        return this.papiClient.get(url);
    }

    trimDate(date){ 
        let output = date.substring(0, date.lastIndexOf('.'));
        output += 'Z';
        return output;
    }

    purgeProfiles(body){
        return this.papiClient.post('/profiles/hard_delete', body);
    }

    getAuditDataLog(){
        return this.papiClient.get(`/audit_data_logs?where=Resource.keyword=profiles&AddonUUID.keyword=00000000-0000-0000-0000-00000000c07e&page_size=1&order_by=ObjectModificationDateTime desc`);
    }

    postProfilesBatch(body){
        return this.papiClient.post('/batch/profiles', body);
    }

    create110ProfilesArray(name, parentInternalID) {
        let profilesArray:any[] = [];
        for (let index = 0; index < 110; index++) {
            profilesArray.push({
                Name: name + ' ' + [index],
                ParentInternalID: parentInternalID
            });  
        }
        return profilesArray;
    }

    postDataView(atdInternalID, profileInternalID){
        return this.papiClient.post('/meta_data/data_views',{
            Context:{
                Object:{
                    Resource: 'transactions',
                    InternalID: atdInternalID
                },
                Profile:{
                    InternalID: profileInternalID
                },
                Name: 'ProfileTestUI' + Math.floor(Math.random() * 10000000),
                ScreenSize: 'Tablet'
            },
            Type: 'Grid'
        })
    }

    getDataView(options?: QueryOptions) {
        let url = '/meta_data/data_views';
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
