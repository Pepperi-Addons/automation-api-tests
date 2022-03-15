import GeneralService, { ConsoleColors, TesterFunctions, ResourceTypes } from '../../services/general.service';
import fs from 'fs';
import { describe, it, after, beforeEach, afterEach, run } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { TestDataTests, DistributorTests, AddonDataImportExportPerformanceTests } from '../../api-tests/index';
import {
    LoginTests,
    OrderTests,
    WorkflowTests,
    DeepLinkTests,
    PromotionTests,
    SecurityPolicyTests,
    CreateDistributorTests,
    UomTests,
} from './index';
import { ObjectsService } from '../../services/objects.service';
import addContext from 'mochawesome/addContext';
import { Client } from '@pepperi-addons/debug-server';
import { UIControl } from '@pepperi-addons/papi-sdk';

/**
 * To run this script from CLI please replace each <> with the correct user information:
 * npm run ui-show-report --server=stage/prod --chrome_headless=false --user_email='<>' --user_pass='<>' --var_pass='<>' --tests='<>'
 *
 * There are two scripts that should be used with the default seetings:
 * 1. ui-cli-report - This script for executing the script in Jenkins.
 * 2. ui-show-repor - This will open the browser with the report when the test finished.
 *
 * Used Params are:
 * 1. server - This switch between 'stage' for stage or any for 'production'.
 * 2. chrome_headless - This switch accept boolean value
 */

chai.use(promised);

const tests = process.env.npm_config_tests as string;
const email = process.env.npm_config_user_email as string;
const pass = process.env.npm_config_user_pass as string;
const varPass = process.env.npm_config_var_pass as string;
const varPassEU = process.env.npm_config_var_pass_eu as string;

