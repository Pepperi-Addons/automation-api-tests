import { By } from 'selenium-webdriver/lib/by';
import { AddonPage } from './base/AddonPage';
import { WebAppHeader } from '../WebAppHeader';
import { WebAppSettingsSidePanel } from '../Components/WebAppSettingsSidePanel';
import { GeneralService } from '../../../services';
import { Key } from 'selenium-webdriver';

export interface AppHeaderObject {
    Name: string;
    Description?: string;
    Button: { shouldAdd: boolean; buttonName: string };
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
    //

    public async enterApplicationHeaderPage(): Promise<boolean> {
        const webAppHeader = new WebAppHeader(this.browser);
        await webAppHeader.openSettings();
        const webAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        await webAppSettingsSidePanel.selectSettingsByID('Pages');
        await this.browser.click(webAppSettingsSidePanel.ApplicationHeader);
        const isSubHeaderShowing = await this.browser.untilIsVisible(this.SubHeaderOfPage);
        return isSubHeaderShowing;
    }

    public async addNewAppHeader(appHeader: AppHeaderObject, generalService: GeneralService): Promise<any> {
        //1. click Add
        await this.browser.click(this.AddHeaderButton);
        //2. give it a 'Header Name'
        await this.browser.sendKeys(this.HeaderNameInput, appHeader.Name);
        //3. Description if there is
        if (appHeader.Description) {
            await this.browser.sendKeys(this.HeaderDescriptionInput, appHeader.Description);
        }
        //5. save the header
        await this.click(this.HeaderSaveButton);
        await this.isSpinnerDone();
        await this.click(this.HeaderPublishButton);
        await this.isSpinnerDone();
        //4. if should add button: -
        if (appHeader.Button.shouldAdd) {
            const bodyForAddoingANotificationButton = `{"Name":"","Description":"","Menu":[],"Buttons":[{"Key":"Notification","Visible":true,"Title":"Notification","FieldID":"Notification","Icon":{"Type":"system","Name":"bell"},"Type":"Notification"}],"Published":true,"Hidden":false}`;
            const addButtonResponse = await generalService.fetchStatus(
                '/addons/api/9bc8af38-dd67-4d33-beb0-7d6b39a6e98d/api/headers',
                {
                    method: 'POST',
                    body: bodyForAddoingANotificationButton,
                },
            );
            console.log(addButtonResponse);
            //TODO: test response of this server call
            await this.browser.sendKeys(this.SearchInputOnAppHeaderMainPage, appHeader.Name + Key.ENTER);
        }

        //6. add by API:

        //POST OBJECT:: {"Name":"","Description":"","Menu":[],"Buttons":[{"Key":"Notification","Visible":true,"Title":"Notification","FieldID":"Notification","Icon":{"Type":"system","Name":"bell"},"Type":"Notification"}],"Published":true,"Hidden":false}
        //7. find the header using search
        //8. enter - goto tabs - see button
    }
}
