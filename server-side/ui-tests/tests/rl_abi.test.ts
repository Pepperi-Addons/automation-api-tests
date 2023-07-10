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

export async function ResourceListAbiTests(email: string, password: string, client: Client, varPass: string) {
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

    /* Addons Installation */
    await generalService.baseAddonVersionsInstallation(varPass);
    //#region Upgrade script dependencies
    const testData = {
        'Resource List': ['0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3', ''],
        Nebula: ['00000000-0000-0000-0000-000000006a91', ''],
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', ''],
        'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', ''],
        Pages: ['50062e0c-9967-4ed4-9102-f2bc50602d41', ''],
        Slugs: ['4ba5d6f9-6642-4817-af67-c79b68c96977', ''],
        'User Defined Events': ['cbbc42ca-0f20-4ac8-b4c6-8f87ba7c16ad', ''],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);

    describe('Prerequisites Addons for Resource List Tests', () => {
        const addonsList = Object.keys(testData);

        isInstalledArr.forEach((isInstalled, index) => {
            it(`Validate That Needed Addon Is Installed: ${addonsList[index]}`, () => {
                expect(isInstalled).to.be.true;
            });
        });
        for (const addonName in testData) {
            const addonUUID = testData[addonName][0];
            const version = testData[addonName][1];
            const currentAddonChnageVersionResponse = chnageVersionResponseArr[addonName];
            const varLatestVersion = currentAddonChnageVersionResponse[2];
            const changeType = currentAddonChnageVersionResponse[3];

            describe(`Test Data: ${addonName}`, () => {
                it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
                    if (currentAddonChnageVersionResponse[4] == 'Failure') {
                        expect(currentAddonChnageVersionResponse[5]).to.include('is already working on version');
                    } else {
                        expect(currentAddonChnageVersionResponse[4]).to.include('Success');
                    }
                });
                it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
                    await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
                        .eventually.to.have.property('Version')
                        .a('string')
                        .that.is.equal(varLatestVersion);
                });
            });
        }
    });

    const installedAddons = await generalService.getInstalledAddons();

    const installedResourceListVersion = installedAddons.find((addon) => addon.Addon.Name === 'Resource List')?.Version;
    const installedRLABIVersion = installedAddons.find(
        (addon) => addon.Addon.Name === 'ResourceListABI_Addon',
    )?.Version;
    const items = await openCatalogService.getItems();
    const accounts = await objectsService.getAccounts();
    // console.info('items: ', JSON.stringify(items, null, 2));
    // console.info('accounts: ', JSON.stringify(accounts, null, 2));
    const numOfListingsIn_items = items.length;
    const numOfListingsIn_accounts = accounts.length;
    const numOfListingsIn_items_filtered_MaNa = items.filter((item) => {
        if (item.ExternalID.includes('MaNa')) {
            return item;
        }
    }).length;
    const numOfListingsIn_items_filtered_a = items.filter((item) => {
        if (item.Name.toLowerCase().includes('a')) {
            return item;
        }
    }).length;
    const numOfListingsIn_accounts_filtered_a = accounts.filter((account) => {
        if (account.Name?.toLowerCase().includes('a')) {
            return account;
        }
    }).length;
    const numOfListingsIn_ReferenceAccountAuto = (await udcService.getAllObjectFromCollection('ReferenceAccountAuto'))
        .count;
    const numOfListingsIn_FiltersAccRefAuto = (await udcService.getAllObjectFromCollection('FiltersAccRefAuto')).count;
    const numOfListingsIn_ArraysOfPrimitivesAuto = (
        await udcService.getAllObjectFromCollection('ArraysOfPrimitivesAuto')
    ).objects.length;
    const numOfListingsIn_ContainedArray = (await udcService.getAllObjectFromCollection('ContainedArray')).objects
        .length;

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
            views: ['Items'],
            columnHeadersPerView: [
                ['Name', 'External ID', 'Main Category', 'Price', 'Cost Price', 'UPC', 'Description'],
            ],
            elements: {
                Menu: false,
                'Search Input': false,
                'Smart Search': false,
                'Single Radio Button': true,
                'Select All Checkbox': false,
                Pager: true,
                'Line Menu': false,
            },
        },
        'Accounts Basic': {
            listToSelect: '2. Accounts View - Basic',
            expectedTitle: 'Accounts Basic',
            expectedNumOfResults: numOfListingsIn_accounts,
            views: ['Accounts'],
            elements: {
                Menu: false,
                'Search Input': false,
                'Smart Search': false,
                'Single Radio Button': true,
                'Select All Checkbox': false,
                Pager: true,
                'Line Menu': false,
            },
        },
        'Accounts Default Draw': {
            listToSelect: '3. Accounts Basic View with Default Draw',
            expectedTitle: 'Accounts With Default Draw',
            expectedNumOfResults: numOfListingsIn_accounts,
            views: ['Accounts'],
            elements: {},
        },
        'Accounts Selection - Multi': {
            listToSelect: '4. Accounts with Selection Type "Multi"',
            expectedTitle: 'Accounts Selection Type Multi',
            expectedNumOfResults: numOfListingsIn_accounts,
            views: ['Accounts'],
            elements: {
                'Single Radio Button': false,
                'Select All Checkbox': true,
                'Line Menu': false,
            },
        },
        'Accounts Selection - Single': {
            listToSelect: '5. Accounts with Selection Type "Single"',
            expectedTitle: 'Accounts Selection Type Single',
            expectedNumOfResults: numOfListingsIn_accounts,
            views: ['Accounts'],
            elements: {
                'Single Radio Button': true,
                'Select All Checkbox': false,
                'Line Menu': false,
            },
        },
        'Accounts Selection - None': {
            listToSelect: '6. Accounts with Selection Type "None"',
            expectedTitle: 'Accounts Selection Type None',
            expectedNumOfResults: numOfListingsIn_accounts,
            views: ['Accounts'],
            elements: {
                'Single Radio Button': false,
                'Select All Checkbox': false,
                'Line Menu': false,
            },
        },
        'Accounts Menu': {
            listToSelect: '7. Accounts with Menu',
            expectedTitle: 'Accounts With Menu',
            expectedNumOfResults: numOfListingsIn_accounts,
            views: ['Accounts'],
            elements: {
                Menu: true,
            },
        },
        'Accounts Menu Hosting Addon Functionality': {
            listToSelect: '8. Accounts with Menu of Hosting Addon Func',
            expectedTitle: 'Accounts Menu With Hosting Addon functionality',
            expectedNumOfResults: numOfListingsIn_accounts,
            views: ['Accounts'],
            elements: {
                Menu: true,
            },
        },
        'Accounts Menu Full': {
            listToSelect: '9. Accounts with Menu - Full',
            expectedTitle: 'Accounts With Menu Full',
            expectedNumOfResults: numOfListingsIn_accounts,
            views: ['Accounts'],
            elements: {
                Menu: true,
            },
        },
        // 'Accounts Line Menu': {                                  // https://pepperi.atlassian.net/browse/DI-24145 - Release: Resource List 1.1
        //     listToSelect: '10. Accounts with Line Menu',
        //     expectedTitle: 'Accounts With Line Menu',
        //     expectedNumOfResults: numOfListingsIn_accounts,
        //     views: ['Accounts'],
        //     elements: {
        //         'Single Radio Button': true,
        //         'Select All Checkbox': false,
        //         'Line Menu': true,
        //     },
        // },
        'Items Line Menu Selection Type Multi': {
            listToSelect: '11. Items with Line Menu & Selection "Multi"',
            expectedTitle: "Items with Line Menu (Selection Type 'Multi')",
            expectedNumOfResults: numOfListingsIn_items,
            views: ['Items Line Menu Selection Multi'],
            elements: {
                'Single Radio Button': false,
                'Select All Checkbox': true,
                'Line Menu': true,
            },
        },
        'Items Search': {
            listToSelect: '12. Items with Search',
            expectedTitle: 'Items With Search (Name, Category, Description)',
            expectedNumOfResults: numOfListingsIn_items,
            views: ['Items'],
            elements: {
                'Search Input': true,
            },
        },
        'Accounts Smart Search': {
            listToSelect: '13. Accounts with Smart Search',
            expectedTitle: 'Accounts With Smart Search (Name)',
            expectedNumOfResults: numOfListingsIn_accounts,
            views: ['Accounts'],
            elements: {
                'Smart Search': true,
            },
        },
        'Accounts Sorting Ascending': {
            listToSelect: '14. Accounts with Sorting - Ascending',
            expectedTitle: 'Accounts Sorting by Name Acsending',
            expectedNumOfResults: numOfListingsIn_accounts,
            views: ['Accounts'],
            elements: {},
        },
        'Accounts Sorting Descending': {
            listToSelect: '15. Accounts with Sorting - Descending',
            expectedTitle: 'Accounts Sorting by Name Decsending',
            expectedNumOfResults: numOfListingsIn_accounts,
            views: ['Accounts'],
            elements: {},
        },
        'Items Search String': {
            listToSelect: '16. Items with Search String',
            expectedTitle: 'Items - Search String',
            expectedNumOfResults: numOfListingsIn_items_filtered_MaNa,
            views: ['Items'],
            elements: {
                'Search Input': true,
            },
        },
        'Items Page Type Pages': {
            listToSelect: '17. Items with Page Type "Pages"',
            expectedTitle: "Items Page Type 'Pages'",
            expectedNumOfResults: numOfListingsIn_items,
            views: ["Items Page Type 'Pages'"],
            elements: {
                Pager: true,
            },
        },
        'Items Page Type Pages - Page size': {
            listToSelect: '18. Items with Page Type "Pages" & Page Size',
            expectedTitle: "Items Page Type 'Pages' with Page Size",
            expectedNumOfResults: numOfListingsIn_items,
            views: ['Items Pages Page Size'],
            elements: {
                Pager: true,
            },
        },
        'Items Page Type Pages - Page Index': {
            listToSelect: '19. Items with Page Type "Pages" & Page Index',
            expectedTitle: "Items Page Type 'Pages' with Page Index",
            expectedNumOfResults: numOfListingsIn_items,
            views: ['Items Pages Page Index'],
            elements: {
                Pager: true,
            },
        },
        'Items Page Type Pages - Top Scroll Index': {
            listToSelect: '20. Items Page Type "Pages" & Top Scroll Index',
            expectedTitle: "Items Page Type 'Pages' with Top Scroll Index",
            expectedNumOfResults: numOfListingsIn_items,
            views: ['Items Pages Top Scroll Index'],
            elements: {
                Pager: true,
            },
        },
        'Items Page Type Pages - Page Size & Page Index': {
            listToSelect: '21. Items with Page Type "Pages" & Page Size & Page Index',
            expectedTitle: "Items Page Type 'Pages' with Page Size & Page Index",
            expectedNumOfResults: numOfListingsIn_items,
            views: ['Items Pages Page Size & Page Index'],
            elements: {
                Pager: true,
            },
        },
        'Items Page Type Pages - Page Size, Page Index & Top Scroll Index': {
            listToSelect: '22. Items with Page Type "Pages" & Page Size & Page Index & Top Scroll Index',
            expectedTitle: "Items Page Type 'Pages' with Page Size, Page Index and Top Scroll Index",
            expectedNumOfResults: numOfListingsIn_items,
            views: ['Items Pages Page Size, Page Index, Top Scroll Index'],
            elements: {
                Pager: true,
            },
        },
        'Items Page Type Scroll': {
            listToSelect: '23. Items with Page Type "Scroll"',
            expectedTitle: "Items Page Type 'Scroll'",
            expectedNumOfResults: numOfListingsIn_items,
            views: ["Items Page Type 'Scroll'"],
            elements: {
                Pager: false,
            },
        },
        // 'Items Page Type Scroll - Top Scroll Index': {                                // https://pepperi.atlassian.net/browse/DI-24307 - Release: Resource List 1.1
        //     listToSelect: '24. Items with Page Type "Scroll" & Top Scroll Index',
        //     expectedTitle: "Items: Page Type 'Scroll' with Top Scroll Index",
        //     expectedNumOfResults: numOfListingsIn_items,
        //     views: ['Items Scroll Top Scroll Index'],
        //     elements: {
        //         Pager: false,
        //     },
        // },
        'Items Page Type Scroll - Page Index': {
            listToSelect: '25. Items with Page Type "Scroll" & Page Index',
            expectedTitle: "Items Page Type 'Scroll' with Page Index",
            expectedNumOfResults: numOfListingsIn_items,
            views: ['Items Scroll Page Index'],
            elements: {
                Pager: false,
            },
        },
        // 'Items Page Type Scroll - Page Index & Top Scroll Index': {                            // https://pepperi.atlassian.net/browse/DI-24307 - Release: Resource List 1.1
        //     listToSelect: '26. Items with Page Type "Scroll" & Page Index & Top Scroll Index',
        //     expectedTitle: "Items Page Type 'Scroll' with Page Index and Top Scroll Index",
        //     expectedNumOfResults: numOfListingsIn_items,
        //     views: ['Items Scroll Page Index Top Scroll Index'],
        //     elements: {
        //         Pager: false,
        //     },
        // },
        'Items Page Type Scroll - Page Size & Page Index': {
            listToSelect: '27. Items with Page Type "Scroll" & Page Size & Page Index',
            expectedTitle: "Items Page Type 'Scroll' with Page Size and Page Index",
            expectedNumOfResults: numOfListingsIn_items,
            views: ['Items Scroll Page Size Page Index'],
            elements: {
                Pager: false,
            },
        },
        // 'Items Page Type Scroll - Page Size & Page Index & Top Scroll Index': {                    // https://pepperi.atlassian.net/browse/DI-24154 - Release: Resource List 1.1
        //     listToSelect: '28. Items with Page Type "Scroll" & Page Size & Page Index & Top Scroll Index',
        //     expectedTitle: "Items Page Type 'Scroll' with Page Size, Page Index and Top Scroll Index",
        //     expectedNumOfResults: numOfListingsIn_items,
        //     views: ['Items Scroll Page Size Page Index Top Scroll Index'],
        //     elements: {
        //         Pager: false,
        //     },
        // },
        'Accounts Full': {
            listToSelect: '29. Accounts View - Full',
            expectedTitle: 'Accounts Full',
            expectedNumOfResults: numOfListingsIn_accounts_filtered_a,
            views: ['Accounts Full'],
            elements: {
                Menu: true,
                'New Button': true,
                'Search Input': true,
                'Smart Search': true,
                'Single Radio Button': false,
                'Select All Checkbox': true,
                Pager: true,
                'Line Menu': true,
            },
        },
        'Items Full - with 2 Views': {
            listToSelect: '30. Items View - Full with 2 Views',
            expectedTitle: 'Items Full - 2 Views',
            expectedNumOfResults: numOfListingsIn_items_filtered_a,
            views: ['Items Name Main Category', 'Items Name Price'],
            columnHeadersPerView: [
                ['Name', 'External ID', 'Main Category'],
                ['Name', 'External ID', 'Price', 'Cost Price', 'UPC'],
            ],
            elements: {
                Menu: true,
                'New Button': true,
                'Search Input': true,
                'Smart Search': true,
                'Single Radio Button': true,
                'Select All Checkbox': false,
                Pager: true,
                // 'Line Menu': true,                     // https://pepperi.atlassian.net/browse/DI-24145 - Release: Resource List 1.1
            },
        },
        'Accounts Draw Grid Relation': {
            listToSelect: '31. Accounts - Test Draw Grid Relation',
            expectedTitle: 'Accounts Test Draw Grid Relation',
            expectedNumOfResults: numOfListingsIn_accounts,
            views: ['Accounts Test Draw'],
            elements: {
                Menu: false,
                'New Button': false,
                'Search Input': false,
                'Smart Search': false,
                'Single Radio Button': false,
                'Select All Checkbox': true,
                Pager: true,
                'Line Menu': false,
            },
        },
        'ReferenceAccount with 2 Views - Tests': {
            listToSelect: '32. ReferenceAccount with 2 Views',
            expectedTitle: 'Reference Account',
            expectedNumOfResults: numOfListingsIn_ReferenceAccountAuto,
            views: ['Best Seller', 'Max Quantity'],
            elements: {
                Menu: true,
                'New Button': false,
                'Search Input': true,
                'Smart Search': true,
                'Single Radio Button': false,
                'Select All Checkbox': true,
                Pager: false,
                'Line Menu': true,
            },
        },
        'FiltersAccRef with 2 Views - Tests': {
            listToSelect: '33. FiltersAccRef with 2 Views',
            expectedTitle: 'Filters Acc Ref ABI View',
            expectedNumOfResults: numOfListingsIn_FiltersAccRefAuto,
            views: ['Additional Indexed Fields', 'No Additional'],
            elements: {
                Menu: true,
                'New Button': true,
                'Search Input': true,
                'Smart Search': true,
                'Single Radio Button': false,
                'Select All Checkbox': true,
                Pager: true,
                'Line Menu': true,
            },
        },
        'Accounts Propagated Error': {
            listToSelect: '34. Accounts - throw Error due to wrong AddonUUID',
            expectedTitle: '',
            expectedNumOfResults: 0,
            elements: {},
        },
        'Arrays Of Primitives Numbers Names Reals': {
            listToSelect: '35.Arrays Of Primitives - Test Draw Array',
            expectedTitle: 'Arrays Of Primitives - Numbers, Names, Reals (Test Draw Array)',
            expectedNumOfResults: numOfListingsIn_ArraysOfPrimitivesAuto,
            views: ['Arrays Of Primitives'],
            elements: {},
        },
        'Contained Array Scheme Only Name Age': {
            listToSelect: '36. Contained Array - Test Draw Array',
            expectedTitle: 'Contained Array - Scheme Only Name Age (Test Draw Array)',
            expectedNumOfResults: numOfListingsIn_ContainedArray,
            views: ['Contained Array'],
            elements: {},
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
            console.info(
                'numOfListingsIn_items_filtered_MaNa: ',
                JSON.stringify(numOfListingsIn_items_filtered_MaNa, null, 2),
            );
            console.info(
                'numOfListingsIn_items_filtered_a: ',
                JSON.stringify(numOfListingsIn_items_filtered_a, null, 2),
            );
            console.info(
                'numOfListingsIn_accounts_filtered_a: ',
                JSON.stringify(numOfListingsIn_accounts_filtered_a, null, 2),
            );
            console.info(
                'numOfListingsIn_ArraysOfPrimitivesAuto: ',
                JSON.stringify(numOfListingsIn_ArraysOfPrimitivesAuto, null, 2),
            );
            console.info('numOfListingsIn_ContainedArray: ', JSON.stringify(numOfListingsIn_ContainedArray, null, 2));
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
                            const listData: [string, string, number, string, boolean | undefined, string | undefined] =
                                [
                                    lists[listTitle].listToSelect,
                                    lists[listTitle].expectedTitle,
                                    lists[listTitle].expectedNumOfResults,
                                    '',
                                    undefined,
                                    undefined,
                                ];
                            switch (listTitle) {
                                case 'Accounts Propagated Error':
                                    listData[4] = true;
                                    listData[5] =
                                        "Error: Addon with uuid 0e2ae61b-a26a-4c26-81fe doesn't exist or isn't installed or doesn't have any cpi-side files";
                                    break;

                                default:
                                    listData[3] = lists[listTitle].views[0];
                                    break;
                            }
                            await listPickAndVerify(...listData);
                            resourceListABI.pause(0.1 * 1000);
                            await resourceListABI.isSpinnerDone();
                        });

                        Object.keys(lists[listTitle].elements).forEach((element) => {
                            const isDisplayed = lists[listTitle].elements[element];
                            it(`${element} - ${isDisplayed ? 'DISPLAYED' : 'NOT Displayed'}`, async () => {
                                switch (element) {
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
                                            case 'Items Full - with 2 Views':
                                                await lineMenuSingleExist();
                                                break;

                                            case 'Items Line Menu Selection Type Multi':
                                            case 'Accounts Full':
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
                                            case 'Accounts Draw Grid Relation':
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
                        if (
                            lists[listTitle].elements['Line Menu'] &&
                            lists[listTitle].elements['Select All Checkbox']
                        ) {
                            it('Line Menu - Disappear', async () => {
                                await lineMenuMultiDisappear();
                            });
                        }
                        switch (listTitle) {
                            case 'Items Basic':
                                it('Validate Views', async () => {
                                    const currentListExpectedViews = lists[listTitle].views;
                                    const currentListExpectedHeadersPerView = lists[listTitle].columnHeadersPerView;
                                    await validateViewsTitles(
                                        currentListExpectedViews.length,
                                        currentListExpectedViews,
                                    );
                                    await validateViewsListHeaders(
                                        currentListExpectedViews.length,
                                        currentListExpectedViews,
                                        currentListExpectedHeadersPerView,
                                    );
                                });
                                break;
                            // case 'Accounts Basic':
                            //     break;
                            // case 'Accounts Propagated Error':
                            //     break;
                            // case 'Accounts Default Draw':
                            //     break;
                            // case 'Accounts Selection - Multi':
                            //     break;
                            // case 'Accounts Selection - Single':
                            //     break;
                            // case 'Accounts Selection - None':
                            //     break;
                            case 'Accounts Menu':
                                // open menu and check that the items are there - Recycle Bin | Import | Export
                                break;
                            case 'Accounts Menu Hosting Addon Functionality':
                                // open menu and check that the items are there - Test | Go To Home Page
                                // click "Go To Home Page" button and check to be on home page
                                break;
                            case 'Accounts Menu Full':
                                // open menu and check that the items are there - Recycle Bin | Import | Export | Test | Go To Home Page
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
                                // check that search input holds the correct string
                                break;
                            // case 'Items Page Type Pages':
                            //     break;
                            // case 'Items Page Type Pages - Page size':
                            //     break;
                            // case 'Items Page Type Pages - Page Index':
                            //     break;
                            // case 'Items Page Type Pages - Top Scroll Index':
                            //     break;
                            // case 'Items Page Type Pages - Page Size & Page Index':
                            //     break;
                            // case 'Items Page Type Pages - Page Size, Page Index & Top Scroll Index':
                            //     break;
                            // case 'Items Page Type Scroll':
                            //     break;
                            // case 'Items Page Type Scroll - Top Scroll Index':
                            //     break;
                            // case 'Items Page Type Scroll - Page Index':
                            //     break;
                            // case 'Items Page Type Scroll - Page Index & Top Scroll Index':
                            //     break;
                            // case 'Items Page Type Scroll - Page Size & Page Index':
                            //     break;
                            // case 'Items Page Type Scroll - Page Size & Page Index & Top Scroll Index':
                            //     break;
                            case 'Accounts Full':
                                // click "Test" button in Menu and check that "Hello World" appear in search input and search response
                                break;
                            case 'Items Full - with 2 Views':
                                it('Validate Views', async () => {
                                    const currentListExpectedViews = lists[listTitle].views;
                                    const currentListExpectedHeadersPerView = lists[listTitle].columnHeadersPerView;
                                    await validateViewsTitles(
                                        currentListExpectedViews.length,
                                        currentListExpectedViews,
                                    );
                                    await validateViewsListHeaders(
                                        currentListExpectedViews.length,
                                        currentListExpectedViews,
                                        currentListExpectedHeadersPerView,
                                    );
                                });
                                break;
                            case 'Accounts Draw Grid Relation':
                                // DI-22735
                                break;
                            case 'ReferenceAccount with 2 Views - Tests':
                                break;
                            case 'FiltersAccRef with 2 Views - Tests':
                                break;
                            case 'Arrays Of Primitives Numbers Names Reals':
                                // test the content on the list cells - that it is displayed correctly
                                break;
                            case 'Contained Array Scheme Only Name Age':
                                // test the content on the list cells - that it is displayed correctly
                                break;

                            default:
                                break;
                        }
                    });
                });
            });
        });
    });

    async function listPickAndVerify(
        listToSelect: string,
        expectedTitle: string,
        expectedNumOfResults: number,
        defaultView: string,
        err = false,
        errorText?: string,
    ) {
        await resourceListABI.isSpinnerDone();
        if (listToSelect) {
            await resourceListABI.selectDropBoxByString(resourceListABI.TestsAddon_dropdownElement, listToSelect);
            await resourceListABI.isSpinnerDone();
        }
        await resourceListABI.clickElement('TestsAddon_openABI_button');
        await resourceListABI.isSpinnerDone();
        await resourceListABI.waitTillVisible(resourceListABI.ListAbi_container, 15000);
        if (!err) {
            const listAbiTitle = await (await driver.findElement(resourceListABI.ListAbi_title)).getAttribute('title');
            expect(listAbiTitle.trim()).to.equal(expectedTitle);
            await resourceListABI.waitTillVisible(resourceListABI.ListAbi_ViewsDropdown, 15000);
            const listAbi_ViewTitle = await (
                await driver.findElement(resourceListABI.ListAbi_ViewsDropdown_value)
            ).getText();
            expect(listAbi_ViewTitle.trim()).to.equal(defaultView);
            resourceListABI.pause(0.1 * 1000);
            if (expectedNumOfResults > 0) {
                await elemntExist('ListRow');
                resourceListABI.pause(0.2 * 1000);
            }
        } else {
            const listAbiErrorTitle = await (
                await driver.findElement(resourceListABI.ListAbi_Empty_Error_title)
            ).getText();
            const listAbiErrorDescription = await (
                await driver.findElement(resourceListABI.ListAbi_Empty_Error_description)
            ).getText();
            expect(listAbiErrorTitle.trim()).to.equal('Error');
            expect(listAbiErrorDescription.trim()).to.contain(errorText);
        }
        const listAbiResultsNumber = await (await driver.findElement(resourceListABI.ListAbi_results_number)).getText();
        expect(Number(listAbiResultsNumber.trim())).to.equal(expectedNumOfResults);
    }

    async function getSelector(
        elemName:
            | 'Menu'
            | 'New Button'
            | 'LineMenu'
            | 'Search'
            | 'SmartSearch'
            | 'ListRow'
            | 'MultiCheckbox'
            | 'SingleRadioButton'
            | 'Pager'
            | 'Scroll'
            | 'RadioButtonSelected'
            | 'CheckboxSelected'
            | 'Views',
    ) {
        let selectorOfElemToFind: By;
        let selectorName: string;
        switch (elemName) {
            case 'Menu':
                selectorOfElemToFind = resourceListABI.ListAbi_Menu_button;
                selectorName = 'Menu Button';
                break;
            case 'New Button':
                selectorOfElemToFind = resourceListABI.ListAbi_New_button;
                selectorName = 'New Button';
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
            case 'RadioButtonSelected':
                selectorOfElemToFind = webAppList.RadioButtonSelected;
                selectorName = 'Selected Radio Button';
                break;
            case 'CheckboxSelected':
                selectorOfElemToFind = webAppList.RowElementCheckBoxSelected;
                selectorName = 'Selected Checkbox';
                break;
            case 'Views':
                selectorOfElemToFind = resourceListABI.ListAbi_ViewsDropdown;
                selectorName = 'Views Box';
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
            | 'New Button'
            | 'LineMenu'
            | 'Search'
            | 'SmartSearch'
            | 'ListRow'
            | 'MultiCheckbox'
            | 'SingleRadioButton'
            | 'Pager'
            | 'Scroll'
            | 'RadioButtonSelected'
            | 'CheckboxSelected'
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
            | 'New Button'
            | 'LineMenu'
            | 'Search'
            | 'SmartSearch'
            | 'ListRow'
            | 'MultiCheckbox'
            | 'SingleRadioButton'
            | 'Pager'
            | 'Scroll'
            | 'RadioButtonSelected'
            | 'CheckboxSelected'
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
        await elemntDoNotExist('CheckboxSelected');
        await webAppList.clickOnCheckBoxByElementIndex();
        await webAppList.isSpinnerDone();
        await webAppList.untilIsVisible(webAppList.RowElementCheckBoxSelected);
        await elemntDoNotExist('LineMenu');
        resourceListABI.pause(0.2 * 1000);
        await webAppList.clickOnCheckBoxByElementIndex();
        await webAppList.isSpinnerDone();
        await elemntDoNotExist('CheckboxSelected');
        await elemntDoNotExist('LineMenu');
        resourceListABI.pause(2 * 1000);
    }

    async function lineMenuSingleDoNotExist() {
        await elemntDoNotExist('RadioButtonSelected');
        await webAppList.clickOnRadioButtonByElementIndex();
        await webAppList.isSpinnerDone();
        await webAppList.untilIsVisible(webAppList.RadioButtonSelected);
        await elemntDoNotExist('LineMenu');
        resourceListABI.pause(0.2 * 1000);
        await webAppList.clickOnRadioButtonByElementIndex();
        await webAppList.isSpinnerDone();
        await elemntDoNotExist('LineMenu');
        resourceListABI.pause(2 * 1000);
    }

    async function lineMenuSingleExist() {
        await elemntDoNotExist('RadioButtonSelected');
        await webAppList.clickOnRadioButtonByElementIndex();
        await webAppList.isSpinnerDone();
        await webAppList.untilIsVisible(webAppList.RadioButtonSelected);
        await elemntExist('LineMenu');
        resourceListABI.pause(0.2 * 1000);
    }

    async function lineMenuMultiExist() {
        await elemntDoNotExist('CheckboxSelected');
        await webAppList.clickOnCheckBoxByElementIndex();
        await webAppList.isSpinnerDone();
        await webAppList.untilIsVisible(webAppList.RowElementCheckBoxSelected);
        await elemntExist('LineMenu');
        resourceListABI.pause(0.2 * 1000);
    }

    async function lineMenuMultiDisappear() {
        await elemntExist('CheckboxSelected');
        await webAppList.clickOnCheckBoxByElementIndex();
        await webAppList.isSpinnerDone();
        await elemntDoNotExist('CheckboxSelected');
        await elemntDoNotExist('LineMenu');
        resourceListABI.pause(2 * 1000);
    }

    async function validateView(expectedViewTitle: string, expectedColumnHeaders: string[]) {
        console.info(`***In Validate View*** ${expectedViewTitle}`);
        const listHeaders = await driver.findElements(webAppList.Headers);
        const viewTitle = await (await driver.findElement(resourceListABI.ListAbi_ViewsDropdown_value)).getText();
        driver.sleep(0.1 * 1000);
        console.info(`in validateView, expectedColumnHeaders: ${expectedColumnHeaders}`);
        console.info(`in validateView, viewTitle: ${viewTitle}`);
        expect(listHeaders.length).to.equal(expectedColumnHeaders.length);
        expect(viewTitle).to.equal(expectedViewTitle);
        listHeaders.forEach(async (header, index) => {
            try {
                const headerTitle = (await header.getText()).trim();
                console.info(`headerTitle: ${headerTitle}`);
                expect(headerTitle).equals(expectedColumnHeaders[index]);
            } catch (error) {
                console.error(
                    `Validating List Headers: looking for ${index}. ${await header.getText()}, getting error: ${error}`,
                );
            }
        });
    }

    async function validateViewsTitles(expectedNumOfViews: number, expectedViewsTitles: string[]) {
        await driver.click(resourceListABI.ListAbi_ViewsDropdown);
        await driver.untilIsVisible(resourceListABI.ListAbi_ViewsDropdownOptions_container);
        const views = await driver.findElements(resourceListABI.ListAbi_ViewsDropdownSingleOption_textContent);
        resourceListABI.pause(0.2 * 1000);
        expect(views.length).to.equal(expectedNumOfViews);
        await views[0].click();
        resourceListABI.pause(0.1 * 1000);
        views.forEach(async (view) => {
            try {
                const viewTitle = await view.getText();
                expect(expectedViewsTitles).contains(viewTitle);
            } catch (error) {
                console.error(
                    `Validating View Title: "${JSON.stringify(
                        await view.getText(),
                    )}" in dropdown, getting an error: ${error}`,
                );
            }
        });
    }

    async function validateViewsListHeaders(
        expectedNumOfViews: number,
        expectedViewsTitles: string[],
        columnHeadersOfEachView: string[][],
    ) {
        driver.sleep(0.1 * 1000);
        for (let viewIndex = 0; viewIndex < expectedNumOfViews; viewIndex++) {
            console.info(`In validateViews, viewIndex: ${viewIndex}`);
            await switchViewByName(expectedViewsTitles[viewIndex]);
            await validateView(expectedViewsTitles[viewIndex], columnHeadersOfEachView[viewIndex]);
        }
        driver.sleep(5 * 1000);
    }

    async function switchViewByName(viewText: string) {
        console.info('***In Switch View***');
        await driver.untilIsVisible(resourceListABI.ListAbi_ViewsDropdown);
        await resourceListABI.selectDropBoxByString(resourceListABI.ListAbi_ViewsDropdown, viewText);
        driver.sleep(0.1 * 1000);
        await driver.click(resourceListABI.ListAbi_title);
        driver.sleep(1 * 1000);
        const currentView = await (await driver.findElement(resourceListABI.ListAbi_ViewsDropdown_value)).getText();
        expect(currentView).equals(viewText);
    }
}