(async function () {
    const tempGeneralService = new GeneralService({
        AddonUUID: '',
        AddonSecretKey: '',
        BaseURL: '',
        OAuthAccessToken: '',
        AssetsBaseUrl: '',
        Retry: function () {
            return;
        },
    });

    const client: Client = await tempGeneralService.initiateTester(email, pass);

    const generalService = new GeneralService(client);

    let nestedGap = '';
    let startedTestSuiteTitle = '';

    generalService.PrintMemoryUseToLog('Start', tests);
    after(function () {
        generalService.PrintMemoryUseToLog('End', tests);
    });

    beforeEach(function () {
        let isCorrectNestedGap = false;
        do {
            if (
                this.currentTest.parent.suites.length > nestedGap.length &&
                this.currentTest.parent.title != startedTestSuiteTitle
            ) {
                const suiteTitle = this.currentTest.parent.title;
                nestedGap += '\t';
                console.log(`%c${nestedGap.slice(1)}Test Suite Start: ${suiteTitle}`, ConsoleColors.SystemInformation);
                startedTestSuiteTitle = suiteTitle;
            } else if (
                this.currentTest.parent.suites.length < nestedGap.length &&
                this.currentTest.parent.title != startedTestSuiteTitle
            ) {
                console.log(
                    `%c${nestedGap.slice(1)}Test Suite End: ${startedTestSuiteTitle}\n`,
                    ConsoleColors.SystemInformation,
                );
                nestedGap = nestedGap.slice(1);
            } else if (
                this.currentTest.parent.suites.length == 0 &&
                this.currentTest.parent.title != startedTestSuiteTitle
            ) {
                isCorrectNestedGap = true;
                nestedGap = '\t';
                console.log(`%cTest Suite Start: ${this.currentTest.parent.title}`, ConsoleColors.SystemInformation);
                console.log(`%c${nestedGap}Test Start: ${this.currentTest.title}`, ConsoleColors.SystemInformation);
                startedTestSuiteTitle = this.currentTest.parent.title;
            } else {
                isCorrectNestedGap = true;
                console.log(`%c${nestedGap}Test Start: ${this.currentTest.title}`, ConsoleColors.SystemInformation);
            }
        } while (!isCorrectNestedGap);
    });

    afterEach(function () {
        if (this.currentTest.state != 'passed') {
            console.log(
                `%c${nestedGap}Test End: ${this.currentTest.title}: Result: ${this.currentTest.state}`,
                ConsoleColors.Error,
            );
        } else {
            console.log(
                `%c${nestedGap}Test End: ${this.currentTest.title}: Result: ${this.currentTest.state}`,
                ConsoleColors.Success,
            );
        }
        if (this.currentTest.parent.tests.slice(-1)[0].title == this.currentTest.title) {
            console.log(
                `%c${nestedGap.slice(1)}Test Suite End: ${startedTestSuiteTitle}\n`,
                ConsoleColors.SystemInformation,
            );
            nestedGap = nestedGap.slice(1);
        }
    });

    if (tests != 'Create') {
        await TestDataTests(generalService, { describe, expect, it } as TesterFunctions);
    }

    if (tests.includes('Reset')) {
        //Reset the needed UI Controls for the UI tests.
        await replaceUIControlsTests(this, generalService);

        //Verify all items exist or replace them
        await replaceItemsTests(generalService);

        await upgradeDependenciesTests(generalService, varPass);
    }

    if (tests.includes('Sanity')) {
        await LoginTests(email, pass);
        await OrderTests(email, pass, client);
    }

    if (tests.includes('Workflow')) {
        await WorkflowTests(email, pass, client);
    }

    if (tests.includes('DeepLink')) {
        await DeepLinkTests(email, pass, client);
    }

    if (tests.includes('Promotion')) {
        await PromotionTests(email, pass, client);
    }

    if (tests.includes('Security')) {
        await SecurityPolicyTests(email, pass);
    }

    if (tests.includes('Create')) {
        await CreateDistributorTests(generalService, varPass, varPassEU);
    }

    if (tests.includes('Uom')) {
        await UomTests(email, pass, varPass, client);
    }

    if (tests.includes('Distributor')) {
        await DistributorTests(
            generalService,
            {
                body: {
                    varKeyStage: varPass,
                    varKeyPro: varPass,
                    varKeyEU: varPassEU,
                },
            },
            { describe, expect, it } as TesterFunctions,
        );
    }

    if (tests.includes('Dimx')) {
        await AddonDataImportExportPerformanceTests(
            generalService,
            {
                body: {
                    varKeyStage: varPass,
                    varKeyPro: varPass,
                    varKeyEU: varPassEU,
                },
            },
            { describe, expect, it } as TesterFunctions,
        );
    }

    run();
})();

