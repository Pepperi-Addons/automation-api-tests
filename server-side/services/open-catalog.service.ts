import { PapiClient } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

const apiCallsInterval = 400;

export class OpenCatalogService {
    papiClient: PapiClient;
    generalService: GeneralService;

    constructor(public service: GeneralService) {
        this.papiClient = service.papiClient;
        this.generalService = service;
    }

    async getOpenCatalogToken() {
        const idpBaseURL = await this.generalService.getClientData('IdpURL');
        const openCatalogSettings = await this.papiClient.get(
            '/addons/data/00000000-0000-0000-0000-00000ca7a109/OpenCatalogSettings',
        );
        const openCatalogToken = await this.generalService
            .fetchStatus(idpBaseURL + '/api/AddonUserToken?key=' + openCatalogSettings[0].AccessKey, {
                method: 'GET',
            })
            .then((res) => res.Body);
        return openCatalogToken.access_token;
    }

    async getOpenCatalogItems(parameters) {
        const openCatalogItems = await this.generalService
            .fetchStatus(this.papiClient['options'].baseURL + '/open_catalog/items' + parameters, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + (await this.getOpenCatalogToken()),
                },
            })
            .then((res) => res.Body);
        return openCatalogItems;
    }

    async getOpenCatalogSingleItem(itemUUID) {
        const openCatalogItem = await this.generalService
            .fetchStatus(this.papiClient['options'].baseURL + '/open_catalog/items/' + itemUUID, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + (await this.getOpenCatalogToken()),
                },
            })
            .then((res) => res.Body);
        return openCatalogItem;
    }

    async getOpenCatalogConfigurationsURL() {
        const configurationsURL = await this.generalService
            .fetchStatus(this.papiClient['options'].baseURL + '/open_catalog/configurations', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + (await this.getOpenCatalogToken()),
                },
            })
            .then((res) => res.Body);
        return configurationsURL;
    }

    async getOpenCatalogConfigurations(URL) {
        const configurations = await this.generalService
            .fetchStatus(URL, {
                method: 'GET',
            })
            .then((res) => res.Body);
        return configurations;
    }

    async getDataViews(view) {
        const dataView = await this.papiClient.get(
            "/meta_data/data_views?where=Context.Object.InternalID=304550 and Context.Name='" + view + "'",
        );
        return dataView;
    }

    async postDataView(body) {
        const dataView = await this.papiClient.post('/meta_data/data_views', body);
        return dataView;
    }

    async getAuditLog(UUID) {
        return this.papiClient.get('/audit_logs/' + UUID);
    }

    async getAdalLog(UUID) {
        return this.papiClient.get('/addons/data/00000000-0000-0000-0000-00000ca7a109/OpenCatalogData/' + UUID);
    }

    async publishOpenCatalog(body) {
        const publishOpenCatalog = await this.papiClient.post(
            '/addons/api/async/00000000-0000-0000-0000-00000ca7a109/settings/publishOpenCatalog',
            body,
        );
        const auditLogStatus = await this.waitForAuditLogStatus(publishOpenCatalog.ExecutionUUID, 200000);
        const ElasticSearchSubTypeObject = JSON.parse(auditLogStatus.AuditInfo.ResultObject);
        const adalLogStatus = await this.waitForAdalLogStatus(ElasticSearchSubTypeObject.ElasticSearchSubType, 200000);
        return adalLogStatus;
    }

    async waitForAuditLogStatus(ID: number, maxTime: number) {
        const maxLoops = maxTime / (apiCallsInterval * 10);
        let counter = 0;
        let apiGetResponse;
        do {
            if (apiGetResponse != undefined) {
                this.generalService.sleep(apiCallsInterval * 10);
            }
            counter++;
            apiGetResponse = await this.getAuditLog(ID);
        } while (
            (apiGetResponse.Status.Name == 'New' || apiGetResponse.Status.Name == 'InProgress') &&
            counter < maxLoops
        );
        this.generalService.sleep(apiCallsInterval * 10);
        apiGetResponse = await this.getAuditLog(ID);
        return apiGetResponse;
    }

    async waitForAdalLogStatus(ID: number, maxTime: number) {
        const maxLoops = maxTime / (apiCallsInterval * 10);
        let counter = 0;
        let apiGetResponse;
        do {
            if (apiGetResponse != undefined) {
                this.generalService.sleep(apiCallsInterval * 10);
            }
            counter++;
            apiGetResponse = await this.getAdalLog(ID);
        } while ((apiGetResponse.Status != 'Done' || !apiGetResponse.Status.includes('Failed')) && counter < maxLoops);
        this.generalService.sleep(apiCallsInterval * 10);
        apiGetResponse = await this.getAdalLog(ID);
        return apiGetResponse;
    }

    async getOpenCatalogFilters(parameters) {
        const openCatalogFilters = await this.generalService
            .fetchStatus(this.papiClient['options'].baseURL + '/open_catalog/filters' + parameters, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + (await this.getOpenCatalogToken()),
                },
            })
            .then((res) => res.Body);
        return openCatalogFilters;
    }

    getItems(parameters?) {
        if (parameters) return this.papiClient.get('/items' + parameters);
        else return this.papiClient.get('/items');
    }
}
