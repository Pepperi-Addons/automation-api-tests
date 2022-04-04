import { Browser } from '../../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import { WebAppLoginPage } from '../../pom/index';
import GeneralService from '../../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { PagesService } from '../../../services/pages/pages.service';
import { PagesList } from '../../pom/addons/PageBuilder/PagesList';
import { BasicBlockTests } from './basic_block.test';
import { ProduceConsumeTests } from './produce_consume.test';

chai.use(promised);
type AddonVersionData = { [AddonName: string]: string[] };

export interface PageTestRequirements
{
    browser: Browser,
    pagesList: PagesList
}

export async function PageBuilderTests(
    email: string,
    password: string,
    varPass: string,
    generalService: GeneralService,
) {
    const pagesService = new PagesService(generalService);

    const testData: AddonVersionData = {
        Pages: ['50062e0c-9967-4ed4-9102-f2bc50602d41', ''], //Page Builder Addon 0.0.81
        'Page Tester': ['3da3c1d7-6aa9-4938-bcdb-b8b4acbf8535', ''], 
    };

    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const changeVersionResponseArr = await generalService.changeVersion(varPass, testData, false);

    describe('Page Builder Hybrid Tests Suite', function () {
        let pagesList: PagesList;
        let browser: Browser;
        const pagesReq : PageTestRequirements = {browser: undefined, pagesList: undefined} as any;
        
        
        describe('Prerequisites Addons for Page Builder Tests', function() {
            //Test Data
            initAndVerifyAddonVersions(isInstalledArr, testData, changeVersionResponseArr, generalService);
        });

        describe('Page Builder Tests', function () {
            this.retries(1);

            before(async function () {
                pagesReq.browser = await Browser.initiateChrome();
                browser = pagesReq.browser;
                const webAppLoginPage = new WebAppLoginPage(browser);
                let homePage = await webAppLoginPage.login(email, password);
                await homePage.Header.openSettingsAndLoad().then((settingSidePanel) =>
                    settingSidePanel.enterSettingsPage('Pages', 'pages'),
                );
                pagesReq.pagesList = new PagesList(browser);
                pagesList = pagesReq.pagesList;
            });

            after(async function () {
                await browser.quit();
            });

            describe('Basic Block Tests', function() {
                BasicBlockTests(pagesService, pagesReq);
            });

            describe('Produce Consume Tests', function() {
                ProduceConsumeTests(pagesService, pagesReq);
            });

        });
    });
}

function initAndVerifyAddonVersions(
    isInstalledArr: boolean[],
    testData: AddonVersionData,
    chnageVersionResponseArr: AddonVersionData,
    generalService: GeneralService,
) {
    isInstalledArr.forEach((isInstalled, index) => {
        it(`Validate That Needed Addons Is Installed: ${Object.keys(testData)[index]}`, () => {
            expect(isInstalled).to.be.true;
        });
    });
    for (const addonName in testData) {
        const addonUUID = testData[addonName][0];
        const version = testData[addonName][1];
        const varLatestVersion = chnageVersionResponseArr[addonName][2];
        const changeType = chnageVersionResponseArr[addonName][3];
        describe(`Test Data: ${addonName}`, function() {
            it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
                if (chnageVersionResponseArr[addonName][4] == 'Failure') {
                    expect(chnageVersionResponseArr[addonName][5]).to.include('is already working on version');
                } else {
                    expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
                }
            });
            it(`Latest Version Is Installed ${varLatestVersion}`, async function() {
                await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
                    .eventually.to.have.property('Version')
                    .a('string')
                    .that.is.equal(varLatestVersion);
            });
        });
    }
}
