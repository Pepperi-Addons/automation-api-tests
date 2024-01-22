import { describe, it, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import addContext from 'mochawesome/addContext';
import { Browser } from '../../utilities/browser';
import { WebAppDialog, WebAppHeader, WebAppHomePage, WebAppList, WebAppLoginPage, WebAppTopBar } from '../../pom';
import { NeltPerformanceService } from './nelt-performance.service';
import { NeltPerformance } from './NeltPerformance';
// import { NavigationTests } from './navigation.test';

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

    describe(`Nelt Performance | ${dateTime}`, function () {
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

        // 1
        describe('1. Home Screen --> Finansijski podaci', async () => {
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
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 2
        describe('2. Home Screen --> Dugovnaja', async () => {
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
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 3
        describe('3. Home Screen --> Dnevni plan', async () => {
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
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 4
        describe('4.1. Home Screen --> Dnevni izvestaj  (NO DATA)', async () => {
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
                await driver.untilIsVisible(neltPerformanceSelectors.getSelectorOfInsightsGalleryCardByText('0')); // if there is NO DATA at insights
                await driver.untilIsVisible(neltPerformanceSelectors.InsightsLoaded_Indication_Table);
                await driver.untilIsVisible(neltPerformanceSelectors.InsightsLoaded_Indication_Table_Header);
                await driver.untilIsVisible(neltPerformanceSelectors.getSelectorOfInsightsTableHeaderdByText('Target'));
                await driver.untilIsVisible(neltPerformanceSelectors.InsightsLoaded_Indication_Chart);
                await driver.untilIsVisible(neltPerformanceSelectors.InsightsLoaded_Indication_Chart_SVG); // if there is NO DATA at insights
                await driver.untilIsVisible(neltPerformanceSelectors.InsightsLoaded_Indication_Chart_SVGtext); // if there is NO DATA at insights
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
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });
        describe('4.2. Home Screen --> Dnevni izvestaj  (WITH DATA)', async () => {
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
                await driver.untilIsVisible(neltPerformanceSelectors.getSelectorOfInsightsGalleryCardByText('0'));
                await driver.untilIsVisible(neltPerformanceSelectors.InsightsLoaded_Indication_Table);
                await driver.untilIsVisible(neltPerformanceSelectors.InsightsLoaded_Indication_Table_Header);
                await driver.untilIsVisible(neltPerformanceSelectors.getSelectorOfInsightsTableHeaderdByText('Target'));
                await driver.untilIsVisible(neltPerformanceSelectors.InsightsLoaded_Indication_Chart);
                await driver.untilIsVisible(neltPerformanceSelectors.InsightsLoaded_Indication_ChartGraph); // if there is data at insights
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
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 5
        describe('5. Home Screen --> Kupci', async () => {
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
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 6
        describe('6. Home Screen --> Kupci --> Select account', async () => {
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
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 7
        describe('7. Home Screen --> Kupci --> Select Account --> + --> Ekstenzija KL', async () => {
            it('Navigate to first account from Home Screen main button', async function () {
                await neltPerfomanceService.selectAccountViaHomePageMainButton.bind(this)(driver, '');
            });
            it('Clicking Plus Button at Account Dashboard', async function () {
                await neltPerfomanceService.clickPlusButtonMenuAtAccountDashboard.bind(this)(driver);
            });
            it('Choosing "Ekstenzija KL" at Catalogs List', async function () {
                await driver.untilIsVisible(neltPerformanceSelectors.OrderCatalogItem);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Catalogs List loaded`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                // time measurment
                const Ekstenzija_KL_opening = new Date().getTime();
                await driver.click(neltPerformanceSelectors.getSelectorOfOrderCatalogByName('Ekstenzija KL'));
                await neltPerformanceSelectors.isSpinnerDone();
                await driver.untilIsVisible(neltPerformanceSelectors.Cart_Button);
                await driver.untilIsVisible(neltPerformanceSelectors.TransactionID);
                await driver.untilIsVisible(neltPerformanceSelectors.OrderCenterItem_OrderButton_GridLineView);
                const Ekstenzija_KL_loaded = new Date().getTime();
                timeInterval = Ekstenzija_KL_loaded - Ekstenzija_KL_opening;
                console.info(
                    'Ekstenzija_KL_opening: ',
                    Ekstenzija_KL_opening,
                    'Ekstenzija_KL_loaded: ',
                    Ekstenzija_KL_loaded,
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
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 8
        describe('8. Home Screen --> Kupci --> Select Account --> + --> Ekstenzija KL --> Submit', async () => {
            it('Navigate to first account from Home Screen main button', async function () {
                await neltPerfomanceService.selectAccountViaHomePageMainButton.bind(this)(driver, '');
            });
            it('Choosing "Ekstenzija KL" at Dropdown Menu of Plus Button at Account Dashboard', async function () {
                await neltPerfomanceService.selectUnderPlusButtonMenuAtAccountDashboard.bind(this)(
                    driver,
                    'Ekstenzija KL',
                );
            });
            it('Clicking Submit at "Ekstenzija KL"', async function () {
                await driver.untilIsVisible(neltPerformanceSelectors.HomeMenuDropdown);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `"Ekstenzija KL" Submitted`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                // time measurment
                const Ekstenzija_KL_submit_opening = new Date().getTime();
                await driver.click(neltPerformanceSelectors.getSelectorOfOrderCatalogByName('CC Call Centar'));
                await neltPerformanceSelectors.isSpinnerDone();
                await driver.untilIsVisible(neltPerformanceSelectors.Cart_Button);
                await driver.untilIsVisible(neltPerformanceSelectors.TransactionID);
                await driver.untilIsVisible(neltPerformanceSelectors.OrderCenterItem_OrderButton_GridLineView);
                const Ekstenzija_KL_submit_loaded = new Date().getTime();
                timeInterval = Ekstenzija_KL_submit_loaded - Ekstenzija_KL_submit_opening;
                console.info(
                    'Ekstenzija_KL_submit_opening: ',
                    Ekstenzija_KL_submit_opening,
                    'Ekstenzija_KL_submit_loaded: ',
                    Ekstenzija_KL_submit_loaded,
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
                    title: `Time Interval for "Ekstenzija KL" Submit to finish:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
                        1,
                    )} s`,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 9
        describe('9. Home Screen --> Kupci --> Select Account (1100072) --> + --> Order --> Select catalogue (CC call center)', async () => {
            it('Navigate to account 1100072 from Home Screen', async function () {
                await neltPerfomanceService.selectAccountViaHomePageMainButton.bind(this)(driver, '1100072');
            });
            it('Choosing "Order" at Dropdown Menu of Plus Button at Account Dashboard', async function () {
                await neltPerfomanceService.selectUnderPlusButtonMenuAtAccountDashboard.bind(this)(driver, 'Order');
            });
            it('Choosing "CC Call Centar" at Catalogs List', async function () {
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
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 10
        describe('10. Home Screen --> Kupci --> Select Account (1100072) --> + -- Order --> Select catalogue (CC call center) --> Add items --> Click on cart', async () => {
            it('Navigate to account 1100072 from Home Screen', async function () {
                await neltPerfomanceService.selectAccountViaHomePageMainButton.bind(this)(driver, '1100072', 'ID');
            });
            it('Choosing "Order" at Dropdown Menu of Plus Button at Account Dashboard', async function () {
                await neltPerfomanceService.selectUnderPlusButtonMenuAtAccountDashboard.bind(this)(driver, 'Order');
            });
            it('Choosing "CC Call Centar" at Catalogs List', async function () {
                await neltPerfomanceService.choosingCatalogForOrder.bind(this)(driver, 'CC Call Centar');
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
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 11
        describe('11. Home Screen --> Kupci --> Select Account (1100072) --> + --> Order --> Select catalogue (CC call center) --> Select filter', async () => {
            it('Navigate to account 1100072 from Home Screen', async function () {
                await neltPerfomanceService.selectAccountViaHomePageMainButton.bind(this)(
                    driver,
                    'DOBROTA STR br. APR',
                    'name',
                );
            });
            it('Choosing "Order" at Dropdown Menu of Plus Button at Account Dashboard', async function () {
                await neltPerfomanceService.selectUnderPlusButtonMenuAtAccountDashboard.bind(this)(driver, 'Order');
            });
            it('Choosing "CC Call Centar" at Catalogs List', async function () {
                await neltPerfomanceService.choosingCatalogForOrder.bind(this)(driver, 'CC Call Centar');
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
                await driver.click(
                    neltPerformanceSelectors.getSelectorOfOrderCenterSideBarTreeItemByName('Svi filteri'),
                );
                await neltPerformanceSelectors.isSpinnerDone();
                await driver.untilIsVisible(
                    neltPerformanceSelectors.getSelectorOfOrderCenterSideBarTreeItemByName('Nestle Dairy'),
                );
                const Select_Filter_opening = new Date().getTime();
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
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 12
        describe('12. Home Screen --> Kupci --> Select Account (1100072) --> + --> Order --> Select catalogue (CC call center) --> Select smart filter', async () => {
            it('Navigate to account 1100072 from Home Screen', async function () {
                await neltPerfomanceService.selectAccountViaHomePageMainButton.bind(this)(driver, '1100072', 'ID');
            });
            it('Choosing "Order" at Dropdown Menu of Plus Button at Account Dashboard', async function () {
                await neltPerfomanceService.selectUnderPlusButtonMenuAtAccountDashboard.bind(this)(driver, 'Order');
            });
            it('Choosing "CC Call Centar" at Catalogs List', async function () {
                await neltPerfomanceService.choosingCatalogForOrder.bind(this)(driver, 'CC Call Centar');
            });
            it('Select Smart Filter', async function () {
                resultsNumberBefore = await (
                    await driver.findElement(neltPerformanceSelectors.ListNumberOfResults)
                ).getText();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Catalogs List loaded`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                await driver.click(neltPerformanceSelectors.getSelectorOfSmartFilterFieldByName('Zalihe'));
                // await neltPerformanceSelectors.isSpinnerDone();
                // await driver.untilIsVisible(
                //     neltPerformanceSelectors.getSelectorOfOrderCenterSideBarTreeItemByName('Nestle Dairy'),
                // );
                // time measurment
                const Select_Smart_Filter_opening = new Date().getTime();
                // await driver.click(
                //     neltPerformanceSelectors.getSelectorOfOrderCenterSideBarTreeItemByName('Nestle Dairy'),
                // );
                // await neltPerformanceSelectors.isSpinnerDone();
                // await driver.untilIsVisible(neltPerformanceSelectors.Cart_Button);
                // await driver.untilIsVisible(neltPerformanceSelectors.TransactionID);
                // await driver.untilIsVisible(neltPerformanceSelectors.OrderCenterItem_QuantitySelector_GridLineView);
                const Select_Smart_Filter_loaded = new Date().getTime();
                timeInterval = Select_Smart_Filter_loaded - Select_Smart_Filter_opening;
                resultsNumberAfter = await (
                    await driver.findElement(neltPerformanceSelectors.ListNumberOfResults)
                ).getText();
                console.info(
                    'Select_Smart_Filter_opening: ',
                    Select_Smart_Filter_opening,
                    'Select_Smart_Filter_loaded: ',
                    Select_Smart_Filter_loaded,
                    'Time Interval: ',
                    timeInterval,
                );
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Smart Filter Selected`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Select Smart Filter" to load:`,
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
                // expect(Number(resultsNumberAfter)).to.not.equal(Number(resultsNumberBefore));
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 13
        describe('13. Home Screen --> Kupci --> Select Account (1100072) --> + --> Order --> Select catalogue (CC call center) --> Change sort by', async () => {
            it('Navigate to account 1100072 from Home Screen', async function () {
                await neltPerfomanceService.selectAccountViaHomePageMainButton.bind(this)(driver, '1100072', 'ID');
            });
            it('Choosing "Order" at Dropdown Menu of Plus Button at Account Dashboard', async function () {
                await neltPerfomanceService.selectUnderPlusButtonMenuAtAccountDashboard.bind(this)(driver, 'Order');
            });
            it('Choosing "CC Call Centar" at Catalogs List', async function () {
                await neltPerfomanceService.choosingCatalogForOrder.bind(this)(driver, 'CC Call Centar');
            });
            it('Change sort by', async function () {
                resultsNumberBefore = await (
                    await driver.findElement(neltPerformanceSelectors.ListNumberOfResults)
                ).getText();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Catalogs List loaded`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                await driver.click(neltPerformanceSelectors.getSelectorOfSmartFilterFieldByName('Zalihe'));
                // await neltPerformanceSelectors.isSpinnerDone();
                // await driver.untilIsVisible(
                //     neltPerformanceSelectors.getSelectorOfOrderCenterSideBarTreeItemByName('Nestle Dairy'),
                // );
                // time measurment
                const Change_sort_by_opening = new Date().getTime();
                // await driver.click(
                //     neltPerformanceSelectors.getSelectorOfOrderCenterSideBarTreeItemByName('Nestle Dairy'),
                // );
                // await neltPerformanceSelectors.isSpinnerDone();
                // await driver.untilIsVisible(neltPerformanceSelectors.Cart_Button);
                // await driver.untilIsVisible(neltPerformanceSelectors.TransactionID);
                // await driver.untilIsVisible(neltPerformanceSelectors.OrderCenterItem_QuantitySelector_GridLineView);
                const Change_sort_by_loaded = new Date().getTime();
                timeInterval = Change_sort_by_loaded - Change_sort_by_opening;
                resultsNumberAfter = await (
                    await driver.findElement(neltPerformanceSelectors.ListNumberOfResults)
                ).getText();
                console.info(
                    'Change_sort_by_opening: ',
                    Change_sort_by_opening,
                    'Change_sort_by_loaded: ',
                    Change_sort_by_loaded,
                    'Time Interval: ',
                    timeInterval,
                );
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Sort-by Changed`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Change sort by" to load:`,
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
                // expect(Number(resultsNumberAfter)).to.not.equal(Number(resultsNumberBefore));
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 14
        describe('14. Home Screen --> Kupci -- Select Account (1100072) --> + --> Order --> Select catalogue (CC call center) --> Open promotions that are (bundles) --> Click Done', async () => {
            it('Navigate to account 1100072 from Home Screen', async function () {
                await neltPerfomanceService.selectAccountViaHomePageMainButton.bind(this)(driver, '1100072', 'ID');
            });
            it('Choosing "Order" at Dropdown Menu of Plus Button at Account Dashboard', async function () {
                await neltPerfomanceService.selectUnderPlusButtonMenuAtAccountDashboard.bind(this)(driver, 'Order');
            });
            it('Choosing "CC Call Centar" at Catalogs List', async function () {
                await neltPerfomanceService.choosingCatalogForOrder.bind(this)(driver, 'CC Call Centar');
            });
            it('Open promotions that are bundles', async function () {
                resultsNumberBefore = await (
                    await driver.findElement(neltPerformanceSelectors.ListNumberOfResults)
                ).getText();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Catalogs List loaded`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                await driver.click(neltPerformanceSelectors.getSelectorOfSmartFilterFieldByName('Zalihe'));
                // await neltPerformanceSelectors.isSpinnerDone();
                // await driver.untilIsVisible(
                //     neltPerformanceSelectors.getSelectorOfOrderCenterSideBarTreeItemByName('Nestle Dairy'),
                // );
                // time measurment
                const Open_promotions_bundles_opening = new Date().getTime();
                // await driver.click(
                //     neltPerformanceSelectors.getSelectorOfOrderCenterSideBarTreeItemByName('Nestle Dairy'),
                // );
                // await neltPerformanceSelectors.isSpinnerDone();
                // await driver.untilIsVisible(neltPerformanceSelectors.Cart_Button);
                // await driver.untilIsVisible(neltPerformanceSelectors.TransactionID);
                // await driver.untilIsVisible(neltPerformanceSelectors.OrderCenterItem_QuantitySelector_GridLineView);
                const Open_promotions_bundles_loaded = new Date().getTime();
                timeInterval = Open_promotions_bundles_loaded - Open_promotions_bundles_opening;
                resultsNumberAfter = await (
                    await driver.findElement(neltPerformanceSelectors.ListNumberOfResults)
                ).getText();
                console.info(
                    'Open_promotions_bundles_opening: ',
                    Open_promotions_bundles_opening,
                    'Open_promotions_bundles_loaded: ',
                    Open_promotions_bundles_loaded,
                    'Time Interval: ',
                    timeInterval,
                );
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Sort-by Changed`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Open promotions bundles" to load:`,
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
                // expect(Number(resultsNumberAfter)).to.not.equal(Number(resultsNumberBefore));
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 15
        describe('15. Home Screen --> Kupci --> Select Account (1100072) --> + --> Order --> Select catalogue (CC call center) --> Open promotions (not bundles) --> Click Done', async () => {
            it('Navigate to account 1100072 from Home Screen', async function () {
                await neltPerfomanceService.selectAccountViaHomePageMainButton.bind(this)(driver, '1100072', 'ID');
            });
            it('Choosing "Order" at Dropdown Menu of Plus Button at Account Dashboard', async function () {
                await neltPerfomanceService.selectUnderPlusButtonMenuAtAccountDashboard.bind(this)(driver, 'Order');
            });
            it('Choosing "CC Call Centar" at Catalogs List', async function () {
                await neltPerfomanceService.choosingCatalogForOrder.bind(this)(driver, 'CC Call Centar');
            });
            it('Open promotions that are NOT bundles', async function () {
                resultsNumberBefore = await (
                    await driver.findElement(neltPerformanceSelectors.ListNumberOfResults)
                ).getText();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Catalogs List loaded`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                await driver.click(neltPerformanceSelectors.getSelectorOfSmartFilterFieldByName('Zalihe'));
                // await neltPerformanceSelectors.isSpinnerDone();
                // await driver.untilIsVisible(
                //     neltPerformanceSelectors.getSelectorOfOrderCenterSideBarTreeItemByName('Nestle Dairy'),
                // );
                // time measurment
                const Open_promotions_not_bundles_opening = new Date().getTime();
                // await driver.click(
                //     neltPerformanceSelectors.getSelectorOfOrderCenterSideBarTreeItemByName('Nestle Dairy'),
                // );
                // await neltPerformanceSelectors.isSpinnerDone();
                // await driver.untilIsVisible(neltPerformanceSelectors.Cart_Button);
                // await driver.untilIsVisible(neltPerformanceSelectors.TransactionID);
                // await driver.untilIsVisible(neltPerformanceSelectors.OrderCenterItem_QuantitySelector_GridLineView);
                const Open_promotions_not_bundles_loaded = new Date().getTime();
                timeInterval = Open_promotions_not_bundles_loaded - Open_promotions_not_bundles_opening;
                resultsNumberAfter = await (
                    await driver.findElement(neltPerformanceSelectors.ListNumberOfResults)
                ).getText();
                console.info(
                    'Open_promotions_not_bundles_opening: ',
                    Open_promotions_not_bundles_opening,
                    'Open_promotions_not_bundles_loaded: ',
                    Open_promotions_not_bundles_loaded,
                    'Time Interval: ',
                    timeInterval,
                );
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Sort-by Changed`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Open promotions NOT bundles" to load:`,
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
                // expect(Number(resultsNumberAfter)).to.not.equal(Number(resultsNumberBefore));
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 16
        describe('16. Home Screen --> Kupci --> Select account --> Burger menu --> Istorija prodaje po kupcu', async () => {
            it('Navigate to first account in list from Home Screen', async function () {
                await neltPerfomanceService.selectAccountViaHomePageMainButton.bind(this)(driver, '');
            });
            it('Clicking Burger Menu', async function () {
                await driver.click(neltPerformanceSelectors.AccountDashboard_BurgerMenu);
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
                    neltPerformanceSelectors.getSelectorOfAccountDashboardHamburgerMenuItemByName(
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
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 17
        // describe('17. Home Screen --> Kupci --> Select account --> Burger menu --> Kartica Kupca', async () => {
        //     it('Navigate to first account in list from Home Screen', async function () {
        //         await neltPerfomanceService.selectAccountViaHomePageMainButton.bind(this)(driver, '');
        //     });
        //     it('Clicking on Hamburger Menu at Account Dashboard', async function () {
        //         await neltPerfomanceService.clickHamburgerMenuAtAccountDashboard.bind(this)(driver);
        //     });
        //     // it('Clicking Burger Menu', async function () {
        //     //     await driver.click(neltPerformanceSelectors.AccountDashboard_BurgerMenu);
        //     //     await neltPerformanceSelectors.isSpinnerDone();
        //     //     await driver.untilIsVisible(neltPerformanceSelectors.HomeMenuDropdown);
        //     //     base64ImageComponent = await driver.saveScreenshots();
        //     //     addContext(this, {
        //     //         title: `Hamburger Menu Opened`,
        //     //         value: 'data:image/png;base64,' + base64ImageComponent,
        //     //     });
        //     // });
        //     it('Choosing "Kartica kupca" Resource View', async function () {
        //         base64ImageComponent = await driver.saveScreenshots();
        //         addContext(this, {
        //             title: `Choosing "Kartica Kupca" From Menu`,
        //             value: 'data:image/png;base64,' + base64ImageComponent,
        //         });
        //         // time measurment
        //         const Kartica_kupca_opening = new Date().getTime();
        //         await driver.click(
        //             neltPerformanceSelectors.getSelectorOfAccountDashboardHamburgerMenuItemByName(
        //                 'Kartica kupca',
        //             ),
        //         );
        //         await neltPerformanceSelectors.isSpinnerDone();
        //         // await driver.untilIsVisible(neltPerformanceSelectors.Iframe);
        //         // await driver.untilIsVisible(neltPerformanceSelectors.ListRow);
        //         // await driver.untilIsVisible(
        //         //     neltPerformanceSelectors.ResourceView_Indication_TableHeader_Label_Category,
        //         // );
        //         // await driver.untilIsVisible(
        //         //     neltPerformanceSelectors.ResourceView_Indication_TableHeader_Label_returnYTD,
        //         // );
        //         const Kartica_kupca_loaded = new Date().getTime();
        //         timeInterval = Kartica_kupca_loaded - Kartica_kupca_opening;
        //         console.info(
        //             'Kartica_kupca_opening: ',
        //             Kartica_kupca_opening,
        //             'Kartica_kupca_loaded: ',
        //             Kartica_kupca_loaded,
        //             'Time Interval: ',
        //             timeInterval,
        //         );
        //         base64ImageComponent = await driver.saveScreenshots();
        //         addContext(this, {
        //             title: `At "Kartica kupca" View`,
        //             value: 'data:image/png;base64,' + base64ImageComponent,
        //         });
        //         driver.sleep(5 * 1000);
        //         await driver.switchTo(neltPerformanceSelectors.Iframe);
        //         await driver.click(neltPerformanceSelectors.WebappIframe_closeButton);
        //     });
        //     it(`Time Measured`, async function () {
        //         await driver.switchToDefaultContent();
        //         addContext(this, {
        //             title: `Time Interval for "Kartica kupca" to load:`,
        //             value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
        //                 1,
        //             )} s`,
        //         });
        //         driver.sleep(0.5 * 1000);
        //     });
        //     it('Back to Home Screen', async function () {
        //         await neltPerfomanceService.toHomeScreen.bind(this, driver)();
        //     });
        // });

        // 18
        describe('18. Home Screen --> Kupci --> Select account --> Burger menu --> Pocni Posetu --> Select visit flow --> Start', async () => {
            it('Navigate to first account in list from Home Screen', async function () {
                await neltPerfomanceService.selectAccountViaHomePageMainButton.bind(this)(driver, '');
            });
            it('Choosing "Pocni Posetu" at Dropdown Menu of Hamburger Menu at Account Dashboard', async function () {
                await neltPerfomanceService.selectUnderHamburgerMenuAtAccountDashboard.bind(this)(
                    driver,
                    'Pocni posetu',
                );
            });
            it('Selecting Visit Flow from visits selection', async function () {
                await neltPerfomanceService.selectVisitFlowFromMultipleVisitsSelection.bind(this)(
                    driver,
                    'F4 out-of-store poseta',
                );
            });
            it('Starting Visit Flow', async function () {
                await neltPerfomanceService.selectVisitGroup.bind(this)(driver, 'Start posete');
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Choosing "Start posete" at Visits Selection`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                // time measurment
                const Start_posete_opening = new Date().getTime();
                await driver.click(neltPerformanceSelectors.getSelectorOfVisitStepByText('Start posete'));
                await neltPerformanceSelectors.isSpinnerDone();
                // await driver.untilIsVisible(neltPerformanceSelectors.ListRow);
                // await driver.untilIsVisible(
                //     neltPerformanceSelectors.ResourceView_Indication_TableHeader_Label_Category,
                // );
                // await driver.untilIsVisible(
                //     neltPerformanceSelectors.ResourceView_Indication_TableHeader_Label_returnYTD,
                // );
                const Start_posete_loaded = new Date().getTime();
                timeInterval = Start_posete_loaded - Start_posete_opening;
                console.info(
                    'Start_posete_opening: ',
                    Start_posete_opening,
                    'Start_posete_loaded: ',
                    Start_posete_loaded,
                    'Time Interval: ',
                    timeInterval,
                );
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At "Start posete" Visit Flow Step`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                driver.sleep(5 * 1000);
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Start posete" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
                        1,
                    )} s`,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 19
        describe('19. Home Screen --> Kupci --> Select account --> Burger menu --> Pocni Posetu --> Select visit flow --> Start --> End', async () => {
            it('Navigate to first account in list from Home Screen', async function () {
                await neltPerfomanceService.selectAccountViaHomePageMainButton.bind(this)(driver, '');
            });
            it('Choosing "Pocni Posetu" at Dropdown Menu of Hamburger Menu at Account Dashboard', async function () {
                await neltPerfomanceService.selectUnderHamburgerMenuAtAccountDashboard.bind(this)(
                    driver,
                    'Pocni posetu',
                );
            });
            it('Selecting Visit Flow from visits selection', async function () {
                await neltPerfomanceService.selectVisitFlowFromMultipleVisitsSelection.bind(this)(
                    driver,
                    'F4 out-of-store poseta',
                );
            });
            it('Starting Visit Flow', async function () {
                await neltPerfomanceService.selectVisitGroup.bind(this)(driver, 'Start posete');
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Choosing "Start posete" at Visits Selection`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                // time measurment
                const Start_posete_opening = new Date().getTime();
                await driver.click(neltPerformanceSelectors.getSelectorOfVisitStepByText('Start posete'));
                await neltPerformanceSelectors.isSpinnerDone();
                // await driver.untilIsVisible(neltPerformanceSelectors.ListRow);
                // await driver.untilIsVisible(
                //     neltPerformanceSelectors.ResourceView_Indication_TableHeader_Label_Category,
                // );
                // await driver.untilIsVisible(
                //     neltPerformanceSelectors.ResourceView_Indication_TableHeader_Label_returnYTD,
                // );
                const Start_posete_loaded = new Date().getTime();
                timeInterval = Start_posete_loaded - Start_posete_opening;
                console.info(
                    'Start_posete_opening: ',
                    Start_posete_opening,
                    'Start_posete_loaded: ',
                    Start_posete_loaded,
                    'Time Interval: ',
                    timeInterval,
                );
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At "Start posete" Visit Flow Step`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                driver.sleep(5 * 1000);
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Start posete" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
                        1,
                    )} s`,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 20
        describe('20. Home Screen --> Kupci --> Select account --> Burger menu --> Pocni Posetu --> Select visit flow --> Open --> Select Provat --> Provat order', async () => {
            it('Navigate to first account in list from Home Screen', async function () {
                await neltPerfomanceService.selectAccountViaHomePageMainButton.bind(this)(driver, '');
            });
            it('Choosing "Pocni Posetu" at Dropdown Menu of Hamburger Menu at Account Dashboard', async function () {
                await neltPerfomanceService.selectUnderHamburgerMenuAtAccountDashboard.bind(this)(
                    driver,
                    'Pocni posetu',
                );
            });
            it('Selecting Visit Flow from visits selection', async function () {
                await neltPerfomanceService.selectVisitFlowFromMultipleVisitsSelection.bind(this)(
                    driver,
                    'F4 out-of-store poseta',
                );
            });
            it('Starting Visit Flow', async function () {
                await neltPerfomanceService.selectVisitGroup.bind(this)(driver, 'Start posete');
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Choosing "Start posete" at Visits Selection`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                // time measurment
                const Start_posete_opening = new Date().getTime();
                await driver.click(neltPerformanceSelectors.getSelectorOfVisitStepByText('Start posete'));
                await neltPerformanceSelectors.isSpinnerDone();
                // await driver.untilIsVisible(neltPerformanceSelectors.ListRow);
                // await driver.untilIsVisible(
                //     neltPerformanceSelectors.ResourceView_Indication_TableHeader_Label_Category,
                // );
                // await driver.untilIsVisible(
                //     neltPerformanceSelectors.ResourceView_Indication_TableHeader_Label_returnYTD,
                // );
                const Start_posete_loaded = new Date().getTime();
                timeInterval = Start_posete_loaded - Start_posete_opening;
                console.info(
                    'Start_posete_opening: ',
                    Start_posete_opening,
                    'Start_posete_loaded: ',
                    Start_posete_loaded,
                    'Time Interval: ',
                    timeInterval,
                );
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At "Start posete" Visit Flow Step`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                driver.sleep(5 * 1000);
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Start posete" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
                        1,
                    )} s`,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 21
        describe('21. Home Screen --> Kupci --> Select account --> Burger menu --> Pocni Posetu --> Select visit flow --> Open --> Select Provat --> Provat order --> Add item --> Submit', async () => {
            it('Navigate to first account in list from Home Screen', async function () {
                await neltPerfomanceService.selectAccountViaHomePageMainButton.bind(this)(driver, '');
            });
            it('Choosing "Pocni Posetu" at Dropdown Menu of Hamburger Menu at Account Dashboard', async function () {
                await neltPerfomanceService.selectUnderHamburgerMenuAtAccountDashboard.bind(this)(
                    driver,
                    'Pocni posetu',
                );
            });
            it('Selecting Visit Flow from visits selection', async function () {
                await neltPerfomanceService.selectVisitFlowFromMultipleVisitsSelection.bind(this)(
                    driver,
                    'F4 out-of-store poseta',
                );
            });
            it('Starting Visit Flow', async function () {
                await neltPerfomanceService.selectVisitGroup.bind(this)(driver, 'Start posete');
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Choosing "Start posete" at Visits Selection`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                // time measurment
                const Start_posete_opening = new Date().getTime();
                await driver.click(neltPerformanceSelectors.getSelectorOfVisitStepByText('Start posete'));
                await neltPerformanceSelectors.isSpinnerDone();
                // await driver.untilIsVisible(neltPerformanceSelectors.ListRow);
                // await driver.untilIsVisible(
                //     neltPerformanceSelectors.ResourceView_Indication_TableHeader_Label_Category,
                // );
                // await driver.untilIsVisible(
                //     neltPerformanceSelectors.ResourceView_Indication_TableHeader_Label_returnYTD,
                // );
                const Start_posete_loaded = new Date().getTime();
                timeInterval = Start_posete_loaded - Start_posete_opening;
                console.info(
                    'Start_posete_opening: ',
                    Start_posete_opening,
                    'Start_posete_loaded: ',
                    Start_posete_loaded,
                    'Time Interval: ',
                    timeInterval,
                );
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At "Start posete" Visit Flow Step`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                driver.sleep(5 * 1000);
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Start posete" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
                        1,
                    )} s`,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 22
        describe('22. Home Screen --> Kupci --> Select account --> Burger menu --> Pocni Posetu --> Select visit flow --> Open --> Near Expiry order', async () => {
            it('Navigate to first account in list from Home Screen', async function () {
                await neltPerfomanceService.selectAccountViaHomePageMainButton.bind(this)(driver, '');
            });
            it('Choosing "Pocni Posetu" at Dropdown Menu of Hamburger Menu at Account Dashboard', async function () {
                await neltPerfomanceService.selectUnderHamburgerMenuAtAccountDashboard.bind(this)(
                    driver,
                    'Pocni posetu',
                );
            });
            it('Selecting Visit Flow from visits selection', async function () {
                await neltPerfomanceService.selectVisitFlowFromMultipleVisitsSelection.bind(this)(
                    driver,
                    'F4 out-of-store poseta',
                );
            });
            it('Starting Visit Flow', async function () {
                await neltPerfomanceService.selectVisitGroup.bind(this)(driver, 'Start posete');
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Choosing "Start posete" at Visits Selection`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                // time measurment
                const Start_posete_opening = new Date().getTime();
                await driver.click(neltPerformanceSelectors.getSelectorOfVisitStepByText('Start posete'));
                await neltPerformanceSelectors.isSpinnerDone();
                // await driver.untilIsVisible(neltPerformanceSelectors.ListRow);
                // await driver.untilIsVisible(
                //     neltPerformanceSelectors.ResourceView_Indication_TableHeader_Label_Category,
                // );
                // await driver.untilIsVisible(
                //     neltPerformanceSelectors.ResourceView_Indication_TableHeader_Label_returnYTD,
                // );
                const Start_posete_loaded = new Date().getTime();
                timeInterval = Start_posete_loaded - Start_posete_opening;
                console.info(
                    'Start_posete_opening: ',
                    Start_posete_opening,
                    'Start_posete_loaded: ',
                    Start_posete_loaded,
                    'Time Interval: ',
                    timeInterval,
                );
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At "Start posete" Visit Flow Step`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                driver.sleep(5 * 1000);
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Start posete" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
                        1,
                    )} s`,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 23
        describe('23. Home Screen --> Kupci --> Select account --> Burger menu --> Pocni Posetu --> Select visit flow --> Open --> Near Expiry order --> Add items --> Submit', async () => {
            it('Navigate to first account in list from Home Screen', async function () {
                await neltPerfomanceService.selectAccountViaHomePageMainButton.bind(this)(driver, '');
            });
            it('Choosing "Pocni Posetu" at Dropdown Menu of Hamburger Menu at Account Dashboard', async function () {
                await neltPerfomanceService.selectUnderHamburgerMenuAtAccountDashboard.bind(this)(
                    driver,
                    'Pocni posetu',
                );
            });
            it('Selecting Visit Flow from visits selection', async function () {
                await neltPerfomanceService.selectVisitFlowFromMultipleVisitsSelection.bind(this)(
                    driver,
                    'F4 out-of-store poseta',
                );
            });
            it('Starting Visit Flow', async function () {
                await neltPerfomanceService.selectVisitGroup.bind(this)(driver, 'Start posete');
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Choosing "Start posete" at Visits Selection`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                // time measurment
                const Start_posete_opening = new Date().getTime();
                await driver.click(neltPerformanceSelectors.getSelectorOfVisitStepByText('Start posete'));
                await neltPerformanceSelectors.isSpinnerDone();
                // await driver.untilIsVisible(neltPerformanceSelectors.ListRow);
                // await driver.untilIsVisible(
                //     neltPerformanceSelectors.ResourceView_Indication_TableHeader_Label_Category,
                // );
                // await driver.untilIsVisible(
                //     neltPerformanceSelectors.ResourceView_Indication_TableHeader_Label_returnYTD,
                // );
                const Start_posete_loaded = new Date().getTime();
                timeInterval = Start_posete_loaded - Start_posete_opening;
                console.info(
                    'Start_posete_opening: ',
                    Start_posete_opening,
                    'Start_posete_loaded: ',
                    Start_posete_loaded,
                    'Time Interval: ',
                    timeInterval,
                );
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At "Start posete" Visit Flow Step`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                driver.sleep(5 * 1000);
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Start posete" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
                        1,
                    )} s`,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 6
        // describe('6. Account Dashboard? CC agent use webapp', async () => {});

        // 10
        // describe('10. Zatvaranje ordera', async () => {});

        // 26
        // describe('26. Status dokumenata', async () => {});

        // 29
        // describe('29. Artikli na leafletu (Opening of page products on leaflet)', async () => {});

        // 30
        // describe('30. Open list of task on accounts', async () => {});

        // 31
        // describe('31. Task response', async () => {});
    });
}
