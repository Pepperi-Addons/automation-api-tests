import { Browser } from '../../utilities/browser';
import { By } from 'selenium-webdriver';
import { Page } from './base/Page';

export class IpaasClientTaskPage extends Page {
    constructor(browser: Browser) {
        super(browser, 'https://integration.pepperi.com/mgr/PluginSettings/ClientTask?TaskId=97043');
    }

}
