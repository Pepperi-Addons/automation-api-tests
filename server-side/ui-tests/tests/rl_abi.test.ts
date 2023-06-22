import promised from 'chai-as-promised';
// import { Client } from '@pepperi-addons/debug-server/dist';
import { Browser } from '../utilities/browser';
import {
    WebAppLoginPage,
    WebAppHomePage,
    WebAppHeader,
    // WebAppDialog,
    WebAppList,
} from '../pom';
import { describe, it, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import { ResourceListABI } from '../pom/addons/ResourceListABI';
import { By } from 'selenium-webdriver';

chai.use(promised);

export async function ResourceListAbiTests(email: string, password: string) {
    let driver: Browser;
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    let webAppHeader: WebAppHeader;
    // let webAppDialog: WebAppDialog;
    let webAppList: WebAppList;
    let resourceListABI: ResourceListABI;

    describe('Resource List ABI UI tests', async () => {
        /** Description **/
        /** for the purpose of this test an Addon named "resource_list_abi" was created **/
        /** it's code can be found at the following repository: https://github.com/Pepperi-Addons/resource-list-abi-tests/tree/main/client-side/src/app/settings/rl-abi **/
        /** the Addon provides a set of list containers that through the "Resource List ABI" are displayed as Generic List inside a Dialog - upon a button click **/
        /** the access to the UI of the Addon is either via the Settings Side Panel, or through the path:
         * https://app.pepperi.com/settings_block/cd3ba412-66a4-42f4-8abc-65768c5dc606/resource_list_abi/view *
         * or through the Home Page Slug: "Resource List ABI" **/

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppLoginPage = new WebAppLoginPage(driver);
            webAppHomePage = new WebAppHomePage(driver);
            webAppHeader = new WebAppHeader(driver);
            // webAppDialog = new WebAppDialog(driver);
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
            const lists = {
                'Items Basic': { listToSelect: '', expectedTitle: 'Items Basic', expectedNumOfResults: 78 },
                'Accounts Basic': {
                    listToSelect: 'Accounts View - Basic',
                    expectedTitle: 'Accounts Basic',
                    expectedNumOfResults: 4,
                },
                'Accounts Selection - Multi': {
                    listToSelect: 'Accounts with Selection Type "Multi"',
                    expectedTitle: 'Accounts Selection Type Multi',
                    expectedNumOfResults: 4,
                },
                'Accounts Selection - Single': {
                    listToSelect: 'Accounts with Selection Type "Single"',
                    expectedTitle: 'Accounts Selection Type Single',
                    expectedNumOfResults: 4,
                },
                'Accounts Selection - None': {
                    listToSelect: 'Accounts with Selection Type "None"',
                    expectedTitle: 'Accounts Selection Type None',
                    expectedNumOfResults: 4,
                },
                'ReferenceAccount with 2 Views - Tests': {
                    listToSelect: 'ReferenceAccount with 2 Views',
                    expectedTitle: 'Reference Account',
                    expectedNumOfResults: 7,
                },
                'FiltersAccRef with 2 Views - Tests': {
                    listToSelect: 'FiltersAccRef with 2 Views',
                    expectedTitle: 'Filters Acc Ref ABI View',
                    expectedNumOfResults: 28,
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
            };
            Object.keys(lists).forEach((title) => {
                describe(title, async () => {
                    after(async function () {
                        await driver.refresh();
                    });
                    let enteringListTitle = '';

                    switch (title) {
                        case 'Items Basic':
                            enteringListTitle = 'Entering Default Selected List';
                            break;

                        default:
                            enteringListTitle = 'Choosing List Data and Opening the Dialog';
                            break;
                    }
                    it(enteringListTitle, async () => {
                        await listPickAndVerify(
                            lists[title].listToSelect,
                            lists[title].expectedTitle,
                            lists[title].expectedNumOfResults,
                        );
                        resourceListABI.pause(0.1 * 1000);
                    });
                    if (lists[title].expectedNumOfResults > 0) {
                        it('List Row - Appear', async () => {
                            await elemntExist('ListRow');
                            resourceListABI.pause(0.2 * 1000);
                        });
                    }
                    Object.keys(elements).forEach((webElement) => {
                        const isDisplayed = elements[webElement][title];
                        it(`${webElement} - ${isDisplayed ? 'DISPLAYED' : 'NOT Displayed'}`, async () => {
                            // debugger
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
                                    switch (title) {
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
                    switch (title) {
                        case 'ReferenceAccount with 2 Views - Tests':
                            it('Line Menu - Disappear', async () => {
                                // await webAppList.clickOnCheckBoxByElementIndex();
                                // await webAppList.isSpinnerDone();
                                // await elemntDoNotExist('LineMenu');
                                // resourceListABI.pause(2 * 1000);
                                await lineMenuMultiDisappear();
                            });

                            break;
                        case 'FiltersAccRef with 2 Views - Tests':
                            it('Line Menu - Disappear', async () => {
                                await lineMenuMultiDisappear();
                            });
                            break;

                        default:
                            break;
                    }
                });
            });
            // describe('Items Basic - Tests', async () => {
            //     after(async function () {
            //         await driver.refresh();
            //     });
            //     it('Entering Default Selected List', async () => {
            //         await listPickAndVerify('', 'Items Basic', 78);
            //         resourceListABI.pause(0.1 * 1000);
            //     });
            //     it('List Row - Appear', async () => {
            //         await elemntExist('ListRow');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Single Radio Button - Appear', async () => {
            //         await elemntExist('SingleRadioButton');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Menu - Do Not Appear', async () => {
            //         await elemntDoNotExist('Menu');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Search Input - Do Not Appear', async () => {
            //         await elemntDoNotExist('Search');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Smart Search - Do Not Appear', async () => {
            //         await elemntDoNotExist('SmartSearch');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Line Menu - Do Not Appear', async () => {
            //         await webAppList.clickOnRadioButtonByElementIndex();
            //         await webAppList.isSpinnerDone();
            //         await elemntDoNotExist('LineMenu');
            //         resourceListABI.pause(0.2 * 1000);
            //         await webAppList.clickOnRadioButtonByElementIndex();
            //         await webAppList.isSpinnerDone();
            //         await elemntDoNotExist('LineMenu');
            //         resourceListABI.pause(2 * 1000);
            //     });
            // });
            // describe('Accounts Basic - Tests', async () => {
            //     after(async function () {
            //         await driver.refresh();
            //     });
            //     it('Choosing List Data and Opening the Dialog', async () => {
            //         const listToSelect = 'Accounts View - Basic';
            //         await listPickAndVerify(listToSelect, 'Accounts Basic', 4);
            //         resourceListABI.pause(0.1 * 1000);
            //     });
            //     it('List Row - Appear', async () => {
            //         await elemntExist('ListRow');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Select All Checkbox - Appear', async () => {
            //         await elemntExist('MultiCheckbox');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Menu - Do Not Appear', async () => {
            //         await elemntDoNotExist('Menu');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Search Input - Do Not Appear', async () => {
            //         await elemntDoNotExist('Search');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Smart Search - Do Not Appear', async () => {
            //         await elemntDoNotExist('SmartSearch');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Line Menu - Do Not Appear', async () => {
            //         await webAppList.clickOnCheckBoxByElementIndex();
            //         await webAppList.isSpinnerDone();
            //         await elemntDoNotExist('LineMenu');
            //         resourceListABI.pause(0.2 * 1000);
            //         await webAppList.clickOnCheckBoxByElementIndex();
            //         await webAppList.isSpinnerDone();
            //         await elemntDoNotExist('LineMenu');
            //         resourceListABI.pause(2 * 1000);
            //     });
            // });
            // describe('Accounts Selection - Multi', async () => {
            //     after(async function () {
            //         await driver.refresh();
            //     });
            //     it('Choosing List Data and Opening the Dialog', async () => {
            //         const listToSelect = 'Accounts with Selection Type "Multi"';
            //         await listPickAndVerify(listToSelect, 'Accounts Selection Type Multi', 4);
            //         resourceListABI.pause(0.1 * 1000);
            //     });
            //     it('List Row - Appear', async () => {
            //         await elemntExist('ListRow');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Select All Checkbox - Appear', async () => {
            //         await elemntExist('MultiCheckbox');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Single Radio Button - Do Not Appear', async () => {
            //         await elemntDoNotExist('SingleRadioButton');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Menu - Do Not Appear', async () => {
            //         await elemntDoNotExist('Menu');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Search Input - Do Not Appear', async () => {
            //         await elemntDoNotExist('Search');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Smart Search - Do Not Appear', async () => {
            //         await elemntDoNotExist('SmartSearch');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Line Menu - Do Not Appear', async () => {
            //         await webAppList.clickOnCheckBoxByElementIndex();
            //         await webAppList.isSpinnerDone();
            //         await elemntDoNotExist('LineMenu');
            //         resourceListABI.pause(0.2 * 1000);
            //         await webAppList.clickOnCheckBoxByElementIndex();
            //         await webAppList.isSpinnerDone();
            //         await elemntDoNotExist('LineMenu');
            //         resourceListABI.pause(2 * 1000);
            //     });
            // });
            // describe('Accounts Selection - Single', async () => {
            //     after(async function () {
            //         await driver.refresh();
            //     });
            //     it('Choosing List Data and Opening the Dialog', async () => {
            //         const listToSelect = 'Accounts with Selection Type "Single"';
            //         await listPickAndVerify(listToSelect, 'Accounts Selection Type Single', 4);
            //         resourceListABI.pause(0.1 * 1000);
            //     });
            //     it('List Row - Appear', async () => {
            //         await elemntExist('ListRow');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Single Radio Button - Appear', async () => {
            //         await elemntExist('SingleRadioButton');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Select All Checkbox - Do Not Appear', async () => {
            //         await elemntDoNotExist('MultiCheckbox');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Menu - Do Not Appear', async () => {
            //         await elemntDoNotExist('Menu');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Search Input - Do Not Appear', async () => {
            //         await elemntDoNotExist('Search');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Smart Search - Do Not Appear', async () => {
            //         await elemntDoNotExist('SmartSearch');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Line Menu - Do Not Appear', async () => {
            //         await webAppList.clickOnRadioButtonByElementIndex();
            //         await webAppList.isSpinnerDone();
            //         await elemntDoNotExist('LineMenu');
            //         resourceListABI.pause(0.2 * 1000);
            //         await webAppList.clickOnRadioButtonByElementIndex();
            //         await webAppList.isSpinnerDone();
            //         await elemntDoNotExist('LineMenu');
            //         resourceListABI.pause(2 * 1000);
            //     });
            // });
            // describe('Accounts Selection - None', async () => {
            //     after(async function () {
            //         await driver.refresh();
            //     });
            //     it('Choosing List Data and Opening the Dialog', async () => {
            //         const listToSelect = 'Accounts with Selection Type "None"';
            //         await listPickAndVerify(listToSelect, 'Accounts Selection Type None', 4);
            //         resourceListABI.pause(0.1 * 1000);
            //     });
            //     it('List Row - Appear', async () => {
            //         await elemntExist('ListRow');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Select All Checkbox - Do Not Appear', async () => {
            //         await elemntDoNotExist('MultiCheckbox');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Single Radio Button - Do Not Appear', async () => {
            //         await elemntDoNotExist('SingleRadioButton');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Menu - Do Not Appear', async () => {
            //         await elemntDoNotExist('Menu');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Search Input - Do Not Appear', async () => {
            //         await elemntDoNotExist('Search');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Smart Search - Do Not Appear', async () => {
            //         await elemntDoNotExist('SmartSearch');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Line Menu - Do Not Appear', async () => {
            //         await webAppList.clickOnRowByIndex();
            //         await webAppList.isSpinnerDone();
            //         await elemntDoNotExist('LineMenu');
            //         // resourceListABI.pause(0.2 * 1000);
            //         // await webAppList.clickOnRowByIndex();
            //         // await webAppList.isSpinnerDone();
            //         // await elemntDoNotExist('LineMenu');
            //         resourceListABI.pause(2 * 1000);
            //     });
            // });
            // describe('ReferenceAccount with 2 Views - Tests', async () => {
            //     after(async function () {
            //         await driver.refresh();
            //     });
            //     it('Choosing List Data and Opening the Dialog', async () => {
            //         driver.refresh();
            //         const listToSelect = 'ReferenceAccount with 2 Views';
            //         await listPickAndVerify(listToSelect, 'Reference Account', 7);
            //         resourceListABI.pause(0.1 * 1000);
            //     });
            //     it('Menu - Appear', async () => {
            //         await elemntExist('Menu');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Search Input - Appear', async () => {
            //         await elemntExist('Search');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Smart Search - Appear', async () => {
            //         await elemntExist('SmartSearch');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Line Menu - Appear', async () => {
            //         await webAppList.clickOnCheckBoxByElementIndex();
            //         await webAppList.isSpinnerDone();
            //         await elemntExist('LineMenu');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Line Menu - Disappear', async () => {
            //         await webAppList.clickOnCheckBoxByElementIndex();
            //         await webAppList.isSpinnerDone();
            //         await elemntDoNotExist('LineMenu');
            //         resourceListABI.pause(2 * 1000);
            //     });
            // });
            // describe('FiltersAccRef with 2 Views - Tests', async () => {
            //     after(async function () {
            //         await driver.refresh();
            //     });
            //     it('Choosing List Data and Opening the Dialog', async () => {
            //         driver.refresh();
            //         const listToSelect = 'FiltersAccRef with 2 Views';
            //         await listPickAndVerify(listToSelect, 'Filters Acc Ref ABI View', 28);
            //         resourceListABI.pause(0.1 * 1000);
            //     });
            //     it('Menu - Appear', async () => {
            //         await elemntExist('Menu');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Search Input - Appear', async () => {
            //         await elemntExist('Search');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Smart Search - Appear', async () => {
            //         await elemntExist('SmartSearch');
            //         resourceListABI.pause(0.2 * 1000);
            //     });
            //     it('Line Menu - Appear', async () => {
            //         await webAppList.clickOnCheckBoxByElementIndex();
            //         await webAppList.isSpinnerDone();
            //         await elemntExist('LineMenu');
            //         resourceListABI.pause(0.2 * 1000);
            //         // await webAppList.clickOnCheckBoxByElementIndex();
            //         // resourceListABI.pause(2 * 1000);
            //     });
            //     it('Line Menu - Disappear', async () => {
            //         await webAppList.clickOnCheckBoxByElementIndex();
            //         await webAppList.isSpinnerDone();
            //         await elemntDoNotExist('LineMenu');
            //         // resourceListABI.pause(0.2 * 1000);
            //         // await webAppList.clickOnCheckBoxByElementIndex();
            //         resourceListABI.pause(2 * 1000);
            //     });
            //     it('To Be Continued...', async () => {
            //         // await webAppList.clickOnFromListRowWebElementByName(nameOfAccount); //5737a507-fa00-4c32-a26a-8bc32572e24d
            //         resourceListABI.pause(10 * 1000);
            //     });
            // });
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
        // await resourceListABI.click(resourceListABI.HtmlBody);
        // await resourceListABI.waitTillVisible(webAppDialog.ButtonArr, 15000);
        await resourceListABI.waitTillVisible(resourceListABI.ListAbi_container, 15000);
        const listAbiTitle = await (await driver.findElement(resourceListABI.ListAbi_title)).getAttribute('title');
        expect(listAbiTitle.trim()).to.equal(expectedTitle);
        const listAbiResultsNumber = await (await driver.findElement(resourceListABI.ListAbi_results_number)).getText();
        expect(Number(listAbiResultsNumber.trim())).to.equal(expectedNumOfResults);
    }

    async function getSelector(
        elemName: 'Menu' | 'LineMenu' | 'Search' | 'SmartSearch' | 'ListRow' | 'MultiCheckbox' | 'SingleRadioButton',
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

            default:
                selectorOfElemToFind = resourceListABI.ListAbi_container;
                selectorName = '';
                break;
        }
        return { selector: selectorOfElemToFind, name: selectorName };
    }

    async function elemntDoNotExist(
        element: 'Menu' | 'LineMenu' | 'Search' | 'SmartSearch' | 'ListRow' | 'MultiCheckbox' | 'SingleRadioButton',
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
        element: 'Menu' | 'LineMenu' | 'Search' | 'SmartSearch' | 'ListRow' | 'MultiCheckbox' | 'SingleRadioButton',
    ) {
        const selectorDetails = getSelector(element);
        try {
            const element = await driver.findElement((await selectorDetails).selector);
            expect(await typeof element).to.equal('object');
        } catch (error) {
            const theError = error as Error;
            console.error(error);
            expect(theError.message).to.be.undefined;
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

    // async function lineMenuSingleExist() {}
}
