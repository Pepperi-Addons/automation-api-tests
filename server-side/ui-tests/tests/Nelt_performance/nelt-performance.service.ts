import { Browser } from '../../utilities/browser';
import { Context } from 'vm';
import { WebAppLoginPage, WebAppHomePage, WebAppHeader, WebAppList, WebAppTopBar, WebAppDialog } from '../../pom';
import addContext from 'mochawesome/addContext';
import { NeltPerformance } from './NeltPerformance';
import { By, Key } from 'selenium-webdriver';

export class NeltPerformanceService {
    public browser: Browser;
    public webAppLoginPage: WebAppLoginPage;
    public webAppHomePage: WebAppHomePage;
    public webAppHeader: WebAppHeader;
    public webAppList: WebAppList;
    public webAppTopBar: WebAppTopBar;
    public webAppDialog: WebAppDialog;
    public neltPerformance: NeltPerformance;
    public base64Image;

    constructor(
        driver: Browser,
        webAppLoginPage: WebAppLoginPage,
        webAppHomePage: WebAppHomePage,
        webAppHeader: WebAppHeader,
        webAppList: WebAppList,
        webAppTopBar: WebAppTopBar,
        webAppDialog: WebAppDialog,
        neltPerformance: NeltPerformance,
    ) {
        this.browser = driver;
        this.webAppLoginPage = webAppLoginPage;
        this.webAppHomePage = webAppHomePage;
        this.webAppHeader = webAppHeader;
        this.webAppList = webAppList;
        this.webAppTopBar = webAppTopBar;
        this.webAppDialog = webAppDialog;
        this.neltPerformance = neltPerformance;
    }

    public async goHome() {
        if (!(await this.browser.getCurrentUrl()).includes('HomePage')) {
            await this.browser.click(this.neltPerformance.Home);
            this.browser.sleep(1000);
        }
        return;
    }

    public async toHomeScreen(this: Context, driver: Browser) {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        if (!(await driver.getCurrentUrl()).includes('HomePage')) {
            try {
                await driver.click(neltPerformanceSelectors.Home);
            } catch (error) {
                console.error(error);
                await driver.click(neltPerformanceSelectors.NeltLogo_Home);
            }
            driver.sleep(1000);
        }
        await neltPerformanceSelectors.isSpinnerDone();
        driver.sleep(0.5 * 1000);
        const base64Image = await driver.saveScreenshots();
        addContext(this, {
            title: `At Home Page`,
            value: 'data:image/png;base64,' + base64Image,
        });
    }

    public async replaceContentOfInput(driver: Browser, inputSelector: By, text: string | number): Promise<void> {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        await neltPerformanceSelectors.isSpinnerDone();
        const inputElement = await driver.findElement(inputSelector);
        await inputElement.clear();
        driver.sleep(0.1 * 1000);
        // await inputElement.sendKeys(text + '\n');
        await inputElement.sendKeys(Key.BACK_SPACE);
        await inputElement.sendKeys(text);
        driver.sleep(0.5 * 1000);
        // await driver.click(neltPerformanceSelectors.HtmlBody);
        driver.sleep(0.1 * 1000);
        await neltPerformanceSelectors.isSpinnerDone();
    }

    public async searchInAccounts(this: Context, driver: Browser, nameOfItem: string): Promise<void> {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        await neltPerformanceSelectors.isSpinnerDone();
        const searchInput = await driver.findElement(neltPerformanceSelectors.Search_Input);
        await searchInput.clear();
        driver.sleep(0.1 * 1000);
        await searchInput.sendKeys(nameOfItem + '\n');
        driver.sleep(0.5 * 1000);
        // await driver.click(neltPerformanceSelectors.HtmlBody);
        driver.sleep(0.1 * 1000);
        await driver.click(neltPerformanceSelectors.Search_Magnifier_Button);
        driver.sleep(0.1 * 1000);
        await neltPerformanceSelectors.isSpinnerDone();
        const base64Image = await driver.saveScreenshots();
        addContext(this, {
            title: `At Accounts - after Search for "${nameOfItem}"`,
            value: 'data:image/png;base64,' + base64Image,
        });
    }

