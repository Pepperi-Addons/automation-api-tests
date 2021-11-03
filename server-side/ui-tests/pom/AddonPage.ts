import { Browser } from '../utilities/browser';
import { Page } from './base/page';
import config from '../../config';
import { Locator, By, WebElement } from 'selenium-webdriver';

export enum SelectOption {
    InCreation = 1,
    Submitted = 2,
    InProgress = 3,
    OnHold = 4,
    Cancelled = 5,
    Revised = 6,
    Closed = 7,
    WaitingForApproval = 9,
    ERP = 12,
    Invoice = 14,
    InPlanning = 16,
    Published = 17,
    InPayment = 18,
    Paid = 19,
    New = 1000,
}

export enum SelectPostAction {
    Alert = 15,
    CaptureDateAndTime = 26,
    CaptureGeolocation = 27,
    ExportFileToFTP = 23,
    ForceSync = 21,
    Notification = 13,
    OpenForm = 22,
    SendEmail = 1,
    CustomForm = 18,
    UpdateInventory = 28,
    Webhook = 2,
    OpenCampaign = 40,
    WebhookResultNotification = 9,
    Duplicate = 43,
    DuplicateForAnotherAccount = 48,
    PushNotification = 37,
    CalculateFieldFormula = 45,
}

export enum AddonLoadCondition {
    Footer,
    Content,
}

export class AddonPage extends Page {
    constructor(browser: Browser) {
        super(browser, `${config.baseUrl}`);
    }

    public AddonContainerTopButton: Locator = By.css('.addon-page-container button');
    public AddonContainerTitle: Locator = By.css('.addon-page-container [title]');
    public AddonContainerTabs: Locator = By.css('.pep-main-area [role="tablist"] [role="tab"]');
    public AddonContainerTablistXpath: Locator = By.xpath(
        './/div[@class="pep-main-area"] //div[@role="tablist"] //div[@role="tab"]',
    );
    public AddonContainerTabsContent: Locator = By.css('#addNewOrderTypesCont');
    public AddonContainerIframe: Locator = By.css('iframe#myFrame');
    public AddonContainerHiddenTabs: Locator = By.css('.ui-tabs-hide');
    public AddonContainerFooterDisplay: Locator = By.css('#FotterCont[style="display: block;"]');
    public AddonContainerContentDisplay: Locator = By.css('#content [style*="display: block"]');

    //Object Types Editor Locators
    public AddonContainerATDEditorWorkflowFlowchartIndicator: Locator = By.css('span[name="flowchart"].disabled');
    public AddonContainerATDEditorWorkflowFlowchartEl: Locator = By.css('#mainFlowchart .flowchart-element');
    public AddonContainerATDEditorWorkflowFlowchartElDeleteBtn: Locator = By.css(
        '#mainFlowchart div[style*="display: block;"] .deleteProgram',
    );
    public AddonContainerATDEditorWorkflowFlowchartElEditBtn: Locator = By.css(
        '#mainFlowchart div[style*="display: block;"] .editProgram',
    );
    public AddonContainerATDEditorWorkflowFlowchartAddAction: Locator = By.css('.addAction');
    public AddonContainerActionsRadioBtn: Locator = By.xpath('//div[contains(@class,"choose")] //input[@type="radio"]');
    public AddonContainerATDEditorWorkflowFlowchartAddActionsSaveBtn: Locator = By.css(
        '#workflowV2 [name="chooseAction"] .save',
    );
    public AddonContainerATDEditorWorkflowFlowchartNewStepBtn: Locator = By.css('#newStep');
    public AddonContainerATDEditorWorkflowFlowchartransitionNameBtn: Locator = By.css('#transitionName');
    public AddonContainerATDEditorWorkflowFlowchartFromStatusBtn: Locator = By.css('#fromStatus');
    public AddonContainerATDEditorWorkflowFlowchartoStatusBtn: Locator = By.css('#toStatus');
    public AddonContainerATDEditorWorkflowFlowchartSaveBtn: Locator = By.css('#workflowV2 .add .save');
    public AddonContainerATDEditorWorkflowFlowchartCancelBtn: Locator = By.css('#workflowV2 .add .cancel');
    public AddonContainerATDEditorWorkflowFlowchartUpdateInventoryOriginInventoryCB: Locator = By.css(
        '#originInventory input[type="checkbox"]',
    );
    public AddonContainerATDEditorWorkflowFlowchartUpdateInventoryDestinationAccountCB: Locator = By.css(
        '#destinationAccount input[type="checkbox"]',
    );
    public AddonContainerATDEditorWorkflowFlowchartUpdateInventorySaveBtn: Locator = By.css(
        '#workflowV2 #updateInventoryAction .save',
    );
    public AddonContainerATDEditorWorkflowFlowchartUpdateInventoryEditSaveBtn: Locator = By.css(
        '#workflowV2 [name="editStack"] .save',
    );

    //Settings Framework Locators
    public SettingsFrameworkEditAdmin: Locator = By.css('span[title="Admin"]+.editPenIcon');
    public SettingsFrameworkEditorSearch: Locator = By.css('#txtSearchBankFields');
    public SettingsFrameworkEditorSave: Locator = By.css('.save');

    public async selectTabByText(tabText: string): Promise<void> {
        const selectedTab = Object.assign({}, this.AddonContainerTablistXpath);
        selectedTab['value'] += ` [contains(., '${tabText}')]`;
        await this.browser.click(selectedTab);
        return;
    }

    public async isEditorTabVisible(tabID: string, waitUntil = 15000): Promise<boolean> {
        const selectedTab = Object.assign({}, this.AddonContainerTabsContent);
        selectedTab['value'] += ` #${tabID}`;
        return await this.browser.untilIsVisible(selectedTab, waitUntil);
    }

    public async isEditorHiddenTabExist(tabID: string, waitUntil = 15000): Promise<boolean> {
        const selectedTab = Object.assign({}, this.AddonContainerHiddenTabs);
        selectedTab['value'] += `#${tabID}`;
        const hiddenEl = await this.browser.findElement(selectedTab, waitUntil, false);
        if (hiddenEl instanceof WebElement) {
            return true;
        }
        return false;
    }

    public async isAddonFullyLoaded(addonLoadCondition: AddonLoadCondition): Promise<boolean> {
        if (addonLoadCondition == AddonLoadCondition.Footer) {
            await this.browser.untilIsVisible(this.AddonContainerFooterDisplay, 45000);
        } else {
            await this.browser.untilIsVisible(this.AddonContainerContentDisplay, 45000);
        }
        let bodySize = 0;
        do {
            let htmlBody = await this.browser.findElement(this.HtmlBody);
            bodySize = (await htmlBody.getAttribute('innerHTML')).length;
            this.browser.sleep(1000);
            htmlBody = await this.browser.findElement(this.HtmlBody);
            if ((await htmlBody.getAttribute('innerHTML')).length == bodySize) {
                bodySize = -1;
            }
        } while (bodySize != -1);
        return true;
    }

    public async selectDropBoxByOption(locator: Locator, option: SelectOption): Promise<void> {
        const selectedBox = Object.assign({}, locator);
        selectedBox['value'] += ` option[value='${option}']`;
        await this.browser.click(selectedBox);
        return;
    }

    public async selectPostAction(actionName: SelectPostAction): Promise<void> {
        const selectedTab = Object.assign({}, this.AddonContainerActionsRadioBtn);
        selectedTab['value'] = `.//li[@data-type='${actionName}'] ${selectedTab['value']}`;
        await this.browser.click(selectedTab);
        return;
    }
}