export async function upgradeDependenciesTests(generalService: GeneralService, varPass: string) {
    const testData = {
        'API Testing Framework': ['eb26afcd-3cf2-482e-9ab1-b53c41a6adbe', ''],
        'Services Framework': ['00000000-0000-0000-0000-000000000a91', '9.5'],
        'Cross Platforms API': ['00000000-0000-0000-0000-000000abcdef', '9.'],
        'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', '16.80.4'], //hardcoded version because there are CPAS .80 versions only for CPI team testing - this one is phased
        'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', '16.65.36'], //16.60.38 //16.60
        'Settings Framework': ['354c5123-a7d0-4f52-8fce-3cf1ebc95314', '9.5.305'], //9.5
        'Addons Manager': ['bd629d5f-a7b4-4d03-9e7c-67865a6d82a9', '0.'],
        'Data Views API': ['484e7f22-796a-45f8-9082-12a734bac4e8', '1.'],
        ADAL: ['00000000-0000-0000-0000-00000000ada1', '1.'],
        'Automated Jobs': ['fcb7ced2-4c81-4705-9f2b-89310d45e6c7', ''],
        'Relations Framework': ['5ac7d8c3-0249-4805-8ce9-af4aecd77794', ''],
        'Object Types Editor': ['04de9428-8658-4bf7-8171-b59f6327bbf1', '1.'],
        'Pepperi Notification Service': ['00000000-0000-0000-0000-000000040fa9', ''],
        'Item Trade Promotions': ['b5c00007-0941-44ab-9f0e-5da2773f2f04', ''],
        'Order Trade Promotions': ['375425f5-cd2f-4372-bb88-6ff878f40630', ''],
        'Package Trade Promotions': ['90b11a55-b36d-48f1-88dc-6d8e06d08286', ''],
    };
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);

    //Services Framework, Cross Platforms API, WebApp Platform, Addons Manager, Data Views API, Settings Framework, ADAL
    describe('Upgrade Dependencies Addons', function () {
        this.retries(1);

        it('Validate That All The Needed Addons Installed', async function () {
            isInstalledArr.forEach((isInstalled) => {
                expect(isInstalled).to.be.true;
            });
        });

        for (const addonName in testData) {
            const addonUUID = testData[addonName][0];
            const version = testData[addonName][1];
            const varLatestVersion = chnageVersionResponseArr[addonName][2];
            const changeType = chnageVersionResponseArr[addonName][3];
            describe(`${addonName}`, function () {
                it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, function () {
                    if (chnageVersionResponseArr[addonName][4] == 'Failure') {
                        expect(chnageVersionResponseArr[addonName][5]).to.include('is already working on version');
                    } else {
                        expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
                    }
                });

                it(`Latest Version Is Installed ${varLatestVersion}`, async function () {
                    await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
                        .eventually.to.have.property('Version')
                        .a('string')
                        .that.is.equal(varLatestVersion);
                });
            });
        }
    });
}

export async function replaceItemsTests(generalService: GeneralService) {
    const objectsService = new ObjectsService(generalService);
    const getAllItems = await objectsService.getItems();
    if (getAllItems.length > 5) {
        describe("Don't Replace Items", function () {
            it("The Test Of Repleace Items Is Limited For Safty Reasons - Won't Run When More Then 5 Items Exist", async function () {
                expect(true).to.be.true;
            });
        });
    } else {
        describe('Replace Items', function () {
            this.retries(1);

            it('Remove Existing Items', async function () {
                //Remove old items
                const itemsArr = await generalService.papiClient.items.find({ page_size: -1 });
                for (let i = 0; i < itemsArr.length; i++) {
                    const deleted = await generalService.papiClient.items.delete(itemsArr[i].InternalID as number);
                    expect(deleted).to.be.true;
                }
            });

            it('Add New Items', async function () {
                //Add new items from local file
                const filesFromFile = fs.readFileSync('../server-side/api-tests/test-data/items.json', {
                    encoding: 'utf8',
                    flag: 'r',
                });
                const objects = JSON.parse(filesFromFile);
                const filteredArray = objects.filter((item) => item.hasOwnProperty('Image'));
                for (let j = 0; j < filteredArray.length; j++) {
                    for (const key in filteredArray[j]) {
                        if (
                            filteredArray[j][key] === null ||
                            JSON.stringify(filteredArray[j][key]) === '{}' ||
                            objects[j][key] === ''
                        ) {
                            delete filteredArray[j][key];
                            continue;
                        }
                        if (
                            key === 'Hidden' ||
                            key === 'InternalID' ||
                            key === 'UUID' ||
                            key === 'Inventory' ||
                            key === 'CreationDateTime' ||
                            key === 'ModificationDateTime'
                        ) {
                            delete filteredArray[j][key];
                            continue;
                        }
                        if (key === 'Parent') {
                            delete filteredArray[j][key].URI;
                            delete filteredArray[j][key].Data.InternalID;
                            delete filteredArray[j][key].Data.UUID;
                        }
                    }
                    //In cases when post item randomally fails, retry 4 times before failing the test
                    let postItemsResponse;
                    let maxLoopsCounter = 5;
                    let isItemPosted = false;
                    do {
                        try {
                            postItemsResponse = await objectsService.postItem(filteredArray[j]);
                            isItemPosted = true;
                        } catch (error) {
                            console.log(`POST item faild for item: ${JSON.stringify(filteredArray[j])}`);
                            console.log(
                                `Wait ${6 * (6 - maxLoopsCounter)} seconds, and retry ${
                                    maxLoopsCounter - 1
                                } more times`,
                            );
                            generalService.sleep(6000 * (6 - maxLoopsCounter));
                        }
                        maxLoopsCounter--;
                    } while (!isItemPosted && maxLoopsCounter > 0);
                    expect(postItemsResponse.Hidden).to.be.false;
                    expect(postItemsResponse.InternalID).to.be.above(0);
                }

                // Create json object from the sorted objects
                // fs.writeFileSync('sorted_items.json', JSON.stringify(filteredArray), 'utf8');
            });
        });
    }
}