    public async searchInOrderCenter(this: Context, driver: Browser, nameOfItem: string): Promise<void> {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        await neltPerformanceSelectors.isSpinnerDone();
        const searchInput = await driver.findElement(neltPerformanceSelectors.Search_Input);
        await searchInput.clear();
        driver.sleep(0.1 * 1000);
        await searchInput.sendKeys(nameOfItem + '\n');
        driver.sleep(0.5 * 1000);
        // await driver.click(neltPerformanceSelectors.HtmlBody);
        driver.sleep(0.1 * 1000);
        await driver.click(neltPerformanceSelectors.Search_Magnifier_Button);
        driver.sleep(0.1 * 1000);
        await neltPerformanceSelectors.isSpinnerDone();
        const base64Image = await driver.saveScreenshots();
        addContext(this, {
            title: `At Order Center - after Search for "${nameOfItem}"`,
            value: 'data:image/png;base64,' + base64Image,
        });
    }

    public async selectAccountViaHomePageMainButton(
        this: Context,
        driver: Browser,
        accountID: string,
        searchBy: 'ID' | 'name' = 'ID',
    ): Promise<void> {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        await driver.click(neltPerformanceSelectors.KupciButtonAtHome);
        await neltPerformanceSelectors.isSpinnerDone();
        let base64Image = await driver.saveScreenshots();
        addContext(this, {
            title: `At Kupci`,
            value: 'data:image/png;base64,' + base64Image,
        });
        await neltPerformanceSelectors.isSpinnerDone();
        const searchInput = await driver.findElement(neltPerformanceSelectors.Search_Input);
        await searchInput.clear();
        driver.sleep(0.1 * 1000);
        accountID && (await searchInput.sendKeys(accountID + '\n'));
        driver.sleep(0.5 * 1000);
        // await driver.click(neltPerformanceSelectors.HtmlBody);
        await driver.click(neltPerformanceSelectors.TopBarContainer);
        driver.sleep(0.1 * 1000);
        accountID && (await driver.click(neltPerformanceSelectors.Search_Magnifier_Button));
        driver.sleep(0.1 * 1000);
        await neltPerformanceSelectors.isSpinnerDone();
        base64Image = await driver.saveScreenshots();
        addContext(this, {
            title: `At Accounts - after Search for "${accountID}"`,
            value: 'data:image/png;base64,' + base64Image,
        });
        const selector =
            accountID === ''
                ? neltPerformanceSelectors.FirstAccountInList
                : searchBy === 'name'
                ? neltPerformanceSelectors.getSelectorOfAccountHyperlinkByName(accountID)
                : neltPerformanceSelectors.getSelectorOfAccountHyperlinkByID(Number(accountID));
        await driver.click(selector);
        await neltPerformanceSelectors.isSpinnerDone();
        base64Image = await driver.saveScreenshots();
        addContext(this, {
            title: `At Account Dashboard`,
            value: 'data:image/png;base64,' + base64Image,
        });
        await driver.untilIsVisible(neltPerformanceSelectors.AccountDashboard_PlusButton);
        await driver.untilIsVisible(neltPerformanceSelectors.AccountDashboard_BurgerMenu);
        await driver.untilIsVisible(neltPerformanceSelectors.AccountDetails_component);
    }

    public async clickPlusButtonMenuAtAccountDashboard(this: Context, driver: Browser): Promise<void> {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        await driver.click(neltPerformanceSelectors.AccountDashboard_PlusButton);
        await neltPerformanceSelectors.isSpinnerDone();
        const base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `After Plus Button Clicked`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        await driver.untilIsVisible(neltPerformanceSelectors.HomeMenuDropdown);
        driver.sleep(0.5 * 1000);
    }

