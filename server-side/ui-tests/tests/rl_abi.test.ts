import promised from 'chai-as-promised';
import { Client } from '@pepperi-addons/debug-server/dist';
import { Browser } from '../utilities/browser';
import { WebAppLoginPage, WebAppHomePage, WebAppHeader, WebAppList } from '../pom';
import { describe, it, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import { ResourceListABI } from '../pom/addons/ResourceListABI';
import { By } from 'selenium-webdriver';
import GeneralService from '../../services/general.service';
import { ObjectsService } from '../../services/objects.service';
import { OpenCatalogService } from '../../services/open-catalog.service';
import { UDCService } from '../../services/user-defined-collections.service';

chai.use(promised);

export async function ResourceListAbiTests(email: string, password: string, client: Client) {
    /** Description **/
    /* for the purpose of this test an Addon named "ResourceListABI_Addon" was created *
    /* it's code can be found at the following repository: https://github.com/Pepperi-Addons/resource-list-abi-tests/tree/main/client-side/src/app/settings/rl-abi *
    /* the Addon provides a set of list containers that through the "Resource List ABI" are displayed as Generic List inside a Dialog - upon a button click *
    /* the access to the UI of the Addon is either via the Settings Side Panel, or through the path:
    * https://app.pepperi.com/settings_block/cd3ba412-66a4-42f4-8abc-65768c5dc606/resource_list_abi/view *
    * or through the Home Page Slug: "Resource List ABI" */

    const generalService = new GeneralService(client);
    const udcService = new UDCService(generalService);
    const objectsService = new ObjectsService(generalService);
    const openCatalogService = new OpenCatalogService(generalService);

    const installedAddons = await generalService.getInstalledAddons();

    const installedResourceListVersion = installedAddons.find((addon) => addon.Addon.Name === 'Resource List')?.Version;
    const installedRLABIVersion = installedAddons.find(
        (addon) => addon.Addon.Name === 'ResourceListABI_Addon',
    )?.Version;
    const numOfListingsIn_items = (await openCatalogService.getItems()).length;
    const numOfListingsIn_accounts = (await objectsService.getAccounts()).length;
    const numOfListingsIn_ReferenceAccountAuto = (await udcService.getAllObjectFromCollection('ReferenceAccountAuto'))
        .count;
    const numOfListingsIn_FiltersAccRefAuto = (await udcService.getAllObjectFromCollection('FiltersAccRefAuto')).count;

    let driver: Browser;
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    let webAppHeader: WebAppHeader;
    let webAppList: WebAppList;
    let resourceListABI: ResourceListABI;

    const lists = {
        'Items Basic': {
            listToSelect: '',
            expectedTitle: 'Items Basic',
            expectedNumOfResults: numOfListingsIn_items,
            elements: [
                'Menu',
                'Search Input',
                'Smart Search',
                'Single Radio Button',
                'Select All Checkbox',
                'Line Menu',
            ],
        },
        'Accounts Basic': {
            listToSelect: 'Accounts View - Basic',
            expectedTitle: 'Accounts Basic',
            expectedNumOfResults: numOfListingsIn_accounts,
            elements: [
                'Menu',
                'Search Input',
                'Smart Search',
                'Single Radio Button',
                'Select All Checkbox',
                'Line Menu',
            ],
        },
        'Accounts Selection - Multi': {
            listToSelect: 'Accounts with Selection Type "Multi"',
            expectedTitle: 'Accounts Selection Type Multi',
            expectedNumOfResults: numOfListingsIn_accounts,
            elements: [
                'Menu',
                'Search Input',
                'Smart Search',
                'Single Radio Button',
                'Select All Checkbox',
                'Line Menu',
            ],
        },
        'Accounts Selection - Single': {
            listToSelect: 'Accounts with Selection Type "Single"',
            expectedTitle: 'Accounts Selection Type Single',
            expectedNumOfResults: numOfListingsIn_accounts,
            elements: [
                'Menu',
                'Search Input',
                'Smart Search',
                'Single Radio Button',
                'Select All Checkbox',
                'Line Menu',
            ],
        },
        'Accounts Selection - None': {
            listToSelect: 'Accounts with Selection Type "None"',
            expectedTitle: 'Accounts Selection Type None',
            expectedNumOfResults: numOfListingsIn_accounts,
            elements: [
                'Menu',
                'Search Input',
                'Smart Search',
                'Single Radio Button',
                'Select All Checkbox',
                'Line Menu',
            ],
        },
        'ReferenceAccount with 2 Views - Tests': {
            listToSelect: 'ReferenceAccount with 2 Views',
            expectedTitle: 'Reference Account',
            expectedNumOfResults: numOfListingsIn_ReferenceAccountAuto,
            elements: [
                'Menu',
                'Search Input',
                'Smart Search',
                'Single Radio Button',
                'Select All Checkbox',
                'Line Menu',
            ],
        },
        'FiltersAccRef with 2 Views - Tests': {
            listToSelect: 'FiltersAccRef with 2 Views',
            expectedTitle: 'Filters Acc Ref ABI View',
            expectedNumOfResults: numOfListingsIn_FiltersAccRefAuto,
            elements: [
                'Menu',
                'Search Input',
                'Smart Search',
                'Single Radio Button',
                'Select All Checkbox',
                'Line Menu',
            ],
        },
    };
    const elements = {
        Menu: {
            'Items Basic': false,
            'Accounts Basic': false,
            'Accounts Selection - Multi': false,
            'Accounts Selection - Single': false,
            'Accounts Selection - None': false,
            'ReferenceAccount with 2 Views - Tests': true,
            'FiltersAccRef with 2 Views - Tests': true,
        },
        'Search Input': {
            'Items Basic': false,
            'Accounts Basic': false,
            'Accounts Selection - Multi': false,
            'Accounts Selection - Single': false,
            'Accounts Selection - None': false,
            'ReferenceAccount with 2 Views - Tests': true,
            'FiltersAccRef with 2 Views - Tests': true,
        },
        'Smart Search': {
            'Items Basic': false,
            'Accounts Basic': false,
            'Accounts Selection - Multi': false,
            'Accounts Selection - Single': false,
            'Accounts Selection - None': false,
            'ReferenceAccount with 2 Views - Tests': true,
            'FiltersAccRef with 2 Views - Tests': true,
        },
        'Single Radio Button': {
            'Items Basic': true,
            'Accounts Basic': false,
            'Accounts Selection - Multi': false,
            'Accounts Selection - Single': true,
            'Accounts Selection - None': false,
            'ReferenceAccount with 2 Views - Tests': false,
            'FiltersAccRef with 2 Views - Tests': false,
        },
        'Select All Checkbox': {
            'Items Basic': false,
            'Accounts Basic': true,
            'Accounts Selection - Multi': true,
            'Accounts Selection - Single': false,
            'Accounts Selection - None': false,
            'ReferenceAccount with 2 Views - Tests': true,
            'FiltersAccRef with 2 Views - Tests': true,
        },
        'Line Menu': {
            'Items Basic': false,
            'Accounts Basic': false,
            'Accounts Selection - Multi': false,
            'Accounts Selection - Single': false,
            'Accounts Selection - None': false,
            'ReferenceAccount with 2 Views - Tests': true,
            'FiltersAccRef with 2 Views - Tests': true,
        },
        Pager: {
            'Items Basic': true,
            'Accounts Basic': false,
            'Accounts Selection - Multi': false,
            'Accounts Selection - Single': false,
            'Accounts Selection - None': false,
            'ReferenceAccount with 2 Views - Tests': true,
            'FiltersAccRef with 2 Views - Tests': true,
        },
    };

    describe('Resource List ABI Test Suite', async () => {
        before(async function () {
            console.info('numOfListingsIn_accounts: ', JSON.stringify(numOfListingsIn_accounts, null, 2));
            console.info('numOfListingsIn_items: ', JSON.stringify(numOfListingsIn_items, null, 2));
            console.info(
                'numOfListingsIn_ReferenceAccountAuto: ',
                JSON.stringify(numOfListingsIn_ReferenceAccountAuto, null, 2),
            );
            console.info(
                'numOfListingsIn_FiltersAccRefAuto: ',
                JSON.stringify(numOfListingsIn_FiltersAccRefAuto, null, 2),
            );
        });

        it(`Resource List Version: ${installedResourceListVersion}`, async () => {
            console.info('Installed Resource List Version: ', JSON.stringify(installedResourceListVersion, null, 2));
            expect(installedResourceListVersion?.split('.')[1]).to.equal('9');
        });

        it(`RL ABI Tests Addon Version: ${installedRLABIVersion}`, async () => {
            console.info('Installed Resource List Version: ', JSON.stringify(installedRLABIVersion, null, 2));
            expect(Number(installedRLABIVersion?.split('.')[2])).to.be.greaterThan(24);
        });

        describe('RL ABI UI tests', async () => {
            before(async function () {
                driver = await Browser.initiateChrome();
                webAppLoginPage = new WebAppLoginPage(driver);
                webAppHomePage = new WebAppHomePage(driver);
                webAppHeader = new WebAppHeader(driver);
                webAppList = new WebAppList(driver);
                resourceListABI = new ResourceListABI(driver);
            });

            after(async function () {
                await driver.quit();
            });

            it('Login', async () => {
                await webAppLoginPage.login(email, password);
            });

            it('Entering Resource List ABI tests Addon', async () => {
                await webAppHeader.goHome();
                await webAppHomePage.isSpinnerDone();
                driver.sleep(2 * 1000);
                await webAppHomePage.clickOnBtn('Resource List ABI');
                await resourceListABI.waitTillVisible(resourceListABI.TestsAddon_container, 15000);
                await resourceListABI.waitTillVisible(resourceListABI.TestsAddon_dropdownElement, 15000);
                resourceListABI.pause(2 * 1000);
                const dropdownTitle = await (
                    await driver.findElement(resourceListABI.TestsAddon_dropdownTitle)
                ).getAttribute('title');
                expect(dropdownTitle).to.contain('Select List Data');
            });

            describe('List Content Tests', async () => {
                afterEach(async function () {
                    driver.sleep(0.5 * 1000);
                    await webAppHomePage.collectEndTestData(this);
                });

                Object.keys(lists).forEach((listTitle) => {
                    describe(listTitle, async () => {
                        after(async function () {
                            await driver.refresh();
                        });
                        let enteringListTitle = '';

                        switch (listTitle) {
                            case 'Items Basic':
                                enteringListTitle = 'Entering Default Selected List';
                                break;

                            default:
                                enteringListTitle = 'Choosing List Data and Opening the Dialog';
                                break;
                        }
                        it(enteringListTitle, async () => {
                            await listPickAndVerify(
                                lists[listTitle].listToSelect,
                                lists[listTitle].expectedTitle,
                                lists[listTitle].expectedNumOfResults,
                            );
                            resourceListABI.pause(0.1 * 1000);
                        });
                        if (lists[listTitle].expectedNumOfResults > 0) {
                            it('List Row - Appear', async () => {
                                await elemntExist('ListRow');
                                resourceListABI.pause(0.2 * 1000);
                            });
                        }

                        lists[listTitle].elements.forEach((webElement) => {
                            const isDisplayed = elements[webElement][listTitle];
                            it(`${webElement} - ${isDisplayed ? 'DISPLAYED' : 'NOT Displayed'}`, async () => {
                                switch (webElement) {
                                    case 'Menu':
                                        isDisplayed ? await elemntExist('Menu') : await elemntDoNotExist('Menu');
                                        break;
                                    case 'Search Input':
                                        isDisplayed ? await elemntExist('Search') : await elemntDoNotExist('Search');
                                        break;
                                    case 'Smart Search':
                                        isDisplayed
                                            ? await elemntExist('SmartSearch')
                                            : await elemntDoNotExist('SmartSearch');
                                        break;
                                    case 'Single Radio Button':
                                        isDisplayed
                                            ? await elemntExist('SingleRadioButton')
                                            : await elemntDoNotExist('SingleRadioButton');
                                        break;
                                    case 'Select All Checkbox':
                                        isDisplayed
                                            ? await elemntExist('MultiCheckbox')
                                            : await elemntDoNotExist('MultiCheckbox');
                                        break;
                                    case 'Line Menu':
                                        switch (listTitle) {
                                            case 'Items Basic':
                                                await lineMenuSingleDoNotExist();
                                                break;
                                            case 'Accounts Basic':
                                                await lineMenuMultiDoNotExist();
                                                break;
                                            case 'Accounts Selection - Multi':
                                                await lineMenuMultiDoNotExist();
                                                break;
                                            case 'Accounts Selection - Single':
                                                await lineMenuSingleDoNotExist();
                                                break;
                                            case 'Accounts Selection - None':
                                                await webAppList.clickOnRowByIndex();
                                                await webAppList.isSpinnerDone();
                                                await elemntDoNotExist('LineMenu');
                                                // resourceListABI.pause(0.2 * 1000);
                                                // await webAppList.clickOnRowByIndex();
                                                // await webAppList.isSpinnerDone();
                                                // await elemntDoNotExist('LineMenu');
                                                resourceListABI.pause(2 * 1000);
                                                break;
                                            case 'ReferenceAccount with 2 Views - Tests':
                                                await lineMenuMultiExist();
                                                break;
                                            case 'FiltersAccRef with 2 Views - Tests':
                                                await lineMenuMultiExist();
                                                break;

                                            default:
                                                isDisplayed
                                                    ? await elemntExist('LineMenu')
                                                    : await elemntDoNotExist('LineMenu');
                                                break;
                                        }
                                        break;

                                    default:
                                        break;
                                }
                            });
                        });
                        if (elements['Line Menu'][listTitle]) {
                            it('Line Menu - Disappear', async () => {
                                if (elements['Accounts Selection - Multi'][listTitle]) {
                                    await lineMenuMultiDisappear();
                                } else if (elements['Accounts Selection - Single'][listTitle]) {
                                    await lineMenuSingleDisappear();
                                }
                            });
                        }
                    });
                });
            });
        });
    });

    async function listPickAndVerify(listToSelect: string, expectedTitle: string, expectedNumOfResults: number) {
        await resourceListABI.isSpinnerDone();
        if (listToSelect) {
            await resourceListABI.selectDropBoxByString(resourceListABI.TestsAddon_dropdownElement, listToSelect);
            await resourceListABI.isSpinnerDone();
        }
        await resourceListABI.clickElement('TestsAddon_openABI_button');
        await resourceListABI.isSpinnerDone();
        await resourceListABI.waitTillVisible(resourceListABI.ListAbi_container, 15000);
        const listAbiTitle = await (await driver.findElement(resourceListABI.ListAbi_title)).getAttribute('title');
        expect(listAbiTitle.trim()).to.equal(expectedTitle);
        const listAbiResultsNumber = await (await driver.findElement(resourceListABI.ListAbi_results_number)).getText();
        expect(Number(listAbiResultsNumber.trim())).to.equal(expectedNumOfResults);
    }

    async function getSelector(
        elemName:
            | 'Menu'
            | 'LineMenu'
            | 'Search'
            | 'SmartSearch'
            | 'ListRow'
            | 'MultiCheckbox'
            | 'SingleRadioButton'
            | 'Pager',
    ) {
        let selectorOfElemToFind: By;
        let selectorName: string;
        switch (elemName) {
            case 'Menu':
                selectorOfElemToFind = resourceListABI.ListAbi_Menu_button;
                selectorName = 'Menu Button';
                break;
            case 'LineMenu':
                selectorOfElemToFind = resourceListABI.ListAbi_LineMenu_button;
                selectorName = 'LineMenu Button';
                break;
            case 'Search':
                selectorOfElemToFind = resourceListABI.ListAbi_Search_input;
                selectorName = 'Search Input';
                break;
            case 'SmartSearch':
                selectorOfElemToFind = resourceListABI.ListAbi_SmartSearch_container;
                selectorName = 'SmartSearch (Filters) Container';
                break;
            case 'ListRow':
                selectorOfElemToFind = webAppList.ListRowElements;
                selectorName = 'List Row';
                break;
            case 'MultiCheckbox':
                selectorOfElemToFind = webAppList.SelectAllCheckbox;
                selectorName = 'Selection Type Multi (Select All Checkbox)';
                break;
            case 'SingleRadioButton':
                selectorOfElemToFind = webAppList.RadioButtons;
                selectorName = 'Selection Type Single (Radio Button)';
                break;
            case 'Pager':
                selectorOfElemToFind = resourceListABI.ListAbi_Pager_container;
                selectorName = 'Pager Box';
                break;

            default:
                selectorOfElemToFind = resourceListABI.ListAbi_container;
                selectorName = '';
                break;
        }
        return { selector: selectorOfElemToFind, name: selectorName };
    }

    async function elemntDoNotExist(
        element:
            | 'Menu'
            | 'LineMenu'
            | 'Search'
            | 'SmartSearch'
            | 'ListRow'
            | 'MultiCheckbox'
            | 'SingleRadioButton'
            | 'Pager',
    ) {
        const selectorDetails = getSelector(element);
        try {
            await driver.findElement((await selectorDetails).selector);
            throw new Error(`The Element: "${(await selectorDetails).name}" is Unexpectedly Shown on the Form!`);
        } catch (error) {
            const theError = error as Error;
            expect(theError.message).to.contain('After wait time of: 15000, for selector');
        }
    }

    async function elemntExist(
        element:
            | 'Menu'
            | 'LineMenu'
            | 'Search'
            | 'SmartSearch'
            | 'ListRow'
            | 'MultiCheckbox'
            | 'SingleRadioButton'
            | 'Pager',
    ) {
        const selectorDetails = getSelector(element);
        try {
            const element = await driver.findElement((await selectorDetails).selector);
            expect(await typeof element).to.equal('object');
        } catch (error) {
            console.error(error);
            expect((await selectorDetails).name).to.be.a.string('Shown - but is NOT');
        }
    }

    async function lineMenuMultiDoNotExist() {
        await webAppList.clickOnCheckBoxByElementIndex();
        await webAppList.isSpinnerDone();
        await elemntDoNotExist('LineMenu');
        resourceListABI.pause(0.2 * 1000);
        await webAppList.clickOnCheckBoxByElementIndex();
        await webAppList.isSpinnerDone();
        await elemntDoNotExist('LineMenu');
        resourceListABI.pause(2 * 1000);
    }

    async function lineMenuMultiExist() {
        await webAppList.clickOnCheckBoxByElementIndex();
        await webAppList.isSpinnerDone();
        await elemntExist('LineMenu');
        resourceListABI.pause(0.2 * 1000);
    }

    async function lineMenuSingleDoNotExist() {
        await webAppList.clickOnRadioButtonByElementIndex();
        await webAppList.isSpinnerDone();
        await elemntDoNotExist('LineMenu');
        resourceListABI.pause(0.2 * 1000);
        await webAppList.clickOnRadioButtonByElementIndex();
        await webAppList.isSpinnerDone();
        await elemntDoNotExist('LineMenu');
        resourceListABI.pause(2 * 1000);
    }

    async function lineMenuMultiDisappear() {
        await webAppList.clickOnCheckBoxByElementIndex();
        await webAppList.isSpinnerDone();
        await elemntDoNotExist('LineMenu');
        resourceListABI.pause(2 * 1000);
    }

    async function lineMenuSingleDisappear() {
        await webAppList.clickOnRadioButtonByElementIndex();
        await webAppList.isSpinnerDone();
        await elemntDoNotExist('LineMenu');
        resourceListABI.pause(2 * 1000);
    }

    // async function lineMenuSingleExist() {}
}
