import { Browser } from '../../utilities/browser';
import { By, WebElement } from 'selenium-webdriver';
// import addContext from 'mochawesome/addContext';
// import fs from 'fs';
// import path from 'path';
import { ConsoleColors } from '../../../services/general.service';
import { BasePomObject } from '../base/BasePomObject';
import { Page } from './base/Page';

export class StoryBookPage extends Page {

    public ChooseBuildDropDown: By = By.xpath(`//span[@role='button' and @trigger='click']`);
    public LatestBuildDropDownOption: By = By.xpath(`(//span[@role='presentation']//span[contains(text(),'Build')])[1]`);
    public ViewStoryBookButton: By = By.xpath(`//span[contains(text(),'View Storybook')]`);
    public GenericComponentButton: By = By.xpath(`//button[contains(@data-item-id,"{placeholder}")]`);

    constructor(browser: Browser) {
        super(browser, 'https://www.chromatic.com/library?appId=60ae3e9eff8e4c003b2f90d4&branch=master');
    }

    public async navigateToStoryBook(): Promise<void> {
        return await this.browser.navigate(super.url);
    }

    public async chooseLatestBuild(): Promise<void> {
        //1. open drop down component
        await this.browser.click(this.ChooseBuildDropDown);
        //2. choose latest build
        await this.browser.click(this.LatestBuildDropDownOption);
        this.browser.sleep(5000);
    }

    public async chooseComponent(componentName: string): Promise<void> {
        //1. enter storybook
        await this.browser.click(this.ViewStoryBookButton);
        this.browser.sleep(6000);
        await this.browser.switchToOtherTab(1);
        //2. choose component by name
        const xpathQueryForComponent: string = this.GenericComponentButton.valueOf()['value'].replace(
            '{placeholder}',
            componentName,
        );
        await this.browser.click(By.xpath(xpathQueryForComponent));
        this.browser.sleep(5000);
    }
}