    public async selectUnderPlusButtonMenuAtAccountDashboard(
        this: Context,
        driver: Browser,
        nameOfItem: string,
    ): Promise<void> {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        await driver.click(neltPerformanceSelectors.AccountDashboard_PlusButton);
        await neltPerformanceSelectors.isSpinnerDone();
        let base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `After Plus Button Clicked`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        await driver.untilIsVisible(neltPerformanceSelectors.HomeMenuDropdown);
        try {
            await driver.click(
                neltPerformanceSelectors.getSelectorOfAccountDashboardPlusButtonMenuItemByName(nameOfItem),
            );
            await neltPerformanceSelectors.isSpinnerDone();
            base64ImageComponent = await driver.saveScreenshots();
            addContext(this, {
                title: `"${nameOfItem}" chosen`,
                value: 'data:image/png;base64,' + base64ImageComponent,
            });
        } catch (error) {
            console.error(error);
            base64ImageComponent = await driver.saveScreenshots();
            addContext(this, {
                title: `"${nameOfItem}" NOT FOUND`,
                value: 'data:image/png;base64,' + base64ImageComponent,
            });
            await driver.click(neltPerformanceSelectors.AccountDashboard_PlusButton);
            await neltPerformanceSelectors.isSpinnerDone();
            base64ImageComponent = await driver.saveScreenshots();
            addContext(this, {
                title: `Plus Menu Closed`,
                value: 'data:image/png;base64,' + base64ImageComponent,
            });
        }
        driver.sleep(0.5 * 1000);
    }

    public async clickHamburgerMenuAtAccountDashboard(this: Context, driver: Browser): Promise<void> {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        await driver.click(neltPerformanceSelectors.AccountDashboard_BurgerMenu);
        await neltPerformanceSelectors.isSpinnerDone();
        const base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `After Hamburger Menu Clicked`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        await driver.untilIsVisible(neltPerformanceSelectors.HomeMenuDropdown);
        driver.sleep(0.5 * 1000);
    }

    public async selectUnderHamburgerMenuAtAccountDashboard(
        this: Context,
        driver: Browser,
        nameOfItem: string,
    ): Promise<void> {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        await driver.click(neltPerformanceSelectors.AccountDashboard_BurgerMenu);
        await neltPerformanceSelectors.isSpinnerDone();
        let base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `After Hamburger Menu Clicked`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        await driver.untilIsVisible(neltPerformanceSelectors.HomeMenuDropdown);
        await driver.click(neltPerformanceSelectors.getSelectorOfAccountDashboardHamburgerMenuItemByName(nameOfItem));
        await neltPerformanceSelectors.isSpinnerDone();
        base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `"${nameOfItem}" chosen`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        driver.sleep(0.5 * 1000);
    }

    public async choosingCatalogForOrder(this: Context, driver: Browser, nameOfCatalog: string): Promise<void> {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        await driver.untilIsVisible(neltPerformanceSelectors.OrderCatalogItem);
        let base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `Catalogs List loaded`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        await driver.click(neltPerformanceSelectors.getSelectorOfOrderCatalogByName(nameOfCatalog));
        await neltPerformanceSelectors.isSpinnerDone();
        await driver.untilIsVisible(neltPerformanceSelectors.Cart_Button);
        await driver.untilIsVisible(neltPerformanceSelectors.TransactionID);
        await driver.untilIsVisible(neltPerformanceSelectors.OrderCenterItem_OrderButton_GridLineView);
        base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `At Order Center`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
    }

    public async selectVisitFlowFromMultipleVisitsSelection(
        this: Context,
        driver: Browser,
        nameOfItem: string,
    ): Promise<void> {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        await neltPerformanceSelectors.isSpinnerDone();
        let base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `Visits Selection`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        await driver.untilIsVisible(neltPerformanceSelectors.VisitFlow_visits_container);
        await driver.click(neltPerformanceSelectors.getSelectorOfVisitFlowAtMultipleVisitsSelectionByText(nameOfItem));
        await neltPerformanceSelectors.isSpinnerDone();
        base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `"${nameOfItem}" chosen`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        await driver.untilIsVisible(neltPerformanceSelectors.VisitFlow_singleVisit_container);
        driver.sleep(0.5 * 1000);
    }

