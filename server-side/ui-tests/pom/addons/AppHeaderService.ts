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
    Button: { ButtonName: string }[];
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

    //

    public applicationHeaderObjectToSend: any = {
        Name: '',
        Description: '',
        Menu: [
            {
                Title: 'test_11', //name
                HierarchyLevel: 0,
                Key: 'cc5028ba-b5f2-4f74-9a92-f42b094c7a46', //auto generated
                Visible: true,
                Enabled: true,
                Type: null,
                Items: [],
                Flow: {
                    FlowKey: '6cab5336-f179-446d-90c3-ec50d5ed5020', //flows key
                    FlowParams: {},
                },
            },
        ],
        Buttons: [
            {
                Key: 'Notification',
                Visible: true,
                Title: 'test22', //name
                FieldID: 'Notification',
                Icon: {
                    Type: 'system',
                    Name: 'bell',
                },
                Type: 'test22', //name
            },
        ],
        Published: true,
        Hidden: false,
    };

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
        //2. give it a 'Header Name'
        await this.browser.sendKeys(this.HeaderNameInput, appHeader.Name);
        //3. Description if there is
        if (appHeader.Description) {
            await this.browser.sendKeys(this.HeaderDescriptionInput, appHeader.Description);
            this.applicationHeaderObjectToSend.Description = appHeader.Description;
        }
        //5. save the header
        await this.click(this.HeaderSaveButton);
        await this.isSpinnerDone();
        await this.click(this.HeaderPublishButton);
        await this.isSpinnerDone();
        await this.enterFlowBySearching(appHeader.Name);
        const eseUtils = new E2EUtils(this.browser);
        const headerUUID = await eseUtils.getUUIDfromURL();
        await this.goBackFromHeaderToMainPage();
        return headerUUID;
    }

    public async goBackFromHeaderToMainPage() {
        await this.browser.click(this.HeaderPageBackButton);
    }

    public async validateMenuAndButtonsViaUI(appHeader: AppHeaderObject): Promise<any> {
        //1. search and enter the header
        await this.enterFlowBySearching(appHeader.Name);
        //2. goto Menu tab
        await this.browser.click(this.MenuTab);
        await this.browser.untilIsVisible(this.MenuTabSubTitle);
        //3. read display name & action
        const displayNameComponent = await this.browser.findElement(this.MenuItemDisplayName);
        const displayName = await displayNameComponent.getAttribute('title');
        const actionNameComponent = await this.browser.findElement(this.MenuItemActionName);
        const actionName = await actionNameComponent.getText();
        //4. goto buttons tab
        await this.browser.click(this.ButtonsTab);
        await this.browser.untilIsVisible(this.ButtonsTabSubTitle);
        //5. read button name & button key
        const buttonKeyComponent = await this.browser.findElement(this.ButtonItemKey);
        const buttonKey = await buttonKeyComponent.getAttribute('title');
        const buttonNameComponent = await this.browser.findElement(this.ButtonItemName);
        const buttonName = await buttonNameComponent.getAttribute('title');
        return (
            displayName === appHeader.Menu[0].Name &&
            actionName === appHeader.Menu[0].FlowName &&
            appHeader.Button[0].ButtonName === buttonName &&
            appHeader.Button[0].ButtonName === buttonKey
        );
    }

    public async configureMenuAndButtonViaAPI(
        generalService: GeneralService,
        appHeaderObject: AppHeaderObject,
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
        for (let index = 0; index < appHeaderObject.Menu.length; index++) {
            const menu = appHeaderObject.Menu[index];
            menuArray.push({
                Title: menu.Name,
                HierarchyLevel: 0,
                Key: uuidv4(),
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
            Hidden: false,
        };
        const applicationResponse = await generalService.fetchStatus(
            '/addons/api/9bc8af38-dd67-4d33-beb0-7d6b39a6e98d/api/headers',
            {
                method: 'POST',
                body: JSON.stringify(objectToSend),
            },
        );
        return applicationResponse;
    }

    async enterFlowBySearching(flowName: string) {
        await this.browser.sendKeys(this.SearchInputOnAppHeaderMainPage, flowName + Key.ENTER);
        const flowsLinkInsideList: string = this.ListLink.valueOf()['value'].replace('|PLACEHOLDER|', flowName);
        await this.browser.click(By.xpath(flowsLinkInsideList));
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
