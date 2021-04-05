import { PapiClient } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';
import fetch from 'node-fetch';

declare type NucleusCrudYype = 'stop_after_redis' | 'stop_after_db' | 'stop_after_nucleus' | null;
declare type PutDataSubTypeHeaders =
    | 'CreationDateTime'
    | 'DeliveryDate'
    | 'Hidden'
    | 'IsDuplicated'
    | 'IsFixedDiscount'
    | 'IsFixedUnitPriceAfterDiscount'
    | 'ItemExternalID'
    | 'ItemWrntyID'
    | 'LineNumber'
    | 'PortfolioItemTSAttributes'
    | 'ReadOnly'
    | 'Remark4'
    | 'SpecialOfferLeadingOrderPortfolioItemUUID'
    | 'SuppressedSpecialOffer'
    | 'TSAttributes'
    | 'TransactionUUID'
    | 'UUID'
    | 'UnitDiscountPercentage'
    | 'UnitFinalPrice'
    | 'UnitPrice'
    | 'UnitPriceAfterDiscount'
    | 'UnitsQuantity'
    | 'WrntyID';
// | 'ObjectPutUUID';

export interface PutData {
    putData: {
        [key: number]: {
            SubType: string;
            Headers: PutDataSubTypeHeaders[];
            Lines: string[][];
        };
    };
    nucleus_crud_type?: NucleusCrudYype;
}
export class PepperiNotificationServiceService {
    papiClient: PapiClient;
    Authorization: string;

    constructor(public generalService: GeneralService) {
        this.papiClient = generalService.papiClient;
        //console.log({ Authorization: 'Bearer ' + generalService['client'].OAuthAccessToken });
        this.Authorization = 'Bearer ' + generalService['client'].OAuthAccessToken;
    }

    putSync(putData: PutData, PutID: number) {
        return fetch(`https://papi.staging.pepperi.com/V1.0/wacd/PutSync/${PutID}`, {
            method: `POST`,
            headers: {
                Authorization: this.Authorization,
                DeviceID: 'Oren_Test',
            },
            body: JSON.stringify(putData),
        })
            .then((res) => {
                console.log(res.url);
                return res.text();
            })
            .then((obj) => {
                console.log(obj ? JSON.parse(obj) : '');
                return obj ? JSON.parse(obj) : '';
            });
    }
}
