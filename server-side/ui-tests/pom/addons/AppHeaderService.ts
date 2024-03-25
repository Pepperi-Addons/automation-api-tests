import { By } from 'selenium-webdriver/lib/by';
import { AddonPage } from './base/AddonPage';
import { WebAppHeader } from '../WebAppHeader';
import { WebAppSettingsSidePanel } from '../Components/WebAppSettingsSidePanel';
import { GeneralService } from '../../../services';
import { v4 as uuidv4 } from 'uuid';
import { Key } from 'selenium-webdriver';
import { Slugs } from './Slugs';
import E2EUtils from '../../utilities/e2e_utils';
import { DataViewsService } from '../../../services/data-views.service';
import { MenuDataViewField } from '@pepperi-addons/papi-sdk';
import { UpsertFieldsToMappedSlugs } from '../../blueprints/DataViewBlueprints';
import { WebAppHomePage } from '../Pages/WebAppHomePage';

export interface AppHeaderObject {
    Name: string;
    Description?: string;
    Button: { ButtonName: string; ButtonKey: 'Notification' }[];
    Menu: { FlowKey: string; FlowName: string; Name: string }[];
}

export class ApplicationHeader extends AddonPage {
    public SubHeaderOfPage: By = By.xpath(
        `//pep-remote-loader-element//configuration-addon-block-element-84c999c3-84b7-454e-9a86-71b7abc96554//pep-generic-list//*[text()='Headers']`,
    );
    public AddHeaderButton: By = By.css(`[data-qa="add"]`);
    public HeaderNameInput: By = By.xpath('//pep-textbox//input');
    public HeaderDescriptionInput: By = By.xpath('//mat-form-field//textarea');
    public HeaderSaveButton: By = By.xpath(`//button[contains(text(),'Save')]`);
    public HeaderPublishButton: By = By.xpath(`//button[contains(text(),'Publish')]`);
    public SearchInputOnAppHeaderMainPage: By = By.xpath(`//mat-form-field//input[@data-placeholder="Search..."]`);
    public ListLink: By = By.xpath(`//a[text()='|PLACEHOLDER|']`);
    public MenuTab: By = By.xpath(`//div[@role='tab']//div[@class="mat-tab-label-content" and text()='Menu']`);
    public MenuTabSubTitle: By = By.xpath(`//label[text()='Structure']`);
    public MenuItemDisplayName: By = By.xpath('//mat-form-field//input');
    public MenuItemActionName: By = By.xpath(`//pep-button[@class='flow-button']//span//span`);
    public ButtonsTab: By = By.xpath(`//div[@role='tab']//div[@class="mat-tab-label-content" and text()='Buttons']`);
    public ButtonsTabSubTitle: By = By.xpath(`//label[text()='Available fields']`);
    public ButtonItemKey: By = By.xpath(`(//mat-form-field//input)[1]`);
    public ButtonItemName: By = By.xpath(`(//mat-form-field//input)[2]`);
    public HeaderPageBackButton: By = By.xpath(`//pep-top-bar//pep-button`);
    public HeaderSlugDeleteButton: By = By.xpath(
        `//input[@title='Application_Header']//..//..//..//..//..//..//pep-button[@iconname="system_bin"]//button`,
    );
    public SaveSlugs: By = By.css(`[data-qa="Save"]`);
    public CancelButtonSlugs: By = By.css(`[data-qa="Cancel"]`);
    public CloseModalButton: By = By.xpath('//mat-dialog-container//button');
    //homepage header
    public NotificationButton: By = By.xpath(`//pep-button[@data-qa='|PLACEHOLDER|']`);
    public MenuButton: By = By.xpath(`//pep-button//button[@data-qa='|PLACEHOLDER|']`);
    public MenuButtonText: By = By.xpath(
        `//pep-button//button[@data-qa='|PLACEHOLDER|']//span[@title='|PLACEHOLDER|']`,
    );

    public async enterApplicationHeaderPage(): Promise<boolean> {
        const webAppHeader = new WebAppHeader(this.browser);
        await webAppHeader.openSettings();
        const webAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        await webAppSettingsSidePanel.selectSettingsByID('Pages');
        await this.browser.click(webAppSettingsSidePanel.ApplicationHeader);
        const isSubHeaderShowing = await this.browser.untilIsVisible(this.SubHeaderOfPage);
        return isSubHeaderShowing;
    }