/**
 * this function is used as a TEST for replacing UI controls using the API - should be used in creating a dist kind of situations
 * @param that 'this' of the TEST class which the function called from
 * @param generalService general service instance to use inside the function
 */
export async function replaceUIControlsTests(that: any, generalService: GeneralService) {
    describe('Replace UIControls', async function () {
        this.retries(1);

        //Add new UIControls from local file
        const uIControlArrFromFile = fs.readFileSync('../server-side/api-tests/test-data/UIControls.json', {
            encoding: 'utf8',
            flag: 'r',
        });
        const uIControlArr = JSON.parse(uIControlArrFromFile);

        for (let j = 0; j < uIControlArr.length; j++) {
            if (uIControlArr[j]['Type'] == 'CatalogSelectionCard') {
                it(`Add UIControls ${uIControlArr[j]['Type']}`, async function () {
                    const setCatalogSelectionCardUIBinded = setCatalogSelectionCardUI.bind(that);
                    await setCatalogSelectionCardUIBinded(generalService, uIControlArr[j]);
                });
            } else if (uIControlArr[j]['Type'] == 'CatalogForm') {
                it(`Add UIControls ${uIControlArr[j]['Type']}`, async function () {
                    const setCatalogFormUIBinded = setCatalogFormUI.bind(that);
                    await setCatalogFormUIBinded(generalService, uIControlArr[j]);
                });
            } else if (uIControlArr[j]['Type'] == '[OA#0]OrderViewsMenu') {
                it(`Add UIControls ${uIControlArr[j]['Type']}`, async function () {
                    const setOrderViewsMenuBinded = setOrderViewsMenu.bind(that);
                    await setOrderViewsMenuBinded(generalService, uIControlArr[j]);
                });
            } else if (uIControlArr[j]['Type'] == '[OA#0]OrderCartGrid') {
                it(`Add UIControls ${uIControlArr[j]['Type']}`, async function () {
                    const setOrderCartGridBinded = setOrderCartGrid.bind(that);
                    await setOrderCartGridBinded(generalService, uIControlArr[j]);
                });
            } else if (uIControlArr[j]['Type'] == '[OA#0]OrderBanner') {
                it(`Add UIControls ${uIControlArr[j]['Type']}`, async function () {
                    const setOrderBannerBinded = setOrderBanner.bind(that);
                    await setOrderBannerBinded(generalService, uIControlArr[j]);
                });
            } else if (uIControlArr[j]['Type'] == '[OA#0]OrderCartOpenedFooter') {
                it(`Add UIControls ${uIControlArr[j]['Type']}`, async function () {
                    const setOrderCartOpenedFooterBinded = setOrderCartOpenedFooter.bind(that);
                    await setOrderCartOpenedFooterBinded(generalService, uIControlArr[j]);
                });
            } else if (uIControlArr[j]['Type'] == '[OA#0]OrderCenterClosedFooter') {
                it(`Add UIControls ${uIControlArr[j]['Type']}`, async function () {
                    const setOrderCenterClosedFooterBinded = setOrderCenterClosedFooter.bind(that);
                    await setOrderCenterClosedFooterBinded(generalService, uIControlArr[j]);
                });
            }
        }
    });
}

