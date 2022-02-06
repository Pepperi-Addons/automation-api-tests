import { Browser } from '../utilities/browser';
import { Page } from './base/PageBase';
import config from '../../config';

export class WebAppActivity extends Page {
    table: string[][] = [];
    protected browser: Browser;
    constructor(browser: Browser, uuid: string) {
        super(browser, `${config.baseUrl}/activities/details/${uuid}`);
        this.browser = super.browser;
    }
}
