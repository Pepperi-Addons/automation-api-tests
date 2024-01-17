import { describe, it, before, after } from 'mocha';
import chai from 'chai';
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

        describe('Home Screen -- Finansijski podaci', async () => {
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
                // await driver.untilIsVisible(neltPerformanceSelectors.ListRow);
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
            it(`Time Measurement`, async function () {
                addContext(this, {
                    title: `Time Interval for "Finansijski podaci" to load:`,
                    value: `${timeInterval} ms`,
                });
                driver.sleep(5 * 1000);
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

        describe('Home Screen -- Dugovnaja', async () => {
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
            it(`Time Measurement`, async function () {
                addContext(this, {
                    title: `Time Interval for "Dugovanja" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${Math.round(
                        timeInterval / 1000,
                    )} s`,
                });
                driver.sleep(5 * 1000);
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

        describe('Home Screen -- Dnevni plan', async () => {
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
            it(`Time Measurement`, async function () {
                addContext(this, {
                    title: `Time Interval for "Dnevni plan" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${Math.round(
                        timeInterval / 1000,
                    )} s`,
                });
                driver.sleep(5 * 1000);
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

        describe('Home Screen -- Kupci', async () => {
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
            it(`Time Measurement`, async function () {
                addContext(this, {
                    title: `Time Interval for "Kupci" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${Math.round(
                        timeInterval / 1000,
                    )} s`,
                });
                driver.sleep(5 * 1000);
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

        describe('Home Screen -- Kupci -- Select account', async () => {
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
            it(`Time Measurement`, async function () {
                addContext(this, {
                    title: `Time Interval for "Kupci Account" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${Math.round(
                        timeInterval / 1000,
                    )} s`,
                });
                driver.sleep(5 * 1000);
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

        // describe('Account Dashboard? CC agent use webapp', async () => {});
        // describe('Home Screen -- Kupci -- Select account -- Burger menu -- Istorija prodaje po kupcu', async () => {});

        describe('Home Screen -- Kupci -- Select Account (1100072) -- + -- Order -- Select catalogue (CC call center)', async () => {
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
                // driver.sleep(5 * 1000);
                // base64ImageComponent = await driver.saveScreenshots();
                // addContext(this, {
                //     title: `After Search for Account "1100072"`,
                //     value: 'data:image/png;base64,' + base64ImageComponent,
                // });
            });
            it('Clicking on Account 1100072 at search results', async function () {
                // await driver.click(neltPerformanceSelectors.getSelectorOfAccountHyperlinkByName('DOBROTA STR br. APR'));
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
                    title: `"Order" chosen`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Choosing "CC Call Center" at Catalog', async function () {
                // await driver.untilIsVisible(neltPerformanceSelectors.HomeMenuDropdown);
                // await driver.click(neltPerformanceSelectors.getSelectorOfAccountActivityPlusButtonMenuItemByName('Order'));
                await neltPerformanceSelectors.isSpinnerDone();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `"Order" chosen`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
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

        // describe('Home Screen -- Kupci -- Select Account (1100072) -- + -- Order -- Select catalogue (CC call center) -- Add items -- Click on cart', async () => {});
        // describe('Zatvaranje ordera', async () => {});
        // describe('Home Screen -- Kupci -- Select Account (1100072) -- + -- Order -- Select catalogue (CC call center) -- Select filter', async () => {
        // });
        // describe('Home Screen -- Kupci -- Select Account (1100072) -- + -- Order -- Select catalogue (CC call center) -- Select smart filter', async () => {
        // });
        // describe('Home Screen -- Kupci -- Select Account (1100072) -- + -- Order -- Select catalogue (CC call center) -- Change sort by', async () => {
        // });
        // describe('Home Screen -- Kupci -- Select Account (1100072) -- + -- Order -- Select catalogue (CC call center) -- Open promotions that are (bundles)', async () => {
        // });
        // describe('Home Screen -- Kupci -- Select Account (1100072) -- + -- Order -- Select catalogue (CC call center) -- Open promotions (not bundles)', async () => {
        // });
        // describe('Home Screen -- Kupci -- Select Account (1100072) -- + -- Order -- Select catalogue (CC call center) -- Open promotions (not bundles) -- Click Done', async () => {
        // });
        // describe('Home Screen -- Kupci -- Select account -- Burger menu -- Pocni Posetu -- Select visit flow -- Open -- Select Provat -- Provat order', async () => {
        // });
        // describe('Home Screen -- Kupci -- Select account -- Burger menu -- Pocni Posetu -- Select visit flow -- Open -- Select Provat -- Provat order -- Add item -- Submit', async () => {
        // });
        // describe('Home Screen -- Kupci -- Select account -- Burger menu -- Pocni Posetu -- Select visit flow -- Open -- Near Expiry order', async () => {
        // });
        // describe('Home Screen -- Kupci -- Select account -- Burger menu -- Pocni Posetu -- Select visit flow -- Open -- Near Expiry order -- Add items -- Submit', async () => {
        // });

        describe('Home Screen -- Dnevni izvestaj', async () => {
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
                await driver.untilIsVisible(neltPerformanceSelectors.InsightsLoaded_Indication_GalleryCard_text0);
                await driver.untilIsVisible(neltPerformanceSelectors.InsightsLoaded_Indication_Table);
                await driver.untilIsVisible(neltPerformanceSelectors.InsightsLoaded_Indication_Table_Header);
                await driver.untilIsVisible(neltPerformanceSelectors.InsightsLoaded_Indication_Table_Header_Target);
                await driver.untilIsVisible(neltPerformanceSelectors.InsightsLoaded_Indication_Chart);
                await driver.untilIsVisible(neltPerformanceSelectors.InsightsLoaded_Indication_Chart_SVG);
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
            it(`Time Measurement`, async function () {
                addContext(this, {
                    title: `Time Interval for "Dnevni izvestaj" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${Math.round(
                        timeInterval / 1000,
                    )} s`,
                });
                driver.sleep(5 * 1000);
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

        // describe('Home Screen -- Kupci -- Select account -- Burger menu -- Pocni Posetu -- Select visit flow -- Start', async () => {});
        // describe('Home Screen -- Kupci -- Select account -- Burger menu -- Pocni Posetu -- Select visit flow -- Start -- End', async () => {});
        // describe('Home Screen -- Kupci -- Select account -- Burger menu -- Kartica Kupca', async () => {});
        // describe('Status dokumenata', async () => {});
        // describe('Home Screen -- Kupci -- Select Account -- + -- Ekstenzija KL', async () => {});
        // describe('Home Screen -- Kupci -- Select Account -- + -- Ekstenzija KL -- Submit', async () => {});
        // describe('Artikli na leafletu (Opening of page products on leaflet)', async () => {
        // });
        // describe('Open list of task on accounts', async () => {
        // });
        // describe('Task response', async () => {
        // });
    });
}
