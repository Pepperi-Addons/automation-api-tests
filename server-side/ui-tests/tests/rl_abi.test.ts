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
                'Pager',
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
                'Pager',
                'Line Menu',
            ],
        },
        // 'Accounts Basic': {
        //     listToSelect: 'Accounts View - Basic',
        //     expectedTitle: 'Accounts Basic',
        //     expectedNumOfResults: numOfListingsIn_accounts,
        //     elements: [
        //         ['Menu', false],
        //         ['Search Input', false],
        //         ['Smart Search', false],
        //         ['Single Radio Button', true],
        //         ['Select All Checkbox', false],
        //         ['Pager', true],
        //         ['Line Menu', false],
        //     ],
        // },
        'Accounts Default Draw': {
            listToSelect: 'Accounts Basic View with Default Draw',
            expectedTitle: 'Accounts With Default Draw',
            expectedNumOfResults: numOfListingsIn_accounts,
            elements: [],
        },
        'Accounts Selection - Multi': {
            listToSelect: 'Accounts with Selection Type "Multi"',
            expectedTitle: 'Accounts Selection Type Multi',
            expectedNumOfResults: numOfListingsIn_accounts,
            elements: ['Single Radio Button', 'Select All Checkbox', 'Line Menu'],
        },
        'Accounts Selection - Single': {
            listToSelect: 'Accounts with Selection Type "Single"',
            expectedTitle: 'Accounts Selection Type Single',
            expectedNumOfResults: numOfListingsIn_accounts,
            elements: ['Single Radio Button', 'Select All Checkbox', 'Line Menu'],
        },
        'Accounts Selection - None': {
            listToSelect: 'Accounts with Selection Type "None"',
            expectedTitle: 'Accounts Selection Type None',
            expectedNumOfResults: numOfListingsIn_accounts,
            elements: ['Single Radio Button', 'Select All Checkbox', 'Line Menu'],
        },
        'Accounts Menu': {
            listToSelect: 'Accounts with Menu',
            expectedTitle: 'Accounts With Menu',
            expectedNumOfResults: numOfListingsIn_accounts,
            elements: ['Menu'],
        },
        'Accounts Menu Hosting Addon Functionality': {
            listToSelect: 'Accounts with Menu of Hosting Addon Func',
            expectedTitle: 'Accounts Menu With Hosting Addon functionality',
            expectedNumOfResults: numOfListingsIn_accounts,
            elements: ['Menu'],
        },
        'Accounts Menu Full': {
            listToSelect: 'Accounts with Menu - Full',
            expectedTitle: 'Accounts With Menu Full',
            expectedNumOfResults: numOfListingsIn_accounts,
            elements: ['Menu'],
        },
        'Accounts Line Menu': {
            listToSelect: 'Accounts with Line Menu',
            expectedTitle: 'Accounts With Line Menu',
            expectedNumOfResults: numOfListingsIn_accounts,
            elements: ['Line Menu'],
        },
        'Items Line Menu Selection Type Multi': {
            listToSelect: 'Items with Line Menu & Selection "Multi"',
            expectedTitle: "Items with Line Menu (Selection Type 'Multi')",
            expectedNumOfResults: numOfListingsIn_items,
            elements: ['Line Menu'],
        },
        'Items Search': {
            listToSelect: 'Items with Search',
            expectedTitle: 'Items With Search (Name, Category, Description)',
            expectedNumOfResults: numOfListingsIn_items,
            elements: ['Search Input'],
        },
        'Accounts Smart Search': {
            listToSelect: 'Accounts with Smart Search',
            expectedTitle: 'Accounts With Smart Search (Name)',
            expectedNumOfResults: numOfListingsIn_accounts,
            elements: ['Smart Search'],
        },
        'Accounts Sorting Ascending': {
            listToSelect: 'Accounts with Sorting - Ascending',
            expectedTitle: 'Accounts Sorting by Name Acsending',
            expectedNumOfResults: numOfListingsIn_accounts,
            elements: [],
        },
        'Accounts Sorting Descending': {
            listToSelect: 'Accounts with Sorting - Descending',
            expectedTitle: 'Accounts Sorting by Name Decsending',
            expectedNumOfResults: numOfListingsIn_accounts,
            elements: [],
        },
        'Items Search String': {
            listToSelect: 'Items with Search String',
            expectedTitle: 'Items - Search String',
            expectedNumOfResults: numOfListingsIn_items,
            elements: ['Search Input'],
        },
        'Items Page Type Pages': {
            listToSelect: 'Items with Page Type "Pages"',
            expectedTitle: "Items Page Type 'Pages'",
            expectedNumOfResults: numOfListingsIn_items,
            elements: ['Pager'],
        },
        'Items Page Type Pages - Page size': {
            listToSelect: 'Items with Page Type "Pages" & Page Size',
            expectedTitle: "Items Page Type 'Pages' with Page Size",
            expectedNumOfResults: numOfListingsIn_items,
            elements: ['Pager'],
        },
        'Items Page Type Pages - Page Index': {
            listToSelect: 'Items with Page Type "Pages" & Page Index',
            expectedTitle: "Items Page Type 'Pages' with Page Index",
            expectedNumOfResults: numOfListingsIn_items,
            elements: ['Pager'],
        },
        'Items Page Type Pages - Top Scroll Index': {
            listToSelect: 'Items Page Type "Pages" & Top Scroll Index',
            expectedTitle: "Items Page Type 'Pages' with Top Scroll Index",
            expectedNumOfResults: numOfListingsIn_items,
            elements: ['Pager'],
        },
        'Items Page Type Pages - Page Size & Page Index': {
            listToSelect: 'Items with Page Type "Pages" & Page Size & Page Index',
            expectedTitle: "Items Page Type 'Pages' with Page Size & Page Index",
            expectedNumOfResults: numOfListingsIn_items,
            elements: ['Pager'],
        },
        'Items Page Type Pages - Page Size, Page Index & Top Scroll Index': {
            listToSelect: 'Items with Page Type "Pages" & Page Size & Page Index & Top Scroll Index',
            expectedTitle: "Items Page Type 'Pages' with Page Size, Page Index and Top Scroll Index",
            expectedNumOfResults: numOfListingsIn_items,
            elements: ['Pager'],
        },
        'Items Page Type Scroll': {
            listToSelect: 'Items with Page Type "Scroll"',
            expectedTitle: "Items Page Type 'Scroll'",
            expectedNumOfResults: numOfListingsIn_items,
            elements: ['Pager'],
        },
        'Items Page Type Scroll - Top Scroll Index': {
            listToSelect: 'Items with Page Type "Scroll" & Top Scroll Index',
            expectedTitle: "Items: Page Type 'Scroll' with Top Scroll Index",
            expectedNumOfResults: numOfListingsIn_items,
            elements: ['Pager'],
        },
        'Items Page Type Scroll - Page Index': {
            listToSelect: 'Items with Page Type "Scroll" & Page Index',
            expectedTitle: "Items Page Type 'Scroll' with Page Index",
            expectedNumOfResults: numOfListingsIn_items,
            elements: ['Pager'],
        },
        'Items Page Type Scroll - Page Index & Top Scroll Index': {
            listToSelect: 'Items with Page Type "Scroll" & Page Index & Top Scroll Index',
            expectedTitle: "Items Page Type 'Scroll' with Page Index and Top Scroll Index",
            expectedNumOfResults: numOfListingsIn_items,
            elements: ['Pager'],
        },
        'Items Page Type Scroll - Page Size & Page Index': {
            listToSelect: 'Items with Page Type "Scroll" & Page Size & Page Index',
            expectedTitle: "Items Page Type 'Scroll' with Page Size and Page Index",
            expectedNumOfResults: numOfListingsIn_items,
            elements: ['Pager'],
        },
        'Items Page Type Scroll - Page Size & Page Index & Top Scroll Index': {
            listToSelect: 'Items with Page Type "Scroll" & Page Size & Page Index & Top Scroll Index',
            expectedTitle: "Items Page Type 'Scroll' with Page Size, Page Index and Top Scroll Index",
            expectedNumOfResults: numOfListingsIn_items,
            elements: ['Pager'],
        },
        'Accounts Full': {
            listToSelect: 'Accounts View - Full',
            expectedTitle: 'Accounts Full',
            expectedNumOfResults: numOfListingsIn_accounts,
            elements: [
                'Menu',
                'Search Input',
                'Smart Search',
                'Single Radio Button',
                'Select All Checkbox',
                'Pager',
                'Line Menu',
            ],
        },
        'Items Full - with 2 Views': {
            listToSelect: 'Items View - Full with 2 Views',
            expectedTitle: 'Items Full - 2 Views',
            expectedNumOfResults: numOfListingsIn_items,
            elements: [
                'Menu',
                'Search Input',
                'Smart Search',
                'Single Radio Button',
                'Select All Checkbox',
                'Pager',
                'Line Menu',
            ],
        },
        'Accounts Draw Grid Relation': {
            listToSelect: 'Accounts - Test Draw Grid',
            expectedTitle: 'Accounts Test Draw Grid',
            expectedNumOfResults: numOfListingsIn_accounts,
            elements: [
                'Menu',
                'Search Input',
                'Smart Search',
                'Single Radio Button',
                'Select All Checkbox',
                'Pager',
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
                'Pager',
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
                'Pager',
                'Line Menu',
            ],
        },
    };
    const elements = {
        Menu: {
            'Items Basic': false,
            'Accounts Basic': false,
            'Accounts Default Draw': false,
            'Accounts Selection - Multi': false,
            'Accounts Selection - Single': false,
            'Accounts Selection - None': false,
            'Accounts Menu': false,
            'Accounts Menu Hosting Addon Functionality': false,
            'Accounts Menu Full': false,
            'Accounts Line Menu': false,
            'Items Line Menu Selection Type Multi': false,
            'Items Search': false,
            'Accounts Smart Search': false,
            'Accounts Sorting Ascending': false,
            'Accounts Sorting Descending': false,
            'Items Search String': false,
            'Items Page Type Pages': false,
            'Items Page Type Pages - Page size': false,
            'Items Page Type Pages - Page Index': false,
            'Items Page Type Pages - Top Scroll Index': false,
            'Items Page Type Pages - Page Size & Page Index': false,
            'Items Page Type Pages - Page Size, Page Index & Top Scroll Index': false,
            'Items Page Type Scroll': false,
            'Items Page Type Scroll - Top Scroll Index': false,
            'Items Page Type Scroll - Page Index': false,
            'Items Page Type Scroll - Page Index & Top Scroll Index': false,
            'Items Page Type Scroll - Page Size & Page Index': false,
            'Items Page Type Scroll - Page Size & Page Index & Top Scroll Index': false,
            'Accounts Full': false,
            'Items Full - with 2 Views': false,
            'Accounts Draw Grid Relation': false,
            'ReferenceAccount with 2 Views - Tests': true,
            'FiltersAccRef with 2 Views - Tests': true,
        },
        'Search Input': {
            'Items Basic': false,
            'Accounts Basic': false,
            'Accounts Default Draw': false,
            'Accounts Selection - Multi': false,
            'Accounts Selection - Single': false,
            'Accounts Selection - None': false,
            'Accounts Menu': false,
            'Accounts Menu Hosting Addon Functionality': false,
            'Accounts Menu Full': false,
            'Accounts Line Menu': false,
            'Items Line Menu Selection Type Multi': false,
            'Items Search': false,
            'Accounts Smart Search': false,
            'Accounts Sorting Ascending': false,
            'Accounts Sorting Descending': false,
            'Items Search String': false,
            'Items Page Type Pages': false,
            'Items Page Type Pages - Page size': false,
            'Items Page Type Pages - Page Index': false,
            'Items Page Type Pages - Top Scroll Index': false,
            'Items Page Type Pages - Page Size & Page Index': false,
            'Items Page Type Pages - Page Size, Page Index & Top Scroll Index': false,
            'Items Page Type Scroll': false,
            'Items Page Type Scroll - Top Scroll Index': false,
            'Items Page Type Scroll - Page Index': false,
            'Items Page Type Scroll - Page Index & Top Scroll Index': false,
            'Items Page Type Scroll - Page Size & Page Index': false,
            'Items Page Type Scroll - Page Size & Page Index & Top Scroll Index': false,
            'Accounts Full': false,
            'Items Full - with 2 Views': false,
            'Accounts Draw Grid Relation': false,
            'ReferenceAccount with 2 Views - Tests': true,
            'FiltersAccRef with 2 Views - Tests': true,
        },
        'Smart Search': {
            'Items Basic': false,
            'Accounts Basic': false,
            'Accounts Default Draw': false,
            'Accounts Selection - Multi': false,
            'Accounts Selection - Single': false,
            'Accounts Selection - None': false,
            'Accounts Menu': false,
            'Accounts Menu Hosting Addon Functionality': false,
            'Accounts Menu Full': false,
            'Accounts Line Menu': false,
            'Items Line Menu Selection Type Multi': false,
            'Items Search': false,
            'Accounts Smart Search': false,
            'Accounts Sorting Ascending': false,
            'Accounts Sorting Descending': false,
            'Items Search String': false,
            'Items Page Type Pages': false,
            'Items Page Type Pages - Page size': false,
            'Items Page Type Pages - Page Index': false,
            'Items Page Type Pages - Top Scroll Index': false,
            'Items Page Type Pages - Page Size & Page Index': false,
            'Items Page Type Pages - Page Size, Page Index & Top Scroll Index': false,
            'Items Page Type Scroll': false,
            'Items Page Type Scroll - Top Scroll Index': false,
            'Items Page Type Scroll - Page Index': false,
            'Items Page Type Scroll - Page Index & Top Scroll Index': false,
            'Items Page Type Scroll - Page Size & Page Index': false,
            'Items Page Type Scroll - Page Size & Page Index & Top Scroll Index': false,
            'Accounts Full': false,
            'Items Full - with 2 Views': false,
            'Accounts Draw Grid Relation': false,
            'ReferenceAccount with 2 Views - Tests': true,
            'FiltersAccRef with 2 Views - Tests': true,
        },
        'Single Radio Button': {
            'Items Basic': true,
            'Accounts Basic': true,
            'Accounts Default Draw': false,
            'Accounts Selection - Multi': false,
            'Accounts Selection - Single': true,
            'Accounts Selection - None': false,
            'Accounts Menu': false,
            'Accounts Menu Hosting Addon Functionality': false,
            'Accounts Menu Full': false,
            'Accounts Line Menu': false,
            'Items Line Menu Selection Type Multi': false,
            'Items Search': false,
            'Accounts Smart Search': false,
            'Accounts Sorting Ascending': false,
            'Accounts Sorting Descending': false,
            'Items Search String': false,
            'Items Page Type Pages': false,
            'Items Page Type Pages - Page size': false,
            'Items Page Type Pages - Page Index': false,
            'Items Page Type Pages - Top Scroll Index': false,
            'Items Page Type Pages - Page Size & Page Index': false,
            'Items Page Type Pages - Page Size, Page Index & Top Scroll Index': false,
            'Items Page Type Scroll': false,
            'Items Page Type Scroll - Top Scroll Index': false,
            'Items Page Type Scroll - Page Index': false,
            'Items Page Type Scroll - Page Index & Top Scroll Index': false,
            'Items Page Type Scroll - Page Size & Page Index': false,
            'Items Page Type Scroll - Page Size & Page Index & Top Scroll Index': false,
            'Accounts Full': false,
            'Items Full - with 2 Views': false,
            'Accounts Draw Grid Relation': false,
            'ReferenceAccount with 2 Views - Tests': false,
            'FiltersAccRef with 2 Views - Tests': false,
        },
        'Select All Checkbox': {
            'Items Basic': false,
            'Accounts Basic': false,
            'Accounts Default Draw': false,
            'Accounts Selection - Multi': true,
            'Accounts Selection - Single': false,
            'Accounts Selection - None': false,
            'Accounts Menu': false,
            'Accounts Menu Hosting Addon Functionality': false,
            'Accounts Menu Full': false,
            'Accounts Line Menu': false,
            'Items Line Menu Selection Type Multi': false,
            'Items Search': false,
            'Accounts Smart Search': false,
            'Accounts Sorting Ascending': false,
            'Accounts Sorting Descending': false,
            'Items Search String': false,
            'Items Page Type Pages': false,
            'Items Page Type Pages - Page size': false,
            'Items Page Type Pages - Page Index': false,
            'Items Page Type Pages - Top Scroll Index': false,
            'Items Page Type Pages - Page Size & Page Index': false,
            'Items Page Type Pages - Page Size, Page Index & Top Scroll Index': false,
            'Items Page Type Scroll': false,
            'Items Page Type Scroll - Top Scroll Index': false,
            'Items Page Type Scroll - Page Index': false,
            'Items Page Type Scroll - Page Index & Top Scroll Index': false,
            'Items Page Type Scroll - Page Size & Page Index': false,
            'Items Page Type Scroll - Page Size & Page Index & Top Scroll Index': false,
            'Accounts Full': false,
            'Items Full - with 2 Views': false,
            'Accounts Draw Grid Relation': false,
            'ReferenceAccount with 2 Views - Tests': true,
            'FiltersAccRef with 2 Views - Tests': true,
        },
        'Line Menu': {
            'Items Basic': false,
            'Accounts Basic': false,
            'Accounts Default Draw': false,
            'Accounts Selection - Multi': false,
            'Accounts Selection - Single': false,
            'Accounts Selection - None': false,
            'Accounts Menu': false,
            'Accounts Menu Hosting Addon Functionality': false,
            'Accounts Menu Full': false,
            'Accounts Line Menu': false,
            'Items Line Menu Selection Type Multi': false,
            'Items Search': false,
            'Accounts Smart Search': false,
            'Accounts Sorting Ascending': false,
            'Accounts Sorting Descending': false,
            'Items Search String': false,
            'Items Page Type Pages': false,
            'Items Page Type Pages - Page size': false,
            'Items Page Type Pages - Page Index': false,
            'Items Page Type Pages - Top Scroll Index': false,
            'Items Page Type Pages - Page Size & Page Index': false,
            'Items Page Type Pages - Page Size, Page Index & Top Scroll Index': false,
            'Items Page Type Scroll': false,
            'Items Page Type Scroll - Top Scroll Index': false,
            'Items Page Type Scroll - Page Index': false,
            'Items Page Type Scroll - Page Index & Top Scroll Index': false,
            'Items Page Type Scroll - Page Size & Page Index': false,
            'Items Page Type Scroll - Page Size & Page Index & Top Scroll Index': false,
            'Accounts Full': false,
            'Items Full - with 2 Views': false,
            'Accounts Draw Grid Relation': false,
            'ReferenceAccount with 2 Views - Tests': true,
            'FiltersAccRef with 2 Views - Tests': true,
        },
        Pager: {
            'Items Basic': true,
            'Accounts Basic': true,
            'Accounts Default Draw': true,
            'Accounts Selection - Multi': true,
            'Accounts Selection - Single': true,
            'Accounts Selection - None': true,
            'Accounts Menu': true,
            'Accounts Menu Hosting Addon Functionality': true,
            'Accounts Menu Full': true,
            'Accounts Line Menu': true,
            'Items Line Menu Selection Type Multi': true,
            'Items Search': true,
            'Accounts Smart Search': true,
            'Accounts Sorting Ascending': true,
            'Accounts Sorting Descending': true,
            'Items Search String': false,
            'Items Page Type Pages': true,
            'Items Page Type Pages - Page size': true,
            'Items Page Type Pages - Page Index': true,
            'Items Page Type Pages - Top Scroll Index': true,
            'Items Page Type Pages - Page Size & Page Index': true,
            'Items Page Type Pages - Page Size, Page Index & Top Scroll Index': true,
            'Items Page Type Scroll': false,
            'Items Page Type Scroll - Top Scroll Index': false,
            'Items Page Type Scroll - Page Index': false,
            'Items Page Type Scroll - Page Index & Top Scroll Index': false,
            'Items Page Type Scroll - Page Size & Page Index': false,
            'Items Page Type Scroll - Page Size & Page Index & Top Scroll Index': false,
            'Accounts Full': false,
            'Items Full - with 2 Views': false,
            'Accounts Draw Grid Relation': false,
            'ReferenceAccount with 2 Views - Tests': false,
            'FiltersAccRef with 2 Views - Tests': true,
        },
        Scroll: {
            'Items Basic': false,
            'Accounts Basic': false,
            'Accounts Default Draw': false,
            'Accounts Selection - Multi': false,
            'Accounts Selection - Single': false,
            'Accounts Selection - None': false,
            'Accounts Menu': false,
            'Accounts Menu Hosting Addon Functionality': false,
            'Accounts Menu Full': false,
            'Accounts Line Menu': false,
            'Items Line Menu Selection Type Multi': false,
            'Items Search': false,
            'Accounts Smart Search': false,
            'Accounts Sorting Ascending': false,
            'Accounts Sorting Descending': false,
            'Items Search String': false,
            'Items Page Type Pages': false,
            'Items Page Type Pages - Page size': false,
            'Items Page Type Pages - Page Index': false,
            'Items Page Type Pages - Top Scroll Index': false,
            'Items Page Type Pages - Page Size & Page Index': false,
            'Items Page Type Pages - Page Size, Page Index & Top Scroll Index': false,
            'Items Page Type Scroll': false,
            'Items Page Type Scroll - Top Scroll Index': false,
            'Items Page Type Scroll - Page Index': false,
            'Items Page Type Scroll - Page Index & Top Scroll Index': false,
            'Items Page Type Scroll - Page Size & Page Index': false,
            'Items Page Type Scroll - Page Size & Page Index & Top Scroll Index': false,
            'Accounts Full': false,
            'Items Full - with 2 Views': false,
            'Accounts Draw Grid Relation': false,
            'ReferenceAccount with 2 Views - Tests': false,
            'FiltersAccRef with 2 Views - Tests': false,
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

            it('Manual Sync', async () => {
                await webAppHomePage.manualResync(client);
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
                await driver.refresh();
                await resourceListABI.isSpinnerDone();
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
                                    case 'Pager':
                                        isDisplayed ? await elemntExist('Pager') : await elemntDoNotExist('Pager');
                                        break;
                                    case 'Line Menu':
                                        switch (listTitle) {
                                            case 'Accounts Line Menu':
                                                await lineMenuSingleExist();
                                                break;

                                            case 'Items Line Menu Selection Type Multi':
                                            case 'ReferenceAccount with 2 Views - Tests':
                                            case 'FiltersAccRef with 2 Views - Tests':
                                                await lineMenuMultiExist();
                                                break;

                                            case 'Items Basic':
                                            case 'Accounts Basic':
                                            case 'Accounts Selection - Single':
                                                await lineMenuSingleDoNotExist();
                                                break;

                                            case 'Accounts Selection - Multi':
                                                await lineMenuMultiDoNotExist();
                                                break;

                                            case 'Accounts Selection - None':
                                                await webAppList.clickOnRowByIndex();
                                                await webAppList.isSpinnerDone();
                                                await elemntDoNotExist('LineMenu');
                                                resourceListABI.pause(0.2 * 1000);
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
                        if (elements['Line Menu'][listTitle] && elements['Accounts Selection - Multi'][listTitle]) {
                            it('Line Menu - Disappear', async () => {
                                await lineMenuMultiDisappear();
                            });
                        }
                        switch (listTitle) {
                            case 'Items Basic':
                                break;
                            case 'Accounts Basic':
                                break;
                            case 'Accounts Default Draw':
                                break;
                            case 'Accounts Selection - Multi':
                                break;
                            case 'Accounts Selection - Single':
                                break;
                            case 'Accounts Selection - None':
                                break;
                            case 'Accounts Menu':
                                break;
                            case 'Accounts Menu Hosting Addon Functionality':
                                break;
                            case 'Accounts Menu Full':
                                break;
                            case 'Accounts Line Menu':
                                break;
                            case 'Items Line Menu Selection Type Multi':
                                break;
                            case 'Items Search':
                                break;
                            case 'Accounts Smart Search':
                                break;
                            case 'Accounts Sorting Ascending':
                                break;
                            case 'Accounts Sorting Descending':
                                break;
                            case 'Items Search String':
                                break;
                            case 'Items Page Type Pages':
                                break;
                            case 'Items Page Type Pages - Page size':
                                break;
                            case 'Items Page Type Pages - Page Index':
                                break;
                            case 'Items Page Type Pages - Top Scroll Index':
                                break;
                            case 'Items Page Type Pages - Page Size & Page Index':
                                break;
                            case 'Items Page Type Pages - Page Size, Page Index & Top Scroll Index':
                                break;
                            case 'Items Page Type Scroll':
                                break;
                            case 'Items Page Type Scroll - Top Scroll Index':
                                break;
                            case 'Items Page Type Scroll - Page Index':
                                break;
                            case 'Items Page Type Scroll - Page Index & Top Scroll Index':
                                break;
                            case 'Items Page Type Scroll - Page Size & Page Index':
                                break;
                            case 'Items Page Type Scroll - Page Size & Page Index & Top Scroll Index':
                                break;
                            case 'Accounts Full':
                                break;
                            case 'Items Full - with 2 Views':
                                break;
                            case 'Accounts Draw Grid Relation':
                                break;
                            case 'ReferenceAccount with 2 Views - Tests':
                                break;
                            case 'FiltersAccRef with 2 Views - Tests':
                                break;

                            default:
                                break;
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
            | 'Pager'
            | 'Scroll'
            | 'Views',
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
            case 'Scroll':
                selectorOfElemToFind = resourceListABI.ListAbi_VerticalScroll;
                selectorName = 'Vertical Scroll';
                break;
            case 'Views':
                selectorOfElemToFind = resourceListABI.ListAbi_ViewsDropdown;
                selectorName = 'Vertical Scroll';
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
            | 'Pager'
            | 'Scroll'
            | 'Views',
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
            | 'Pager'
            | 'Scroll'
            | 'Views',
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

    // async function lineMenuSingleDisappear() {
    //     await webAppList.clickOnRadioButtonByElementIndex();
    //     await webAppList.isSpinnerDone();
    //     await elemntDoNotExist('LineMenu');
    //     resourceListABI.pause(2 * 1000);
    // }

    async function lineMenuSingleExist() {
        await webAppList.clickOnRadioButtonByElementIndex();
        await webAppList.isSpinnerDone();
        await elemntExist('LineMenu');
        resourceListABI.pause(0.2 * 1000);
    }
}
