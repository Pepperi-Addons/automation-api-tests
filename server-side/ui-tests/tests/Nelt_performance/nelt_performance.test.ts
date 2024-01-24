import { describe, it, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import addContext from 'mochawesome/addContext';
import { Browser } from '../../utilities/browser';
import { WebAppDialog, WebAppHeader, WebAppHomePage, WebAppList, WebAppLoginPage, WebAppTopBar } from '../../pom';
import { NeltPerformanceService } from './nelt-performance.service';
import { NeltPerformance } from './NeltPerformance';

chai.use(promised);

export async function NeltPerformanceTests(email: string, password: string) {
    const dateTime = new Date();
    const timeMeasurements = {};
    const timeMeasurementsRaw: { description: string; time: number }[] = [];

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
        describe('ResourceView: 1. Home Screen --> Finansijski podaci ********* || BUG', async () => {
            it('Navigating from Home Screen (through Burger Menu) to "Finansijski podaci"', async function () {
                timeInterval = 0;
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
                // timeMeasurements['Home Screen --> Finansijski podaci'] = timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
                // timeMeasurements['Home Screen --> Finansijski podaci'] = Number((timeInterval / 1000).toFixed(1)); // un-comment-out when BUG is fixed
                // timeMeasurementsRaw.push({ description: 'Home Screen --> Finansijski podaci', time: timeInterval }); // un-comment-out when BUG is fixed
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 2
        describe('ResourceView: 2. Home Screen --> Dugovnaja', async () => {
            it('Navigating from Home Screen (through Burger Menu) to "Dugovanja"', async function () {
                timeInterval = 0;
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
                // timeMeasurements['Home Screen --> Dugovnaja'] = timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
                timeMeasurements['Home Screen --> Dugovnaja'] = Number((timeInterval / 1000).toFixed(1));
                timeMeasurementsRaw.push({ description: 'Home Screen --> Dugovnaja', time: timeInterval });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async () => {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 3
        describe('ResourceView: 3. Home Screen --> Dnevni plan', async () => {
            it('Navigating from Home Screen (through Burger Menu) to "Dnevni plan"', async function () {
                timeInterval = 0;
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
                // timeMeasurements['Home Screen --> Dnevni plan'] = timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
                timeMeasurements['Home Screen --> Dnevni plan'] = Number((timeInterval / 1000).toFixed(1));
                timeMeasurementsRaw.push({ description: 'Home Screen --> Dnevni plan', time: timeInterval });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 4
        describe('AccountList: 1. Home Screen --> Kupci', async () => {
            it('Clicking "Kupci" button at Home Screen', async function () {
                timeInterval = 0;
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
                // timeMeasurements['Home Screen --> Kupci'] = timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
                timeMeasurements['Home Screen --> Kupci'] = Number((timeInterval / 1000).toFixed(1));
                timeMeasurementsRaw.push({ description: 'Home Screen --> Kupci', time: timeInterval });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 5
        describe('AccountList: 2. Home Screen --> Kupci --> Select account', async () => {
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
                timeInterval = 0;
                // time measurment
                const KupciAccount_opening = new Date().getTime();
                await driver.click(neltPerformanceSelectors.FirstAccountInList);
                await neltPerformanceSelectors.isSpinnerDone();
                await driver.untilIsVisible(neltPerformanceSelectors.AccountDashboard_PlusButton);
                await driver.untilIsVisible(neltPerformanceSelectors.AccountDashboard_BurgerMenu);
                await driver.untilIsVisible(neltPerformanceSelectors.AccountDetails_component);
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
                // timeMeasurements['Home Screen --> Kupci --> Select account'] = timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
                timeMeasurements['Home Screen --> Kupci --> Select account'] = Number((timeInterval / 1000).toFixed(1));
                timeMeasurementsRaw.push({
                    description: 'Home Screen --> Kupci --> Select account',
                    time: timeInterval,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 6
        describe('AccountAction: 1. Home Screen --> Kupci --> Select Account --> + --> Ekstenzija KL', async () => {
            it('Navigate to first account from Home Screen main button', async function () {
                await neltPerfomanceService.selectAccountViaHomePageMainButton.bind(this)(driver, '');
            });
            it('Clicking Plus Button at Account Dashboard', async function () {
                await neltPerfomanceService.clickPlusButtonMenuAtAccountDashboard.bind(this)(driver);
            });
            it('Choosing "Ekstenzija KL" at Catalogs List', async function () {
                timeInterval = 0;
                // time measurment
                const Ekstenzija_KL_opening = new Date().getTime();
                await driver.click(
                    neltPerformanceSelectors.getSelectorOfAccountDashboardPlusButtonMenuItemByName('Ekstenzija KL'),
                );
                await neltPerformanceSelectors.isSpinnerDone();
                await driver.untilIsVisible(neltPerformanceSelectors.TopBar_Left_CancelButtton);
                await driver.untilIsVisible(neltPerformanceSelectors.TopBar_Right_DoneButtton);
                await driver.untilIsVisible(neltPerformanceSelectors.MatGridList);
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
                    title: `"Ekstenzija KL" loaded`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Ekstenzija KL" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
                        1,
                    )} s`,
                });
                // timeMeasurements['Home Screen --> Kupci --> Select Account --> + --> Ekstenzija KL'] = timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
                timeMeasurements['Home Screen --> Kupci --> Select Account --> + --> Ekstenzija KL'] = Number(
                    (timeInterval / 1000).toFixed(1),
                );
                timeMeasurementsRaw.push({
                    description: 'Home Screen --> Kupci --> Select Account --> + --> Ekstenzija KL',
                    time: timeInterval,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 7
        describe('AccountAction: 2. Home Screen --> Kupci --> Select Account --> + --> Ekstenzija KL --> Submit', async () => {
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
                timeInterval = 0;
                await driver.untilIsVisible(neltPerformanceSelectors.TopBar_Left_CancelButtton);
                await driver.untilIsVisible(neltPerformanceSelectors.TopBar_Right_DoneButtton);
                await driver.untilIsVisible(neltPerformanceSelectors.MatGridList);
                await driver.click(neltPerformanceSelectors.Datum_ekstenzije_od_DateField);
                await driver.untilIsVisible(neltPerformanceSelectors.DatePicker_container);
                await driver.click(neltPerformanceSelectors.DatePicker_highlightedDate);
                await driver.untilIsVisible(neltPerformanceSelectors.Broj_dana_trajanja_ekstenzije_Field);
                await neltPerfomanceService.replaceContentOfInput(
                    driver,
                    neltPerformanceSelectors.Broj_dana_trajanja_ekstenzije_Field,
                    10,
                );
                await driver.untilIsVisible(neltPerformanceSelectors.Razlog_povecanja_DropdownOptionsField);
                await driver.click(neltPerformanceSelectors.Razlog_povecanja_DropdownOptionsField);
                await driver.untilIsVisible(neltPerformanceSelectors.Razlog_povecanja_OptionsList);
                await driver.click(neltPerformanceSelectors.Razlog_povecanja_OptionThatContainsWhiteSpace);
                await driver.untilIsVisible(neltPerformanceSelectors.MatGridList);
                await driver.click(neltPerformanceSelectors.TopBar_Right_DoneButtton);
                await driver.untilIsVisible(neltPerformanceSelectors.Information_popup);
                await driver.untilIsVisible(neltPerformanceSelectors.PepDialog_Continue_button);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `"Ekstenzija KL" Opened`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                // time measurment
                const Ekstenzija_KL_submit_opening = new Date().getTime();
                await driver.click(neltPerformanceSelectors.PepDialog_Continue_button);
                await neltPerformanceSelectors.isSpinnerDone();
                await driver.untilIsVisible(neltPerformanceSelectors.AccountDashboard_PlusButton);
                await driver.untilIsVisible(neltPerformanceSelectors.AccountDashboard_BurgerMenu);
                await driver.untilIsVisible(neltPerformanceSelectors.AccountDetails_component);
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
                // timeMeasurements['Home Screen --> Kupci --> Select Account --> + --> Ekstenzija KL --> Submit'] =
                //     timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
                timeMeasurements['Home Screen --> Kupci --> Select Account --> + --> Ekstenzija KL --> Submit'] =
                    Number((timeInterval / 1000).toFixed(1));
                timeMeasurementsRaw.push({
                    description: 'Home Screen --> Kupci --> Select Account --> + --> Ekstenzija KL --> Submit',
                    time: timeInterval,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 17
        describe('ExternalResourceView: 1. Home Screen --> Kupci --> Select account --> Burger menu --> Kartica Kupca', async () => {
            it('Navigate to first account in list from Home Screen', async function () {
                await neltPerfomanceService.selectAccountViaHomePageMainButton.bind(this)(driver, '');
            });
            it('Clicking on Hamburger Menu at Account Dashboard', async function () {
                await neltPerfomanceService.clickHamburgerMenuAtAccountDashboard.bind(this)(driver);
            });
            it('Choosing "Kartica kupca" Resource View', async function () {
                timeInterval = 0;
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Choosing "Kartica Kupca" From Menu`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                // time measurment
                const Kartica_kupca_opening = new Date().getTime();
                await driver.click(
                    neltPerformanceSelectors.getSelectorOfAccountDashboardHamburgerMenuItemByName('Kartica kupca'),
                );
                await neltPerformanceSelectors.isSpinnerDone();
                await driver.untilIsVisible(neltPerformanceSelectors.WebappIframe_closeButton);
                await driver.switchTo(neltPerformanceSelectors.WebappIframe);
                await driver.untilIsVisible(neltPerformanceSelectors.Kartica_kupca_results_number);
                await driver.untilIsVisible(neltPerformanceSelectors.Kartica_kupca_table_cell);
                await driver.switchToDefaultContent();
                const Kartica_kupca_loaded = new Date().getTime();
                timeInterval = Kartica_kupca_loaded - Kartica_kupca_opening;
                console.info(
                    'Kartica_kupca_opening: ',
                    Kartica_kupca_opening,
                    'Kartica_kupca_loaded: ',
                    Kartica_kupca_loaded,
                    'Time Interval: ',
                    timeInterval,
                );
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At "Kartica kupca" View`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                driver.sleep(5 * 1000);
                await driver.click(neltPerformanceSelectors.WebappIframe_closeButton);
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Kartica kupca" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
                        1,
                    )} s`,
                });
                // timeMeasurements['Home Screen --> Kupci --> Select account --> Burger menu --> Kartica Kupca'] =
                //     timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
                timeMeasurements['Home Screen --> Kupci --> Select account --> Burger menu --> Kartica Kupca'] = Number(
                    (timeInterval / 1000).toFixed(1),
                );
                timeMeasurementsRaw.push({
                    description: 'Home Screen --> Kupci --> Select account --> Burger menu --> Kartica Kupca',
                    time: timeInterval,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 15
        describe('AccountMenu: 1. Home Screen --> Kupci --> Select account --> Burger menu --> Istorija prodaje po kupcu', async () => {
            it('Navigate to first account in list from Home Screen', async function () {
                timeInterval = 0;
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
                // timeMeasurements[
                //     'Select account --> Burger menu --> Istorija prodaje po kupcu'
                // ] = timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
                timeMeasurements[
                    'Home Screen --> Kupci --> Select account --> Burger menu --> Istorija prodaje po kupcu'
                ] = Number((timeInterval / 1000).toFixed(1));
                timeMeasurementsRaw.push({
                    description:
                        'Home Screen --> Kupci --> Select account --> Burger menu --> Istorija prodaje po kupcu',
                    time: timeInterval,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 18 + 19
        describe('VisitFlow: 1. Home Screen --> Kupci --> Select account --> Burger menu --> Pocni Posetu --> Select visit flow --> Start --> End', async () => {
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
                if (await driver.isElementVisible(neltPerformanceSelectors.VisitFlow_visits_selection)) {
                    await neltPerfomanceService.selectVisitFlowFromMultipleVisitsSelection.bind(this)(
                        driver,
                        'F4 out-of-store poseta',
                    );
                }
            });
            it('Initiating Visit Flow', async function () {
                timeInterval = 0;
                await neltPerfomanceService.selectVisitGroup.bind(this)(driver, 'Start posete');
                await driver.click(neltPerformanceSelectors.getSelectorOfVisitStepByText('Start posete'));
                await neltPerformanceSelectors.isSpinnerDone();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Chose "Start posete" at Visit Selection`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it('Start Step of Visit Flow', async function () {
                // time measurment
                const Start_posete_opening = new Date().getTime();
                await driver.click(neltPerformanceSelectors.TopBar_Right_StartButtton);
                await driver.untilIsVisible(neltPerformanceSelectors.VisitFlow_singleVisit_container);
                await driver.untilIsVisible(neltPerformanceSelectors.getSelectorOfVisitGroupByText('Kraj posete'));
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
                    title: `After "Start posete" Visit Flow Step`,
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
                // timeMeasurements[
                //     'Select account --> Burger menu --> Pocni Posetu --> Select visit flow --> Start'
                // ] = timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
                timeMeasurements['Select visit flow --> Start'] = Number((timeInterval / 1000).toFixed(1));
                timeMeasurementsRaw.push({ description: 'Select visit flow --> Start', time: timeInterval });
                driver.sleep(0.5 * 1000);
            });
            it('Ending Visit Flow', async function () {
                timeInterval = 0;
                await neltPerfomanceService.selectVisitGroup.bind(this)(driver, 'Kraj posete');
                await neltPerfomanceService.selectVisitStep.bind(this)(driver, 'Kraj posete');
                await neltPerformanceSelectors.isSpinnerDone();
                await driver.untilIsVisible(neltPerformanceSelectors.TopBar_Right_EndButtton);
            });
            it('End Step of Visit Flow', async function () {
                // time measurment
                const Kraj_posete_opening = new Date().getTime();
                await driver.click(neltPerformanceSelectors.TopBar_Right_EndButtton);
                await neltPerformanceSelectors.isSpinnerDone();
                await driver.untilIsVisible(neltPerformanceSelectors.AccountDashboard_PlusButton);
                await driver.untilIsVisible(neltPerformanceSelectors.AccountDashboard_BurgerMenu);
                await driver.untilIsVisible(neltPerformanceSelectors.AccountDetails_component);
                await driver.untilIsVisible(neltPerformanceSelectors.PepList);
                const Kraj_posete_loaded = new Date().getTime();
                timeInterval = Kraj_posete_loaded - Kraj_posete_opening;
                console.info(
                    'Kraj_posete_opening: ',
                    Kraj_posete_opening,
                    'Kraj_posete_loaded: ',
                    Kraj_posete_loaded,
                    'Time Interval: ',
                    timeInterval,
                );
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `After "Kraj posete" Visit Flow Step`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                driver.sleep(5 * 1000);
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Kraj posete" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
                        1,
                    )} s`,
                });
                // timeMeasurements[
                //     'Select account --> Burger menu --> Pocni Posetu --> Select visit flow --> Start --> End'
                // ] = timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
                timeMeasurements['Select visit flow --> Start --> End'] = Number((timeInterval / 1000).toFixed(1));
                timeMeasurementsRaw.push({ description: 'Select visit flow --> Start --> End', time: timeInterval });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 22
        describe('VisitFlow: 4. Home Screen --> Kupci --> Select account --> Burger menu --> Pocni Posetu --> Select visit flow --> Open --> Near Expiry order', async () => {
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
                if (await driver.isElementVisible(neltPerformanceSelectors.VisitFlow_visits_selection)) {
                    await neltPerfomanceService.selectVisitFlowFromMultipleVisitsSelection.bind(this)(
                        driver,
                        'F4 out-of-store poseta',
                    );
                }
            });
            it('Starting Visit Flow', async function () {
                timeInterval = 0;
                await neltPerfomanceService.startVisit.bind(this)(driver);
            });
            it('Ending Visit Flow', async function () {
                await neltPerfomanceService.endVisit.bind(this)(driver);
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Start posete" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
                        1,
                    )} s`,
                });
                // timeMeasurements[
                //     'Select account --> Burger menu --> Pocni Posetu --> Select visit flow --> Open --> Near Expiry order'
                // ] = timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
                timeMeasurements['Select visit flow --> Open --> Near Expiry order'] = Number(
                    (timeInterval / 1000).toFixed(1),
                );
                timeMeasurementsRaw.push({
                    description: 'Select visit flow --> Open --> Near Expiry order',
                    time: timeInterval,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 23
        describe('VisitFlow: 5. Home Screen --> Kupci --> Select account --> Burger menu --> Pocni Posetu --> Select visit flow --> Open --> Near Expiry order --> Add items --> Submit', async () => {
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
                if (await driver.isElementVisible(neltPerformanceSelectors.VisitFlow_visits_selection)) {
                    await neltPerfomanceService.selectVisitFlowFromMultipleVisitsSelection.bind(this)(
                        driver,
                        'F4 out-of-store poseta',
                    );
                }
            });
            it('Starting Visit Flow', async function () {
                timeInterval = 0;
                await neltPerfomanceService.startVisit.bind(this)(driver);
            });
            it('Ending Visit Flow', async function () {
                await neltPerfomanceService.endVisit.bind(this)(driver);
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Start posete" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
                        1,
                    )} s`,
                });
                // timeMeasurements[
                //     'Select account --> Burger menu --> Pocni Posetu --> Select visit flow --> Open --> Near Expiry order --> Add items --> Submit'
                // ] = timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
                timeMeasurements['Select visit flow --> Open --> Near Expiry order --> Add items --> Submit'] = Number(
                    (timeInterval / 1000).toFixed(1),
                );
                timeMeasurementsRaw.push({
                    description: 'Select visit flow --> Open --> Near Expiry order --> Add items --> Submit',
                    time: timeInterval,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 20
        describe('VisitFlow: 2. Home Screen --> Kupci --> Select account --> Burger menu --> Pocni Posetu --> Select visit flow --> Open --> Select Provat --> Provat order', async () => {
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
                if (await driver.isElementVisible(neltPerformanceSelectors.VisitFlow_visits_selection)) {
                    await neltPerfomanceService.selectVisitFlowFromMultipleVisitsSelection.bind(this)(
                        driver,
                        'F4 out-of-store poseta',
                    );
                }
            });
            it('Starting Visit Flow', async function () {
                timeInterval = 0;
                await neltPerfomanceService.startVisit.bind(this)(driver);
            });
            it('Ending Visit Flow', async function () {
                await neltPerfomanceService.endVisit.bind(this)(driver);
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Start posete" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
                        1,
                    )} s`,
                });
                // timeMeasurements[
                //     'Select account --> Burger menu --> Pocni Posetu --> Select visit flow --> Open --> Select Provat --> Provat order'
                // ] = timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
                timeMeasurements['Select visit flow --> Open --> Select Provat --> Provat order'] = Number(
                    (timeInterval / 1000).toFixed(1),
                );
                timeMeasurementsRaw.push({
                    description: 'Select visit flow --> Open --> Select Provat --> Provat order',
                    time: timeInterval,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 21
        describe('VisitFlow: 3. Home Screen --> Kupci --> Select account --> Burger menu --> Pocni Posetu --> Select visit flow --> Open --> Select Provat --> Provat order --> Add item --> Submit', async () => {
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
                if (await driver.isElementVisible(neltPerformanceSelectors.VisitFlow_visits_selection)) {
                    await neltPerfomanceService.selectVisitFlowFromMultipleVisitsSelection.bind(this)(
                        driver,
                        'F4 out-of-store poseta',
                    );
                }
            });
            it('Starting Visit Flow', async function () {
                timeInterval = 0;
                await neltPerfomanceService.startVisit.bind(this)(driver);
            });
            it('Ending Visit Flow', async function () {
                await neltPerfomanceService.endVisit.bind(this)(driver);
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Start posete" to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
                        1,
                    )} s`,
                });
                // timeMeasurements[
                //     'Select account --> Burger menu --> Pocni Posetu --> Select visit flow --> Open --> Select Provat --> Provat order --> Add item --> Submit'
                // ] = timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
                timeMeasurements[
                    'Select visit flow --> Open --> Select Provat --> Provat order --> Add item --> Submit'
                ] = Number((timeInterval / 1000).toFixed(1));
                timeMeasurementsRaw.push({
                    description:
                        'Select visit flow --> Open --> Select Provat --> Provat order --> Add item --> Submit',
                    time: timeInterval,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 8
        describe('Order: 1. Home Screen --> Kupci --> Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar)', async () => {
            it('Navigate to account 1100072 from Home Screen', async function () {
                await neltPerfomanceService.selectAccountViaHomePageMainButton.bind(this)(driver, '1100072');
            });
            it('Choosing "Order" at Dropdown Menu of Plus Button at Account Dashboard', async function () {
                await neltPerfomanceService.selectUnderPlusButtonMenuAtAccountDashboard.bind(this)(driver, 'Order');
            });
            it('Choosing "CC Call Centar" at Catalogs List', async function () {
                timeInterval = 0;
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
                // timeMeasurements[
                //     'Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar)'
                // ] = timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
                timeMeasurements['Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar)'] =
                    Number((timeInterval / 1000).toFixed(1));
                timeMeasurementsRaw.push({
                    description: 'Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar)',
                    time: timeInterval,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 10
        describe('Order: 3. Home Screen --> Kupci --> Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Select filter', async () => {
            it('Navigate to account 1100072 from Home Screen', async function () {
                timeInterval = 0;
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
                // timeMeasurements[
                //     'Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Select filter'
                // ] = timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
                timeMeasurements[
                    'Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Select filter'
                ] = Number((timeInterval / 1000).toFixed(1));
                timeMeasurementsRaw.push({
                    description:
                        'Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Select filter',
                    time: timeInterval,
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

        // 11
        describe('Order: 4. Home Screen --> Kupci --> Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Select smart filter', async () => {
            it('Navigate to account 1100072 from Home Screen', async function () {
                timeInterval = 0;
                await neltPerfomanceService.selectAccountViaHomePageMainButton.bind(this)(driver, '1100072', 'ID');
            });
            it('Choosing "Order" at Dropdown Menu of Plus Button at Account Dashboard', async function () {
                await neltPerfomanceService.selectUnderPlusButtonMenuAtAccountDashboard.bind(this)(driver, 'Order');
            });
            it('Choosing "CC Call Centar" at Catalogs List', async function () {
                await neltPerfomanceService.choosingCatalogForOrder.bind(this)(driver, 'CC Call Centar');
            });
            it('Select Smart Filter ********* || TODO', async function () {
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
                // timeMeasurements[
                //     'Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Select smart filter'
                // ] = timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
                timeMeasurements[
                    'Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Select smart filter'
                ] = Number((timeInterval / 1000).toFixed(1));
                timeMeasurementsRaw.push({
                    description:
                        'Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Select smart filter',
                    time: timeInterval,
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

        // 12
        describe('Order: 5. Home Screen --> Kupci --> Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Change sort by', async () => {
            it('Navigate to account 1100072 from Home Screen', async function () {
                timeInterval = 0;
                await neltPerfomanceService.selectAccountViaHomePageMainButton.bind(this)(driver, '1100072', 'ID');
            });
            it('Choosing "Order" at Dropdown Menu of Plus Button at Account Dashboard', async function () {
                await neltPerfomanceService.selectUnderPlusButtonMenuAtAccountDashboard.bind(this)(driver, 'Order');
            });
            it('Choosing "CC Call Centar" at Catalogs List', async function () {
                await neltPerfomanceService.choosingCatalogForOrder.bind(this)(driver, 'CC Call Centar');
            });
            it('Change sort by ********* || TODO', async function () {
                // resultsNumberBefore = await (
                //     await driver.findElement(neltPerformanceSelectors.ListNumberOfResults)
                // ).getText();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Order Center loaded`,
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
                // resultsNumberAfter = await (
                //     await driver.findElement(neltPerformanceSelectors.ListNumberOfResults)
                // ).getText();
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
                // timeMeasurements[
                //     'Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Change sort by'
                // ] = timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
                timeMeasurements[
                    'Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Change sort by'
                ] = Number((timeInterval / 1000).toFixed(1));
                timeMeasurementsRaw.push({
                    description:
                        'Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Change sort by',
                    time: timeInterval,
                });
                driver.sleep(0.5 * 1000);
            });
            // it(`Number of results has changed Assertion`, async function () {
            //     addContext(this, {
            //         title: `Number Of Results - Before & After`,
            //         value: `Before: ${resultsNumberBefore} | After: ${resultsNumberAfter}`,
            //     });
            //     // expect(Number(resultsNumberAfter)).to.not.equal(Number(resultsNumberBefore));
            //     driver.sleep(0.5 * 1000);
            // });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 9
        describe('Order: 2. Home Screen --> Kupci --> Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Add items --> Click on cart', async () => {
            it('Navigate to account 1100072 from Home Screen', async function () {
                timeInterval = 0;
                await neltPerfomanceService.selectAccountViaHomePageMainButton.bind(this)(driver, '1100072', 'ID');
            });
            it('Choosing "Order" at Dropdown Menu of Plus Button at Account Dashboard', async function () {
                await neltPerfomanceService.selectUnderPlusButtonMenuAtAccountDashboard.bind(this)(driver, 'Order');
            });
            it('Choosing "CC Call Centar" at Catalogs List', async function () {
                await neltPerfomanceService.choosingCatalogForOrder.bind(this)(driver, 'CC Call Centar');
            });
            it('Adding Items ********* || TODO', async function () {
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
                // timeMeasurements[
                //     'Select Account (1100072) --> + -- Order --> Select catalogue (CC call centar) --> Add items --> Click on cart'
                // ] = timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
                timeMeasurements[
                    'Select Account (1100072) --> + -- Order --> Select catalogue (CC call centar) --> Add items --> Click on cart'
                ] = Number((timeInterval / 1000).toFixed(1));
                timeMeasurementsRaw.push({
                    description:
                        'Select Account (1100072) --> + -- Order --> Select catalogue (CC call centar) --> Add items --> Click on cart',
                    time: timeInterval,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 13
        describe('Order: 6. Home Screen --> Kupci -- Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Open promotions that are (bundles) --> Click Done', async () => {
            it('Navigate to account 1100072 from Home Screen', async function () {
                timeInterval = 0;
                await neltPerfomanceService.selectAccountViaHomePageMainButton.bind(this)(driver, '1100072', 'ID');
            });
            it('Choosing "Order" at Dropdown Menu of Plus Button at Account Dashboard', async function () {
                await neltPerfomanceService.selectUnderPlusButtonMenuAtAccountDashboard.bind(this)(driver, 'Order');
            });
            it('Choosing "CC Call Centar" at Catalogs List', async function () {
                await neltPerfomanceService.choosingCatalogForOrder.bind(this)(driver, 'CC Call Centar');
            });
            it('Open promotions that are bundles ********* || TODO', async function () {
                // resultsNumberBefore = await (
                //     await driver.findElement(neltPerformanceSelectors.ListNumberOfResults)
                // ).getText();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Order Center loaded`,
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
                // resultsNumberAfter = await (
                //     await driver.findElement(neltPerformanceSelectors.ListNumberOfResults)
                // ).getText();
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
                    title: `Promotions Bundles Opened`,
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
                // timeMeasurements[
                //     'Home Screen --> Kupci --> Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Open promotions that are (bundles)'
                // ] = timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
                timeMeasurements[
                    'Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Open promotions that are bundles'
                ] = Number((timeInterval / 1000).toFixed(1));
                timeMeasurementsRaw.push({
                    description:
                        'Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Open promotions that are bundles',
                    time: timeInterval,
                });
                driver.sleep(0.5 * 1000);
            });
            // it(`Number of results has changed Assertion`, async function () {
            //     addContext(this, {
            //         title: `Number Of Results - Before & After`,
            //         value: `Before: ${resultsNumberBefore} | After: ${resultsNumberAfter}`,
            //     });
            //     // expect(Number(resultsNumberAfter)).to.not.equal(Number(resultsNumberBefore));
            //     driver.sleep(0.5 * 1000);
            // });
            it('Click on Done button ********* || TODO', async function () {
                // resultsNumberBefore = await (
                //     await driver.findElement(neltPerformanceSelectors.ListNumberOfResults)
                // ).getText();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Promotions Bundles`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                await driver.click(neltPerformanceSelectors.getSelectorOfSmartFilterFieldByName('Zalihe'));
                // await neltPerformanceSelectors.isSpinnerDone();
                // await driver.untilIsVisible(
                //     neltPerformanceSelectors.getSelectorOfOrderCenterSideBarTreeItemByName('Nestle Dairy'),
                // );
                // time measurment
                const Open_promotions_bundles_Done_opening = new Date().getTime();
                // await driver.click(
                //     neltPerformanceSelectors.getSelectorOfOrderCenterSideBarTreeItemByName('Nestle Dairy'),
                // );
                // await neltPerformanceSelectors.isSpinnerDone();
                // await driver.untilIsVisible(neltPerformanceSelectors.Cart_Button);
                // await driver.untilIsVisible(neltPerformanceSelectors.TransactionID);
                // await driver.untilIsVisible(neltPerformanceSelectors.OrderCenterItem_QuantitySelector_GridLineView);
                const Open_promotions_bundles_Done_loaded = new Date().getTime();
                timeInterval = Open_promotions_bundles_Done_loaded - Open_promotions_bundles_Done_opening;
                // resultsNumberAfter = await (
                //     await driver.findElement(neltPerformanceSelectors.ListNumberOfResults)
                // ).getText();
                console.info(
                    'Open_promotions_bundles_Done_opening: ',
                    Open_promotions_bundles_Done_opening,
                    'Open_promotions_bundles_Done_loaded: ',
                    Open_promotions_bundles_Done_loaded,
                    'Time Interval: ',
                    timeInterval,
                );
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Done Button Clicked`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Open promotions bundles" submission to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
                        1,
                    )} s`,
                });
                // timeMeasurements[
                //     'Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Open promotions that are (bundles) --> Click Done'
                // ] = timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
                timeMeasurements[
                    'Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Open promotions (bundles) --> Click Done'
                ] = Number((timeInterval / 1000).toFixed(1));
                timeMeasurementsRaw.push({
                    description:
                        'Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Open promotions (bundles) --> Click Done',
                    time: timeInterval,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 14
        describe('Order: 7. Home Screen --> Kupci --> Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Open promotions (not bundles) --> Click Done', async () => {
            it('Navigate to account 1100072 from Home Screen', async function () {
                timeInterval = 0;
                await neltPerfomanceService.selectAccountViaHomePageMainButton.bind(this)(driver, '1100072', 'ID');
            });
            it('Choosing "Order" at Dropdown Menu of Plus Button at Account Dashboard', async function () {
                await neltPerfomanceService.selectUnderPlusButtonMenuAtAccountDashboard.bind(this)(driver, 'Order');
            });
            it('Choosing "CC Call Centar" at Catalogs List', async function () {
                await neltPerfomanceService.choosingCatalogForOrder.bind(this)(driver, 'CC Call Centar');
            });
            it('Open promotions that are NOT bundles ********* || TODO', async function () {
                // resultsNumberBefore = await (
                //     await driver.findElement(neltPerformanceSelectors.ListNumberOfResults)
                // ).getText();
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Order Center loaded`,
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
                // resultsNumberAfter = await (
                //     await driver.findElement(neltPerformanceSelectors.ListNumberOfResults)
                // ).getText();
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
                    title: `Promotions NOT Bundles Opened`,
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
                // timeMeasurements[
                //     'Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Open promotions (not bundles)'
                // ] = timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
                timeMeasurements[
                    'Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Open promotions that are not bundles'
                ] = Number((timeInterval / 1000).toFixed(1));
                timeMeasurementsRaw.push({
                    description:
                        'Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Open promotions that are not bundles',
                    time: timeInterval,
                });
                driver.sleep(0.5 * 1000);
            });
            // it(`Number of results has changed Assertion`, async function () {
            //     addContext(this, {
            //         title: `Number Of Results - Before & After`,
            //         value: `Before: ${resultsNumberBefore} | After: ${resultsNumberAfter}`,
            //     });
            //     // expect(Number(resultsNumberAfter)).to.not.equal(Number(resultsNumberBefore));
            //     driver.sleep(0.5 * 1000);
            // });
            it('Click on Done button ********* || TODO', async function () {
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Promotions NOT Bundles`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                await driver.click(neltPerformanceSelectors.getSelectorOfSmartFilterFieldByName('Zalihe'));
                // await neltPerformanceSelectors.isSpinnerDone();
                // await driver.untilIsVisible(
                //     neltPerformanceSelectors.getSelectorOfOrderCenterSideBarTreeItemByName('Nestle Dairy'),
                // );
                // time measurment
                const Open_promotions_not_bundles_Done_opening = new Date().getTime();
                // await driver.click(
                //     neltPerformanceSelectors.getSelectorOfOrderCenterSideBarTreeItemByName('Nestle Dairy'),
                // );
                // await neltPerformanceSelectors.isSpinnerDone();
                // await driver.untilIsVisible(neltPerformanceSelectors.Cart_Button);
                // await driver.untilIsVisible(neltPerformanceSelectors.TransactionID);
                // await driver.untilIsVisible(neltPerformanceSelectors.OrderCenterItem_QuantitySelector_GridLineView);
                const Open_promotions_not_bundles_Done_loaded = new Date().getTime();
                timeInterval = Open_promotions_not_bundles_Done_loaded - Open_promotions_not_bundles_Done_opening;
                console.info(
                    'Open_promotions_not_bundles_Done_opening: ',
                    Open_promotions_not_bundles_Done_opening,
                    'Open_promotions_not_bundles_Done_loaded: ',
                    Open_promotions_not_bundles_Done_loaded,
                    'Time Interval: ',
                    timeInterval,
                );
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Done Button Clicked`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Time Interval for "Open promotions NOT bundles" submission to load:`,
                    value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
                        1,
                    )} s`,
                });
                // timeMeasurements[
                //     'Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Open promotions (not bundles) --> Click Done'
                // ] = timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
                timeMeasurements[
                    'Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Open promotions (not bundles) --> Click Done'
                ] = Number((timeInterval / 1000).toFixed(1));
                timeMeasurementsRaw.push({
                    description:
                        'Select Account (1100072) --> + --> Order --> Select catalogue (CC call centar) --> Open promotions (not bundles) --> Click Done',
                    time: timeInterval,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // 4
        describe('Insights: 1. Home Screen --> Dnevni izvestaj  (NO DATA)', async () => {
            it('Navigating from Home Screen (through Burger Menu) to "Dnevni izvestaj"', async function () {
                timeInterval = 0;
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
                await driver.untilIsVisible(neltPerformanceSelectors.getSelectorOfInsightsGalleryCardByText('')); // if there is NO DATA at insights
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
                // timeMeasurements['Home Screen --> Dnevni izvestaj  (NO DATA)'] = timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
                timeMeasurements['Home Screen --> Dnevni izvestaj  (NO DATA)'] = Number(
                    (timeInterval / 1000).toFixed(1),
                );
                timeMeasurementsRaw.push({
                    description: 'Home Screen --> Dnevni izvestaj  (NO DATA)',
                    time: timeInterval,
                });
                driver.sleep(0.5 * 1000);
            });
            it('Back to Home Screen', async function () {
                await neltPerfomanceService.toHomeScreen.bind(this, driver)();
            });
        });

        // describe('Insights: 2. Home Screen --> Dnevni izvestaj  (WITH DATA)', async () => {
        //     it('Navigating from Home Screen (through Burger Menu) to "Dnevni izvestaj"', async function () {
        //         timeInterval = 0;
        //         await driver.click(neltPerformanceSelectors.HamburgerMenuButtonAtHome);
        //         base64ImageComponent = await driver.saveScreenshots();
        //         addContext(this, {
        //             title: `Home Hamburger Menu Opened:`,
        //             value: 'data:image/png;base64,' + base64ImageComponent,
        //         });
        //         // time measurment
        //         const Dnevni_izvestaj_opening = new Date().getTime();
        //         await driver.click(
        //             neltPerformanceSelectors.getSelectorOfHomeHamburgerMenuItemByName('Dnevni izvestaj'),
        //         );
        //         await neltPerformanceSelectors.isSpinnerDone();
        //         await driver.untilIsVisible(neltPerformanceSelectors.InsightsLoaded_Indication_GalleryCard);
        //         await driver.untilIsVisible(neltPerformanceSelectors.getSelectorOfInsightsGalleryCardByText('0'));
        //         await driver.untilIsVisible(neltPerformanceSelectors.InsightsLoaded_Indication_Table);
        //         await driver.untilIsVisible(neltPerformanceSelectors.InsightsLoaded_Indication_Table_Header);
        //         await driver.untilIsVisible(neltPerformanceSelectors.getSelectorOfInsightsTableHeaderdByText('Target'));
        //         await driver.untilIsVisible(neltPerformanceSelectors.InsightsLoaded_Indication_Chart);
        //         await driver.untilIsVisible(neltPerformanceSelectors.InsightsLoaded_Indication_ChartGraph); // if there is data at insights
        //         const Dnevni_izvestaj_loaded = new Date().getTime();
        //         timeInterval = Dnevni_izvestaj_loaded - Dnevni_izvestaj_opening;
        //         console.info(
        //             'Dnevni_izvestaj_opening: ',
        //             Dnevni_izvestaj_opening,
        //             'Dnevni_izvestaj_loaded: ',
        //             Dnevni_izvestaj_loaded,
        //             'Time Interval: ',
        //             timeInterval,
        //         );
        //         base64ImageComponent = await driver.saveScreenshots();
        //         addContext(this, {
        //             title: `At "Dnevni izvestaj"`,
        //             value: 'data:image/png;base64,' + base64ImageComponent,
        //         });
        //     });
        //     it(`Time Measured`, async function () {
        //         addContext(this, {
        //             title: `Time Interval for "Dnevni izvestaj" to load:`,
        //             value: `row (miliseconds): ${timeInterval} ms | rounded (seconds): ${(timeInterval / 1000).toFixed(
        //                 1,
        //             )} s`,
        //         });
        //         timeMeasurements["Home Screen --> Dnevni izvestaj  (WITH DATA)"] = timeInterval != 0 ? `${timeInterval} (${(timeInterval / 1000).toFixed(1)} s)` : timeInterval.toString();
        //         driver.sleep(0.5 * 1000);
        //     });
        //     it('Back to Home Screen', async function () {
        //         await neltPerfomanceService.toHomeScreen.bind(this, driver)();
        //     });
        // });

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

        describe('CONCLUSION', async () => {
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `All Measured Times (in seconds):`,
                    value: `${JSON.stringify(timeMeasurements, null, 2)}`,
                });
                driver.sleep(0.5 * 1000);
            });
            it(`Time Measured`, async function () {
                addContext(this, {
                    title: `Raw Times (in miliseconds):`,
                    value: `${JSON.stringify(timeMeasurementsRaw, null, 2)}`,
                });
                console.info(JSON.stringify(timeMeasurementsRaw, null, 2));
                console.table(timeMeasurementsRaw, ['description', 'time']);
                driver.sleep(0.5 * 1000);
            });
        });
    });
}
