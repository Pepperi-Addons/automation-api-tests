import { Browser } from '../utilities/browser';
import { Page } from './base/page';
import config from '../../config';

export class WebAppTransaction extends Page {
    table: string[][] = [];
    constructor(browser: Browser, uuid: string) {
        super(browser, `${config.baseUrl}/transactions/scope_items/${uuid}`);
    }
}
