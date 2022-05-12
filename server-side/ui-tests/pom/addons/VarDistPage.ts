import { By, Key } from 'selenium-webdriver';
import { AddonPage } from './base/AddonPage';
import { Browser } from '../../utilities/browser';
import { PepSearch } from '../Components/PepSearch';
import addContext from 'mochawesome/addContext';


export class VarDistPage extends AddonPage {
    public search: PepSearch;
    constructor(protected browser: Browser) {
        super(browser);
        this.search = new PepSearch(browser);
        this.search.SearchContainer = By.xpath("//div[@id='searchContainer']");
    }

    //dist list
    public readonly certainDistEditBtn: By = By.xpath(`//i[@class='fa fa-pencil']`);
    public IdRowTitle = By.xpath('//*[contains(text(),"DistributorID")]');
    //dist editor
    public readonly distributorDetailsTitle: By = By.xpath(`//*[contains(text(),'Distributor details')]`);
    public readonly supportBtn: By = By.css(`#btnBackEndArea`);
    //support editor
    public readonly supportTitle: By = By.xpath(`//*[contains(text(),'Hello People!')]`);
    public readonly nucMachineText: By = By.css(`#machine`);
    public readonly recycleNucBtn: By = By.css(`#btnRecycle`);
    public readonly recycleReasonTxtBox: By = By.css(`#logTxt`);
    public readonly recycleModalMessage: By = By.css(`#msgModalText`);
    public readonly recycleModalContinueBtn: By = By.css(`#msgModalRightBtn`);
    public readonly recycleModalCancleBtn: By = By.css(`#msgModalLeftBtn`);
    public readonly secondModalOK: By = By.css(`#msgModalLeftBtn`);
    public readonly newMachineDropDown: By = By.css(`#newMachine`);
    public readonly newEmptyMachine: By = By.xpath(`//option[contains(text(),'empty')]`);
    public readonly relocateDistBtn: By = By.css(`#btnRelocate`);

    public async editPresentedDist(): Promise<boolean> {
        this.browser.sleep(1500);
        await this.browser.click(By.xpath("(//div[@class='ui-grid-canvas']//div[@class='ui-grid-row ng-scope'])[2]"));
        this.browser.sleep(1500);
        await this.browser.click(this.certainDistEditBtn);
        this.browser.sleep(1000);
        // await this.browser.switchTo(this.AddonContainerIframe);
        return await this.untilIsVisible(this.distributorDetailsTitle, 40000);
    }

    public async enterSupportSettings(): Promise<boolean> {
        await this.browser.click(this.supportBtn);
        return await this.untilIsVisible(this.supportTitle, 40000);
    }

    public async recycleNuc(that) {
        await this.browser.sendKeys(this.recycleReasonTxtBox, `login perormance auto test setup` + Key.ENTER);
        await this.browser.click(this.recycleNucBtn);
        await this.untilIsVisible(this.recycleModalMessage, 40000);
        const preRecycleMessage = await (await this.browser.findElement(this.recycleModalMessage)).getText();
        if (preRecycleMessage !== 'there are 1 distributors on this nucleus') {
            await this.browser.click(this.recycleModalCancleBtn);
            await this.moveDistToEmptyMachine();
        } else {
            const base64Image = await this.browser.saveScreenshots();
            addContext(that, {
                title: `Reseting Nuc`,
                value: 'data:image/png;base64,' + base64Image,
            });
            await this.browser.click(this.recycleModalContinueBtn);
            await this.untilIsVisible(this.recycleModalMessage, 40000);
            const postRecycleMessage = await (await this.browser.findElement(this.recycleModalMessage)).getText();
            if (
                postRecycleMessage !==
                'Distributor Website was recycled successfully DO NOT click on Reload after clicking on Recycle. Login into the distributor and data will be reloaded automatically'
            ) {
                throw Error(`nuc returned wrong message for recycling: ${postRecycleMessage}`);
            } else {
                const base64Image = await this.browser.saveScreenshots();
                addContext(that, {
                    title: `Reseting Nuc`,
                    value: 'data:image/png;base64,' + base64Image,
                });
                await this.browser.click(this.secondModalOK);
            }
        }
    }
    public async moveDistToEmptyMachine() {
        await this.browser.click(this.newMachineDropDown);
        this.browser.sleep(2500);
        await this.browser.click(this.newEmptyMachine);
        this.browser.sleep(2000);
        await this.browser.sendKeys(this.recycleReasonTxtBox, `login perormance auto test setup` + Key.ENTER);
        this.browser.sleep(500);
        await this.browser.click(this.relocateDistBtn);
        await this.untilIsVisible(this.recycleModalMessage, 40000);
        const preRelocateMessage = await (await this.browser.findElement(this.recycleModalMessage)).getText();
        if (preRelocateMessage !== 'Are you sure you want to move the distributor to different nucleus?') {
            throw Error(`nuc returned wrong message for relocating: ${preRelocateMessage}`);
        } else {
            await this.browser.click(this.recycleModalContinueBtn);
        }
    }
}
