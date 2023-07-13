import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage, WebAppLoginPage } from '../pom';
import GeneralService from '../../services/general.service';
import { Client } from '@pepperi-addons/debug-server/dist';
import { Flow, FlowParam, FlowService, FlowStep } from '../pom/addons/flow.service';

chai.use(promised);

// const newFlowName = 'test_api_pos';
const newFlowParams: FlowParam[] = [
    {
        DefaultValue: 'evgenyos',
        Type: 'String',
        Description: 'test',
        Internal: false,
        Name: 'test',
    },
];
const newFlowSteps: FlowStep[] = [
    {
        Type: 'LogicBlock',
        Relation: {
            ExecutionURL: '/addon-cpi/run_logic_block_script',
            AddonUUID: '9f3b727c-e88c-4311-8ec4-3857bc8621f3',
            Name: 'UserScriptsBlock',
        },
        Disabled: false,
        Configuration: {
            runScriptData: {
                ScriptData: {},
                ScriptKey: '0c52a228-cf30-4baa-a635-83fa6e4edef8',
            },
        },
        Name: 'Step',
    },
];
const positiveFlow: Flow = {
    Params: newFlowParams,
    Description: 'aaaaaaaaaaaaaa',
    Hidden: false,
    Steps: newFlowSteps,
    Name: 'dfmspkfndkps',
};

export async function FlowTests(email: string, password: string, client: Client, varPass) {
    const generalService = new GeneralService(client);
    let driver: Browser;

    // await generalService.baseAddonVersionsInstallation(varPass);
    // #region Upgrade survey dependencies

    const testData = {};

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);

    // #endregion Upgrade survey dependencies

    describe('Survey Builder Tests Suit', async function () {
        describe('Prerequisites Addons for Survey Builder Tests', () => {
            //Test Data
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

        describe('Configuring Survey', () => {
            this.retries(0);

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
            it(`Create Flow Using UI - Call It From Api And See Everything Is Correct`, async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                const flowService = new FlowService(driver);
                //enter flows from settings
                const isFlowBuilderMainPageShown = await flowService.enterFlowBuilderSettingsPage();
                expect(isFlowBuilderMainPageShown).to.equal(true);
                //add flow modal
                const isAddFlowModalOpened = await flowService.openAddFlowPage();
                expect(isAddFlowModalOpened).to.equal(true);
                const isIternalPageOfFlowShown = await flowService.enterNewFlowPage(positiveFlow);
                expect(isIternalPageOfFlowShown).to.equal(true);
                //1. inside flow: validate name + Description in General Tab
                const isGeneralDataShownCorrectly = await flowService.enterGeneralTabAndSeeValues(positiveFlow);
                expect(isGeneralDataShownCorrectly).to.equal(true);
                //2. add parameters by given flow
                const isParamTabShown = await flowService.enterParamTab();
                expect(isParamTabShown).to.equal(true);
                const [isModalShownCorrectly, saveButtonDisability, areValuesSimilar] = await flowService.addParam(
                    positiveFlow,
                );
                expect(isModalShownCorrectly).to.equal(true);
                expect(saveButtonDisability).to.equal(true);
                expect(areValuesSimilar).to.equal(true);
                //3. add steps by given flow
                //4. save everything
                //5. call API to see everything is similar
            });
        });
    });
}