/**
 * this function is used as a routine inside a flow to validate all UI controls are configured correctly before starting the test
 * @param that 'this' of the TEST class which the function called from
 * @param generalService general service instance to use inside the function
 */
export async function replaceUIControls(that: any, generalService: GeneralService) {
    //Add new UIControls from local file
    const uIControlArrFromFile = fs.readFileSync('../server-side/api-tests/test-data/UIControls.json', {
        encoding: 'utf8',
        flag: 'r',
    });
    const uIControlArr = JSON.parse(uIControlArrFromFile);
    for (let j = 0; j < uIControlArr.length; j++) {
        if (uIControlArr[j]['Type'] == 'CatalogSelectionCard') {
            const setCatalogSelectionCardUIBinded = setCatalogSelectionCardUI.bind(that);
            await setCatalogSelectionCardUIBinded(generalService, uIControlArr[j]);
        } else if (uIControlArr[j]['Type'] == 'CatalogForm') {
            const setCatalogFormUIBinded = setCatalogFormUI.bind(that);
            await setCatalogFormUIBinded(generalService, uIControlArr[j]);
        } else if (uIControlArr[j]['Type'] == '[OA#0]OrderViewsMenu') {
            const setOrderViewsMenuBinded = setOrderViewsMenu.bind(that);
            await setOrderViewsMenuBinded(generalService, uIControlArr[j]);
        } else if (uIControlArr[j]['Type'] == '[OA#0]OrderCartGrid') {
            const setOrderCartGridBinded = setOrderCartGrid.bind(that);
            await setOrderCartGridBinded(generalService, uIControlArr[j]);
        } else if (uIControlArr[j]['Type'] == '[OA#0]OrderBanner') {
            const setOrderBannerBinded = setOrderBanner.bind(that);
            await setOrderBannerBinded(generalService, uIControlArr[j]);
        } else if (uIControlArr[j]['Type'] == '[OA#0]OrderCartOpenedFooter') {
            const setOrderCartOpenedFooterBinded = setOrderCartOpenedFooter.bind(that);
            await setOrderCartOpenedFooterBinded(generalService, uIControlArr[j]);
        } else if (uIControlArr[j]['Type'] == '[OA#0]OrderCenterClosedFooter') {
            const setOrderCenterClosedFooterBinded = setOrderCenterClosedFooter.bind(that);
            await setOrderCenterClosedFooterBinded(generalService, uIControlArr[j]);
        }
    }
}

//#region Replacing UI Functions
async function setCatalogSelectionCardUI(generalService: GeneralService, catalogSelectionUIControl: UIControl) {
    const catalogSelectionCard: UIControl[] = await generalService.papiClient.uiControls.find({
        where: `Type='CatalogSelectionCard'`,
    });
    expect(catalogSelectionCard).to.have.length.that.is.above(0);
    for (let i = 0; i < catalogSelectionCard.length; i++) {
        addContext(this, {
            title: 'Test Data',
            value: `Add UIControls ${catalogSelectionCard[i]['Type']}, ${catalogSelectionCard[i]['InternalID']}`,
        });
        const uiControlFromAPI = catalogSelectionCard[i].UIControlData.split('CatalogSelectionCard');
        const uiControlFromFile = catalogSelectionUIControl.UIControlData.split('CatalogSelectionCard');
        catalogSelectionCard[i].UIControlData = `${uiControlFromAPI[0]}CatalogSelectionCard${uiControlFromFile[1]}`;
        const upsertUIControlResponse = await generalService.papiClient.uiControls.upsert(catalogSelectionCard[i]);
        expect(upsertUIControlResponse.Hidden).to.be.false;
        expect(upsertUIControlResponse.Type).to.include('CatalogSelectionCard');
    }
}

