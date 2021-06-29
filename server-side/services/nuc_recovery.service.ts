import { PapiClient } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export declare type NucleusFlagType =
    | 'stop_after_redis'
    | 'stop_after_db'
    | 'stop_after_nucleus'
    | 'stop_after_pns'
    | null;

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
    nucleus_crud_type?: NucleusFlagType;
}
export class NucRecoveryService {
    papiClient: PapiClient;
    Authorization: string;

    constructor(public generalService: GeneralService) {
        this.papiClient = generalService.papiClient;
        //console.log({ Authorization: 'Bearer ' + generalService['client'].OAuthAccessToken });
        this.Authorization = 'Bearer ' + generalService['client'].OAuthAccessToken;
    }

    putSync(putData: PutData, PutID: number) {
        return this.generalService
            .fetchStatus(`${this.generalService['client'].BaseURL}/wacd/PutSync/${PutID}`, {
                method: `POST`,
                headers: {
                    Authorization: this.Authorization,
                    DeviceID: 'Oren_Test',
                },
                body: JSON.stringify(putData),
            })
            .then((res) => res.Body);
    }
}
