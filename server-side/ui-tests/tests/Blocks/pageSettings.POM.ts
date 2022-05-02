import { Actions, By, Key, Locator, WebElement } from 'selenium-webdriver';
import { Browser } from '../../utilities/browser';
import config from '../../../config';
import { Executor } from 'selenium-webdriver/http';
import { WebAppDialog, WebAppHeader, WebAppSettingsSidePanel } from '../../pom';
import { Page as PageBuilder, PageBlock } from '@pepperi-addons/papi-sdk';
import { PagesService } from '../../../services/pages/pages.service';
import { PageSectionClass } from '../../../models/pages/page-section.class';
import { v4 as newUuid } from 'uuid';
import { PageClass } from '../../../models/pages/page.class';
import { TestConfiguration } from '../../../models/pages/parameter-config.class';
import { Page } from '../../pom/Pages/base/Page';
import chai, { expect } from 'chai';

export enum pageOptions {
    'Blank' = 'Blank',
    'Gridy' = 'Gridy',
    'Simplistic' = 'Simplistic',
    'Branded' = 'Branded',
}
export class PageBuilderSettings extends Page {
    constructor(protected browser: Browser) {
        super(browser, `${config.baseUrl}`);
    }

    public newPageBtn: By = By.css("[data-qa='PAGES_MANAGER.A_PAGE']");
    public pageBuilderOption: By = By.xpath("//div[@class='logo']");
    public arrayOfBlocks: By = By.className('pep-draggable-item-container');
    public pageBlock: By = By.css("[title='Chart']");
    //By.xpath("//div[@class='pep-draggable-item-container']//div//span[@title='|placeholder|']//..//..");
    public pageSections: By = By.xpath("//div[contains(@class,'cdk-drop-list') and contains(@id,'drop-list')]");
    public pageInputs: By = By.xpath('//input');
    public saveBtn: By = By.xpath("//span[@title='Save']/ancestor::button");
    public publishBtn: By = By.xpath("//span[@title='Publish']/ancestor::button");
    public backToListBtn: By = By.xpath("//pep-button[@iconname='arrow_left_alt']");
    public searchBar: By = By.xpath('//mat-form-field/descendant::input');
    public homeScreen: By = By.css('[data-qa="systemHome"]');

    public async choosePageBuilderOptipn(option: pageOptions) {
        switch (option) {
            case 'Blank':
                await this.browser.click(this.pageBuilderOption, 0);
                break;
            case 'Gridy':
                await this.browser.click(this.pageBuilderOption, 1);
                break;
            case 'Simplistic':
                await this.browser.click(this.pageBuilderOption, 2);
                break;
            case 'Branded':
                await this.browser.click(this.pageBuilderOption, 3);
                break;
        }
    }

    public async getBlockFromPage(titleName: string) {
        const certainBlockLocator = this.pageBlock.valueOf()['value'].slice().replace('|placeholder|', titleName);
        return await (await this.browser.findElement(By.xpath(certainBlockLocator))).getText();
    }

    public async changePageName(newPageName: string) {
        await this.browser.click(this.pageInputs, 0);
        await this.browser.sendKeys(this.pageInputs, newPageName + Key.ENTER);
        await this.savePage();
        await this.publishPage();
    }

    public async backToPageList() {
        await this.browser.click(this.homeScreen);
        const webAppHeader = new WebAppHeader(this.browser);
        await this.browser.click(webAppHeader.Settings);
        const webAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        await webAppSettingsSidePanel.selectSettingsByID('Pages');
        await this.browser.click(webAppSettingsSidePanel.PageBuilderSection);
    }

    public async searchForPageAndEnter(name: string) {
        await this.browser.click(this.searchBar);
        await this.browser.sendKeys(this.searchBar, name + Key.ENTER);
        await this.browser.click(By.xpath(`//a[text()='${name}']`));
    }

    public async publishPage() {
        await this.browser.click(this.publishBtn);
        const webAppDialog = new WebAppDialog(this.browser);
        await webAppDialog.untilIsVisible(webAppDialog.Content, 8000);
        await webAppDialog.selectDialogBox('Close');
    }

    public async savePage() {
        await this.browser.click(this.saveBtn);
        const webAppDialog = new WebAppDialog(this.browser);
        await webAppDialog.untilIsVisible(webAppDialog.Content, 8000);
        await webAppDialog.selectDialogBox('Close');
    }

    // public async dragGivenItemToGivenSection(titleNameOfBlockToDrag: string, sectionIndex: number) {
    //     // const certainBlockLocator = this.pageBlock.valueOf()['value'].slice().replace('|placeholder|', titleNameOfBlockToDrag);
    //     const draggable = await this.browser.findElements(this.pageBlock);
    //     const debug = await draggable[0].getTagName();
    //     const debug1 = await draggable[0].getAttribute('class');
    //     const dragTo = await this.browser.findElements(this.pageSections);
    //     await this.browser.sleepTimeout(1500);
    //     await this.browser.dragAndDrop(draggable[0], dragTo[0]);
    //     debugger;
    // }

    public async apiCreatePage(expect, pagesService: PagesService, blockName: string, basicPage: PageClass) {
        const newBlockRelation = await pagesService.getBlockRelation(blockName);
        const newBlock: PageBlock = basicPage.Blocks.createAndAddChart(newBlockRelation);
        const section = new PageSectionClass(newUuid());

        // const testConfig: TestConfiguration = {
        //     Parameters: [],
        //     BlockId: 'basicStaticBlock',
        // };
        // config.push(stringParam, filterParam);
        // newBlock.Configuration.Data = testConfig;

        section.addBlock(newBlock.Key);

        basicPage.Layout.Sections.add(section);

        const pageResult: PageBuilder = await pagesService.createOrUpdatePage(basicPage).catch((error) => {
            console.log((error as Error).message);
            throw error;
        });
        pagesService.deepCompareObjects(basicPage, pageResult, expect, ["Hidden", "CreationDateTime", "ModificationDateTime","query"]);
        return pageResult;
    }
}
