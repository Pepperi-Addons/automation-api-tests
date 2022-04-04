import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import { WebAppHomePage, WebAppLoginPage } from '../pom/index';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { PagesService } from '../../services/pages/pages.service';
import { PageClass } from '../../models/pages/page.class';
import { PageBlocksArray } from '../../models/pages/page-block-array';
import { v4 as newUuid } from 'uuid';
import { PageSectionClass } from '../../models/pages/page-section.class';
import { Page, PageBlock } from '@pepperi-addons/papi-sdk';
import { PagesList } from '../pom/addons/PageBuilder/PagesList';
import { StaticTester } from '../pom/addons/Blocks/StaticTester.block';
import { PageEditor } from '../pom/addons/PageBuilder/PageEditor';

chai.use(promised);

export async function PageBuilderTests(
    email: string,
    password: string,
    varPass: string,
    generalService: GeneralService,
) {
    const pagesService = new PagesService(generalService);
    let browser: Browser;

    const testData = {
        Pages: ['50062e0c-9967-4ed4-9102-f2bc50602d41', '0.0.81'], //Page Builder Addon 0.0.81
        PageBuilderTester: ['5046a9e4-ffa4-41bc-8b62-db1c2cf3e455', ''],
    };

    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    //#endregion Upgrade cpi-node & UOM

    describe('Page Builder Hybrid Tests Suite', async function () {
        describe('Prerequisites Addons for Page Builder Tests', () => {
            //Test Data
            initAndVerifyAddonVersions(isInstalledArr, testData, chnageVersionResponseArr, generalService);
        });

        describe('Page Builder Tests', function () {
            this.retries(1);
            let homePage: WebAppHomePage;
            let pagesList: PagesList;
            before(async function () {
                browser = await Browser.initiateChrome();
                const webAppLoginPage = new WebAppLoginPage(browser);
                homePage = await webAppLoginPage.login(email, password);
                await homePage.Header.openSettingsAndLoad().then((settingSidePanel) =>
                    settingSidePanel.enterSettingsPage('Pages', 'pages'),
                );
                pagesList = new PagesList(browser);
            });

            after(async function () {
                await browser.quit();
            });

            describe('Basic Page Builder Tests (Static Tester)', function () {
                let basicPage: PageClass = new PageClass();
                basicPage.Key = newUuid();
                basicPage.Name = 'Basic Page Tests';
                let staticTester: StaticTester;
                before(async function () {
                    basicPage = await createSectionWithBlock(basicPage, 'Static Tester');
                    const pageResult: Page = await pagesService.createOrUpdatePage(basicPage);

                    pagesService.deepCompareObjects(basicPage, pageResult, expect);
                    if (basicPage?.Name) {
                        const pageEditor: PageEditor = await pagesList.editPage(basicPage.Name);
                        await pageEditor.enterPreviewMode();
                        staticTester = new StaticTester(browser);
                    } else {
                        throw new Error(`Page does not have a name. Page Key: ${basicPage.Key}`);
                    }
                });

                after(async function () {
                    await pagesService.deletePage(basicPage);
                    const result = await pagesService.getPages({
                        where: `Key='${basicPage.Key}'`,
                        include_deleted: true,
                    });
                    expect(result[0]?.Hidden).is.equal(true);
                });

                afterEach(async function () {
                    await homePage.collectEndTestData(this);
                });

                it('Check Static Tester block loaded', async function () {
                    await staticTester.clickBlockLoadBtn();
                    expect(await staticTester.getTestText()).equals('TEST PASSED');
                });

                it('Check API call from block', async function () {
                    await staticTester.clickApiCallBtn();
                    const apiResult = await pagesService.getPages();

                    let testText: string | null = await staticTester.getTestText();
                    let textPollCount = 0;
                    const maxCount = 30;
                    while (testText == 'TEST PASSED' || !testText) {
                        if (textPollCount >= maxCount) {
                            throw new Error('Timed out while polling test text');
                        }
                        await browser.sleepTimeout(2500);
                        testText = await staticTester.getTestText();
                        textPollCount++;
                    }
                    expect(testText).equals(JSON.stringify(apiResult));
                });
            });
        });
    });

    async function createSectionWithBlock(basicPage: PageClass, blockRelationName: string): Promise<PageClass> {
        const blocksArray: PageBlocksArray = new PageBlocksArray();
        const staticBlockRelation = await pagesService.getBlockRelation(blockRelationName);
        const staticBlock: PageBlock = blocksArray.createAndAdd(staticBlockRelation);

        const sectionKey: string = newUuid();

        basicPage.Layout.Sections.add(new PageSectionClass(sectionKey));
        basicPage.createAndAddBlockToSection(staticBlock, sectionKey);

        return basicPage;
    }
}
function initAndVerifyAddonVersions(
    isInstalledArr: boolean[],
    testData: {
        Pages: string[]; //Page Builder Addon 0.0.81
        PageBuilderTester: string[];
    },
    chnageVersionResponseArr: { [any: string]: string[] },
    generalService: GeneralService,
) {
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
}
