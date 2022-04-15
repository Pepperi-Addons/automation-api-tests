import { Browser } from '../utilities/browser';
import { describe, it, beforeEach, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import {
    WebAppLoginPage,
    WebAppHeader,
    WebAppHomePage,
    WebAppList,
    WebAppTopBar,
    WebAppTransaction,
    WebAppSettingsSidePanel,
    Udc,
} from '../pom/index';
import {CollectionField} from '../pom/addons/udc';

import addContext from 'mochawesome/addContext';
import GeneralService from '../../services/general.service';
import { ObjectsService } from '../../services/objects.service';
import { Client } from '@pepperi-addons/debug-server';
import { upgradeDependenciesTests } from './test.index';

chai.use(promised);

export async function UDCTests(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    let driver: Browser;

    const UserDefinedCollectionsUUID = '122c0e9d-c240-4865-b446-f37ece866c22';

    //#region Upgrade UDC
    const testData = {
        'User Defined Collections': [UserDefinedCollectionsUUID, ''],
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
    };

    // const isInstalledArr = await generalService.areAddonsInstalled(testData);
    // const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    //#endregion Upgrade UDC

    describe('UDC UI Tests Suit', async function () {
        // describe('Prerequisites Addons for UOM Tests', () => {
        //     //Test Data
        //     //UOM
        //     isInstalledArr.forEach((isInstalled, index) => {
        //         it(`Validate That Needed Addon Is Installed: ${Object.keys(testData)[index]}`, () => {
        //             expect(isInstalled).to.be.true;
        //         });
        //     });
        //     for (const addonName in testData) {
        //         const addonUUID = testData[addonName][0];
        //         const version = testData[addonName][1];
        //         const varLatestVersion = chnageVersionResponseArr[addonName][2];
        //         const changeType = chnageVersionResponseArr[addonName][3];
        //         describe(`Test Data: ${addonName}`, () => {
        //             it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
        //                 if (chnageVersionResponseArr[addonName][4] == 'Failure') {
        //                     expect(chnageVersionResponseArr[addonName][5]).to.include('is already working on version');
        //                 } else {
        //                     expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
        //                 }
        //             });
        //             it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
        //                 await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
        //                     .eventually.to.have.property('Version')
        //                     .a('string')
        //                     .that.is.equal(varLatestVersion);
        //             });
        //         });
        //     }
        // });

        describe('Scenarios', async function () {
            // this.retries(1);

            before(async function () {
                driver = await Browser.initiateChrome();
            });

            after(async function () {
                await driver.quit();
            });

            afterEach(async function () {
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.collectEndTestData(this);
            });

            it('Create WebApp Session', async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
            });

            it('Open UDC', async function () {
                const webAppHeader = new WebAppHeader(driver);
                await driver.click(webAppHeader.Settings);

                const webAppSettingsSidePanel = new WebAppSettingsSidePanel(driver);
                await webAppSettingsSidePanel.selectSettingsByID('Configuration');
                await driver.click(webAppSettingsSidePanel.UDCEditor);
            });

            it('Validate UDC Header', async function () {
                const udc = new Udc(driver);
                const udcAddonPageTitle = await driver.findElements(udc.pageListHeaderTitle);
                const udcAddonPageTitleText = await udcAddonPageTitle[0].getText();
                expect(udcAddonPageTitleText).to.equal('User Defined Collections');
            });

            describe('Create New Collection', async function () {
                let collaectionTableBefore;
                let collaectionTableAfter;
                let totalItemsBefore: number;
                let totalItemsAfter: number;

                const collectionFieldsArr: CollectionField[] = [
                    {
                        Key: 'StringTest',
                        Description: 'DescriptionTest',
                        Type: 'String',
                        Mandatory: false,
                    },
                    {
                        Key: 'StringTest',
                        Description: 'DescriptionTest',
                        Type: 'String',
                        OptionalValues: "Oren,Boren,Popcorn",
                        Mandatory: false,
                    },
                ];

                it('Get UDC Main Collections List Before', async function () {
                    const webAppList = new WebAppList(driver);
                    collaectionTableBefore = await webAppList.getAddonListAsTable();
                    console.table(collaectionTableBefore);
                    totalItemsBefore = Number(await (await driver.findElement(webAppList.TotalResultsText)).getText());
                });

                it('Add UDC Collection', async function () {
                    const webAppList = new WebAppList(driver);
                    await (await driver.findElement(webAppList.AddonAddButton)).click();

                    const udc = new Udc(driver);
                    const udcCreateCollectionTitle = await driver.findElements(udc.createCollectionHeaderTitle);
                    const udcAddonPageTitleText = await udcCreateCollectionTitle[0].getText();
                    expect(udcAddonPageTitleText).to.equal('Create Collection');
                     udc.createCollection({Key:"oren", Description: "test"});
                     debugger;
                });

                for (let i = 0; i < collectionFieldsArr.length; i++) {
                    it('Add UDC Fields', async function () {
                        const udc = new Udc(driver);
                        const webAppList = new WebAppList(driver);
                        await (await driver.findElement(webAppList.AddonAddButton)).click();

                        const udcAddonPageTitle = await driver.findElements(udc.pageListHeaderTitle);
                        const udcAddonPageTitleText = await udcAddonPageTitle[0].getText();
                        expect(udcAddonPageTitleText).to.equal('Fields');

                        udc.createField(collectionFieldsArr[i])
                        await (await driver.findElement(udc.DialogSaveBtn)).click();
                    });
                }

                it('Get UDC Main Collections List After', async function () {
                    const udc = new Udc(driver);
                    await (await driver.findElement(udc.AddonPageSaveBtn)).click();

                    const webAppList = new WebAppList(driver);
                    collaectionTableAfter = await webAppList.getAddonListAsTable();
                    console.table(collaectionTableBefore);
                    totalItemsAfter = Number(await (await driver.findElement(webAppList.TotalResultsText)).getText());
                });
            });
        });
    });
}
