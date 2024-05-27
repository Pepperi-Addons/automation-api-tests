import { By } from 'selenium-webdriver';
import { AddonPage } from './addons/base/AddonPage';
import { Browser } from '../utilities/browser';
import { expect } from 'chai';
import { WebAppSettingsSidePanel } from './Components/WebAppSettingsSidePanel';
import { WebAppHomePage } from './Pages/WebAppHomePage';
import { WebAppHeader } from './WebAppHeader';
import addContext from 'mochawesome/addContext';
import { Context } from 'vm';

export class AccountDashboardLayout extends AddonPage {
    // Account Dashborad Layout
    public AccountDashboardLayout_Container: By = By.xpath('//div[@id="appContainer"]');
    public AccountDashboardLayout_Title: By = By.xpath('//h1[contains(@class,"page-title")]/span');
    public Search_Input: By = By.xpath('//input[@id="searchInput"]');
    public Search_Magnifier_Button: By = By.xpath('//search//pep-icon[@name="system_search"]');
    public AccountDetails_component: By = By.xpath('//acc-details');
    public AccountDashboardLayout_ListContainer: By = By.xpath('//div[@id="tamplateListCont"]');
    public AccountDashboardLayout_MenuRow_Container: By = By.xpath('//div[text()="Menu"]/parent::div');
    // public AccountDashboardLayout_Menu_PencilButton: By = By.xpath('//div[text()="Menu"]/parent::div//div[@title="Edit"]');
    public AccountDashboardLayout_MenuRow_PencilButton: By = By.xpath(
        '//div[text()="Menu"]/parent::div[contains(@class,"active")]//div[@title="Edit"]',
    );
    public AccountDashboardLayout_ConfigPage_Title: By = By.xpath(
        '//div[contains(@class,"previewAndRestoreDiv")]/div/b',
    );
    public AccountDashboardLayout_Menu_CancelButton: By = By.xpath('//div[contains(@class,"cancel")][text()="Cancel"]');
    public AccountDashboardLayout_Menu_RepCard_PencilButton: By = By.xpath(
        '//span[@title="Rep"]/following-sibling::span[contains(@class,"editPenIcon")]',
    );
    public AccountDashboardLayout_Menu_RepCard_SearchBox: By = By.xpath('//input[@id="txtSearchBankFields"]');
    public AccountDashboardLayout_Menu_RepCard_SearchResult: By = By.xpath(
        '//div[text()="Available Fields"]/parent::div//ul/div[4]/ul/li[contains(@class,"filter-selected")]',
    );
    public AccountDashboardLayout_Menu_RepCard_SearchResult_PlusButton: By = By.xpath(
        '//div[text()="Available Fields"]/parent::div//ul/div[4]/ul/li[contains(@class,"filter-selected")]//div[contains(@class,"plusIcon")]',
    );
    public AccountDashboardLayout_Menu_RepCard_SaveButton: By = By.xpath(
        '//div[contains(@class,"footer-buttons")]/div[contains(@class,"save")]',
    );
    // Account Dashboard Page
    public FirstAccountInList: By = By.xpath('//virtual-scroller//fieldset//span[@id="Name"]');
    public AccountDashboard_HamburgerMenu_Button: By = By.xpath('//list-menu[@data-qa="firstMenu"]//button');
    public AccountDashboard_ListSelectAll_Checkbox: By = By.xpath(
        '//fieldset[contains(@class,"table-header-fieldset")]/mat-checkbox',
    );
    public AccountDashboard_List_PencilButton: By = By.xpath('//list-actions//button');
    public AccountDashboard_List_UnderPencilButton_Delete: By = By.xpath('//button[@title="Delete"]');
    public AccountDashboard_List_DeletePopUpDialog_RedDeleteButton: By = By.xpath(
        '//pep-dialog/div[3]//span[contains(text(),"Delete")]/parent::button',
    );
    public AccountDashboard_List_EmptyList_Message: By = By.xpath(
        '//pep-list//p[contains(text(),"No Activities found")]',
    );
    public AccountDashboard_HamburgerMenu_Content: By = By.xpath('//div[contains(@id,"cdk-overlay-")]');
    public AccountDashboard_PlusButton: By = By.xpath('//list-menu[@data-qa="secondMenu"]//button');

