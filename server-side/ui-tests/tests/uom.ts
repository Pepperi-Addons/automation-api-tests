import { Browser } from '../utilities/browser';
import { describe, it, afterEach, beforeEach } from 'mocha';
import { AddonPage, WebAppHeader, WebAppHomePage, WebAppLoginPage, WebAppSettingsSidePanel } from '../pom/index';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { ObjectsService } from '../../services/objects.service';
import { Item } from '@pepperi-addons/papi-sdk';

chai.use(promised);

//npm run ui-show-report --server=prod --chrome_headless=false --user_email='UOM_UI@pepperitest.com' --user_pass='Aa1234567' --var_pass='Basic dmFyM0BwZXBwZXJpLmNvbTpQZXAxMjNRYXc='

export async function UomTests(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    let driver: Browser;

    const _TEST_DATA_ATD_NAME = `UOM_${generateRandString(15)}`;
    const _TEST_DATA_ATD_DESCRIPTION = "ATD for uom automation testing";

    //#region Upgrade cpi-node & UOM
    const testData = {
        'cpi-node': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', ''],
        'uom': ['1238582e-9b32-4d21-9567-4e17379f41bb', '']
    };
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    //#endregion Upgrade cpi-node & UOM

    describe('Basic UI Tests Suit', async function () {
        describe('UOM Tests Suites', () => {
            describe('Prerequisites Addon for UOM Tests', () => {
                //Test Data
                //UOM
                it('Validate That All The Needed Addons Installed', async () => {
                    isInstalledArr.forEach((isInstalled) => {
                        expect(isInstalled).to.be.true;
                    });
                });

                for (const addonName in testData) {
                    const addonUUID = testData[addonName][0];
                    const version = testData[addonName][1];
                    const varLatestVersion = chnageVersionResponseArr[addonName][2];
                    const changeType = chnageVersionResponseArr[addonName][3];
                    describe(`Test Data: ${addonName}`, () => {
                        it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
                            if (chnageVersionResponseArr[addonName][4] == 'Failure') {
                                expect(chnageVersionResponseArr[addonName][5]).to.include(
                                    'is already working on version',
                                );
                            } else {
                                expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
                            }
                        });

                        it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
                            await expect(
                                generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get(),
                            )
                                .eventually.to.have.property('Version')
                                .a('string')
                                .that.is.equal(varLatestVersion);
                        });
                    });
                }
            });

            describe('Data Preparation Using Endpoints', () => {

                it('Post items for uom', async function () {
                    const itemsToPost = createItemsList();
                    const postItemsResponse: Item[] = [];
                    for (let i = 0; i < itemsToPost.length; i++) {
                        postItemsResponse.push(await objectsService.postItem(itemsToPost[i]));
                    }

                    for (let i = 0; i < postItemsResponse.length; i++) {
                        expect(postItemsResponse[i].ExternalID).to.equal(itemsToPost[i].ExternalID);
                        expect(postItemsResponse[i].MainCategoryID).to.equal(itemsToPost[i].MainCategoryID);
                        expect(postItemsResponse[i].Name).to.equal(itemsToPost[i].Name);
                        expect(postItemsResponse[i].Price).to.equal(itemsToPost[i].Price);
                    }
                });

                it('Post items: UOM fields', async function () {
                    const uomItemsToPost: UomItem[] = createUomItemsList();
                    const postUomItemsResponse: any[] = [];
                    for (let i = 0; i < uomItemsToPost.length; i++) {
                        postUomItemsResponse.push(
                            await generalService.fetchStatus
                                (
                                    `/addons/api/1238582e-9b32-4d21-9567-4e17379f41bb/api/uoms`,
                                    {
                                        method: 'POST',
                                        body: JSON.stringify(uomItemsToPost[i]),
                                    }
                                )
                        );
                    }
                    for (let i = 0; i < postUomItemsResponse.length; i++) {
                        expect(postUomItemsResponse[i].Status).to.equal(200);
                        expect(postUomItemsResponse[i].Body.Key).to.equal(uomItemsToPost[i].Key);
                        expect(postUomItemsResponse[i].Body.Multiplier).to.equal(uomItemsToPost[i].Multiplier);
                        expect(postUomItemsResponse[i].Body.Title).to.equal(uomItemsToPost[i].Title);
                    }
                });

                describe('UI Tests', () => {
                    this.retries(1);

                    beforeEach(async function () {
                        driver = new Browser('chrome');
                    });

                    afterEach(async function () {
                        const webAppLoginPage = new WebAppLoginPage(driver);
                        await webAppLoginPage.collectEndTestData(this);
                        await driver.quit();
                    });

                    it('Set Up UOM ATD', async function () {
                        const webAppLoginPage = new WebAppLoginPage(driver);
                        await webAppLoginPage.loginNoCompanyLogo(email, password);
                        //1. validating all items are added to the main catalog
                        const addonPage = new AddonPage(driver);
                        await addonPage.selectCatalogItemsByCategory("uom item", "NOT uom item");
                        //2. goto ATD editor - create new ATD UOM_{random-hashstring}
                        await addonPage.createNewATD(this, generalService, _TEST_DATA_ATD_NAME, _TEST_DATA_ATD_DESCRIPTION);
                        //3. goto new ATD and configure everything needed for the test - 3 calculated fields 
                        //3.1.configure Allowed UOMs Field as AllowedUomFieldsForTest, UOM Configuration Field as ItemConfig and uom data field as ConstInventory
                        //3.2. add fields to UI control of ATD
                        await addonPage.configUomATD();
                        await addonPage.returnToHomePage();
                        await addonPage.openSettings();
                        //4. add the ATD to home screen
                        await addonPage.addAdminHomePageButtons(_TEST_DATA_ATD_NAME);
                        const webAppHomePage = new WebAppHomePage(driver);
                        await webAppHomePage.manualResync();
                        await webAppHomePage.validateATDIsApearingOnHomeScreen(_TEST_DATA_ATD_NAME);
                    });
                    it('UI Test UOM ATD', async function () {
                        const webAppLoginPage = new WebAppLoginPage(driver);
                        await webAppLoginPage.loginNoCompanyLogo(email, password);
                        const webAppHomePage = new WebAppHomePage(driver);
                        await webAppHomePage.manualResync();
                        await webAppHomePage.initiateUOMActivity(_TEST_DATA_ATD_NAME, "uom");
                        debugger;

                    });
                    it('Delete test ATD from dist + home screen using UI', async function () {
                        const webAppLoginPage = new WebAppLoginPage(driver);
                        await webAppLoginPage.loginNoCompanyLogo(email, password);
                        const addonPage = new AddonPage(driver);
                        await addonPage.openSettings();
                        await addonPage.removeAdminHomePageButtons(_TEST_DATA_ATD_NAME);
                        await addonPage.removeATD(generalService, _TEST_DATA_ATD_NAME, _TEST_DATA_ATD_DESCRIPTION);//maybe should be done using API
                    });
                });
                describe('Test Data Cleansing using API', () => {
                    it('Reset Existing Items', async function () {
                        //Remove all items
                        const itemsArr = await generalService.papiClient.items.find({ page_size: -1 });
                        for (let i = 0; i < itemsArr.length; i++) {
                            const deleted = await generalService.papiClient.items.delete(itemsArr[i].InternalID as number);
                            expect(deleted).to.be.true;
                        }
                    });
                });
            });

        });


    });
}

