import GeneralService, { TesterFunctions } from '../../services/general.service';
import fetch from 'node-fetch';
import jwt_decode from 'jwt-decode';
import fs from 'fs';
import { describe, it, run } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { TestDataTest } from '../../api-tests/test-service/test_data';
import { Client } from '@pepperi-addons/debug-server';
import { LoginTest } from './login';
import { OrdersTest } from './orders';
import { WorkflowTest } from './workflow';
import { ObjectsService } from '../../services/objects.service';
import addContext from 'mochawesome/addContext';

/**
 * To run this script from CLI please replace each <> with the correct user information:
 * npm run ui-show-report --server=stage --chrome_headless=false --user_email=<> --user_pass=<> --var_pass='<>'
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

const email = process.env.npm_config_user_email as string;
const pass = process.env.npm_config_user_pass as string;
const varPass = process.env.npm_config_var_pass as string;

(async function () {
    const client = await initiateTester();

    const generalService = new GeneralService(client);

    await TestDataTest(generalService, { describe, expect, it } as TesterFunctions);

    //Reset the needed UI Controls for the UI tests.
    await replaceUIControls(generalService);

    //Verify all items exist or replace them
    await replaceItems(generalService);

    await upgradeDependenciesTests(generalService, varPass);

    await LoginTest(email, pass);

    await OrdersTest(email, pass, client);

    await WorkflowTest(email, pass);

    run();
})();

async function initiateTester(): Promise<Client> {
    const urlencoded = new URLSearchParams();
    urlencoded.append('username', email);
    urlencoded.append('password', pass);
    urlencoded.append('scope', 'pepperi.apint pepperi.wacd offline_access');
    urlencoded.append('grant_type', 'password');
    urlencoded.append('client_id', 'ios.com.wrnty.peppery');

    const getToken = await fetch(
        `https://idp${process.env.npm_config_server == 'stage' ? '.sandbox' : ''}.pepperi.com/connect/token`,
        { method: 'POST', body: urlencoded },
    )
        .then((res) => res.text())
        .then((res) => (res ? JSON.parse(res) : ''));

    return createClient(getToken.access_token);
}

function createClient(authorization) {
    if (!authorization) {
        throw new Error('unauthorized');
    }
    const token = authorization.replace('Bearer ', '') || '';
    const parsedToken = jwt_decode(token);
    const [sk, AddonUUID] = getSecret();
    return {
        AddonUUID: AddonUUID,
        AddonSecretKey: sk,
        BaseURL: parsedToken['pepperi.baseurl'],
        OAuthAccessToken: token,
        AssetsBaseUrl: 'http://localhost:4400/publish/assets',
        Retry: function () {
            return;
        },
    };
}

function getSecret() {
    const addonUUID = JSON.parse(fs.readFileSync('../addon.config.json', { encoding: 'utf8', flag: 'r' }))['AddonUUID'];
    let sk;
    try {
        sk = fs.readFileSync('../var_sk', { encoding: 'utf8', flag: 'r' });
    } catch (error) {
        console.log(`SK Not found: ${error}`);
        sk = '00000000-0000-0000-0000-000000000000';
    }
    return [addonUUID, sk];
}

async function upgradeDependenciesTests(generalService: GeneralService, varPass) {
    const testData = {
        'API Testing Framework': ['eb26afcd-3cf2-482e-9ab1-b53c41a6adbe', ''],
        'Services Framework': ['00000000-0000-0000-0000-000000000a91', '9.5'],
        'Cross Platforms API': ['00000000-0000-0000-0000-000000abcdef', '9.'],
        'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', '16.6'],
        'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', '16.60'],
        'Settings Framework': ['354c5123-a7d0-4f52-8fce-3cf1ebc95314', '9.5'],
        'Addons Manager': ['bd629d5f-a7b4-4d03-9e7c-67865a6d82a9', '0.'],
        'Data Views API': ['484e7f22-796a-45f8-9082-12a734bac4e8', '1.'],
        ADAL: ['00000000-0000-0000-0000-00000000ada1', '1.'],
        'Pepperi Notification Service': ['00000000-0000-0000-0000-000000040fa9', ''],
        'Relations Framework': ['5ac7d8c3-0249-4805-8ce9-af4aecd77794', ''],
        'Object Types Editor': ['04de9428-8658-4bf7-8171-b59f6327bbf1', ''],
    };
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.chnageVersion(varPass, testData, true);

    //Services Framework, Cross Platforms API, WebApp Platform, Addons Manager, Data Views API, Settings Framework, ADAL
    describe('Upgrade Dependencies Addons', function () {
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

async function replaceItems(generalService: GeneralService) {
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
                    let postItemsResponse;
                    try {
                        postItemsResponse = await objectsService.postItem(filteredArray[j]);
                    } catch (error) {
                        console.log(`POST item faild for item: ${JSON.stringify(filteredArray[j])}`);
                        //In cases when post item randomally fails, wait and try again before failing the test
                        generalService.sleep(4000);
                        postItemsResponse = await objectsService.postItem(filteredArray[j]);
                    }
                    expect(postItemsResponse.Hidden).to.be.false;
                    expect(postItemsResponse.InternalID).to.be.above(0);
                }

                //Create json object from the sorted objects
                // fs.writeFileSync('sorted_items.json', JSON.stringify(filteredArray), 'utf8');
            });
        });
    }
}

async function replaceUIControls(generalService: GeneralService) {
    describe('Replace UIControls', function () {
        //Add new UIControls from local file
        const uIControlArrFromFile = fs.readFileSync('../server-side/api-tests/test-data/UIControls.json', {
            encoding: 'utf8',
            flag: 'r',
        });
        const uIControlArr = JSON.parse(uIControlArrFromFile);

        let catalogSelectionCard;
        let catalogForm;
        let orderViewsMenu;

        for (let j = 0; j < uIControlArr.length; j++) {
            if (uIControlArr[j]['Type'] == 'CatalogSelectionCard') {
                it(`Add UIControls ${uIControlArr[j]['Type']}`, async function () {
                    catalogSelectionCard = await generalService.papiClient.uiControls.find({
                        where: `Type='CatalogSelectionCard'`,
                    });
                    expect(catalogSelectionCard).to.have.length.that.is.above(0);
                    for (let i = 0; i < catalogSelectionCard.length; i++) {
                        addContext(this, {
                            title: 'Test Data',
                            value: `Add UIControls ${catalogSelectionCard[i]['Type']}, ${catalogSelectionCard[i]['InternalID']}`,
                        });
                        const uiControlFromAPI = catalogSelectionCard[i].UIControlData.split('CatalogSelectionCard');
                        const uiControlFromFile = uIControlArr[j].UIControlData.split('CatalogSelectionCard');
                        catalogSelectionCard[
                            i
                        ].UIControlData = `${uiControlFromAPI[0]}CatalogSelectionCard${uiControlFromFile[1]}`;
                        const upsertUIControlResponse = await generalService.papiClient.uiControls.upsert(
                            catalogSelectionCard[i],
                        );
                        expect(upsertUIControlResponse.Hidden).to.be.false;
                        expect(upsertUIControlResponse.Type).to.include('CatalogSelectionCard');
                    }
                });
            } else if (uIControlArr[j]['Type'] == 'CatalogForm') {
                it(`Add UIControls ${uIControlArr[j]['Type']}`, async function () {
                    catalogForm = await generalService.papiClient.uiControls.find({
                        where: `Type='CatalogForm'`,
                    });
                    expect(catalogForm).to.have.length.that.is.above(0);
                    for (let i = 0; i < catalogForm.length; i++) {
                        addContext(this, {
                            title: 'Test Data',
                            value: `Add UIControls ${catalogForm[i]['Type']}, ${catalogForm[i]['InternalID']}`,
                        });
                        const uiControlFromAPI = catalogForm[i].UIControlData.split('CatalogForm');
                        const uiControlFromFile = uIControlArr[j].UIControlData.split('CatalogForm');
                        catalogForm[i].UIControlData = `${uiControlFromAPI[0]}CatalogForm${uiControlFromFile[1]}`;
                        const upsertUIControlResponse = await generalService.papiClient.uiControls.upsert(
                            catalogForm[i],
                        );
                        expect(upsertUIControlResponse.Hidden).to.be.false;
                        expect(upsertUIControlResponse.Type).to.include('CatalogForm');
                    }
                });
            } else if (uIControlArr[j]['Type'] == '[OA#0]OrderViewsMenu') {
                it(`Add UIControls ${uIControlArr[j]['Type']}`, async function () {
                    orderViewsMenu = await generalService.papiClient.uiControls.find({
                        where: "Type LIKE '%OrderViewsMenu'",
                    });
                    expect(orderViewsMenu).to.have.length.that.is.above(0);
                    for (let i = 0; i < orderViewsMenu.length; i++) {
                        addContext(this, {
                            title: 'Test Data',
                            value: `Add UIControls ${orderViewsMenu[i]['Type']}, ${orderViewsMenu[i]['InternalID']}`,
                        });
                        const uiControlFromAPI = orderViewsMenu[i].UIControlData.split('OrderViewsMenu');
                        const uiControlFromFile = uIControlArr[j].UIControlData.split('OrderViewsMenu');
                        orderViewsMenu[i].UIControlData = `${uiControlFromAPI[0]}OrderViewsMenu${uiControlFromFile[1]}`;
                        const upsertUIControlResponse = await generalService.papiClient.uiControls.upsert(
                            orderViewsMenu[i],
                        );
                        expect(upsertUIControlResponse.Hidden).to.be.false;
                        expect(upsertUIControlResponse.Type).to.include('OrderViewsMenu');
                    }
                });
            }
        }
    });
}