async function setCatalogFormUI(generalService: GeneralService, catalogSelectionUIControl: UIControl) {
    const catalogForm: UIControl[] = await generalService.papiClient.uiControls.find({
        where: `Type='CatalogForm'`,
    });
    expect(catalogForm).to.have.length.that.is.above(0);
    for (let i = 0; i < catalogForm.length; i++) {
        addContext(this, {
            title: 'Test Data',
            value: `Add UIControls ${catalogForm[i]['Type']}, ${catalogForm[i]['InternalID']}`,
        });
        const uiControlFromAPI = catalogForm[i].UIControlData.split('CatalogForm');
        const uiControlFromFile = catalogSelectionUIControl.UIControlData.split('CatalogForm');
        catalogForm[i].UIControlData = `${uiControlFromAPI[0]}CatalogForm${uiControlFromFile[1]}`;
        const upsertUIControlResponse = await generalService.papiClient.uiControls.upsert(catalogForm[i]);
        expect(upsertUIControlResponse.Hidden).to.be.false;
        expect(upsertUIControlResponse.Type).to.include('CatalogForm');
    }
}

async function setOrderViewsMenu(generalService: GeneralService, orderViewsMenuUIControl: UIControl) {
    const orderViewsMenu = await generalService.papiClient.uiControls.find({
        where: "Type LIKE '%OrderViewsMenu'",
    });
    expect(orderViewsMenu).to.have.length.that.is.above(0);
    for (let i = 0; i < orderViewsMenu.length; i++) {
        addContext(this, {
            title: 'Test Data',
            value: `Add UIControls ${orderViewsMenu[i]['Type']}, ${orderViewsMenu[i]['InternalID']}`,
        });
        const uiControlFromAPI = orderViewsMenu[i].UIControlData.split('OrderViewsMenu');
        const uiControlFromFile = orderViewsMenuUIControl.UIControlData.split('OrderViewsMenu');
        orderViewsMenu[i].UIControlData = `${uiControlFromAPI[0]}OrderViewsMenu${uiControlFromFile[1]}`;
        const upsertUIControlResponse = await generalService.papiClient.uiControls.upsert(orderViewsMenu[i]);
        expect(upsertUIControlResponse.Hidden).to.be.false;
        expect(upsertUIControlResponse.Type).to.include('OrderViewsMenu');
    }
}

async function setOrderCartGrid(generalService: GeneralService, orderCartGridUIControl: UIControl) {
    const orderCartGrid = await generalService.papiClient.uiControls.find({
        where: "Type LIKE '%OrderCartGrid'",
    });
    expect(orderCartGrid).to.have.length.that.is.above(0);
    for (let i = 0; i < orderCartGrid.length; i++) {
        addContext(this, {
            title: 'Test Data',
            value: `Add UIControls ${orderCartGrid[i]['Type']}, ${orderCartGrid[i]['InternalID']}`,
        });
        const uiControlFromAPI = orderCartGrid[i].UIControlData.split('OrderCartGrid');
        const uiControlFromFile = orderCartGridUIControl.UIControlData.split('OrderCartGrid');
        orderCartGrid[i].UIControlData = `${uiControlFromAPI[0]}OrderCartGrid${uiControlFromFile[1]}`;
        const upsertUIControlResponse = await generalService.papiClient.uiControls.upsert(orderCartGrid[i]);
        expect(upsertUIControlResponse.Hidden).to.be.false;
        expect(upsertUIControlResponse.Type).to.include('OrderCartGrid');
    }
}

async function setOrderBanner(generalService: GeneralService, OrderBannerUIControl: UIControl) {
    const orderBanner = await generalService.papiClient.uiControls.find({
        where: "Type LIKE '%OrderBanner'",
    });
    expect(orderBanner).to.have.length.that.is.above(0);
    for (let i = 0; i < orderBanner.length; i++) {
        addContext(this, {
            title: 'Test Data',
            value: `Add UIControls ${orderBanner[i]['Type']}, ${orderBanner[i]['InternalID']}`,
        });
        const uiControlFromAPI = orderBanner[i].UIControlData.split('OrderBanner');
        const uiControlFromFile = OrderBannerUIControl.UIControlData.split('OrderBanner');
        orderBanner[i].UIControlData = `${uiControlFromAPI[0]}OrderBanner${uiControlFromFile[1]}`;
        const upsertUIControlResponse = await generalService.papiClient.uiControls.upsert(orderBanner[i]);
        expect(upsertUIControlResponse.Hidden).to.be.false;
        expect(upsertUIControlResponse.Type).to.include('OrderBanner');
    }
}

