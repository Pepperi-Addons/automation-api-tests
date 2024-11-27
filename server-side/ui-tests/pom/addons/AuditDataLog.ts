import { By } from 'selenium-webdriver';
import { AddonPage } from './base/AddonPage';

export class AuditDataLog extends AddonPage {
    // *general selectors for Audit Data Log*
    public openFieldLogABI_button: By = By.xpath('//button[@data-qa="Open Audit Data Field Log ABI"]');
    public dialogContainer: By = By.xpath('//mat-dialog-container');
    public auditDataFieldLogBlock_element: By = By.xpath(
        '//audit-data-field-log-block-element-00000000-0000-0000-0000-00000da1a109',
    );
    public ceationDateTime_field: By = By.xpath('//pep-textbox[@data-qa="CreationDateTime"]');
    public email_field: By = By.xpath('//pep-textbox[@data-qa="Email"]');
    public name_field: By = By.xpath('//pep-textbox[@data-qa="User"]');
    public updatedFields_field: By = By.xpath('//pep-textbox[@data-qa="UpdatedFields"]');
    public externalID_field: By = By.xpath('//pep-textbox[@data-qa="ExternalID"]');
    public userID_field: By = By.xpath('//pep-textbox[@data-qa="InternalID"]');
    public actionUUID_field: By = By.xpath('//pep-textbox[@data-qa="ActionUUID"]');
    public emptyListTitle_div: By = By.xpath('//div[contains(@class,"list-empty-title")]');
    public emptyListDescription_div: By = By.xpath('//div[contains(@class,"list-empty-descr")]');
}
