import { By } from 'selenium-webdriver';
import { Browser } from '../../utilities/browser';
import { WebAppHeader } from '../WebAppHeader';
import { Page } from './Page';

export abstract class WebAppPage extends Page {
    public static LoadingSpinner: By = By.css('#loadingSpinnerModal');
    public Header: WebAppHeader;
    /**
     *
     */
    constructor(browser: Browser, url: string) {
        super(browser, url);
        this.Header = new WebAppHeader(browser);
    }
}