    public async addNewAppHeader(appHeader: AppHeaderObject): Promise<any> {
        //1. click Add
        await this.browser.click(this.AddHeaderButton);
        this.browser.sleep(1500);
        //2. give it a 'Header Name'
        await this.browser.sendKeys(this.HeaderNameInput, appHeader.Name);
        this.browser.sleep(1500);
        //3. Description if there is
        if (appHeader.Description) {
            await this.browser.sendKeys(this.HeaderDescriptionInput, appHeader.Description);
        }
        this.browser.sleep(1500);
        //5. save the header
        await this.click(this.HeaderSaveButton);
        await this.isSpinnerDone();
        this.browser.sleep(2500);
        await this.enterHeaderBySearching(appHeader.Name);
        this.browser.sleep(1500);
        await this.click(this.HeaderPublishButton);
        await this.isSpinnerDone();
        this.browser.sleep(2500);
        await this.enterHeaderBySearching(appHeader.Name);
        this.browser.sleep(2500);
        const eseUtils = new E2EUtils(this.browser);
        const headerUUID = await eseUtils.getUUIDfromURL();
        this.browser.sleep(1500);
        await this.goBackFromHeaderToMainPage();
        return headerUUID;
    }

    public async publiushHeader() {
        this.browser.sleep(1500);
        await this.click(this.HeaderPublishButton);
        await this.isSpinnerDone();
        this.browser.sleep(2500);
    }

    public async goBackFromHeaderToMainPage() {
        await this.browser.click(this.HeaderPageBackButton);
    }

    public async validateMenuAndButtonsViaUI(appHeader: AppHeaderObject): Promise<any> {
        //1. search and enter the header
        await this.enterHeaderBySearching(appHeader.Name);
        this.browser.sleep(1000);
        //2. goto Menu tab
        await this.browser.click(this.MenuTab);
        await this.browser.untilIsVisible(this.MenuTabSubTitle);
        this.browser.sleep(2000);
        let displayName,
            actionName,
            buttonKey,
            buttonName = '';
        //3. read display name & action
        if (appHeader.Menu.length > 0) {
            const displayNameComponent = await this.browser.findElement(this.MenuItemDisplayName);
            displayName = await displayNameComponent.getAttribute('title');
            this.browser.sleep(1000);
            const actionNameComponent = await this.browser.findElement(this.MenuItemActionName);
            actionName = await actionNameComponent.getText();
        }
        //4. goto buttons tab
        await this.browser.click(this.ButtonsTab);
        await this.browser.untilIsVisible(this.ButtonsTabSubTitle);
        this.browser.sleep(2000);
        if (appHeader.Button.length > 0) {
            const buttonKeyComponent = await this.browser.findElement(this.ButtonItemKey);
            buttonKey = await buttonKeyComponent.getAttribute('title');
            this.browser.sleep(1000);
            const buttonNameComponent = await this.browser.findElement(this.ButtonItemName);
            buttonName = await buttonNameComponent.getAttribute('title');
            //publish the header
        }
        if (appHeader.Button.length > 0 || appHeader.Menu.length > 0) {
            await this.publiushHeader();
        }
        await this.goBackFromHeaderToMainPage();
        //5. read button name & button key
        return appHeader.Menu.length > 0
            ? displayName === appHeader.Menu[0].Name
            : true && appHeader.Menu.length > 0
            ? actionName === appHeader.Menu[0].FlowName
            : true && appHeader.Button.length > 0
            ? buttonKey === appHeader.Button[0].ButtonKey
            : true && appHeader.Button.length > 0
            ? buttonName === appHeader.Button[0].ButtonName
            : true;
    }

    public async configureMenuAndButtonViaAPI(
        generalService: GeneralService,
        appHeaderObject: AppHeaderObject,
        appHeaderUUID: string,
    ): Promise<any> {
        const buttonArray: any[] = [];
        const menuArray: any[] = [];
        for (let index = 0; index < appHeaderObject.Button.length; index++) {
            const button = appHeaderObject.Button[index];
            buttonArray.push({
                Key: 'Notification',
                Visible: true,
                Title: button.ButtonName,
                FieldID: 'Notification',
                Icon: {
                    Type: 'system',
                    Name: 'bell',
                },
                Type: button.ButtonName,
            });
        }
        const menuKey = uuidv4();
        for (let index = 0; index < appHeaderObject.Menu.length; index++) {
            const menu = appHeaderObject.Menu[index];
            menuArray.push({
                Title: menu.Name,
                HierarchyLevel: 0,
                Key: menuKey,
                Visible: true,
                Enabled: true,
                Type: null,
                Items: [],
                Flow: {
                    FlowKey: menu.FlowKey,
                    FlowParams: {},
                },
            });
        }
        const objectToSend = {
            Name: appHeaderObject.Name,
            Description: appHeaderObject.Description ? appHeaderObject.Description : '',
            Menu: menuArray,
            Buttons: buttonArray,
            Published: true,
            Draft: true,
            Hidden: false,
            Key: appHeaderUUID,
        };
        const applicationResponse = await generalService.fetchStatus(
            '/addons/api/9bc8af38-dd67-4d33-beb0-7d6b39a6e98d/api/headers',
            {
                method: 'POST',
                body: JSON.stringify(objectToSend),
            },
        );
        return [applicationResponse, menuKey];
    }

