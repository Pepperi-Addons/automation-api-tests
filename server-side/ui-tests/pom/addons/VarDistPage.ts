import { expect } from 'chai';
import { Actions, By, Key, WebElement } from 'selenium-webdriver';
import { AddonPage } from './base/AddonPage';
import { WebAppDialog, WebAppHeader, WebAppHomePage, WebAppList, WebAppSettingsSidePanel, WebAppTopBar } from '..';
import { OrderPage } from '../Pages/OrderPage';
import { AddonLoadCondition } from './base/AddonPage';
import { ObjectTypeEditor } from './ObjectTypeEditor';
import { Browser } from '../../utilities/browser';
import { VarList } from '../VarList';
import { PepSearch } from '../Components/PepSearch';

export class VarDistPage extends AddonPage {
    public list: VarList;
    public search: PepSearch;
    // public topBar: VarTopBar;
    constructor(protected browser: Browser) {
        super(browser);
        this.list = new VarList(browser);
        this.search = new PepSearch(browser);
        this.search.SearchContainer = By.xpath("//div[@id='searchContainer']");
    }

    //dist list
    public readonly certainDistEditBtn: By = By.xpath(`//i[@class='fa fa-pencil']`);
    //dist editor
    public readonly distributorDetailsTitle: By = By.xpath(`//*[contains(text(),'Distributor details')]`);
    public readonly supportBtn: By = By.css(`#btnBackEndArea`);
    //support editor
    public readonly supportTitle: By = By.xpath(`//*[contains(text(),'Hello People!')]`);
    public readonly nucMachineText: By = By.css(`#machine`);
    public readonly recycleNucBtn: By = By.css(`#btnRecycle`);


    public async editPresentedDist(): Promise<boolean> {
        this.browser.sleep(1000);
        await this.browser.click(By.xpath("(//div[@class='ui-grid-canvas']//div[@class='ui-grid-row ng-scope'])[2]"));
        this.browser.sleep(1000);
        await this.browser.click(this.certainDistEditBtn);
        this.browser.sleep(1000);
        // await this.browser.switchTo(this.AddonContainerIframe);
        return (await this.untilIsVisible(this.distributorDetailsTitle, 40000));
    }

    public async enterSupportSettings(): Promise<boolean> {
        await this.browser.click(this.supportBtn);
        return (await this.untilIsVisible(this.supportTitle, 40000));
    }

    // public async getNucMachine(): Promise<string> {
    //     return (await (await this.browser.findElement(this.nucMachineText)).getText());
    // }

    public async recycleNuc() {
        await this.browser.click(this.recycleNucBtn);
    }


}
