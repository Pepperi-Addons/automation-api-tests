import { Browser } from '../../utilities/browser';
import { By } from 'selenium-webdriver';
import { Component } from './Base/Component';
import { WebAppPage } from '../Pages/base/WebAppPage';
import { expect } from 'chai';

export class WebAppSettingsSidePanel extends Component {
    constructor(protected browser: Browser) {
        super(browser);
    }

    //TODO: Replace SettingsBarContainer for:
    //WebApp Platform | Version: 16.60.38 = settings-bar-container
    //WebApp Platform | Version: 16.65.30/16.65.34 = pep-side-bar-container
    //public SettingsBarContainer: By = By.xpath('.//*[@class="settings-bar-container"]//*[@role="button"]');
    public SettingsBarContainer: By = By.xpath('//*[@class="pep-side-bar-container"]//*[@role="button"]');

    public SettingsBarContainer_isOpen: By = By.xpath(
        '//div[@class="toggle-side-bar-container ng-star-inserted is-open-state"]',
    );

    public async isSettingsOpen() {
        try {
            const element = await this.browser.findElement(this.SettingsBarContainer_isOpen, 1000);
            console.info(`SettingsBarContainer_isOpen: ${element}`);
        } catch (error) {
            console.error(error);
            return false;
        }
        return true;
    }

    public static readonly PepSideBarContainer = By.xpath('//pep-side-bar');

    public static getCategoryBtn(categoryId: string): By {
        return By.xpath(
            `${WebAppSettingsSidePanel.PepSideBarContainer.value}//*[@id='${categoryId}']/ancestor::mat-expansion-panel-header[@role="button"]`,
        );
    }

    public static getSubCategoryBtn(subCategoryId: string, categoryId: string): By {
        return By.xpath(
            `${
                WebAppSettingsSidePanel.getCategoryBtn(categoryId).value
            }/parent::mat-expansion-panel//li[contains(@id,'${subCategoryId}')]`,
        );
    }

    //Object Types Editor Locators
    public ObjectEditorAccounts: By = By.id('settings/04de9428-8658-4bf7-8171-b59f6327bbf1/accounts/types');
    public ObjectEditorTransactions: By = By.id('settings/04de9428-8658-4bf7-8171-b59f6327bbf1/transactions/types');
    public ObjectEditorActivities: By = By.id('settings/04de9428-8658-4bf7-8171-b59f6327bbf1/activities/types');

    //Branded App / Settings Framework Locators
    public SettingsFrameworkHomeButtons: By = By.id(
        'settings/354c5123-a7d0-4f52-8fce-3cf1ebc95314/app_home_screen?view=company_webapp_homebuttons',
    );
    public BrandedAppBranding: By = By.id('settings/354c5123-a7d0-4f52-8fce-3cf1ebc95314/editor?view=company_branding');
    public CatalogsSection: By = By.id('settings/354c5123-a7d0-4f52-8fce-3cf1ebc95314/editor?view=catalogs_manage');

    //Promotion Locators
    public ItemTPEditor: By = By.id('custom_plugin/b5c00007-0941-44ab-9f0e-5da2773f2f04/default_editor');
    public OrderTPEditor: By = By.id('custom_plugin/375425f5-cd2f-4372-bb88-6ff878f40630/default_editor');
    public PackageTPEditor: By = By.id('custom_plugin/90b11a55-b36d-48f1-88dc-6d8e06d08286/default_editor');

    //UDC Selectors
    public UDCEditor: By = By.id('settings/122c0e9d-c240-4865-b446-f37ece866c22/udc');
    public AddonManagerEditor: By = By.id('settings/bd629d5f-a7b4-4d03-9e7c-67865a6d82a9/addons_manager');

    //VAR Selectors
    public VarDistsEditor: By = By.id(
        'settings/2cabad50-2df0-4136-abda-03ab9c901953/editor?view=var_distributors&uri=grid/vardistributors',
    );

    // Pages Selectors
    public ResourceViews: By = By.id('settings/0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3/views_and_editors');
    //public Pages: Object = {};

    //config Selectors
    public ScriptsEditor: By = By.id('settings/9f3b727c-e88c-4311-8ec4-3857bc8621f3/scripts');

    public SurveysEditor: By = By.id('settings/cf17b569-1af4-45a9-aac5-99f23cae45d8/surveys');

    public ApplicationHeader: By = By.id('settings/9bc8af38-dd67-4d33-beb0-7d6b39a6e98d/application_header');

    public FlowEditor: By = By.id('settings/dc8c5ca7-3fcc-4285-b790-349c7f3908bd/flows');

    public async selectSettingsByID(settingsButtonID: string): Promise<void> {
        try {
            const expanded = this.isCategoryExpanded(settingsButtonID);
            console.info(`this.isCategoryExpanded(settingsButtonID) : ${JSON.stringify(expanded, null, 2)}`);
            const mat_expansion_panel_header_selector = `//*[@id="${settingsButtonID}"]/ancestor::mat-expansion-panel-header[@aria-expanded="false"]`;
            const isNotExpanded = await this.browser.isElementVisible(By.xpath(mat_expansion_panel_header_selector));
            if (isNotExpanded) {
                console.info(`${settingsButtonID} will be clicked`);
                await this.browser.click(
                    By.xpath(`${this.SettingsBarContainer.value}//*[contains(@id,"${settingsButtonID}")]/../../..`),
                );
            }
        } catch (error) {
            console.error(error);
            console.info('Settings Category is probably already OPEN');
            // expect(error).to.be.null;
        }
    }

    public async isCategoryExpanded(categoryId: string): Promise<boolean> {
        const ariaExpanded = await this.browser.getElementAttribute(
            WebAppSettingsSidePanel.getCategoryBtn(categoryId),
            'aria-expanded',
        );
        return ariaExpanded === 'true';
    }

    public async expandSettingsCategory(categoryId: string): Promise<void> {
        const isExpanded: boolean = await this.isCategoryExpanded(categoryId);
        if (!isExpanded) {
            return await this.browser.click(WebAppSettingsSidePanel.getCategoryBtn(categoryId));
        }
    }

    public async clickSettingsSubCategory(subCategoryId: string, categoryId: string): Promise<void> {
        try {
            await this.browser.click(WebAppSettingsSidePanel.getSubCategoryBtn(subCategoryId, categoryId));
            return await this.browser.waitForLoading(WebAppPage.LoadingSpinner);
        } catch (error) {
            console.error(error);
            console.info('Settings Sub Category is NOT OPEN');
            expect('Settings Sub Category is NOT OPEN').to.be.null;
        }
    }

    public async enterSettingsPage(categoryId: string, subCategoryId: string): Promise<void> {
        await this.expandSettingsCategory(categoryId);
        return await this.clickSettingsSubCategory(subCategoryId, categoryId);
    }
}