    async enterHeaderBySearching(flowName: string) {
        this.browser.sleep(2500);
        await this.browser.sendKeys(this.SearchInputOnAppHeaderMainPage, flowName + Key.ENTER);
        this.browser.sleep(1500);
        const flowsLinkInsideList: string = this.ListLink.valueOf()['value'].replace('|PLACEHOLDER|', flowName);
        await this.browser.untilIsVisible(By.xpath(flowsLinkInsideList));
        await this.browser.click(By.xpath(flowsLinkInsideList));
    }

    async deleteAppHeaderSlug() {
        const e2eUiService = new E2EUtils(this.browser);
        await e2eUiService.navigateTo('Slugs');
        const slugs: Slugs = new Slugs(this.browser);
        this.browser.sleep(2000);
        if (await this.browser.isElementVisible(slugs.Slugs_Tab)) {
            await slugs.clickTab('Mapping_Tab');
        }
        this.browser.sleep(2000);
        await slugs.waitTillVisible(slugs.EditPage_ConfigProfileCard_EditButton_Rep, 5000);
        await slugs.click(slugs.EditPage_ConfigProfileCard_EditButton_Rep);
        await slugs.isSpinnerDone();
        this.browser.sleep(2500);
        const isHeaderAlreadyWasConfigured = await this.browser.isElementVisible(this.HeaderSlugDeleteButton);
        if (isHeaderAlreadyWasConfigured) {
            await this.browser.click(this.HeaderSlugDeleteButton);
            await this.browser.click(this.SaveSlugs);
            this.browser.sleep(2000);
            await this.browser.click(this.CloseModalButton);
        } else {
            await this.browser.click(this.CancelButtonSlugs);
            this.browser.sleep(1500);
        }
    }

    async UIValidateWeSeeAppHeader(notificationsButtonName, menuButtonName) {
        //EVGENY^^^
        const notificationsButtonHeader: string = this.NotificationButton.valueOf()['value'].replace(
            '|PLACEHOLDER|',
            notificationsButtonName,
        );
        const isNotificationsVisibale = await this.browser.isElementVisible(By.xpath(notificationsButtonHeader));
        const menuButtonHeader: string = this.MenuButton.valueOf()['value'].replace('|PLACEHOLDER|', menuButtonName);
        const isMenuVisibale = await this.browser.isElementVisible(By.xpath(menuButtonHeader));
        const mennuButtonTextElement = this.MenuButtonText.valueOf()['value'].replaceAll(
            '|PLACEHOLDER|',
            menuButtonName,
        );
        const textOfMenuButton = await (await this.browser.findElement(By.xpath(mennuButtonTextElement))).getText();
        return isNotificationsVisibale && isMenuVisibale && textOfMenuButton === menuButtonName;
    }

    async mapASlugToAppHeader(
        email: string,
        password: string,
        generalService: GeneralService,
        keyOfHeaderToMap: string,
    ) {
        const e2eUiService = new E2EUtils(this.browser);
        await e2eUiService.navigateTo('Slugs');
        const slugs: Slugs = new Slugs(this.browser);
        this.browser.sleep(2000);
        if (await this.browser.isElementVisible(slugs.Slugs_Tab)) {
            await slugs.clickTab('Mapping_Tab');
        }
        this.browser.sleep(2000);
        await slugs.waitTillVisible(slugs.EditPage_ConfigProfileCard_EditButton_Rep, 5000);
        await slugs.click(slugs.EditPage_ConfigProfileCard_EditButton_Rep);
        await slugs.isSpinnerDone();
        this.browser.sleep(2500);
        const dataViewsService = new DataViewsService(generalService.papiClient);
        const existingMappedSlugs = await slugs.getExistingMappedSlugsList(dataViewsService);
        const slugsFields: MenuDataViewField[] = e2eUiService.prepareDataForDragAndDropAtSlugs(
            [{ slug_path: 'Application_Header', pageUUID: keyOfHeaderToMap }],
            existingMappedSlugs,
        );
        console.info(`slugsFields: ${JSON.stringify(slugsFields, null, 2)}`);
        const slugsFieldsToAddToMappedSlugsObj = new UpsertFieldsToMappedSlugs(slugsFields);
        console.info(`slugsFieldsToAddToMappedSlugs: ${JSON.stringify(slugsFieldsToAddToMappedSlugsObj, null, 2)}`);
        const upsertFieldsToMappedSlugs = await dataViewsService.postDataView(slugsFieldsToAddToMappedSlugsObj);
        console.info(`RESPONSE: ${JSON.stringify(upsertFieldsToMappedSlugs, null, 2)}`);
        this.browser.sleep(2 * 1000);
        await e2eUiService.logOutLogIn_Web18(email, password);
        const webAppHomePage = new WebAppHomePage(this.browser);
        await webAppHomePage.isSpinnerDone();
        await e2eUiService.navigateTo('Slugs');
        this.browser.sleep(4 * 1000);
        await slugs.clickTab('Mapping_Tab');
        this.browser.sleep(15 * 1000);
        const webAppHeader = new WebAppHeader(this.browser);
        await webAppHeader.goHome();
    }
}
