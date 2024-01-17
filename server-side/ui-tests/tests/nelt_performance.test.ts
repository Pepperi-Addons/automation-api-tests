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
                await driver.click(
                    neltPerformanceSelectors.getSelectorOfHomeHamburgerMenuItemByName('Finansijski podaci'),
                );
                // time measurment
                driver.sleep(5 * 1000);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At "Finansijski podaci"`,
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
        describe('Home Screen -- Dugovnaja', async () => {
            it('Navigating from Home Screen (through Burger Menu) to "Dugovanja"', async function () {
                await driver.click(neltPerformanceSelectors.HamburgerMenuButtonAtHome);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Home Hamburger Menu Opened:`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                await driver.click(neltPerformanceSelectors.getSelectorOfHomeHamburgerMenuItemByName('Dugovanja'));
                // time measurment
                driver.sleep(0.5 * 1000);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At "Dugovanja"`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
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
        // describe('Home Screen -- Dnevni plan', async () => {
        //     it('Navigating from Home Screen (through Burger Menu) to "Dnevni plan"', async function () {
        //         await driver.click(neltPerformanceSelectors.HamburgerMenuButtonAtHome);
        //         base64ImageComponent = await driver.saveScreenshots();
        //         addContext(this, {
        //             title: `Home Hamburger Menu Opened:`,
        //             value: 'data:image/png;base64,' + base64ImageComponent,
        //         });
        //         await driver.click(neltPerformanceSelectors.getSelectorOfHomeHamburgerMenuItemByName("Dnevni plan"));
        //         // time measurment
        //         driver.sleep(0.5 * 1000);
        //         base64ImageComponent = await driver.saveScreenshots();
        //         addContext(this, {
        //             title: `At "Dnevni plan"`,
        //             value: 'data:image/png;base64,' + base64ImageComponent,
        //         });
        //     });
        //     it('Back to Home Screen', async function () {
        //         await neltPerfomanceService.goHome();
        //         await neltPerformanceSelectors.isSpinnerDone();
        //         driver.sleep(0.5 * 1000);
        //         base64ImageComponent = await driver.saveScreenshots();
        //         addContext(this, {
        //             title: `At Home Page`,
        //             value: 'data:image/png;base64,' + base64ImageComponent,
        //         });
        //     });
        // });
        describe('Home Screen -- Dnevni plan', async () => {
            it('Navigating from Home Screen (through Burger Menu) to "Dnevni plan"', async function () {
                await driver.click(neltPerformanceSelectors.HamburgerMenuButtonAtHome);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Home Hamburger Menu Opened:`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                await driver.click(neltPerformanceSelectors.getSelectorOfHomeHamburgerMenuItemByName('Dnevni plan'));
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At "Dnevni plan"`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                await neltPerformanceSelectors.isSpinnerDone();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `After Spinner Done`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            // it('Choosing First Account in list', async function () {
            //     await neltPerformanceSelectors.isSpinnerDone();
            //     await driver.click(neltPerformanceSelectors.FirstAccountInList);
            //     // time measurment
            //     driver.sleep(0.5 * 1000);
            //     base64ImageComponent = await driver.saveScreenshots();
            //     addContext(this, {
            //         title: `At First Account of "Dnevni plan"`,
            //         value: 'data:image/png;base64,' + base64ImageComponent,
            //     });
            // });
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
                await driver.click(neltPerformanceSelectors.KupciButtonAtHome);
                // time measurment
                driver.sleep(0.5 * 1000);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Kupci`,
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
                await driver.click(neltPerformanceSelectors.FirstAccountInList);
                // time measurment
                driver.sleep(5 * 1000);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Home Page`,
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
                await driver.click(
                    neltPerformanceSelectors.getSelectorOfHomeHamburgerMenuItemByName('Dnevni izvestaj'),
                );
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At "Dnevni izvestaj"`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                await neltPerformanceSelectors.isSpinnerDone();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `After Spinner Done`,
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