async function setOrderCartOpenedFooter(generalService: GeneralService, OrderCartOpenedFooterUIControl: UIControl) {
    const orderCartOpenedFooter = await generalService.papiClient.uiControls.find({
        where: "Type LIKE '%OrderCartOpenedFooter'",
    });
    expect(orderCartOpenedFooter).to.have.length.that.is.above(0);
    for (let i = 0; i < orderCartOpenedFooter.length; i++) {
        addContext(this, {
            title: 'Test Data',
            value: `Add UIControls ${orderCartOpenedFooter[i]['Type']}, ${orderCartOpenedFooter[i]['InternalID']}`,
        });
        const uiControlFromAPI = orderCartOpenedFooter[i].UIControlData.split('OrderCartOpenedFooter');
        const uiControlFromFile = OrderCartOpenedFooterUIControl.UIControlData.split('OrderCartOpenedFooter');
        orderCartOpenedFooter[i].UIControlData = `${uiControlFromAPI[0]}OrderCartOpenedFooter${uiControlFromFile[1]}`;
        const upsertUIControlResponse = await generalService.papiClient.uiControls.upsert(orderCartOpenedFooter[i]);
        expect(upsertUIControlResponse.Hidden).to.be.false;
        expect(upsertUIControlResponse.Type).to.include('OrderCartOpenedFooter');
    }
}

async function setOrderCenterClosedFooter(generalService: GeneralService, OrderCenterClosedFooterUIControl: UIControl) {
    const orderCenterClosedFooter: any = await generalService.papiClient.uiControls.find({
        where: "Type LIKE '%OrderCenterClosedFooter'",
    });
    expect(orderCenterClosedFooter).to.have.length.that.is.above(0);
    const atdArray: any = await generalService.papiClient.metaData.type('transactions' as ResourceTypes).types.get();
    let orderOrigenUpdateCounter = 0;
    for (let i = 0; i < atdArray.length; i++) {
        const uiControlFromAPI = orderCenterClosedFooter[0].UIControlData.split('OrderCenterClosedFooter');
        uiControlFromAPI[0] = `${uiControlFromAPI[0].split('OA#')[0]}OA#${atdArray[i]['InternalID']}]`;
        const uiControlFromFile = OrderCenterClosedFooterUIControl.UIControlData.split('OrderCenterClosedFooter');
        addContext(this, {
            title: 'Test Data',
            value: `Add UIControls ${uiControlFromAPI[0]}OrderCenterClosedFooter${uiControlFromFile[1]}, ${atdArray[i]['InternalID']}`,
        });
        if (JSON.stringify(orderCenterClosedFooter).includes(atdArray[i].InternalID)) {
            orderCenterClosedFooter[0]['InternalID'] = orderCenterClosedFooter[orderOrigenUpdateCounter].InternalID;
            orderOrigenUpdateCounter++;
        } else {
            delete orderCenterClosedFooter[0].InternalID;
        }
        orderCenterClosedFooter[0].UIControlData = `${uiControlFromAPI[0]}OrderCenterClosedFooter${uiControlFromFile[1]}`;
        orderCenterClosedFooter[0].Type = `[OA#${atdArray[i]['InternalID']}]OrderCenterClosedFooter`;
        const upsertUIControlResponse = await generalService.papiClient.uiControls.upsert(orderCenterClosedFooter[0]);
        expect(upsertUIControlResponse.Hidden).to.be.false;
        expect(upsertUIControlResponse.Type).to.include('OrderCenterClosedFooter');
    }
}
//#endregion Replacing UI Functions