    public getSelectorOfPencilButtonOfSelectedSection(section: string) {
        return By.xpath(`${this[section].value}[contains(@class,"active")]//div[@title="Edit"]`);
    }

    public getSelectorOfAccountHyperlinkByName(name: string) {
        return By.xpath(`//virtual-scroller//fieldset//span[@id="Name"][@title="${name}"]`);
    }

    public getSelectorOfAccountHyperlinkByID(id: number) {
        return By.xpath(
            `//virtual-scroller//fieldset//span[@id="ExternalID"][@title="${id}"]/ancestor::fieldset//pep-internal-button/a`,
        );
    }

    public getSelectorOfSearchResultListRowPlusButtonByUniqueName(uniqueName: string) {
        return By.xpath(`//li[@data-id="SLUG_visit_flow_auto_${uniqueName}"]/div/div`);
    }

    public getSelectorOfSearchResultListRowPlusButtonByUniqueNameEVGENY(uniqueName: string) {
        return By.xpath(`//li[@data-id="SLUG_${uniqueName}"]/div/div`);
    }

    public getSelectorOfSlugConfiguredToAccountDashboardMenuLayoutByText(slugpath: string) {
        return By.xpath(`//div[text()="Layout"]/following-sibling::ul/li[contains(@data-id,"${slugpath}")]`);
    }

    public getSelectorOfSlugConfiguredToAccountDashboardMenuDELETEbuttonByText(slugpath: string) {
        return By.xpath(`//div[text()="Layout"]/following-sibling::ul/li[contains(@data-id,"${slugpath}")]//span[4]`);
    }

    public getSelectorOfAccountHomePageHamburgerMenuVisitFlowAutomatedSlug(slugName: string) {
        return By.xpath(`//div[contains(@id,"cdk-overlay-")]//button[@title="${slugName}"]`);
    }

    public getSelectorOfAccountHomePageHamburgerMenuItemByText(text: string) {
        return By.xpath(`//div[contains(@id,"cdk-overlay-")]//button[@title="${text}"]`);
    }

