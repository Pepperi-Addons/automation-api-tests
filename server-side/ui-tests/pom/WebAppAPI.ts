import { Browser } from '../utilities/browser';
import { Page } from './base/PageBase';
import config from '../../config';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';

export class WebAppAPI extends Page {
    table: string[][] = [];
    _CLIENT: Client;
    _BASE_URL: string;
    protected browser: Browser;
    constructor(browser: Browser, client: Client) {
        super(browser, `${config.baseUrl}`);
        this.browser = super.browser;
        this._CLIENT = client;
        this._BASE_URL = '';
    }

    async getSyncResponse(accessToken: string, loopsAmount = 30) {
        const generalService = new GeneralService(this._CLIENT);
        let syncStatusReposnse;
        const url = `${this._BASE_URL === '' ? await this.getBaseURL() : this._BASE_URL}/Service1.svc/v1/GetSyncStatus`;
        do {
            syncStatusReposnse = await generalService.fetchStatus(url, {
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
                console.log(`UpToDate: Retry ${loopsAmount} Times.`);
            }
            loopsAmount--;
        } while ((syncStatusReposnse === null || syncStatusReposnse.Status == 'Processing') && loopsAmount > 0);
        return syncStatusReposnse;
    }

    async initSync(accessToken: string) {
        //webapi.sandbox.pepperi.com/16.60.82/webapi/Service1.svc/v1/HomePage
        const URL = `${this._BASE_URL === '' ? await this.getBaseURL() : this._BASE_URL}/Service1.svc/v1/HomePage`;
        const navigateToHomescreen = await (
            await fetch(URL, {
                method: 'GET',
                headers: {
                    PepperiSessionToken: accessToken,
                    'Content-Type': 'application/json',
                },
            })
        ).json();
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
            createSessionResponse = await generalService.fetchStatus(
                `${this._BASE_URL === '' ? await this.getBaseURL() : this._BASE_URL}/Service1.svc/v1/CreateSession`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        accessToken: this._CLIENT.OAuthAccessToken,
                        culture: 'en-US',
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
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
            searchResponse = await generalService.fetchStatus(
                `${
                    this._BASE_URL === '' ? await this.getBaseURL() : this._BASE_URL
                }/Service1.svc/v1/Cart/Transaction/${catalogUUID}/Items/Search`,
                {
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
                },
            );
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
        let maxLoopsCounter = 90;
        do {
            generalService.sleep(2000);
            searchResponse = await generalService.fetchStatus(
                `${
                    this._BASE_URL === '' ? await this.getBaseURL() : this._BASE_URL
                }/Service1.svc/v1/Cart/Transaction/${catalogUUID}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        PepperiSessionToken: accessToken,
                    },
                },
            );
            maxLoopsCounter--;
        } while (searchResponse.Ok == null && maxLoopsCounter > 0);
        return searchResponse.Body;
    }

    public async getBaseURL() {
        const generalService = new GeneralService(this._CLIENT);
        this._BASE_URL = await (await generalService.papiClient.get('/webapi/base_url')).BaseURL;
        return this._BASE_URL;
    }
}
