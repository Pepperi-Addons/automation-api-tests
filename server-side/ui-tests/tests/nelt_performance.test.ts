import { describe, it, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import addContext from 'mochawesome/addContext';
import { Browser } from '../utilities/browser';
import { WebAppDialog, WebAppHeader, WebAppHomePage, WebAppList, WebAppLoginPage, WebAppTopBar } from '../pom';
import { NeltPerformanceService } from '../../services/nelt-performance.service';
import { NeltPerformance } from '../pom/NeltPerformance';

chai.use(promised);

export async function NeltPerformanceTests(email: string, password: string) {
    const dateTime = new Date();

    let driver: Browser;
    let neltPerfomanceService: NeltPerformanceService;
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    let webAppHeader: WebAppHeader;
    let webAppList: WebAppList;
    let webAppTopBar: WebAppTopBar;
    let webAppDialog: WebAppDialog;
    let neltPerformanceSelectors: NeltPerformance;
    let base64ImageComponent;
    let timeInterval = 0;
    let resultsNumberBefore;
    let resultsNumberAfter;

    describe(`Nelt Performance | ${dateTime}`, () => {
        before(async function () {
            driver = await Browser.initiateChrome();
            webAppLoginPage = new WebAppLoginPage(driver);
            webAppHomePage = new WebAppHomePage(driver);
            webAppHeader = new WebAppHeader(driver);
            webAppList = new WebAppList(driver);
            webAppTopBar = new WebAppTopBar(driver);
            webAppDialog = new WebAppDialog(driver);
            neltPerformanceSelectors = new NeltPerformance(driver);
            neltPerfomanceService = new NeltPerformanceService(
                driver,
                webAppLoginPage,
                webAppHomePage,
                webAppHeader,
                webAppList,
                webAppTopBar,
                webAppDialog,
                neltPerformanceSelectors,
            );
        });

        after(async function () {
            await driver.quit();
        });

        it('Login', async function () {
            await webAppLoginPage.login(email, password);
            base64ImageComponent = await driver.saveScreenshots();
            addContext(this, {
                title: `At Home Page`,
                value: 'data:image/png;base64,' + base64ImageComponent,
            });
            driver.sleep(1 * 1000);
        });

        describe('1. Home Screen -- Finansijski podaci', async () => {
            it('Navigating from Home Screen (through Burger Menu) to "Finansijski podaci"', async function () {
                await driver.click(neltPerformanceSelectors.HamburgerMenuButtonAtHome);
                await driver.untilIsVisible(neltPerformanceSelectors.HomeMenuDropdown);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Home Hamburger Menu Opened:`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                // time measurment
                const Finansijski_podaci_opening = new Date().getTime();
                await driver.click(
                    neltPerformanceSelectors.getSelectorOfHomeHamburgerMenuItemByName('Finansijski podaci'),
                );
                await neltPerformanceSelectors.isSpinnerDone();
                // await driver.untilIsVisible(neltPerformanceSelectors.ListRow); // there is a bug with content loading for now 17/1/24
                const Finansijski_podaci_loaded = new Date().getTime();
                timeInterval = Finansijski_podaci_loaded - Finansijski_podaci_opening;
                console.info(
                    'Finansijski_podaci_opening: ',
                    Finansijski_podaci_opening,
                    'Finansijski_podaci_loaded: ',
                    Finansijski_podaci_loaded,
                    'Time Interval: ',
                    timeInterval,
                );
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At "Finansijski podaci"`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Finansijski podaci" to load:`,
                    value: `${timeInterval} ms`,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.goHome();
                await neltPerformanceSelectors.isSpinnerDone();
                driver.sleep(0.5 * 1000);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Home Page`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
        });

        describe('2. Home Screen -- Dugovnaja', async () => {
            it('Navigating from Home Screen (through Burger Menu) to "Dugovanja"', async function () {
                await driver.click(neltPerformanceSelectors.HamburgerMenuButtonAtHome);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Home Hamburger Menu Opened:`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                // time measurment
                const Dugovanja_opening = new Date().getTime();
                await driver.click(neltPerformanceSelectors.getSelectorOfHomeHamburgerMenuItemByName('Dugovanja'));
                await neltPerformanceSelectors.isSpinnerDone();
                await driver.untilIsVisible(neltPerformanceSelectors.ListRow);
                const Dugovanja_loaded = new Date().getTime();
                timeInterval = Dugovanja_loaded - Dugovanja_opening;
                console.info(
                    'Dugovanja_opening: ',
                    Dugovanja_opening,
                    'Dugovanja_loaded: ',
                    Dugovanja_loaded,
                    'Time Interval: ',
                    timeInterval,
                );
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At "Dugovanja"`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Dugovanja" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
                        1,
                    )} s`,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async () => {
                await neltPerfomanceService.goHome();
                await neltPerformanceSelectors.isSpinnerDone();
                driver.sleep(0.5 * 1000);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Home Page`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
        });

        describe('3. Home Screen -- Dnevni plan', async () => {
            it('Navigating from Home Screen (through Burger Menu) to "Dnevni plan"', async function () {
                await driver.click(neltPerformanceSelectors.HamburgerMenuButtonAtHome);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Home Hamburger Menu Opened:`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                // time measurment
                const Dnevni_plan_opening = new Date().getTime();
                await driver.click(neltPerformanceSelectors.getSelectorOfHomeHamburgerMenuItemByName('Dnevni plan'));
                await neltPerformanceSelectors.isSpinnerDone();
                await driver.untilIsVisible(neltPerformanceSelectors.PepList);
                const Dnevni_plan_loaded = new Date().getTime();
                timeInterval = Dnevni_plan_loaded - Dnevni_plan_opening;
                console.info(
                    'Dnevni plan_opening: ',
                    Dnevni_plan_opening,
                    'Dnevni plan_loaded: ',
                    Dnevni_plan_loaded,
                    'Time Interval: ',
                    timeInterval,
                );
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At "Dnevni plan"`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Dnevni plan" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
                        1,
                    )} s`,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.goHome();
                await neltPerformanceSelectors.isSpinnerDone();
                driver.sleep(0.5 * 1000);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Home Page`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
        });

        describe('4. Home Screen -- Kupci', async () => {
            it('Clicking "Kupci" button at Home Screen', async function () {
                // time measurment
                const Kupci_opening = new Date().getTime();
                await driver.click(neltPerformanceSelectors.KupciButtonAtHome);
                await neltPerformanceSelectors.isSpinnerDone();
                await driver.untilIsVisible(neltPerformanceSelectors.ListRow);
                const Kupci_loaded = new Date().getTime();
                timeInterval = Kupci_loaded - Kupci_opening;
                console.info(
                    'Kupci_opening: ',
                    Kupci_opening,
                    'Kupci_loaded: ',
                    Kupci_loaded,
                    'Time Interval: ',
                    timeInterval,
                );
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Kupci`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Kupci" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
                        1,
                    )} s`,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.goHome();
                await neltPerformanceSelectors.isSpinnerDone();
                driver.sleep(0.5 * 1000);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Home Page`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
        });

        describe('5. Home Screen -- Kupci -- Select account', async () => {
            it('Clicking "Kupci" button at Home Screen', async function () {
                await driver.click(neltPerformanceSelectors.KupciButtonAtHome);
                await neltPerformanceSelectors.isSpinnerDone();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Kupci`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Choosing First Account in list', async function () {
                // time measurment
                const KupciAccount_opening = new Date().getTime();
                await driver.click(neltPerformanceSelectors.FirstAccountInList);
                await neltPerformanceSelectors.isSpinnerDone();
                await driver.untilIsVisible(neltPerformanceSelectors.PepList);
                const KupciAccount_loaded = new Date().getTime();
                timeInterval = KupciAccount_loaded - KupciAccount_opening;
                console.info(
                    'KupciAccount_opening: ',
                    KupciAccount_opening,
                    'KupciAccount_loaded: ',
                    KupciAccount_loaded,
                    'Time Interval: ',
                    timeInterval,
                );
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Kupci Account`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Kupci Account" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
                        1,
                    )} s`,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.goHome();
                await neltPerformanceSelectors.isSpinnerDone();
                driver.sleep(0.5 * 1000);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Home Page`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
        });

        // describe('6. Account Dashboard? CC agent use webapp', async () => {});

        describe('7. Home Screen -- Kupci -- Select account -- Burger menu -- Istorija prodaje po kupcu', async () => {
            it('Clicking "Kupci" button at Home Screen', async function () {
                await driver.click(neltPerformanceSelectors.KupciButtonAtHome);
                await neltPerformanceSelectors.isSpinnerDone();
                await driver.untilIsVisible(neltPerformanceSelectors.ListRow);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Kupci`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Choosing First Account in list', async function () {
                await driver.click(neltPerformanceSelectors.FirstAccountInList);
                await neltPerformanceSelectors.isSpinnerDone();
                await driver.untilIsVisible(neltPerformanceSelectors.PepList);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Kupci Account`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Clicking Burger Menu', async function () {
                await driver.click(neltPerformanceSelectors.AccountActivityList_BurgerMenu);
                await neltPerformanceSelectors.isSpinnerDone();
                await driver.untilIsVisible(neltPerformanceSelectors.HomeMenuDropdown);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Hamburger Menu Opened`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Choosing "Istorija prodaje po kupcu" Resource View', async function () {
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Choosing "Istorija prodaje po kupcu" From Menu`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                // time measurment
                const Istorija_prodaje_po_kupcu_opening = new Date().getTime();
                await driver.click(
                    neltPerformanceSelectors.getSelectorOfAccountActivityHamburgerMenuItemByName(
                        'Istorija prodaje po kupcu',
                    ),
                );
                await neltPerformanceSelectors.isSpinnerDone();
                await driver.untilIsVisible(neltPerformanceSelectors.PepList);
                await driver.untilIsVisible(neltPerformanceSelectors.ListRow);
                await driver.untilIsVisible(
                    neltPerformanceSelectors.ResourceView_Indication_TableHeader_Label_Category,
                );
                await driver.untilIsVisible(
                    neltPerformanceSelectors.ResourceView_Indication_TableHeader_Label_returnYTD,
                );
                const Istorija_prodaje_po_kupcu_loaded = new Date().getTime();
                timeInterval = Istorija_prodaje_po_kupcu_loaded - Istorija_prodaje_po_kupcu_opening;
                console.info(
                    'Istorija_prodaje_po_kupcu_opening: ',
                    Istorija_prodaje_po_kupcu_opening,
                    'Istorija_prodaje_po_kupcu_loaded: ',
                    Istorija_prodaje_po_kupcu_loaded,
                    'Time Interval: ',
                    timeInterval,
                );
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At "Istorija prodaje po kupcu" View`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Istorija prodaje po kupcu" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
                        1,
                    )} s`,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.goHome();
                await neltPerformanceSelectors.isSpinnerDone();
                driver.sleep(0.5 * 1000);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Home Page`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
        });

        describe('8. Home Screen -- Kupci -- Select Account (1100072) -- + -- Order -- Select catalogue (CC call center)', async () => {
            it('Clicking "Kupci" button at Home Screen', async function () {
                await driver.click(neltPerformanceSelectors.KupciButtonAtHome);
                await neltPerformanceSelectors.isSpinnerDone();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Kupci`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Searching for Account 1100072 at searchbox', async function () {
                await neltPerfomanceService.searchInAccounts.bind(this)('1100072', driver);
            });
            it('Clicking on Account 1100072 at search results', async function () {
                await driver.click(neltPerformanceSelectors.getSelectorOfAccountHyperlinkByID(1100072));
                await neltPerformanceSelectors.isSpinnerDone();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Account Activity List`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Clicking on Plus Button at Account Activity List', async function () {
                await driver.click(neltPerformanceSelectors.AccountActivityList_PlusButton);
                await neltPerformanceSelectors.isSpinnerDone();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `After Plus Button Clicked`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Choosing "Order" at Dropdown Menu', async function () {
                await driver.untilIsVisible(neltPerformanceSelectors.HomeMenuDropdown);
                await driver.click(
                    neltPerformanceSelectors.getSelectorOfAccountActivityPlusButtonMenuItemByName('Order'),
                );
                await neltPerformanceSelectors.isSpinnerDone();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `"Order" chosen --> Catalogs List loaded`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Choosing "CC Call Centar" at Catalog', async function () {
                await driver.untilIsVisible(neltPerformanceSelectors.OrderCatalogItem);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Catalogs List loaded`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                // time measurment
                const CC_Call_Centar_opening = new Date().getTime();
                await driver.click(neltPerformanceSelectors.getSelectorOfOrderCatalogByName('CC Call Centar'));
                await neltPerformanceSelectors.isSpinnerDone();
                await driver.untilIsVisible(neltPerformanceSelectors.Cart_Button);
                await driver.untilIsVisible(neltPerformanceSelectors.TransactionID);
                await driver.untilIsVisible(neltPerformanceSelectors.OrderCenterItem_OrderButton_GridLineView);
                const CC_Call_Centar_loaded = new Date().getTime();
                timeInterval = CC_Call_Centar_loaded - CC_Call_Centar_opening;
                console.info(
                    'CC_Call_Centar_opening: ',
                    CC_Call_Centar_opening,
                    'CC_Call_Centar_loaded: ',
                    CC_Call_Centar_loaded,
                    'Time Interval: ',
                    timeInterval,
                );
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Order Center`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "CC Call Centar" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
                        1,
                    )} s`,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.goHome();
                await neltPerformanceSelectors.isSpinnerDone();
                driver.sleep(0.5 * 1000);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Home Page`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
        });

        describe('9. Home Screen -- Kupci -- Select Account (1100072) -- + -- Order -- Select catalogue (CC call center) -- Add items -- Click on cart', async () => {
            it('Clicking "Kupci" button at Home Screen', async function () {
                await driver.click(neltPerformanceSelectors.KupciButtonAtHome);
                await neltPerformanceSelectors.isSpinnerDone();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Kupci`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Searching for Account 1100072 at searchbox', async function () {
                await neltPerfomanceService.searchInAccounts.bind(this)('1100072', driver);
            });
            it('Clicking on Account 1100072 at search results', async function () {
                await driver.click(neltPerformanceSelectors.getSelectorOfAccountHyperlinkByID(1100072));
                await neltPerformanceSelectors.isSpinnerDone();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Account Activity List`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Clicking on Plus Button at Account Activity List', async function () {
                await driver.click(neltPerformanceSelectors.AccountActivityList_PlusButton);
                await neltPerformanceSelectors.isSpinnerDone();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `After Plus Button Clicked`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Choosing "Order" at Dropdown Menu', async function () {
                await driver.untilIsVisible(neltPerformanceSelectors.HomeMenuDropdown);
                await driver.click(
                    neltPerformanceSelectors.getSelectorOfAccountActivityPlusButtonMenuItemByName('Order'),
                );
                await neltPerformanceSelectors.isSpinnerDone();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `"Order" chosen --> Catalogs List loaded`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Choosing "CC Call Centar" at Catalog', async function () {
                await driver.untilIsVisible(neltPerformanceSelectors.OrderCatalogItem);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Catalogs List loaded`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                await driver.click(neltPerformanceSelectors.getSelectorOfOrderCatalogByName('CC Call Centar'));
                await neltPerformanceSelectors.isSpinnerDone();
                await driver.untilIsVisible(neltPerformanceSelectors.Cart_Button);
                await driver.untilIsVisible(neltPerformanceSelectors.TransactionID);
                await driver.untilIsVisible(neltPerformanceSelectors.OrderCenterItem_OrderButton_GridLineView);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Order Center`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Adding Items', async function () {
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Catalogs List loaded`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                // TODO - add between 3 to 5 items
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Items Added`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Clicking on Cart Button', async function () {
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `After Item Picking`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                // time measurment
                const Click_on_Cart_opening = new Date().getTime();
                await driver.click(neltPerformanceSelectors.Cart_Button);
                await neltPerformanceSelectors.isSpinnerDone();
                await driver.untilIsVisible(neltPerformanceSelectors.ContinueOrdering_Button);
                await driver.untilIsVisible(neltPerformanceSelectors.PepList);
                // await driver.untilIsVisible(neltPerformanceSelectors.ListRow);
                const Click_on_Cart_loaded = new Date().getTime();
                timeInterval = Click_on_Cart_loaded - Click_on_Cart_opening;
                console.info(
                    'Click_on_Cart_opening: ',
                    Click_on_Cart_opening,
                    'Click_on_Cart_loaded: ',
                    Click_on_Cart_loaded,
                    'Time Interval: ',
                    timeInterval,
                );
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Cart`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Cart" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
                        1,
                    )} s`,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.goHome();
                await neltPerformanceSelectors.isSpinnerDone();
                driver.sleep(0.5 * 1000);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Home Page`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
        });
        // describe('10. Zatvaranje ordera', async () => {});
        describe('11. Home Screen -- Kupci -- Select Account (1100072) -- + -- Order -- Select catalogue (CC call center) -- Select filter', async () => {
            it('Clicking "Kupci" button at Home Screen', async function () {
                await driver.click(neltPerformanceSelectors.KupciButtonAtHome);
                await neltPerformanceSelectors.isSpinnerDone();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Kupci`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Searching for Account 1100072 at searchbox', async function () {
                await neltPerfomanceService.searchInAccounts.bind(this)('1100072', driver);
            });
            it('Clicking on Account 1100072 at search results', async function () {
                await driver.click(neltPerformanceSelectors.getSelectorOfAccountHyperlinkByID(1100072));
                await neltPerformanceSelectors.isSpinnerDone();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Account Activity List`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Clicking on Plus Button at Account Activity List', async function () {
                await driver.click(neltPerformanceSelectors.AccountActivityList_PlusButton);
                await neltPerformanceSelectors.isSpinnerDone();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `After Plus Button Clicked`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Choosing "Order" at Dropdown Menu', async function () {
                await driver.untilIsVisible(neltPerformanceSelectors.HomeMenuDropdown);
                await driver.click(
                    neltPerformanceSelectors.getSelectorOfAccountActivityPlusButtonMenuItemByName('Order'),
                );
                await neltPerformanceSelectors.isSpinnerDone();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `"Order" chosen --> Catalogs List loaded`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Choosing "CC Call Centar" at Catalog', async function () {
                await driver.untilIsVisible(neltPerformanceSelectors.OrderCatalogItem);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Catalogs List loaded`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                await driver.click(neltPerformanceSelectors.getSelectorOfOrderCatalogByName('CC Call Centar'));
                await neltPerformanceSelectors.isSpinnerDone();
                await driver.untilIsVisible(neltPerformanceSelectors.Cart_Button);
                await driver.untilIsVisible(neltPerformanceSelectors.TransactionID);
                await driver.untilIsVisible(neltPerformanceSelectors.OrderCenterItem_OrderButton_GridLineView);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Order Center`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Select Filter', async function () {
                resultsNumberBefore = await (
                    await driver.findElement(neltPerformanceSelectors.ListNumberOfResults)
                ).getText();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Catalogs List loaded`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                // time measurment
                const Select_Filter_opening = new Date().getTime();
                await driver.click(
                    neltPerformanceSelectors.getSelectorOfOrderCenterSideBarTreeItemByName('Svi filteri'),
                );
                await neltPerformanceSelectors.isSpinnerDone();
                await driver.untilIsVisible(
                    neltPerformanceSelectors.getSelectorOfOrderCenterSideBarTreeItemByName('Nestle Dairy'),
                );
                await driver.click(
                    neltPerformanceSelectors.getSelectorOfOrderCenterSideBarTreeItemByName('Nestle Dairy'),
                );
                await neltPerformanceSelectors.isSpinnerDone();
                await driver.untilIsVisible(neltPerformanceSelectors.Cart_Button);
                await driver.untilIsVisible(neltPerformanceSelectors.TransactionID);
                await driver.untilIsVisible(neltPerformanceSelectors.OrderCenterItem_QuantitySelector_GridLineView);
                const Select_Filter_loaded = new Date().getTime();
                timeInterval = Select_Filter_loaded - Select_Filter_opening;
                resultsNumberAfter = await (
                    await driver.findElement(neltPerformanceSelectors.ListNumberOfResults)
                ).getText();
                console.info(
                    'Select_Filter_opening: ',
                    Select_Filter_opening,
                    'Select_Filter_loaded: ',
                    Select_Filter_loaded,
                    'Time Interval: ',
                    timeInterval,
                );
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Filter Selected`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Select Filter" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
                        1,
                    )} s`,
                });
                driver.sleep(0.5 * 1000);
            });
            it(`Number of results has changed Assertion`, async function () {
                addContext(this, {
                    title: `Number Of Results - Before & After`,
                    value: `Before: ${resultsNumberBefore} | After: ${resultsNumberAfter}`,
                });
                expect(Number(resultsNumberAfter)).to.not.equal(Number(resultsNumberBefore));
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.goHome();
                await neltPerformanceSelectors.isSpinnerDone();
                driver.sleep(0.5 * 1000);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Home Page`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
        });
        // describe('12. Home Screen -- Kupci -- Select Account (1100072) -- + -- Order -- Select catalogue (CC call center) -- Select smart filter', async () => {});
        // describe('13. Home Screen -- Kupci -- Select Account (1100072) -- + -- Order -- Select catalogue (CC call center) -- Change sort by', async () => {});
        // describe('14. Home Screen -- Kupci -- Select Account (1100072) -- + -- Order -- Select catalogue (CC call center) -- Open promotions that are (bundles)', async () => {});
        // describe('15. Home Screen -- Kupci -- Select Account (1100072) -- + -- Order -- Select catalogue (CC call center) -- Open promotions that are (bundles) -- Click Done', async () => {});
        // describe('16. Home Screen -- Kupci -- Select Account (1100072) -- + -- Order -- Select catalogue (CC call center) -- Open promotions (not bundles)', async () => {});
        // describe('17. Home Screen -- Kupci -- Select Account (1100072) -- + -- Order -- Select catalogue (CC call center) -- Open promotions (not bundles) -- Click Done', async () => {});
        // describe('18. Home Screen -- Kupci -- Select account -- Burger menu -- Pocni Posetu -- Select visit flow -- Open -- Select Provat -- Provat order', async () => {});
        // describe('19. Home Screen -- Kupci -- Select account -- Burger menu -- Pocni Posetu -- Select visit flow -- Open -- Select Provat -- Provat order -- Add item -- Submit', async () => {});
        // describe('20. Home Screen -- Kupci -- Select account -- Burger menu -- Pocni Posetu -- Select visit flow -- Open -- Near Expiry order', async () => {});
        // describe('21. Home Screen -- Kupci -- Select account -- Burger menu -- Pocni Posetu -- Select visit flow -- Open -- Near Expiry order -- Add items -- Submit', async () => {});

        describe('22. Home Screen -- Dnevni izvestaj', async () => {
            it('Navigating from Home Screen (through Burger Menu) to "Dnevni izvestaj"', async function () {
                await driver.click(neltPerformanceSelectors.HamburgerMenuButtonAtHome);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Home Hamburger Menu Opened:`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                // time measurment
                const Dnevni_izvestaj_opening = new Date().getTime();
                await driver.click(
                    neltPerformanceSelectors.getSelectorOfHomeHamburgerMenuItemByName('Dnevni izvestaj'),
                );
                await neltPerformanceSelectors.isSpinnerDone();
                await driver.untilIsVisible(neltPerformanceSelectors.InsightsLoaded_Indication_GalleryCard);
                await driver.untilIsVisible(neltPerformanceSelectors.getSelectorOfInsightsGalleryCardByText('1'));
                await driver.untilIsVisible(neltPerformanceSelectors.InsightsLoaded_Indication_Table);
                await driver.untilIsVisible(neltPerformanceSelectors.InsightsLoaded_Indication_Table_Header);
                await driver.untilIsVisible(neltPerformanceSelectors.getSelectorOfInsightsTableHeaderdByText('Target'));
                await driver.untilIsVisible(neltPerformanceSelectors.InsightsLoaded_Indication_Chart);
                await driver.untilIsVisible(neltPerformanceSelectors.InsightsLoaded_Indication_ChartGraph);
                const Dnevni_izvestaj_loaded = new Date().getTime();
                timeInterval = Dnevni_izvestaj_loaded - Dnevni_izvestaj_opening;
                console.info(
                    'Dnevni_izvestaj_opening: ',
                    Dnevni_izvestaj_opening,
                    'Dnevni_izvestaj_loaded: ',
                    Dnevni_izvestaj_loaded,
                    'Time Interval: ',
                    timeInterval,
                );
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At "Dnevni izvestaj"`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Dnevni izvestaj" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
                        1,
                    )} s`,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.goHome();
                await neltPerformanceSelectors.isSpinnerDone();
                driver.sleep(0.5 * 1000);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Home Page`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
        });

        // describe('23. Home Screen -- Kupci -- Select account -- Burger menu -- Pocni Posetu -- Select visit flow -- Start', async () => {});
        // describe('24. Home Screen -- Kupci -- Select account -- Burger menu -- Pocni Posetu -- Select visit flow -- Start -- End', async () => {});
        // describe('25. Home Screen -- Kupci -- Select account -- Burger menu -- Kartica Kupca', async () => {});
        // describe('26. Status dokumenata', async () => {});
        // describe('27. Home Screen -- Kupci -- Select Account -- + -- Ekstenzija KL', async () => {});
        // describe('28. Home Screen -- Kupci -- Select Account -- + -- Ekstenzija KL -- Submit', async () => {});
        // describe('29. Artikli na leafletu (Opening of page products on leaflet)', async () => {});
        // describe('30. Open list of task on accounts', async () => {});
        // describe('31. Task response', async () => {});
    });
}
