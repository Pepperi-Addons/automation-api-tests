import { PapiClient /*, FindOptions, Relation */ } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';
// import {
//     InstalledAddon,
//     AddonAPIAsyncResult,
// } from '../entities';

export class UsageMonitorService {
    papiClient: PapiClient;
    generalService: GeneralService;

    constructor(public service: GeneralService) {
        this.papiClient = service.papiClient;
        this.generalService = service;
    }

    //https://{{server}}.pepperi.com/V1.0/addons/api/00000000-0000-0000-0000-000000005A9E/api/collect_data

    // async install(version = ''): Promise<AddonAPIAsyncResult> {
    //     if (version) return await this.service.post(`/addons/installed_addons/${this.addonUUID}/install/${version}`);
    //     else return await this.service.post(`/addons/installed_addons/${this.addonUUID}/install`);
    // }

    // async uninstall(): Promise<AddonAPIAsyncResult> {
    //     return await this.service.post(`/addons/installed_addons/${this.addonUUID}/uninstall`);
    // }

    // async upgrade(version = ''): Promise<AddonAPIAsyncResult> {
    //     if (version) return await this.service.post(`/addons/installed_addons/${this.addonUUID}/upgrade/${version}`);
    //     else return await this.service.post(`/addons/installed_addons/${this.addonUUID}/upgrade`);
    // }

    // async downgrade(version: string): Promise<AddonAPIAsyncResult> {
    //     return await this.service.post(`/addons/installed_addons/${this.addonUUID}/downgrade/${version}`);
    // }

    async get(): Promise<any> {
        return await this.papiClient.get(`/addons/api/00000000-0000-0000-0000-000000005A9E/api/collect_data`);
    }
}
