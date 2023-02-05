import { describe, it, before, after, afterEach } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService, { FetchStatusResponse } from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { Browser } from '../utilities/browser';
import { WebAppHeader, WebAppHomePage, WebAppLoginPage, WebAppSettingsSidePanel } from '../pom';
// import { ResourceEditors, ResourceList, ResourceViews } from '../pom/addons/ResourceList';
import { PageBuilder } from '../pom/addons/PageBuilder/PageBuilder';
import { Slugs } from '../pom/addons/Slugs';
import E2EUtils from '../utilities/e2e_utils';
import { VisitFlowPage } from '../blueprints/PageBlocksBlueprints';
import { VisitFlow } from '../pom/addons/VisitFlow';
import { v4 as newUuid } from 'uuid';
import { UDCService } from '../../services/user-defined-collections.service';
import { ObjectsService } from '../../services';

chai.use(promised);

export async function VisitFlowTests(email: string, password: string, client: Client, varPass: string) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    const udcService = new UDCService(generalService);

    let driver: Browser;
    let e2eUtils: E2EUtils;
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    let webAppHeader: WebAppHeader;
    let settingsSidePanel: WebAppSettingsSidePanel;
    let visitFlow: VisitFlow;
    let pageBuilder: PageBuilder;
    let slugs: Slugs;
    let randomString: string;
    let upsertedListingsToVisitFlowGroups: {
        Title: string;
        SortIndex: number;
        Key: string;
        Hidden: boolean;
        CreationDateTime?: Date;
        ModificationDateTime?: Date;
    }[];
    let upsertedListingsToVisitFlows: {
        Completed: string;
        Resource: string;
        Title: string;
        Group: string;
        ResourceCreationData: string;
        Mandatory: boolean;
        Key: string;
        Hidden: boolean;
        CreationDateTime?: Date;
        ModificationDateTime?: Date;
    }[];
    let pageUUID: string;
    let pageName: string;
    let visitFlowName: string;
    let visitFlowDescription: string;
    let slugDisplayName: string;
    let slug_path: string;
    let slugUUID: string;
    let getCreatedVisitFlowMainActivity;
    let getCreatedSalesOrderTransaction;
    // let resourceViews: ResourceViews;

    describe('Visit Flow Test Suite', async () => {
        await before(() => {
            randomString = generalService.generateRandomString(5);
        });

        // await describe(`Prerequisites Addons for Visit Flow Tests (${randomString})`, async () => {
        //     const baseAddonsInstallationResponse = await generalService.baseAddonVersionsInstallation(varPass);
        //     let chnageVersionResponseArr = baseAddonsInstallationResponse.chnageVersionResponseArr;
        //     let isInstalledArr = baseAddonsInstallationResponse.isInstalledArr;
        //     isInstalledArr.forEach((isInstalled, index) => {
        //         it(`Validate That Base Addon: ${Object.keys(baseAddonsInstallationResponse)[index]} - Is Installed`, () => {
        //             console.info(`Base Addon: ${Object.keys(baseAddonsInstallationResponse)[index]} - Is Installed ? ${isInstalled}`);
        //             expect(isInstalled).to.be.true;
        //         });
        //     });
        //     // Visit Flow Required Addons
        //     const testAddonsDependencies = {
        //         'VisitFlow': ['2b462e9e-16b5-4e7a-b1e6-9e2bfb61db7e', '0.5.24'],
        //         'Slugs': ['4ba5d6f9-6642-4817-af67-c79b68c96977', '1.2.2'],
        //     };

        //     const testAddonsInstallationResponse = await generalService.baseAddonVersionsInstallation(varPass, testAddonsDependencies);
        //     chnageVersionResponseArr = testAddonsInstallationResponse.chnageVersionResponseArr;
        //     isInstalledArr = testAddonsInstallationResponse.isInstalledArr;
        //     // debugger
        //     // chnageVersionResponseArr = await generalService.changeVersion(varPass, testAddonsDependencies, false);
        //     // debugger
        //     // isInstalledArr = await generalService.areAddonsInstalled(testAddonsDependencies);
        //     // debugger
        //     isInstalledArr.forEach((isInstalled, index) => {
        //         it(`Validate That Needed Addon: ${Object.keys(testAddonsDependencies)[index]} - Is Installed`, () => {
        //             console.info(`Needed Addon: ${Object.keys(testAddonsDependencies)[index]} - Is Installed ? ${isInstalled}`);
        //             expect(isInstalled).to.be.true;
        //         });
        //     });
        //     let addonUUID: string;
        //     let version: string;
        //     let varLatestVersion: string;
        //     let changeType: string;
        //     for (const addonName in testAddonsDependencies) {
        //         addonUUID = testAddonsDependencies[addonName][0];
        //         version = testAddonsDependencies[addonName][1];
        //         varLatestVersion = chnageVersionResponseArr[addonName][2];
        //         changeType = chnageVersionResponseArr[addonName][3];
        //         await describe(`Test Required Addon's Installation: ${addonName}`, async () => {
        //             await it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
        //                 if (chnageVersionResponseArr[addonName][4] == 'Failure') {
        //                     expect(chnageVersionResponseArr[addonName][5]).to.include('is already working on version');
        //                 } else {
        //                     expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
        //                 }
        //             });
        //             await it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
        //                 await expect(await generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
        //                     .eventually.to.have.property('Version')
        //                     .a('string')
        //                     .that.is.equal(varLatestVersion);
        //             });
        //         });
        //     }
        // });

        await describe('Inserting Data to the UDC VisitFlowGroups', () => {
            it('Configuring Groups', async () => {
                const collectionName = 'VisitFlowGroups';
                const groupsDocumentsToUpsert = [
                    { Title: `Start Auto ${randomString}`, SortIndex: 0 },
                    { Title: `Orders Auto ${randomString}`, SortIndex: 10 },
                    { Title: `End Auto ${randomString}`, SortIndex: 100 },
                ];
                let upsertingValues_Response;
                groupsDocumentsToUpsert.forEach(async (documentToUpsert) => {
                    // POST /addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/documents?name=VisitFlowGroups
                    upsertingValues_Response = await udcService.upsertValuesToCollection(
                        documentToUpsert,
                        collectionName,
                    );
                    console.info(`Response: ${JSON.stringify(upsertingValues_Response, null, 4)}`);
                    expect(upsertingValues_Response.Ok).to.be.true;
                    expect(upsertingValues_Response.Status).to.equal(200);
                    expect(upsertingValues_Response.Error).to.eql({});
                    upsertedListingsToVisitFlowGroups.push(upsertingValues_Response.Body);
                });
            });
        });

        await describe('Inserting Data to the UDC VisitFlows', () => {
            it('Configuring Flows', async () => {
                driver.sleep(5 * 1000);
                const collectionName = 'VisitFlows';
                const group_Start = upsertedListingsToVisitFlowGroups.length
                    ? upsertedListingsToVisitFlowGroups.find((group) => {
                        if (group.Title.includes('Start')) {
                            return group.Key;
                        }
                    })
                    : '';
                const group_Orders = upsertedListingsToVisitFlowGroups.length
                    ? upsertedListingsToVisitFlowGroups.find((group) => {
                        if (group.Title.includes('Orders')) {
                            return group.Key;
                        }
                    })
                    : '';
                const group_End = upsertedListingsToVisitFlowGroups.length
                    ? upsertedListingsToVisitFlowGroups.find((group) => {
                        if (group.Title.includes('End')) {
                            return group.Key;
                        }
                    })
                    : '';
                const visitsDocumentsToUpsert = [
                    {
                        Name: visitFlowName,
                        Description: visitFlowDescription,
                        Active: true,
                        steps: [
                            {
                                Completed: 'In Creation',
                                Resource: 'activities',
                                Title: 'Start Visit',
                                Group: group_Start ? group_Start.Key : '',
                                ResourceCreationData: 'VF_VisitFlowMainActivity',
                                Mandatory: true,
                            },
                            {
                                Completed: 'In Creation',
                                Resource: 'transactions',
                                Title: 'Sales Order',
                                Group: group_Orders ? group_Orders.Key : '',
                                ResourceCreationData: 'Sales Order',
                            },
                            {
                                Completed: 'Submitted',
                                Resource: 'activities',
                                Title: 'End Visit',
                                Group: group_End ? group_End.Key : '',
                                ResourceCreationData: 'VF_VisitFlowMainActivity',
                                Mandatory: true,
                            },
                        ],
                    },
                    {
                        Name: 'MockVisit',
                        Description: 'Mock Visit',
                        Active: true,
                        steps: [],
                    },
                ];
                let upsertingValues_Response;
                visitsDocumentsToUpsert.forEach(async (documentToUpsert) => {
                    // POST /addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/documents?name=VisitFlows
                    upsertingValues_Response = await udcService.upsertValuesToCollection(
                        documentToUpsert,
                        collectionName,
                    );
                    console.info(`Response: ${JSON.stringify(upsertingValues_Response, null, 4)}`);
                    expect(upsertingValues_Response.Ok).to.be.true;
                    expect(upsertingValues_Response.Status).to.equal(200);
                    expect(upsertingValues_Response.Error).to.eql({});
                    upsertedListingsToVisitFlows.push(upsertingValues_Response.Body);
                });
            });
        });

        describe('Visit Flow UI tests', () => {
            before(async function () {
                driver = await Browser.initiateChrome();
                webAppLoginPage = new WebAppLoginPage(driver);
                webAppHomePage = new WebAppHomePage(driver);
                webAppHeader = new WebAppHeader(driver);
                settingsSidePanel = new WebAppSettingsSidePanel(driver);
                e2eUtils = new E2EUtils(driver);
                visitFlow = new VisitFlow(driver);
                pageBuilder = new PageBuilder(driver);
                slugs = new Slugs(driver);
                // resourceViews = new ResourceViews(driver);
                // randomString = generalService.generateRandomString(5);
                visitFlowName = `AutoVisiT${randomString}`;
                visitFlowDescription = `Auto Visit ${randomString}`;
                slugDisplayName = `Visit Flow Auto ${randomString}`;
                slug_path = `visit_flow_auto_${randomString}`;
                upsertedListingsToVisitFlowGroups = [];
                upsertedListingsToVisitFlows = [];
            });

            after(async function () {
                await driver.quit();
            });

            afterEach(async function () {
                await webAppHeader.goHome();
            });

            it('Login', async () => {
                await webAppLoginPage.login(email, password);
            });

            // describe("Verifying Addon's installation generated required data", () => {
            //     it('Three UDC collections were created (VisitFlows, VisitFlowGroups, VisitFlowSteps)', async () => {
            //     });
            //     it('Activity type "VF_VisitFlowMainActivity" was created', async () => {
            //     });
            // });

            // describe('Creating a Catalogs View (if does not exist)', () => {
            //     it('Configuring Groups', async () => {
            //     });
            //     it('Configuring Flows', async () => {
            //     });
            // });

            // describe('Inserting Data to the UDC VisitFlowGroups', () => {
            //     it('Configuring Groups', async () => {
            //         const collectionName = 'VisitFlowGroups';
            //         const groupsDocumentsToUpsert = [
            //             { Title: `Start Auto ${randomString}`, SortIndex: 0 },
            //             { Title: `Orders Auto ${randomString}`, SortIndex: 10 },
            //             { Title: `End Auto ${randomString}`, SortIndex: 100 },
            //         ];
            //         let upsertingValues_Response;
            //         groupsDocumentsToUpsert.forEach(async (documentToUpsert) => {
            //             // POST /addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/documents?name=VisitFlowGroups
            //             upsertingValues_Response = await udcService.upsertValuesToCollection(
            //                 documentToUpsert,
            //                 collectionName,
            //             );
            //             console.info(`Response: ${JSON.stringify(upsertingValues_Response, null, 4)}`);
            //             expect(upsertingValues_Response.Ok).to.be.true;
            //             expect(upsertingValues_Response.Status).to.equal(200);
            //             expect(upsertingValues_Response.Error).to.eql({});
            //             upsertedListingsToVisitFlowGroups.push(upsertingValues_Response.Body);
            //         });
            //     });
            // });

            describe('Creating a Page with VisitFlow Block', () => {
                before(() => {
                    pageName = `VisitFlow Page Auto_${randomString}`;
                });
                afterEach(async function () {
                    driver.sleep(500);
                    await webAppHomePage.collectEndTestData(this);
                });
                it('New Page through the UI + VisitFlow Block through API', async () => {
                    pageUUID = await e2eUtils.addPage(pageName, 'Visit Flow 0.5 tests');
                    expect(pageUUID).to.not.be.undefined;
                    console.info('pageUUID: ', pageUUID);
                    const createdPage = await pageBuilder.getPageByUUID(pageUUID, client);
                    // console.info('createdPage: ', JSON.stringify(createdPage, null, 2));
                    const sectionKey = createdPage.Layout.Sections[0].Key;
                    const blockKey = newUuid();
                    const visitFlowPage = new VisitFlowPage(pageUUID, blockKey, sectionKey, pageName, 'pageDescription');
                    // console.info('visitFlowPage: ', JSON.stringify(visitFlowPage, null, 2));
                    const responseOfPublishPage = await pageBuilder.publishPage(visitFlowPage, client);
                    console.info('responseOfPublishPage: ', JSON.stringify(responseOfPublishPage, null, 4));
                });
                it('Verifying Page was created successfully', async () => {
                    await e2eUtils.navigateTo('Page Builder');
                    await pageBuilder.searchForPageByName(pageName);
                    pageBuilder.pause(2 * 1000);
                    // expect(await driver.findElement(pageBuilder.PagesList_EmptyList_Paragraph)).to.throw();
                });
            });

            // describe('Inserting Data to the UDC VisitFlows', () => {
            //     it('Configuring Flows', async () => {
            //         driver.sleep(5 * 1000);
            //         const collectionName = 'VisitFlows';
            //         const group_Start = upsertedListingsToVisitFlowGroups.length
            //             ? upsertedListingsToVisitFlowGroups.find((group) => {
            //                 if (group.Title.includes('Start')) {
            //                     return group.Key;
            //                 }
            //             })
            //             : '';
            //         const group_Orders = upsertedListingsToVisitFlowGroups.length
            //             ? upsertedListingsToVisitFlowGroups.find((group) => {
            //                 if (group.Title.includes('Orders')) {
            //                     return group.Key;
            //                 }
            //             })
            //             : '';
            //         const group_End = upsertedListingsToVisitFlowGroups.length
            //             ? upsertedListingsToVisitFlowGroups.find((group) => {
            //                 if (group.Title.includes('End')) {
            //                     return group.Key;
            //                 }
            //             })
            //             : '';
            //         const visitsDocumentsToUpsert = [
            //             {
            //                 Name: visitFlowName,
            //                 Description: visitFlowDescription,
            //                 Active: true,
            //                 steps: [
            //                     {
            //                         Completed: 'In Creation',
            //                         Resource: 'activities',
            //                         Title: 'Start Visit',
            //                         Group: group_Start ? group_Start.Key : '',
            //                         ResourceCreationData: 'VF_VisitFlowMainActivity',
            //                         Mandatory: true,
            //                     },
            //                     {
            //                         Completed: 'In Creation',
            //                         Resource: 'transactions',
            //                         Title: 'Sales Order',
            //                         Group: group_Orders ? group_Orders.Key : '',
            //                         ResourceCreationData: 'Sales Order',
            //                     },
            //                     {
            //                         Completed: 'Submitted',
            //                         Resource: 'activities',
            //                         Title: 'End Visit',
            //                         Group: group_End ? group_End.Key : '',
            //                         ResourceCreationData: 'VF_VisitFlowMainActivity',
            //                         Mandatory: true,
            //                     },
            //                 ],
            //             },
            //             {
            //                 Name: 'MockVisit',
            //                 Description: 'Mock Visit',
            //                 Active: true,
            //                 steps: [],
            //             },
            //         ];
            //         let upsertingValues_Response;
            //         visitsDocumentsToUpsert.forEach(async (documentToUpsert) => {
            //             // POST /addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/documents?name=VisitFlows
            //             upsertingValues_Response = await udcService.upsertValuesToCollection(
            //                 documentToUpsert,
            //                 collectionName,
            //             );
            //             console.info(`Response: ${JSON.stringify(upsertingValues_Response, null, 4)}`);
            //             expect(upsertingValues_Response.Ok).to.be.true;
            //             expect(upsertingValues_Response.Status).to.equal(200);
            //             expect(upsertingValues_Response.Error).to.eql({});
            //             upsertedListingsToVisitFlows.push(upsertingValues_Response.Body);
            //         });
            //     });
            // });

            describe('Creating and Mapping a Slug', () => {
                it('Creating a Visit Flow Slug for Automation', async () => {
                    await e2eUtils.navigateTo('Slugs');
                    await slugs.createSlug(slugDisplayName, slug_path, 'slug for Visit Flow Automation');
                    slugs.pause(3 * 1000);
                    slugUUID = await slugs.getSlugUUIDbySlugName(slug_path, client);
                    console.info('slugUUID: ', slugUUID);
                    expect(slugUUID).to.not.be.undefined;
                });

                it('Dragging the created slug to the mapped fields section and Posting via API', async () => {
                    await slugs.clickTab('Mapping_Tab');
                    await slugs.waitTillVisible(slugs.EditPage_ConfigProfileCard_EditButton_Rep, 5000);
                    await slugs.click(slugs.EditPage_ConfigProfileCard_EditButton_Rep);
                    await slugs.isSpinnerDone();
                    await slugs.waitTillVisible(slugs.MappedSlugs, 5000);
                    const mappedSlugsUpsertResponse = await e2eUtils.addToMappedSlugs(
                        [{ slug_path: slug_path, pageUUID: pageUUID }],
                        client,
                    );
                    // existingMappedSlugs = mappedSlugsUpsertResponse.previouslyExistingMappedSlugs;
                    console.info(
                        `existingMappedSlugs: ${JSON.stringify(
                            mappedSlugsUpsertResponse.previouslyExistingMappedSlugs,
                            null,
                            4,
                        )}`,
                    );
                    driver.sleep(2 * 1000);
                    await e2eUtils.logOutLogIn(email, password);
                    await webAppHomePage.isSpinnerDone();
                    await e2eUtils.navigateTo('Slugs');
                    await slugs.clickTab('Mapping_Tab');
                    await slugs.waitTillVisible(slugs.MappingTab_RepCard_InnerListOfMappedSlugs, 15000);
                    const slugNameAtMappedSlugsSmallDisplayInRepCard = await driver.findElement(
                        slugs.getSelectorOfMappedSlugInRepCardSmallDisplayByText(slug_path),
                        10000,
                    );
                    expect(await slugNameAtMappedSlugsSmallDisplayInRepCard.getText()).to.contain(slug_path);
                    driver.sleep(15 * 1000);
                });
            });

            describe('Configuring Account Dashboard', () => {
                it('Navigating to Account Dashboard Layout -> Menu (Pencil) -> Rep (Pencil)', async () => {
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                    await webAppHeader.openSettings();
                    await webAppHeader.isSpinnerDone();
                    visitFlow.pause(0.5 * 1000);
                    await settingsSidePanel.selectSettingsByID('Accounts');
                    await settingsSidePanel.clickSettingsSubCategory('account_dashboard_layout', 'Accounts');
                    for (let i = 0; i < 2; i++) {
                        visitFlow.pause(10 * 1000);
                        try {
                            await visitFlow.isSpinnerDone();
                            await driver.switchTo(visitFlow.AddonContainerIframe);
                            await visitFlow.waitTillVisible(visitFlow.AccountDashboardLayout_Container, 15000);
                            break;
                        } catch (error) {
                            console.error(error);
                        }
                    }
                    await visitFlow.waitTillVisible(visitFlow.AccountDashboardLayout_Title, 15000);
                    await visitFlow.waitTillVisible(visitFlow.AccountDashboardLayout_ListContainer, 15000);
                    await visitFlow.waitTillVisible(visitFlow.AccountDashboardLayout_MenuRow_Container, 15000);
                    await visitFlow.clickElement('AccountDashboardLayout_MenuRow_Container');
                    await visitFlow.waitTillVisible(visitFlow.AccountDashboardLayout_MenuRow_PencilButton, 15000);
                    await visitFlow.clickElement('AccountDashboardLayout_MenuRow_PencilButton');
                    await visitFlow.waitTillVisible(visitFlow.AccountDashboardLayout_ConfigPage_Title, 15000);
                    expect(
                        await (await driver.findElement(visitFlow.AccountDashboardLayout_ConfigPage_Title)).getText(),
                    ).to.equal('Menu');
                    await visitFlow.waitTillVisible(visitFlow.AccountDashboardLayout_Menu_RepCard_PencilButton, 15000);
                    await visitFlow.clickElement('AccountDashboardLayout_Menu_RepCard_PencilButton');
                });

                it('Adding the Visit Flow Slug by the Search input, clicking the (+) button and Save', async () => {
                    await visitFlow.waitTillVisible(visitFlow.AccountDashboardLayout_Menu_RepCard_SearchBox, 15000);
                    await visitFlow.insertTextToInputElement(
                        slugDisplayName,
                        visitFlow.AccountDashboardLayout_Menu_RepCard_SearchBox,
                    );
                    // await visitFlow.insertTextToInputElement('Visit Flow Auto', visitFlow.AccountDashboardLayout_Menu_RepCard_SearchBox);
                    expect(
                        await (
                            await driver.findElement(visitFlow.AccountDashboardLayout_Menu_RepCard_SearchResult)
                        ).getAttribute('data-id'),
                    ).to.equal(`SLUG_${slug_path}`);
                    // expect(await (await driver.findElement(visitFlow.AccountDashboardLayout_Menu_RepCard_SearchResult)).getAttribute('data-id')).to.contain('SLUG_visit_flow_auto');
                    await visitFlow.clickElement('AccountDashboardLayout_Menu_RepCard_SearchResult_PlusButton');
                    await visitFlow.waitTillVisible(
                        visitFlow.getSelectorOfSlugConfiguredToAccountDashboardMenuLayoutByText(slug_path),
                        15000,
                    );
                    // await visitFlow.waitTillVisible(visitFlow.getSelectorOfSlugConfiguredToAccountDashboardMenuLayoutByText('visit_flow_auto'), 15000);
                    await visitFlow.clickElement('AccountDashboardLayout_Menu_RepCard_SaveButton');
                    // is there a function to wait for round loader to finish?
                    driver.sleep(5 * 1000);
                    await visitFlow.waitTillVisible(visitFlow.AccountDashboardLayout_Menu_RepCard_PencilButton, 15000);
                    await visitFlow.clickElement('AccountDashboardLayout_Menu_CancelButton');
                    await visitFlow.waitTillVisible(visitFlow.AccountDashboardLayout_MenuRow_Container, 15000);
                    driver.sleep(2 * 1000);
                    await driver.switchToDefaultContent();
                    driver.sleep(7 * 1000);
                });

                it('Performing Manual Sync', async () => {
                    // await webAppHomePage.manualResync(client);
                    await e2eUtils.performManualSync();
                });
            });

            describe('Going Through a Basic Visit', () => {
                it('Navigating to a specific Account', async () => {
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                    await webAppHomePage.clickOnBtn('Accounts');
                    driver.sleep(1 * 1000);
                    await webAppHeader.isSpinnerDone();
                    await visitFlow.waitTillVisible(visitFlow.FirstAccountInList, 15000);
                    await visitFlow.clickElement('FirstAccountInList');
                    driver.sleep(1 * 1000);
                });

                it('Entering Visit Flow slug from Menu', async () => {
                    await visitFlow.waitTillVisible(visitFlow.AccountHomePage_HamburgerMenu_Button, 15000);
                    await visitFlow.clickElement('AccountHomePage_HamburgerMenu_Button');
                    await visitFlow.waitTillVisible(visitFlow.AccountHomePage_HamburgerMenu_Content, 15000);
                    visitFlow.pause(1 * 1000);
                    await visitFlow.click(
                        visitFlow.getSelectorOfAccountHomePageHamburgerMenuVisitFlowAutomatedSlug(slugDisplayName),
                    );
                    visitFlow.pause(1 * 1000);
                });

                it('If more than one slug - Choosing a Slug', async () => {
                    if (await driver.isElementVisible(visitFlow.VisitFlow_SelectVisit_Title)) {
                        visitFlow.pause(1.5 * 1000);
                        await visitFlow.click(visitFlow.getSelectorOfVisitFlowButtonByName(visitFlowDescription));
                    } else {
                        await visitFlow.waitTillVisible(visitFlow.VisitFlow_Content, 15000);
                    }
                    visitFlow.pause(1 * 1000);
                });

                it('Checking off "Start"', async () => {
                    await visitFlow.clickElement('VisitFlow_GroupButton_Start');
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_StepButton_StartVisit, 15000);
                    visitFlow.pause(0.5 * 1000);
                    await visitFlow.clickElement('VisitFlow_StepButton_StartVisit');
                    await visitFlow.isSpinnerDone();
                    await visitFlow.waitTillVisible(visitFlow.VisitFlowMainActivity_FormPage_FormContent, 15000);
                    visitFlow.pause(0.5 * 1000);
                    await visitFlow.insertTextToInputElement(
                        `Automated test (${randomString}) of Visit Flow started`,
                        visitFlow.VisitFlowMainActivity_FormPage_SubjectInput,
                    );
                    visitFlow.pause(0.5 * 1000);
                    await visitFlow.clickElement('VisitFlowMainActivity_FormPage_Header_CancelButton');
                    await visitFlow.waitTillVisible(visitFlow.VisitFlowMainActivity_CancelDialog_Notice_Headline, 15000);
                    await visitFlow.waitTillVisible(visitFlow.VisitFlowMainActivity_CancelDialog_SaveChanges_Button, 15000);
                    await visitFlow.clickElement('VisitFlowMainActivity_CancelDialog_SaveChanges_Button');
                    await visitFlow.isSpinnerDone();
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_Content, 15000);
                    visitFlow.pause(0.5 * 1000);
                });

                it('Checking off "Orders"', async () => {
                    await visitFlow.clickElement('VisitFlow_GroupButton_Orders');
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_StepButton_SalesOrder, 15000);
                    visitFlow.pause(0.5 * 1000);
                    await visitFlow.clickElement('VisitFlow_StepButton_SalesOrder');
                    await visitFlow.isSpinnerDone();
                    visitFlow.pause(0.5 * 1000);
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_OrdersChooseCatalogDialog_Content, 15000);
                    await visitFlow.clickElement('VisitFlow_OrdersChooseCatalogDialog_FirstCatalogInList_RadioButton');
                    await visitFlow.waitTillVisible(
                        visitFlow.VisitFlow_OrdersChooseCatalogDialog_SelectedCatalog_RadioButton,
                        15000,
                    );
                    await visitFlow.clickElement('VisitFlow_OrdersChooseCatalogDialog_DoneButton');
                    await visitFlow.isSpinnerDone();
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_DefaultCatalog_OrderButton, 15000);
                    await visitFlow.clickElement('VisitFlow_DefaultCatalog_OrderButton');
                    await visitFlow.isSpinnerDone();
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_DefaultCatalog_CartButton, 15000);
                    await visitFlow.clickElement('VisitFlow_DefaultCatalog_CartButton');
                    await visitFlow.isSpinnerDone();
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_DefaultCatalog_SubmitButton, 15000);
                    await visitFlow.clickElement('VisitFlow_DefaultCatalog_SubmitButton');
                    await visitFlow.isSpinnerDone();
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_Content, 15000);
                    visitFlow.pause(5 * 1000);
                });

                it('Checking off "End"', async () => {
                    await visitFlow.clickElement('VisitFlow_GroupButton_End');
                    await visitFlow.waitTillVisible(visitFlow.VisitFlow_StepButton_EndVisit, 15000);
                    visitFlow.pause(0.5 * 1000);
                    await visitFlow.clickElement('VisitFlow_StepButton_EndVisit');
                    await visitFlow.isSpinnerDone();
                    await visitFlow.waitTillVisible(visitFlow.VisitFlowMainActivity_FormPage_FormContent, 15000);
                    visitFlow.pause(0.5 * 1000);
                    await visitFlow.insertTextToInputElement(
                        'Automated test finished Visit',
                        visitFlow.VisitFlowMainActivity_FormPage_VisitSummaryInput,
                    );
                    visitFlow.pause(0.5 * 1000);
                    await visitFlow.clickElement('VisitFlowMainActivity_FormPage_Header_SubmitButton');
                    await visitFlow.isSpinnerDone();
                    if (await driver.isElementVisible(visitFlow.VisitFlow_SelectVisit_Title)) {
                        visitFlow.pause(1.5 * 1000);
                        await visitFlow.click(visitFlow.getSelectorOfVisitFlowButtonByName(visitFlowDescription));
                    } else {
                        await visitFlow.waitTillVisible(visitFlow.VisitFlow_Content, 15000);
                    }
                    visitFlow.pause(5 * 1000);
                });

                it('Verifying VF_VisitFlowMainActivity activity was formed (via API)', async () => {
                    await webAppLoginPage.login(email, password);
                    getCreatedVisitFlowMainActivity = await objectsService.getActivity({
                        where: `TSASubject="Automated test (${randomString}) of Visit Flow started"`,
                    });
                    console.info(
                        `getCreatedVisitFlowMainActivity: ${JSON.stringify(getCreatedVisitFlowMainActivity, null, 4)}`,
                    );
                    expect(getCreatedVisitFlowMainActivity).to.haveOwnProperty('TSAFlowID');
                    expect(getCreatedVisitFlowMainActivity).to.haveOwnProperty('TSAStartVisitDateTime');
                    expect(getCreatedVisitFlowMainActivity).to.haveOwnProperty('TSAEndVisitDateTime');
                    expect(getCreatedVisitFlowMainActivity.TSASubject).to.equal(
                        `Automated test (${randomString}) of Visit Flow started`,
                    );
                });

                it('Verifying Sales Order transaction was formed (via API)', async () => {
                    await webAppLoginPage.login(email, password);
                    getCreatedSalesOrderTransaction = await objectsService.getTransaction({
                        order_by: 'CreationDateTime DESC',
                    })[0];
                    console.info(
                        `getCreatedSalesOrderTransaction: ${JSON.stringify(getCreatedSalesOrderTransaction, null, 4)}`,
                    );
                    expect(getCreatedSalesOrderTransaction.Type).to.equal('Sales Order');
                    expect(getCreatedSalesOrderTransaction).to.haveOwnProperty('TSAStartVisitDateTime');
                    expect(getCreatedSalesOrderTransaction).to.haveOwnProperty('TSAEndVisitDateTime');
                    expect(getCreatedSalesOrderTransaction.TSASubject).to.equal(
                        `Automated test (${randomString}) of Visit Flow started`,
                    );
                });
            });

            describe('Teardown', () => {
                it('Unconfiguring Slug from Account Dashboard', async () => {
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                    await webAppHeader.openSettings();
                    await webAppHeader.isSpinnerDone();
                    visitFlow.pause(0.5 * 1000);
                    await settingsSidePanel.selectSettingsByID('Accounts');
                    await settingsSidePanel.clickSettingsSubCategory('account_dashboard_layout', 'Accounts');
                    for (let i = 0; i < 2; i++) {
                        visitFlow.pause(10 * 1000);
                        try {
                            await visitFlow.isSpinnerDone();
                            await driver.switchTo(visitFlow.AddonContainerIframe);
                            await visitFlow.waitTillVisible(visitFlow.AccountDashboardLayout_Container, 15000);
                            break;
                        } catch (error) {
                            console.error(error);
                        }
                    }
                    await visitFlow.waitTillVisible(visitFlow.AccountDashboardLayout_Title, 15000);
                    await visitFlow.waitTillVisible(visitFlow.AccountDashboardLayout_ListContainer, 15000);
                    await visitFlow.waitTillVisible(visitFlow.AccountDashboardLayout_MenuRow_Container, 15000);
                    await visitFlow.clickElement('AccountDashboardLayout_MenuRow_Container');
                    await visitFlow.waitTillVisible(visitFlow.AccountDashboardLayout_MenuRow_PencilButton, 15000);
                    await visitFlow.clickElement('AccountDashboardLayout_MenuRow_PencilButton');
                    await visitFlow.waitTillVisible(visitFlow.AccountDashboardLayout_ConfigPage_Title, 15000);
                    expect(
                        await (await driver.findElement(visitFlow.AccountDashboardLayout_ConfigPage_Title)).getText(),
                    ).to.equal('Menu');
                    await visitFlow.waitTillVisible(visitFlow.AccountDashboardLayout_Menu_RepCard_PencilButton, 15000);
                    await visitFlow.clickElement('AccountDashboardLayout_Menu_RepCard_PencilButton');
                    await visitFlow.waitTillVisible(
                        visitFlow.getSelectorOfSlugConfiguredToAccountDashboardMenuLayoutByText(slug_path),
                        15000,
                    );
                    // await visitFlow.waitTillVisible(visitFlow.getSelectorOfSlugConfiguredToAccountDashboardMenuLayoutByText('visit_flow_auto'), 15000);
                    await visitFlow.click(
                        visitFlow.getSelectorOfSlugConfiguredToAccountDashboardMenuDELETEbuttonByText(slug_path),
                    );
                    // await visitFlow.click(visitFlow.getSelectorOfSlugConfiguredToAccountDashboardMenuDELETEbuttonByText('visit_flow_auto'));
                    await visitFlow.clickElement('AccountDashboardLayout_Menu_RepCard_SaveButton');
                    // is there a function to wait for round loader to finish?
                    driver.sleep(5 * 1000);
                    await visitFlow.waitTillVisible(visitFlow.AccountDashboardLayout_Menu_RepCard_PencilButton, 15000);
                    await visitFlow.clickElement('AccountDashboardLayout_Menu_CancelButton');
                    await visitFlow.waitTillVisible(visitFlow.AccountDashboardLayout_MenuRow_Container, 15000);
                    driver.sleep(2 * 1000);
                    await driver.switchToDefaultContent();
                    driver.sleep(7 * 1000);
                });

                it('Deleting Slug via API', async () => {
                    const res = await slugs.deleteSlugByName(slug_path, client);
                    expect(res.Ok).to.be.true;
                    expect(res.Status).to.equal(200);
                    expect(res.Error).to.eql({});
                    expect(res.Body.success).to.be.true;
                    expect(await (await slugs.getSlugs(client)).Body.find((item) => item.Slug === slug_path)).to.be
                        .undefined;
                });

                // it('Deleting Slug from Mapped Slugs via API', async () => {
                //     console.info(`existingMappedSlugs: ${JSON.stringify(existingMappedSlugs, null, 4)}`);
                //     const res = await e2eUtils.runOverMappedSlugs(existingMappedSlugs, client);
                //     console.info(`RESPONSE: ${JSON.stringify(res, null, 4)}`);

                //     // const slugsFields: MenuDataViewField[] = e2eUtils.prepareDataForDragAndDropAtSlugs([], existingMappedSlugs);
                //     // console.info(`slugsFields: ${JSON.stringify(slugsFields, null, 2)}`);
                //     // const slugsFieldsToAddToMappedSlugsObj = new UpsertFieldsToMappedSlugs(slugsFields);
                //     // console.info(
                //     //     `slugsFieldsToAddToMappedSlugs: ${JSON.stringify(slugsFieldsToAddToMappedSlugsObj, null, 2)}`,
                //     // );
                //     // const upsertFieldsToMappedSlugs = await dataViewsService.postDataView(slugsFieldsToAddToMappedSlugsObj);
                //     // console.info(`RESPONSE: ${JSON.stringify(upsertFieldsToMappedSlugs, null, 2)}`);
                // });

                // it('Deleting Slug from Mapped Slugs via UI', async () => {
                //     await e2eUtils.navigateTo('Slugs');
                //     await slugs.clickTab('Mapping_Tab');
                //     await slugs.waitTillVisible(slugs.EditPage_ConfigProfileCard_EditButton_Rep, 5000);
                //     await slugs.click(slugs.EditPage_ConfigProfileCard_EditButton_Rep);
                //     await slugs.isSpinnerDone();
                //     await slugs.waitTillVisible(slugs.MappedSlugs, 5000);
                //     await slugs.click(slugs.getSelectorOfMappedSlugDeleteButtonByName(slug_path));
                //     await slugs.clickElement('PageMapping_ProfileEditButton_Save');
                // });

                it('Deleting Page via UI', async () => {
                    await e2eUtils.navigateTo('Page Builder');
                    await pageBuilder.waitTillVisible(pageBuilder.PagesList_Title, 15000);
                    await pageBuilder.waitTillVisible(pageBuilder.PagesList_NumberOfItemsInList, 15000);
                    await pageBuilder.searchForPageByName(pageName);
                    pageBuilder.pause(2 * 1000);
                    await pageBuilder.deleteFromListByName(pageName);
                    pageBuilder.pause(5 * 1000);
                    await pageBuilder.searchForPageByName(pageName);
                    expect(
                        await (await driver.findElement(pageBuilder.PagesList_EmptyList_Paragraph)).getText(),
                    ).to.contain('No results were found.');
                    pageBuilder.pause(1 * 1000);
                });

                // it('Deleting Page via API', async () => { // doesn't work!
                //     const deletePageResponse = await pageBuilder.removePageByKey(pageUUID, client);
                //     console.info(`RESPONSE: ${JSON.stringify(deletePageResponse, null, 4)}`);
                // });

                it('Deleting UDCs listings', async () => {
                    // deleting created VisitFlowGroups documents
                    upsertedListingsToVisitFlowGroups.forEach(async (documentBody) => {
                        const deleteResponse = await udcService.hideObjectInACollection(
                            'VisitFlowGroups',
                            documentBody.Key,
                        );
                        expect(deleteResponse.Ok).to.be.true;
                        expect(deleteResponse.Status).to.equal(200);
                        expect(deleteResponse.Error).to.eql({});
                        expect(deleteResponse.Body.Hidden).to.be.true;
                        expect(deleteResponse.Body.Key).to.equal(documentBody.Key);
                        expect(deleteResponse.Body.Title).to.equal(documentBody.Title);
                        expect(deleteResponse.Body.SortIndex).to.equal(documentBody.SortIndex);
                    });

                    // deleting created VisitFlows documents
                    upsertedListingsToVisitFlows.forEach(async (documentBody) => {
                        const deleteResponse = await udcService.hideObjectInACollection('VisitFlows', documentBody.Key);
                        expect(deleteResponse.Ok).to.be.true;
                        expect(deleteResponse.Status).to.equal(200);
                        expect(deleteResponse.Error).to.eql({});
                        expect(deleteResponse.Body.Hidden).to.be.true;
                        expect(deleteResponse.Body.Key).to.equal(documentBody.Key);
                        expect(deleteResponse.Body.Title).to.equal(documentBody.Title);
                    });
                });

                // it('Deleting Catalogs View', async () => {
                // });

                it('Deleting Activities', async () => {
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                    await webAppHomePage.clickOnBtn('Accounts');
                    driver.sleep(0.5 * 1000);
                    await webAppHeader.isSpinnerDone();
                    await visitFlow.waitTillVisible(visitFlow.FirstAccountInList, 15000);
                    await visitFlow.clickElement('FirstAccountInList');
                    driver.sleep(0.5 * 1000);
                    await visitFlow.waitTillVisible(visitFlow.AccountHomePage_ListSelectAll_Checkbox, 15000);
                    await visitFlow.clickElement('AccountHomePage_ListSelectAll_Checkbox');
                    driver.sleep(0.5 * 1000);
                    await visitFlow.waitTillVisible(visitFlow.AccountHomePage_List_PencilButton, 15000);
                    await visitFlow.clickElement('AccountHomePage_List_PencilButton');
                    driver.sleep(0.5 * 1000);
                    await visitFlow.waitTillVisible(visitFlow.AccountHomePage_List_UnderPencilButton_Delete, 15000);
                    await visitFlow.clickElement('AccountHomePage_List_UnderPencilButton_Delete');
                    driver.sleep(0.5 * 1000);
                    await visitFlow.waitTillVisible(
                        visitFlow.AccountHomePage_List_DeletePopUpDialog_RedDeleteButton,
                        15000,
                    );
                    await visitFlow.clickElement('AccountHomePage_List_DeletePopUpDialog_RedDeleteButton');
                    driver.sleep(0.5 * 1000);
                    await visitFlow.waitTillVisible(visitFlow.AccountHomePage_List_EmptyList_Message, 15000);
                    driver.sleep(2.5 * 1000);
                });

                it('Performing Manual Sync', async () => {
                    await e2eUtils.performManualSync();
                });
            });
        });
    });
}
