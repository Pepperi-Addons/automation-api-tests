import { Browser } from '../utilities/browser';
import { WebAppHeader } from './WebAppHeader';
import { WebAppLoginPage } from './WebAppLoginPage';
import { WebAppHomePage } from './WebAppHomePage';
import { WebAppList } from './WebAppList';
import { WebAppTopBar } from './WebAppTopBar';
import { WebAppDialog } from './WebAppDialog';

export { WebAppLoginPage, WebAppHeader, WebAppHomePage, WebAppList, WebAppTopBar, WebAppDialog };

export class AllPages {
    public webAppLoginPage: WebAppLoginPage;
    public webAppHomePage: WebAppHomePage;
    public webAppHeader: WebAppHeader;
    public webAppList: WebAppList;
    public webAppTopBar: WebAppTopBar;
    public webAppDialog: WebAppDialog;

    constructor(public browser: Browser) {
        this.webAppLoginPage = new WebAppLoginPage(browser);
        this.webAppHeader = new WebAppHeader(browser);
        this.webAppHomePage = new WebAppHomePage(browser);
        this.webAppList = new WebAppList(browser);
        this.webAppTopBar = new WebAppTopBar(browser);
        this.webAppDialog = new WebAppDialog(browser);
    }
}
