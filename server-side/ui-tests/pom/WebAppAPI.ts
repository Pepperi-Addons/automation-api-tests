import { Browser } from '../utilities/browser';
import { Page } from './base/page';
import config from '../../config';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';

export class WebAppAPI extends Page {
    table: string[][] = [];
    _CLIENT: Client;
    _IS_STAGE: boolean;
    webAPIVersionVersion = '0.0.0';
    constructor(browser: Browser, client: Client) {
        super(browser, `${config.baseUrl}`);
        this._CLIENT = client;
        this._IS_STAGE = client.BaseURL.includes('staging');
    }

    /**
     * Create Access Token and set the version of the WebAppAPI by the installed WebAppAPI version
     * @returns AccessToken: string
     */
    public async getAccessToken(): Promise<string> {
        const generalService = new GeneralService(this._CLIENT);
        const webAPIVersion = await generalService.getAddonsByUUID('00000000-0000-0000-0000-0000003eba91');
        this.webAPIVersionVersion = webAPIVersion.Version as string;
        let createSessionResponse;
        let maxLoopsCounter = 90;
        do {
            generalService.sleep(2000);
            createSessionResponse = await generalService.fetchStatus(
                `https://webapi${this._IS_STAGE ? '.sandbox.' : '.'}pepperi.com/${
                    this.webAPIVersionVersion
                }/webapi/Service1.svc/v1/CreateSession`,
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
     * @returns
     */
    public async getCartItemSearch(accessToken: string, catalogUUID: string) {
        const generalService = new GeneralService(this._CLIENT);
        let searchResponse;
        let maxLoopsCounter = 90;
        do {
            generalService.sleep(2000);
            searchResponse = await generalService.fetchStatus(
                `https://webapi${this._IS_STAGE ? '.sandbox.' : '.'}pepperi.com/${
                    this.webAPIVersionVersion
                }/webapi/Service1.svc/v1/Cart/Transaction/${catalogUUID}/Items/Search`,
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
}
