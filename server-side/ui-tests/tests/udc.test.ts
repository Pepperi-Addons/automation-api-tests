import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppLoginPage, WebAppHeader, WebAppHomePage, WebAppList, WebAppSettingsSidePanel, Udc } from '../pom/index';
import { CollectionField, CollectionMain } from '../pom/addons/Udc';
import GeneralService from '../../services/general.service';
import { Client } from '@pepperi-addons/debug-server';
import { UdcField, UDCService } from '../../services/user-defined-collections.service';

chai.use(promised);

export async function UDCTests(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    let driver: Browser;

    //TODO:
    //1: Create Automation to fields sorting DI-19436
    //2: Create Automation to validate restore is working DI-19867
    //3: Create CompositeKeyType validation in the API (DI-19736)
    //4: Add a test with Import Export ATD and UDC (DI-19699)

    const UserDefinedCollectionsUUID = '122c0e9d-c240-4865-b446-f37ece866c22';
    await generalService.baseAddonVersionsInstallation(varPass);
    //#region Upgrade UDC
    const testData = {
        'User Defined Collections': [UserDefinedCollectionsUUID, '0.0.52'],
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    //#endregion Upgrade UDC

    describe('UDC UI Tests Suit', async function () {
        describe('Prerequisites Addons for UOM Tests', () => {
            //Test Data
            //UOM
            isInstalledArr.forEach((isInstalled, index) => {
                it(`Validate That Needed Addon Is Installed: ${Object.keys(testData)[index]}`, () => {
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
                            expect(chnageVersionResponseArr[addonName][5]).to.include('is already working on version');
                        } else {
                            expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
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

        //TODO: Develope happy flow tests of edit collection for each type
        /*describe('Basic Happy Flow', async function () {
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
            const collectionFieldsArr: CollectionField[] = [
                {
                    Key: 'StringTest',
                    Description: 'DescriptionStringTest',
                    Type: 'String',
                    Mandatory: false,
                },
                // {
                //     Key: 'StringTestWithOptions',
                //     Description: 'DescriptionStringTest',
                //     Type: 'String',
                //     OptionalValues: 'Option1\nOption2\nOption3',
                //     Mandatory: false,
                // },
                // {
                //     Key: 'IntegerTest',
                //     Description: 'DescriptionIntegerTest',
                //     Type: 'Integer',
                //     Mandatory: false,
                // },
                // {
                //     Key: 'IntegerTestWithOptions',
                //     Description: 'DescriptionIntegerTest',
                //     Type: 'Integer',
                //     OptionalValues: '1\n2\n3',
                //     Mandatory: false,
                // },
                // {
                //     Key: 'ArrayTest',
                //     Description: 'DescriptionArrayTest',
                //     Type: 'Array',
                //     Mandatory: false,
                // },
                // {
                //     Key: 'ArrayTestWithOptions',
                //     Description: 'DescriptionArrayTest',
                //     Type: 'Array',
                //     OptionalValues: 'Option1\nOption2\nOption3',
                //     Mandatory: false,
                // },
                // {
                //     Key: 'ArrayOfIntegerTest',
                //     Description: 'DescriptionArrayTest',
                //     Type: 'Array',
                //     ArrayInnerType: 'Integer',
                //     Mandatory: false,
                // },
                // {
                //     Key: 'ArrayOfIntegerTestWithOptions',
                //     Description: 'DescriptionArrayTest',
                //     Type: 'Array',
                //     ArrayInnerType: 'Integer',
                //     OptionalValues: '1\n2\n3',
                //     Mandatory: false,
                // },
            ];
            for (let j = 0; j < 220; j++) {
                for (let i = 0; i < collectionFieldsArr.length; i++) {
                    describe(`Create New Collection: ${collectionFieldsArr[i].Key}`, async function () {
                        let collaectionTableBefore;
                        let collaectionTableAfter;
                        let totalItemsBefore: number;
                        let totalItemsAfter: number;
                        const collectionTestData: CollectionMain = {
                            Key: generalService.replaceAll(
                                `CollectionTest_${generalService.getTime()}_${generalService.getDate()}`,
                                ':|/',
                                '-',
                            ),
                            Description: `CollectionDescriptionTest_${generalService.generateRandomString(7)}`,
                        };
                        it('Get UDC Main Collections List Before', async function () {
                            const webAppList = new WebAppList(driver);
                            collaectionTableBefore = await webAppList.getAddonListAsTable();
                            console.table(collaectionTableBefore);
                            totalItemsBefore = Number(
                                await (await driver.findElement(webAppList.TotalResultsText)).getText(),
                            );
                        });
                        it('Add UDC Collection', async function () {
                            const webAppList = new WebAppList(driver);
                            await (await driver.findElement(webAppList.AddonAddButton)).click();
                            const udc = new Udc(driver);
                            const udcCreateCollectionTitle = await driver.findElements(udc.createCollectionHeaderTitle);
                            const udcAddonPageTitleText = await udcCreateCollectionTitle[0].getText();
                            expect(udcAddonPageTitleText).to.equal('Create Collection');
                            await udc.createCollection({
                                Key: `${collectionTestData.Key}_${j}`,
                                Description: collectionTestData.Description,
                            });
                        });
                        it(`Add UDC Fields, Key: ${collectionFieldsArr[i].Key}`, async function () {
                            const udc = new Udc(driver);
                            const udcAddonPageTitle = await driver.findElements(udc.pageListHeaderTitle);
                            const udcAddonPageTitleText = await udcAddonPageTitle[0].getText();
                            expect(udcAddonPageTitleText).to.equal('Fields');
                            await udc.createField(collectionFieldsArr[i]);
                        });
                        it('Get UDC Main Collections List After', async function () {
                            const udc = new Udc(driver);
                            await udc.closeEditDialogsAndSave();
                            const webAppList = new WebAppList(driver);
                            collaectionTableAfter = await webAppList.getAddonListAsTable();
                            totalItemsAfter = Number(
                                await (await driver.findElement(webAppList.TotalResultsText)).getText(),
                            );
                            console.table(collaectionTableBefore);
                            console.table(collaectionTableAfter);
                            console.table(totalItemsBefore);
                            console.table(totalItemsAfter);
                        });
                    });
                }
            }
        });*/

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
                await webAppLoginPage.loginWithImage(email, password);
            });
            it('For Hagit Infra Example', async function () {
                //1. service init
                const udcService = new UDCService(generalService);
                //2. data to upsert
                const udcName = 'UdcTestInfraFunc';
                const fieldTestString: UdcField = {
                    Name: 'testFieldString',
                    Mandatory: false,
                    Type: 'String',
                    Value: 'abc123',
                };
                const fieldTestNumber: UdcField = {
                    Name: 'testFieldNumber',
                    Mandatory: false,
                    Type: 'Integer',
                    Value: 123,
                };
                const fieldsToSend = [fieldTestString, fieldTestNumber];
                //3. infra function to use
                const udcResponse = await udcService.createUDCWithFields(udcName, fieldsToSend);
                //4. testing all went well
                expect(udcResponse.Fail).to.be.undefined; //flag i created to test if whole flow was successful
                for (let index = 0; index < fieldsToSend.length; index++) {
                    //iterate throuth all fields and test each is found + with correct value
                    const field = fieldsToSend[index];
                    expect(udcResponse[field.Name]).to.not.be.undefined;
                    expect(udcResponse[field.Name].Value).to.equal(field.Value);
                }
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
                const collectionTestData: CollectionMain = {
                    Key: generalService.replaceAll(
                        `CollectionTest_${generalService.getTime()}_${generalService.getDate()}`,
                        ':|/',
                        '-',
                    ),
                    Description: `CollectionDescriptionTest_${generalService.generateRandomString(7)}`,
                };
                const collectionFieldsArr: CollectionField[] = [
                    {
                        Key: 'StringTest',
                        Description: 'Normal',
                        Type: 'String',
                        Mandatory: false,
                    },
                    {
                        Key: 'StringOptionalTest',
                        Description: 'Optional',
                        Type: 'String',
                        OptionalValues: 'Option1\nOption2\nOption3',
                        Mandatory: false,
                    },
                    {
                        Key: 'IntegerTest',
                        Description: 'Normal',
                        Type: 'Integer',
                        Mandatory: false,
                    },
                    {
                        Key: 'IntegerMandatoryTest',
                        Description: 'Mandatory',
                        Type: 'Integer',
                        Mandatory: true,
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
                    await udc.createCollection({
                        Key: collectionTestData.Key,
                        Description: collectionTestData.Description,
                    });
                });
                for (let i = 0; i < collectionFieldsArr.length; i++) {
                    it(`Add UDC Fields, Key: ${collectionFieldsArr[i].Key}`, async function () {
                        const udc = new Udc(driver);
                        const udcAddonPageTitle = await driver.findElements(udc.pageListHeaderTitle);
                        const udcAddonPageTitleText = await udcAddonPageTitle[0].getText();
                        expect(udcAddonPageTitleText).to.equal('Fields');
                        await udc.createField(collectionFieldsArr[i]);
                    });
                }
                it('Get UDC Main Collections List After', async function () {
                    const udc = new Udc(driver);
                    await udc.closeEditDialogsAndSave();
                    const webAppList = new WebAppList(driver);
                    collaectionTableAfter = await webAppList.getAddonListAsTable();
                    totalItemsAfter = Number(await (await driver.findElement(webAppList.TotalResultsText)).getText());
                    console.table(collaectionTableBefore);
                    console.table(collaectionTableAfter);
                    console.table(totalItemsBefore);
                    console.table(totalItemsAfter);
                });
            });
        });

        //TODO: Develope bug reproduction tests
        /*describe('Bug Reproduction', async function () {
            this.retries(1);
            describe('Creating new collection with the same name replace older collection without notice (DI-20035)', async function () {
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
                const collectionFieldsArr: CollectionField[] = [
                    {
                        Key: 'StringTest',
                        Description: 'DescriptionStringTest',
                        Type: 'String',
                        Mandatory: false,
                    },
                ];
                for (let i = 0; i < collectionFieldsArr.length; i++) {
                    describe(`Create New Collection: ${collectionFieldsArr[i].Key}`, async function () {
                        let collaectionTableBefore;
                        let collaectionTableAfter;
                        let totalItemsBefore: number;
                        let totalItemsAfter: number;
                        const collectionTestData: CollectionMain = {
                            Key: generalService.replaceAll(
                                `CollectionTest_${generalService.getTime()}_${generalService.getDate()}`,
                                ':|/',
                                '-',
                            ),
                            Description: `CollectionDescriptionTest_${generalService.generateRandomString(7)}`,
                        };
                        it('Get UDC Main Collections List Before', async function () {
                            const webAppList = new WebAppList(driver);
                            collaectionTableBefore = await webAppList.getAddonListAsTable();
                            console.table(collaectionTableBefore);
                            totalItemsBefore = Number(
                                await (await driver.findElement(webAppList.TotalResultsText)).getText(),
                            );
                        });
                        it('Add UDC Collection', async function () {
                            const webAppList = new WebAppList(driver);
                            await (await driver.findElement(webAppList.AddonAddButton)).click();
                            const udc = new Udc(driver);
                            const udcCreateCollectionTitle = await driver.findElements(udc.createCollectionHeaderTitle);
                            const udcAddonPageTitleText = await udcCreateCollectionTitle[0].getText();
                            expect(udcAddonPageTitleText).to.equal('Create Collection');
                            await udc.createCollection({
                                Key: collectionTestData.Key,
                                Description: collectionTestData.Description,
                            });
                        });
                        it(`Add UDC Fields, Key: ${collectionFieldsArr[i].Key}`, async function () {
                            const udc = new Udc(driver);
                            const udcAddonPageTitle = await driver.findElements(udc.pageListHeaderTitle);
                            const udcAddonPageTitleText = await udcAddonPageTitle[0].getText();
                            expect(udcAddonPageTitleText).to.equal('Fields');
                            await udc.createField(collectionFieldsArr[i]);
                        });
                        it('Get UDC Main Collections List After', async function () {
                            const udc = new Udc(driver);
                            udc.closeEditDialogsAndSave();
                            const webAppList = new WebAppList(driver);
                            collaectionTableAfter = await webAppList.getAddonListAsTable();
                            totalItemsAfter = Number(
                                await (await driver.findElement(webAppList.TotalResultsText)).getText(),
                            );
                        });
                    });
                    describe(`Create New Collection (Negative): ${collectionFieldsArr[i].Key}`, async function () {
                        let collaectionTableBefore;
                        let collaectionTableAfter;
                        let totalItemsBefore: number;
                        let totalItemsAfter: number;
                        const collectionTestData: CollectionMain = {
                            Key: generalService.replaceAll(
                                `CollectionTest_${generalService.getTime()}_${generalService.getDate()}`,
                                ':|/',
                                '-',
                            ),
                            Description: `CollectionDescriptionTest_${generalService.generateRandomString(7)}`,
                        };
                        it('Get UDC Main Collections List Before', async function () {
                            const webAppList = new WebAppList(driver);
                            collaectionTableBefore = await webAppList.getAddonListAsTable();
                            console.table(collaectionTableBefore);
                            totalItemsBefore = Number(
                                await (await driver.findElement(webAppList.TotalResultsText)).getText(),
                            );
                        });
                        it('Add UDC Collection', async function () {
                            const webAppList = new WebAppList(driver);
                            await (await driver.findElement(webAppList.AddonAddButton)).click();
                            const udc = new Udc(driver);
                            const udcCreateCollectionTitle = await driver.findElements(udc.createCollectionHeaderTitle);
                            const udcAddonPageTitleText = await udcCreateCollectionTitle[0].getText();
                            expect(udcAddonPageTitleText).to.equal('Create Collection');
                            //TODO: Fix this scenario when the bug will be solved (DI-20035)
                            debugger;
                            await udc.createCollection({
                                Key: collectionTestData.Key,
                                Description: collectionTestData.Description,
                            });
                            debugger;
                            throw new Error(
                                'This is a bug this should not happen and inseatad there should be an error message',
                            );
                            debugger;
                        });
                        it(`Add UDC Fields, Key: ${collectionFieldsArr[i].Key}`, async function () {
                            const udc = new Udc(driver);
                            const udcAddonPageTitle = await driver.findElements(udc.pageListHeaderTitle);
                            const udcAddonPageTitleText = await udcAddonPageTitle[0].getText();
                            expect(udcAddonPageTitleText).to.equal('Fields');
                            await udc.createField(collectionFieldsArr[i]);
                        });
                        it('Get UDC Main Collections List After', async function () {
                            const udc = new Udc(driver);
                            await udc.closeEditDialogsAndSave();;
                            const webAppList = new WebAppList(driver);
                            collaectionTableAfter = await webAppList.getAddonListAsTable();
                            totalItemsAfter = Number(
                                await (await driver.findElement(webAppList.TotalResultsText)).getText(),
                            );
                        });
                    });
                }
            });
        });*/
    });
}
