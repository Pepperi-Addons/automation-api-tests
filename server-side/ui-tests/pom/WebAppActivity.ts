import { Browser } from '../utilities/browser';
import { Page } from './base/page.base';
import config from '../../config';

export class WebAppActivity extends Page {
    table: string[][] = [];
    constructor(browser: Browser, uuid: string) {
        super(browser, `${config.baseUrl}/activities/details/${uuid}`);
    }
}