function createItemsList() {
    const itemList: Item[] = [];
    for (let i = 0; i < 5; i++) {
        const item: Item =
        {
            "ExternalID": `123${i}`,
            "MainCategoryID": i === 0 ? "NOT uom item" : "uom item",
            "Name": `${i === 0 ? 'non uom item' : 'uom item'}`,
            "Price": i === 0 ? 0.5 : 1
        };
        itemList.push(item);
    }
    return itemList;
}

function createUomItemsList() {
    const itemList: UomItem[] = [];
    for (let i = 0; i < 5; i++) {
        itemList.push(resolveUomItem(i));
    }
    return itemList;
}

function resolveUomItem(i: number): UomItem {
    switch (i) {
        case 0: return {
            "Key": "SIN",
            "Title": "Single",
            "Multiplier": "1"
        }
        case 1: return {
            "Key": "CS",
            "Title": "Case",
            "Multiplier": "24"
        }
        case 2: return {
            "Key": "DOU",
            "Title": "double",
            "Multiplier": "2"
        }
        case 3: return {
            "Key": "Bx",
            "Title": "Box",
            "Multiplier": "13"
        }
        case 4: return {
            "Key": "PK",
            "Title": "Pack",
            "Multiplier": "6"
        }
        default: return {//dummy return for ts
            "Key": "PK",
            "Title": "Pack",
            "Multiplier": "6"
        }
    }
}
//TODO: UI test phase
//* validate amount in UI upper and field data & price - every one by itself and all togather
//1.regular item testing
//2.box & single
//3.double & signle
//4. pack & double
//5. case & box 

interface UomItem {
    Key: string,
    Title: string,
    Multiplier: string
}


function generateRandString(length: number): string {
    let result = ' ';
    for (let i = 0; i < length; i++) {
        result +=
            String.fromCharCode(97 + Math.floor(Math.random() * 26));
    }
    return result;
}