    public async selectVisitGroup(this: Context, driver: Browser, nameOfItem: string): Promise<void> {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        await neltPerformanceSelectors.isSpinnerDone();
        let base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `Visit Groups`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        await driver.untilIsVisible(neltPerformanceSelectors.VisitFlow_singleVisit_container);
        await driver.click(neltPerformanceSelectors.getSelectorOfVisitGroupByText(nameOfItem));
        await neltPerformanceSelectors.isSpinnerDone();
        base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `"${nameOfItem}" group chosen`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        await driver.untilIsVisible(neltPerformanceSelectors.getSelectorOfVisitStepByText(''));
        driver.sleep(0.5 * 1000);
    }

    public async selectVisitStep(this: Context, driver: Browser, nameOfItem: string): Promise<void> {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        await neltPerformanceSelectors.isSpinnerDone();
        let base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `Visit Steps`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        await driver.untilIsVisible(neltPerformanceSelectors.VisitFlow_singleVisit_step);
        await driver.click(neltPerformanceSelectors.getSelectorOfVisitStepByText(nameOfItem));
        await neltPerformanceSelectors.isSpinnerDone();
        base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `"${nameOfItem}" step chosen`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        driver.sleep(0.5 * 1000);
    }

    public async startVisit(this: Context, driver: Browser): Promise<void> {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        await neltPerformanceSelectors.isSpinnerDone();
        let base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `Visit Groups`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        await driver.untilIsVisible(neltPerformanceSelectors.VisitFlow_singleVisit_container);
        await driver.click(neltPerformanceSelectors.getSelectorOfVisitGroupByText('Start posete'));
        await neltPerformanceSelectors.isSpinnerDone();
        base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `"Start posete" group chosen`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        await driver.untilIsVisible(neltPerformanceSelectors.getSelectorOfVisitStepByText(''));
        await driver.click(neltPerformanceSelectors.getSelectorOfVisitStepByText('Start posete'));
        await neltPerformanceSelectors.isSpinnerDone();
        base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `Chose "Start posete" at Visit Selection`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        driver.sleep(1 * 1000);
        await driver.untilIsVisible(neltPerformanceSelectors.VisitFlow_StartEnd_Form_indication);
        // try {
        // await driver.untilIsVisible(neltPerformanceSelectors.TopBar_Right_StartButtton);
        // } catch (error) {
        if (await driver.isElementVisible(neltPerformanceSelectors.TopBar_Right_StartButtton_disabled)) {
            console.info('Start Visit Form NOT Loaded');
            // console.error(error);
            // addContext(this, {
            //     title: `Start Visit Form NOT Loaded`,
            //     value: error,
            // });
            base64ImageComponent = await driver.saveScreenshots();
            addContext(this, {
                title: `Start Visit Form NOT Loaded`,
                value: 'data:image/png;base64,' + base64ImageComponent,
            });
            await driver.click(neltPerformanceSelectors.TopBar_Left_CancelButtton);
            const dialogMessageContent = await (
                await driver.findElement(neltPerformanceSelectors.PepDialog_message)
            ).getText();
            if (dialogMessageContent.includes('Are you sure you want to discard changes?')) {
                await driver.click(neltPerformanceSelectors.getPepDialogButtonByText('Discard changes'));
                await neltPerformanceSelectors.isSpinnerDone();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Changes Discarded at "Start" step`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                await driver.untilIsVisible(neltPerformanceSelectors.VisitFlow_singleVisit_container);
                await driver.click(neltPerformanceSelectors.getSelectorOfVisitGroupByText('Start posete'));
                await neltPerformanceSelectors.isSpinnerDone();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `"Start posete" group chosen`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                await driver.untilIsVisible(neltPerformanceSelectors.getSelectorOfVisitStepByText(''));
                await driver.click(neltPerformanceSelectors.getSelectorOfVisitStepByText('Start posete'));
                await neltPerformanceSelectors.isSpinnerDone();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Chose "Start posete" at Visit Selection`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                await driver.click(neltPerformanceSelectors.TopBar_Right_StartButtton);
                await driver.untilIsVisible(neltPerformanceSelectors.VisitFlow_singleVisit_container);
                await driver.untilIsVisible(neltPerformanceSelectors.getSelectorOfVisitGroupByText('Kraj posete'));
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `After "Start posete" Visit Flow Step`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            } else {
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: 'Unexpected Dialog is shown:',
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                console.error('Unexpected Dialog is shown');
                throw new Error('Unexpected Dialog is shown');
            }
        }
        await driver.click(neltPerformanceSelectors.TopBar_Right_StartButtton);
        await driver.untilIsVisible(neltPerformanceSelectors.VisitFlow_singleVisit_container);
        await driver.untilIsVisible(neltPerformanceSelectors.getSelectorOfVisitGroupByText('Kraj posete'));
        driver.sleep(0.5 * 1000);
    }