    public async configureToAccountSelectedSectionByProfile(
        this: Context,
        driver: Browser,
        textOfItemToAdd: string,
        selectedSection: 'Menu' = 'Menu', // TOBE expended upon need
        profile: 'Admin' | 'Rep' | 'Buyer' = 'Rep',
    ) {
        const webAppHomePage = new WebAppHomePage(driver);
        const webAppHeader = new WebAppHeader(driver);
        const settingsSidePanel = new WebAppSettingsSidePanel(driver);
        const selectedSectionUnderAccount =
            selectedSection == 'Menu'
                ? 'AccountDashboardLayout_MenuRow_Container'
                : 'AccountDashboardLayout_MenuRow_Container'; // TOBE expended upon need
        let quit = false;
        do {
            try {
                await webAppHeader.goHome();
                await webAppHomePage.isSpinnerDone();
                await webAppHeader.openSettings();
                await webAppHeader.isSpinnerDone();
                driver.sleep(0.5 * 1000);
                await settingsSidePanel.selectSettingsByID('Accounts');
                await settingsSidePanel.clickSettingsSubCategory('account_dashboard_layout', 'Accounts');
                await webAppHeader.isSpinnerDone();
                driver.sleep(20 * 1000);
                await driver.switchTo(this.AddonContainerIframe);
                await this.waitTillVisible(this.AccountDashboardLayout_Container, 5000);
                await this.waitTillVisible(this.AccountDashboardLayout_Title, 5000);
                await this.waitTillVisible(this.AccountDashboardLayout_ListContainer, 5000);
                await this.waitTillVisible(this[selectedSectionUnderAccount], 5000);
                let screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Account Dashboar Layout`,
                    value: 'data:image/png;base64,' + screenShot,
                });
                console.info(`At Account Dashboar Layout`);
                await this.clickElement(selectedSectionUnderAccount);
                await this.waitTillVisible(
                    this.getSelectorOfPencilButtonOfSelectedSection(selectedSectionUnderAccount),
                    5000,
                );
                await this.click(this.getSelectorOfPencilButtonOfSelectedSection(selectedSectionUnderAccount));
                await this.waitTillVisible(this.AccountDashboardLayout_ConfigPage_Title, 5000);
                screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `After Pencil button of ${selectedSectionUnderAccount} was clicked`,
                    value: 'data:image/png;base64,' + screenShot,
                });
                console.info(`After Pencil button of ${selectedSectionUnderAccount} was clicked`);
                expect(
                    await (await driver.findElement(this.AccountDashboardLayout_ConfigPage_Title)).getText(),
                ).to.equal(selectedSection);
                await this.waitTillVisible(this.getSelectorOfEditCardByProfile(profile), 5000);
                await this.click(this.getSelectorOfEditCardByProfile(profile));
                await this.waitTillVisible(this.SearchBankFields_input, 5000);
                screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `After Profile ${profile} was selected`,
                    value: 'data:image/png;base64,' + screenShot,
                });
                console.info(`After Profile ${profile} was selected`);
                await this.insertTextToInputElement(textOfItemToAdd, this.SearchBankFields_input);
                await this.click(
                    this.getSelectorOfSearchResultListRowPlusButtonByPartialTextAtCardEdit(textOfItemToAdd),
                );
                await this.waitTillVisible(
                    this.getSelectorOfItemConfiguredToCardByTextAtCardEdit(textOfItemToAdd),
                    5000,
                );
                screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `${textOfItemToAdd} was added`,
                    value: 'data:image/png;base64,' + screenShot,
                });
                console.info(`${textOfItemToAdd} was added`);
                await this.click(this.getSelectorOfFooterButtonByText('Save'));
                driver.sleep(5 * 1000);
                await this.waitTillVisible(this.getSelectorOfEditCardByProfile(profile), 5000);
                screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `After Save button was clicked`,
                    value: 'data:image/png;base64,' + screenShot,
                });
                console.info(`After Save button was clicked`);
                await this.clickElement('AccountDashboardLayout_Menu_CancelButton');
                await this.waitTillVisible(this[selectedSectionUnderAccount], 5000);
                screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `After Cancel button was clicked`,
                    value: 'data:image/png;base64,' + screenShot,
                });
                console.info(`After Cancel button was clicked`);
                driver.sleep(2 * 1000);
                quit = true;
            } catch (error) {
                const err = error as Error;
                console.error(error);
                addContext(this, {
                    title: `At Catch of configureToAccountSelectedSectionByProfile function, the Error:`,
                    value: err,
                });
            } finally {
                await driver.switchToDefaultContent();
                driver.sleep(2 * 1000);
                await webAppHeader.goHome();
            }
        } while (!quit);
    }

    public async unconfigureFromAccountSelectedSectionByProfile(
        this: Context,
        driver: Browser,
        deletionText: string,
        selectedSection: 'Menu' = 'Menu', // TOBE expended upon need
        profile: 'Admin' | 'Rep' | 'Buyer' = 'Rep',
        cleanupText?: string,
    ) {
        const accountDashboardLayout = new AccountDashboardLayout(driver);
        const webAppHomePage = new WebAppHomePage(driver);
        const webAppHeader = new WebAppHeader(driver);
        const settingsSidePanel = new WebAppSettingsSidePanel(driver);
        const selectedSectionUnderAccount =
            selectedSection == 'Menu'
                ? 'AccountDashboardLayout_MenuRow_Container'
                : 'AccountDashboardLayout_MenuRow_Container'; // TOBE expended upon need

        for (let i = 0; i < 2; i++) {
            try {
                await webAppHeader.goHome();
                await webAppHomePage.isSpinnerDone();
                await webAppHeader.openSettings();
                await webAppHeader.isSpinnerDone();
                accountDashboardLayout.pause(0.5 * 1000);
                await settingsSidePanel.selectSettingsByID('Accounts');
                await settingsSidePanel.clickSettingsSubCategory('account_dashboard_layout', 'Accounts');
                for (let i = 0; i < 2; i++) {
                    accountDashboardLayout.pause(10 * 1000);
                    try {
                        await accountDashboardLayout.isSpinnerDone();
                        await driver.switchTo(accountDashboardLayout.AddonContainerIframe);
                        await accountDashboardLayout.waitTillVisible(
                            accountDashboardLayout.AccountDashboardLayout_Container,
                            5 * 1000,
                        );
                        break;
                    } catch (error) {
                        console.error(error);
                    }
                }
                await accountDashboardLayout.waitTillVisible(
                    accountDashboardLayout.AccountDashboardLayout_Title,
                    5 * 1000,
                );
                await accountDashboardLayout.waitTillVisible(
                    accountDashboardLayout.AccountDashboardLayout_ListContainer,
                    5 * 1000,
                );
                await accountDashboardLayout.waitTillVisible(
                    accountDashboardLayout[selectedSectionUnderAccount],
                    5 * 1000,
                );
                await accountDashboardLayout.clickElement(selectedSectionUnderAccount);
                await accountDashboardLayout.waitTillVisible(
                    accountDashboardLayout.getSelectorOfPencilButtonOfSelectedSection(selectedSectionUnderAccount),
                    5 * 1000,
                );
                await accountDashboardLayout.click(
                    accountDashboardLayout.getSelectorOfPencilButtonOfSelectedSection(selectedSectionUnderAccount),
                );
                await accountDashboardLayout.waitTillVisible(
                    accountDashboardLayout.AccountDashboardLayout_ConfigPage_Title,
                    5 * 1000,
                );
                expect(
                    await (
                        await driver.findElement(accountDashboardLayout.AccountDashboardLayout_ConfigPage_Title)
                    ).getText(),
                ).to.equal(selectedSection);
                await accountDashboardLayout.waitTillVisible(
                    accountDashboardLayout.getSelectorOfEditCardByProfile(profile),
                    5 * 1000,
                );
                await accountDashboardLayout.click(accountDashboardLayout.getSelectorOfEditCardByProfile(profile));
                await accountDashboardLayout.waitTillVisible(
                    accountDashboardLayout.getSelectorOfItemConfiguredToCardDeleteButtonByTextAtCardEdit(deletionText),
                    5 * 1000,
                );
                await accountDashboardLayout.click(
                    accountDashboardLayout.getSelectorOfItemConfiguredToCardDeleteButtonByTextAtCardEdit(deletionText),
                );
                if (
                    cleanupText &&
                    (await driver.isElementVisible(
                        accountDashboardLayout.getSelectorOfItemConfiguredToCardDeleteButtonByTextAtCardEdit(
                            cleanupText,
                        ),
                    ))
                ) {
                    const configuredSlugsLeftovers = await driver.findElements(
                        accountDashboardLayout.getSelectorOfItemConfiguredToCardDeleteButtonByTextAtCardEdit(
                            cleanupText,
                        ),
                    );
                    configuredSlugsLeftovers.forEach(async (leftoverSlugDeleteButton) => {
                        await leftoverSlugDeleteButton.click();
                    });
                    driver.sleep(2 * 1000);
                }
                await accountDashboardLayout.click(accountDashboardLayout.getSelectorOfFooterButtonByText('Save'));
                driver.sleep(3 * 1000);
                // await accountDashboardLayout.isSpinnerDone();
                await accountDashboardLayout.waitTillVisible(
                    accountDashboardLayout.getSelectorOfPencilButtonOfSelectedSection(selectedSectionUnderAccount),
                    10 * 1000,
                );
                await accountDashboardLayout.click(accountDashboardLayout.getSelectorOfFooterButtonByText('Cancel'));
                await accountDashboardLayout.waitTillVisible(
                    accountDashboardLayout[selectedSectionUnderAccount],
                    5 * 1000,
                );
                driver.sleep(2 * 1000);
                await driver.switchToDefaultContent();
                driver.sleep(7 * 1000);
                break;
            } catch (error) {
                const err = error as Error;
                await driver.switchToDefaultContent();
                console.error(error);
                addContext(this, {
                    title: `At Catch of unconfigureFromAccountSelectedSectionByProfile function, the Error:`,
                    value: err,
                });
                await webAppHeader.goHome();
            }
        }
    }

    public async configureToAccountMenuRepCard(
        driver: Browser,
        searchText: string,
        uniqueText?: string,
        validationText?: string,
    ) {
        const webAppHomePage = new WebAppHomePage(driver);
        const webAppHeader = new WebAppHeader(driver);
        const settingsSidePanel = new WebAppSettingsSidePanel(driver);
        for (let i = 0; i < 2; i++) {
            try {
                await webAppHeader.goHome();
                await webAppHomePage.isSpinnerDone();
                await webAppHeader.openSettings();
                await webAppHeader.isSpinnerDone();
                driver.sleep(0.5 * 1000);
                await settingsSidePanel.selectSettingsByID('Accounts');
                await settingsSidePanel.clickSettingsSubCategory('account_dashboard_layout', 'Accounts');
                await this.isSpinnerDone();
                driver.sleep(20 * 1000);
                await driver.switchTo(this.AddonContainerIframe);
                await this.waitTillVisible(this.AccountDashboardLayout_Container, 15000);
                await this.waitTillVisible(this.AccountDashboardLayout_Title, 15000);
                await this.waitTillVisible(this.AccountDashboardLayout_ListContainer, 15000);
                await this.waitTillVisible(this.AccountDashboardLayout_MenuRow_Container, 15000);
                let screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Account Dashboar Layout`,
                    value: 'data:image/png;base64,' + screenShot,
                });
                await this.clickElement('AccountDashboardLayout_MenuRow_Container');
                await this.waitTillVisible(this.AccountDashboardLayout_MenuRow_PencilButton, 15000);
                screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `After Pencil button of Menu was clicked`,
                    value: 'data:image/png;base64,' + screenShot,
                });
                await this.clickElement('AccountDashboardLayout_MenuRow_PencilButton');
                await this.waitTillVisible(this.AccountDashboardLayout_ConfigPage_Title, 15000);
                expect(
                    await (await driver.findElement(this.AccountDashboardLayout_ConfigPage_Title)).getText(),
                ).to.equal('Menu');
                await this.waitTillVisible(this.AccountDashboardLayout_Menu_RepCard_PencilButton, 15000);
                await this.clickElement('AccountDashboardLayout_Menu_RepCard_PencilButton');
                await this.waitTillVisible(this.AccountDashboardLayout_Menu_RepCard_SearchBox, 15000);
                await this.insertTextToInputElement(searchText, this.AccountDashboardLayout_Menu_RepCard_SearchBox);
                const plusButton = await driver.findElement(
                    this.getSelectorOfSearchResultListRowPlusButtonByUniqueName(uniqueText || searchText),
                );
                await plusButton.click();
                await this.waitTillVisible(
                    this.getSelectorOfSlugConfiguredToAccountDashboardMenuLayoutByText(validationText || searchText),
                    15000,
                );
                await this.clickElement('AccountDashboardLayout_Menu_RepCard_SaveButton');
                driver.sleep(5 * 1000);
                await this.waitTillVisible(this.AccountDashboardLayout_Menu_RepCard_PencilButton, 15000);
                await this.clickElement('AccountDashboardLayout_Menu_CancelButton');
                await this.waitTillVisible(this.AccountDashboardLayout_MenuRow_Container, 15000);
                driver.sleep(2 * 1000);
                await driver.switchToDefaultContent();
                driver.sleep(2 * 1000);
                await webAppHeader.goHome();
                break;
            } catch (error) {
                await driver.switchToDefaultContent();
                console.error(error);
                await webAppHeader.goHome();
            }
        }
    }

    public async configureToAccountMenuRepCardEVGENY(driver: Browser, searchText: string, validationText?: string) {
        const webAppHomePage = new WebAppHomePage(driver);
        const webAppHeader = new WebAppHeader(driver);
        const settingsSidePanel = new WebAppSettingsSidePanel(driver);
        for (let i = 0; i < 2; i++) {
            try {
                await webAppHeader.goHome();
                await webAppHomePage.isSpinnerDone();
                await webAppHeader.openSettings();
                await webAppHeader.isSpinnerDone();
                driver.sleep(0.5 * 1000);
                await settingsSidePanel.selectSettingsByID('Accounts');
                await settingsSidePanel.clickSettingsSubCategory('account_dashboard_layout', 'Accounts');
                await this.isSpinnerDone();
                driver.sleep(20 * 1000);
                await driver.switchTo(this.AddonContainerIframe);
                await this.waitTillVisible(this.AccountDashboardLayout_Container, 15000);
                await this.waitTillVisible(this.AccountDashboardLayout_Title, 15000);
                await this.waitTillVisible(this.AccountDashboardLayout_ListContainer, 15000);
                await this.waitTillVisible(this.AccountDashboardLayout_MenuRow_Container, 15000);
                await this.clickElement('AccountDashboardLayout_MenuRow_Container');
                await this.waitTillVisible(this.AccountDashboardLayout_MenuRow_PencilButton, 15000);
                await this.clickElement('AccountDashboardLayout_MenuRow_PencilButton');
                await this.waitTillVisible(this.AccountDashboardLayout_ConfigPage_Title, 15000);
                expect(
                    await (await driver.findElement(this.AccountDashboardLayout_ConfigPage_Title)).getText(),
                ).to.equal('Menu');
                await this.waitTillVisible(this.AccountDashboardLayout_Menu_RepCard_PencilButton, 15000);
                await this.clickElement('AccountDashboardLayout_Menu_RepCard_PencilButton');
                await this.waitTillVisible(this.AccountDashboardLayout_Menu_RepCard_SearchBox, 15000);
                await this.insertTextToInputElement(searchText, this.AccountDashboardLayout_Menu_RepCard_SearchBox);
                const plusButton = await driver.findElement(
                    this.getSelectorOfSearchResultListRowPlusButtonByUniqueNameEVGENY(searchText),
                );
                await plusButton.click();
                await this.waitTillVisible(
                    this.getSelectorOfSlugConfiguredToAccountDashboardMenuLayoutByText(validationText || searchText),
                    15000,
                );
                await this.clickElement('AccountDashboardLayout_Menu_RepCard_SaveButton');
                driver.sleep(5 * 1000);
                await this.waitTillVisible(this.AccountDashboardLayout_Menu_RepCard_PencilButton, 15000);
                await this.clickElement('AccountDashboardLayout_Menu_CancelButton');
                await this.waitTillVisible(this.AccountDashboardLayout_MenuRow_Container, 15000);
                driver.sleep(2 * 1000);
                await driver.switchToDefaultContent();
                driver.sleep(2 * 1000);
                await webAppHeader.goHome();
                break;
            } catch (error) {
                await driver.switchToDefaultContent();
                console.error(error);
                await webAppHeader.goHome();
            }
        }
    }

    public async unconfigureFromAccountMenuRepCardEVGENY(driver: Browser, deletionText: string, cleanupText?: string) {
        const webAppHomePage = new WebAppHomePage(driver);
        const webAppHeader = new WebAppHeader(driver);
        const settingsSidePanel = new WebAppSettingsSidePanel(driver);
        await webAppHeader.goHome();
        await webAppHomePage.isSpinnerDone();
        await webAppHeader.openSettings();
        await webAppHeader.isSpinnerDone();
        this.pause(0.5 * 1000);
        await settingsSidePanel.selectSettingsByID('Accounts');
        await settingsSidePanel.clickSettingsSubCategory('account_dashboard_layout', 'Accounts');
        for (let i = 0; i < 2; i++) {
            this.pause(10 * 1000);
            try {
                await this.isSpinnerDone();
                await driver.switchTo(this.AddonContainerIframe);
                await this.waitTillVisible(this.AccountDashboardLayout_Container, 15000);
                break;
            } catch (error) {
                console.error(error);
            }
        }
        await this.waitTillVisible(this.AccountDashboardLayout_Title, 15000);
        await this.waitTillVisible(this.AccountDashboardLayout_ListContainer, 15000);
        await this.waitTillVisible(this.AccountDashboardLayout_MenuRow_Container, 15000);
        await this.clickElement('AccountDashboardLayout_MenuRow_Container');
        await this.waitTillVisible(this.AccountDashboardLayout_MenuRow_PencilButton, 15000);
        await this.clickElement('AccountDashboardLayout_MenuRow_PencilButton');
        await this.waitTillVisible(this.AccountDashboardLayout_ConfigPage_Title, 15000);
        expect(await (await driver.findElement(this.AccountDashboardLayout_ConfigPage_Title)).getText()).to.equal(
            'Menu',
        );
        await this.waitTillVisible(this.AccountDashboardLayout_Menu_RepCard_PencilButton, 15000);
        await this.clickElement('AccountDashboardLayout_Menu_RepCard_PencilButton');
        await this.waitTillVisible(
            this.getSelectorOfSlugConfiguredToAccountDashboardMenuLayoutByText(deletionText),
            15000,
        );
        await this.click(this.getSelectorOfSlugConfiguredToAccountDashboardMenuDELETEbuttonByText(deletionText));
        if (
            cleanupText &&
            (await driver.isElementVisible(
                this.getSelectorOfSlugConfiguredToAccountDashboardMenuDELETEbuttonByText(cleanupText),
            ))
        ) {
            const configuredSlugsLeftovers = await driver.findElements(
                this.getSelectorOfSlugConfiguredToAccountDashboardMenuDELETEbuttonByText(cleanupText),
            );
            configuredSlugsLeftovers.forEach(async (leftoverSlugDeleteButton) => {
                await leftoverSlugDeleteButton.click();
            });
            driver.sleep(2 * 1000);
        }
        await this.clickElement('AccountDashboardLayout_Menu_RepCard_SaveButton');
        driver.sleep(3 * 1000);
        await this.waitTillVisible(this.AccountDashboardLayout_Menu_RepCard_PencilButton, 15000);
        await this.clickElement('AccountDashboardLayout_Menu_CancelButton');
        await this.waitTillVisible(this.AccountDashboardLayout_MenuRow_Container, 15000);
        driver.sleep(2 * 1000);
        await driver.switchToDefaultContent();
        driver.sleep(7 * 1000);
    }

    public async unconfigureFromAccountMenuRepCard(driver: Browser, deletionText: string, cleanupText?: string) {
        const webAppHomePage = new WebAppHomePage(driver);
        const webAppHeader = new WebAppHeader(driver);
        const settingsSidePanel = new WebAppSettingsSidePanel(driver);
        await webAppHeader.goHome();
        await webAppHomePage.isSpinnerDone();
        await webAppHeader.openSettings();
        await webAppHeader.isSpinnerDone();
        this.pause(0.5 * 1000);
        await settingsSidePanel.selectSettingsByID('Accounts');
        await settingsSidePanel.clickSettingsSubCategory('account_dashboard_layout', 'Accounts');
        for (let i = 0; i < 2; i++) {
            this.pause(10 * 1000);
            try {
                await this.isSpinnerDone();
                await driver.switchTo(this.AddonContainerIframe);
                await this.waitTillVisible(this.AccountDashboardLayout_Container, 15000);
                break;
            } catch (error) {
                console.error(error);
            }
        }
        await this.waitTillVisible(this.AccountDashboardLayout_Title, 15000);
        await this.waitTillVisible(this.AccountDashboardLayout_ListContainer, 15000);
        await this.waitTillVisible(this.AccountDashboardLayout_MenuRow_Container, 15000);
        await this.clickElement('AccountDashboardLayout_MenuRow_Container');
        await this.waitTillVisible(this.AccountDashboardLayout_MenuRow_PencilButton, 15000);
        await this.clickElement('AccountDashboardLayout_MenuRow_PencilButton');
        await this.waitTillVisible(this.AccountDashboardLayout_ConfigPage_Title, 15000);
        expect(await (await driver.findElement(this.AccountDashboardLayout_ConfigPage_Title)).getText()).to.equal(
            'Menu',
        );
        await this.waitTillVisible(this.AccountDashboardLayout_Menu_RepCard_PencilButton, 15000);
        await this.clickElement('AccountDashboardLayout_Menu_RepCard_PencilButton');
        await this.waitTillVisible(
            this.getSelectorOfSlugConfiguredToAccountDashboardMenuLayoutByText(deletionText),
            15000,
        );
        await this.click(this.getSelectorOfSlugConfiguredToAccountDashboardMenuDELETEbuttonByText(deletionText));
        if (
            cleanupText &&
            (await driver.isElementVisible(
                this.getSelectorOfSlugConfiguredToAccountDashboardMenuDELETEbuttonByText(cleanupText),
            ))
        ) {
            const configuredSlugsLeftovers = await driver.findElements(
                this.getSelectorOfSlugConfiguredToAccountDashboardMenuDELETEbuttonByText(cleanupText),
            );
            configuredSlugsLeftovers.forEach(async (leftoverSlugDeleteButton) => {
                await leftoverSlugDeleteButton.click();
            });
            driver.sleep(2 * 1000);
        }
        await this.clickElement('AccountDashboardLayout_Menu_RepCard_SaveButton');
        driver.sleep(3 * 1000);
        await this.waitTillVisible(this.AccountDashboardLayout_Menu_RepCard_PencilButton, 15000);
        await this.clickElement('AccountDashboardLayout_Menu_CancelButton');
        await this.waitTillVisible(this.AccountDashboardLayout_MenuRow_Container, 15000);
        driver.sleep(2 * 1000);
        await driver.switchToDefaultContent();
        driver.sleep(7 * 1000);
    }
}
