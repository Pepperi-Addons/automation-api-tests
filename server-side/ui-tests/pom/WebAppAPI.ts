import { Browser } from '../utilities/browser';
import { Page } from './Pages/base/Page';
import config from '../../config';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';

export class WebAppAPI extends Page {
    table: string[][] = [];
    _CLIENT: Client;
    _BASE_URL: string;
    constructor(protected browser: Browser, client: Client) {
        super(browser, `${config.baseUrl}`);
        this._CLIENT = client;
        this._BASE_URL = '';
    }

    async getSyncResponse(accessToken: string, loopsAmount = 30) {
        const generalService = new GeneralService(this._CLIENT);
        let syncStatusReposnse;
        const URL = `${await this.getBaseURL()}/Service1.svc/v1/GetSyncStatus`;
        do {
            syncStatusReposnse = await generalService.fetchStatus(URL, {
                method: 'GET',
                headers: {
                    PepperiSessionToken: accessToken,
                    'Content-Type': 'application/json',
                },
            });
            //This case is used when syncStatus was not created at all
            syncStatusReposnse = syncStatusReposnse.Body;
            if (syncStatusReposnse === null) {
                this.browser.sleep(5000);
                console.log('Sync status not found, waiting...');
            }
            //This case will only retry the get call again as many times as the "loopsAmount"
            else if (syncStatusReposnse.Status == 'Processing') {
                await this.browser.sleep(5000);
                console.log(`Processing: Retry ${loopsAmount} Times.`);
            }
            loopsAmount--;
        } while ((syncStatusReposnse === null || syncStatusReposnse.Status == 'Processing') && loopsAmount > 0);
        return syncStatusReposnse;
    }

    async initSync(accessToken: string) {
        const generalService = new GeneralService(this._CLIENT);
        //webapi.sandbox.pepperi.com/16.60.82/webapi/Service1.svc/v1/HomePage
        const URL = `${this._BASE_URL === '' ? await this.getBaseURL() : this._BASE_URL}/Service1.svc/v1/HomePage`;
        const navigateToHomescreen = await generalService.fetchStatus(URL, {
            method: 'GET',
            headers: {
                PepperiSessionToken: accessToken,
                'Content-Type': 'application/json',
            },
        });
        return navigateToHomescreen;
    }

    /**
     * Create Access Token and set the version of the WebAppAPI by the installed WebAppAPI version
     * @returns AccessToken: string
     */
    public async getAccessToken(): Promise<string> {
        const generalService = new GeneralService(this._CLIENT);
        let createSessionResponse;
        let maxLoopsCounter = 90;
        do {
            generalService.sleep(2000);
            const URL = `${
                this._BASE_URL === '' ? await this.getBaseURL() : this._BASE_URL
            }/Service1.svc/v1/CreateSession`;
            createSessionResponse = await generalService.fetchStatus(URL, {
                method: 'POST',
                body: JSON.stringify({
                    accessToken: this._CLIENT.OAuthAccessToken,
                    culture: 'en-US',
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            maxLoopsCounter--;
        } while (createSessionResponse.Body == null && maxLoopsCounter > 0);
        return createSessionResponse.Body.AccessToken;
    }

    /**
     * From this response the correct UI of the cart is created in the WebApp
     * @param accessToken
     * @param catalogUUID
     * @returns
     */
    public async getCartItemSearch(accessToken: string, catalogUUID: string) {
        const generalService = new GeneralService(this._CLIENT);
        let searchResponse;
        let maxLoopsCounter = 90;
        do {
            generalService.sleep(2000);
            const URL = `${
                this._BASE_URL === '' ? await this.getBaseURL() : this._BASE_URL
            }/Service1.svc/v1/Cart/Transaction/${catalogUUID}/Items/Search`;
            searchResponse = await generalService.fetchStatus(URL, {
                method: 'POST',
                body: JSON.stringify({
                    CatalogUID: catalogUUID,
                    Top: 100,
                    ViewType: 'OrderCartGrid',
                    OrderBy: '',
                    Ascending: true,
                    SearchText: '',
                    SmartSearch: [],
                }),
                headers: {
                    'Content-Type': 'application/json',
                    PepperiSessionToken: accessToken,
                },
            });
            maxLoopsCounter--;
        } while (searchResponse.Ok == null && maxLoopsCounter > 0);
        return searchResponse.Body;
    }

    /**
     * From this response the correct UI of the cart is created in the WebApp
     * @param accessToken
     * @param catalogUUID
     * @returns
     */
    public async getCart(accessToken: string, catalogUUID: string) {
        const generalService = new GeneralService(this._CLIENT);
        let searchResponse;
        let maxLoopsCounter = 60;
        const URL = `${
            this._BASE_URL === '' ? await this.getBaseURL() : this._BASE_URL
        }/Service1.svc/v1/Cart/Transaction/${catalogUUID}`;
        do {
            generalService.sleep(2000);
            searchResponse = await generalService.fetchStatus(URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    PepperiSessionToken: accessToken,
                },
            });
            maxLoopsCounter--;
        } while (searchResponse.Ok == null && maxLoopsCounter > 0);
        return searchResponse.Body;
    }

    public async getBaseURL() {
        const generalService = new GeneralService(this._CLIENT);
        console.log("performing GET call to 'base_url' to recive correct URL to use as base in all API calls");
        this._BASE_URL = await (await generalService.papiClient.get('/webapi/base_url')).BaseURL;
        // //06/04/2022: after we talked with benny: the wrapper knows by itself whether we work with EU or prod so we can ALWAYS call the prod
        // this._BASE_URL = this._BASE_URL.replace('euwebapi', 'webapi');
        return this._BASE_URL;
    }
}