    public async endVisit(this: Context, driver: Browser): Promise<void> {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        await neltPerformanceSelectors.isSpinnerDone();
        await driver.untilIsVisible(neltPerformanceSelectors.VisitFlow_singleVisit_container);
        await driver.click(neltPerformanceSelectors.getSelectorOfVisitGroupByText('Kraj posete'));
        await neltPerformanceSelectors.isSpinnerDone();
        let base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `"Kraj posete" group chosen`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        await driver.untilIsVisible(neltPerformanceSelectors.VisitFlow_singleVisit_step);
        await driver.click(neltPerformanceSelectors.getSelectorOfVisitStepByText('Kraj posete'));
        await neltPerformanceSelectors.isSpinnerDone();
        base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `"Kraj posete" step chosen`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        await neltPerformanceSelectors.isSpinnerDone();
        await driver.untilIsVisible(neltPerformanceSelectors.TopBar_Right_EndButtton);
        await driver.click(neltPerformanceSelectors.TopBar_Right_EndButtton);
        await neltPerformanceSelectors.isSpinnerDone();
        await driver.untilIsVisible(neltPerformanceSelectors.AccountDashboard_PlusButton);
        await driver.untilIsVisible(neltPerformanceSelectors.AccountDashboard_BurgerMenu);
        await driver.untilIsVisible(neltPerformanceSelectors.AccountDetails_component);
        await driver.untilIsVisible(neltPerformanceSelectors.PepList);
        base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `End Button clicked -> back at Account Dashboard`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        driver.sleep(0.5 * 1000);
    }

    public async chooseNonBundleItemWithOrderClickByIndex(
        this: Context,
        driver: Browser,
        index: number,
    ): Promise<void> {
        const neltPerformanceSelectors = new NeltPerformance(driver);
        await driver.click(neltPerformanceSelectors.getSelectorOfOrderCenterItemOrderButtonGridLineViewByIndex(index));
        await neltPerformanceSelectors.isSpinnerDone();
        await driver.untilIsVisible(neltPerformanceSelectors.ListNumberOfResults);
        await driver.untilIsVisible(neltPerformanceSelectors.TopBar_Right_DoneButtton);
        await driver.untilIsVisible(neltPerformanceSelectors.OrderItem_single_details);
        const base64ImageComponent = await driver.saveScreenshots();
        addContext(this, {
            title: `At Item [${index}] Details`,
            value: 'data:image/png;base64,' + base64ImageComponent,
        });
        await driver.click(neltPerformanceSelectors.TopBar_Right_DoneButtton);
        await neltPerformanceSelectors.isSpinnerDone();
        await driver.untilIsVisible(neltPerformanceSelectors.ListNumberOfResults);
        await driver.untilIsVisible(neltPerformanceSelectors.Cart_Button);
        await driver.untilIsVisible(neltPerformanceSelectors.OrderCenterItem_OrderButton_GridLineView);
        driver.sleep(0.5 * 1000);
    }
}
