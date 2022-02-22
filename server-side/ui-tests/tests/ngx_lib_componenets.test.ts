import { Browser } from '../utilities/browser';
import { describe, it, afterEach, beforeEach } from 'mocha';
import { WebAppHeader, WebAppLoginPage } from '../pom/index';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { ObjectsService } from '../../services/objects.service';
import { upgradeDependenciesTests } from './test.index';
import { NgxLibComponents } from '../pom/addons/NgxLibComponents';
import { Alert } from 'selenium-webdriver';
import addContext from 'mochawesome/addContext';


chai.use(promised);

export async function NgxTests(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    // const objectsService = new ObjectsService(generalService);
    let driver: Browser;

    //#region Upgrade ngx-lib-testing addon + dependencies 
    const testData = {
        'ngx-lib-testing': ['47db1b61-e1a7-42bd-9d55-93dd85044e91', '']
    };

    await upgradeDependenciesTests(generalService, varPass);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    //#endregion Upgrade ngx-lib-testing addon + dependencies
    describe('Basic UI Tests Suit', async function () {
        describe('UOM Tests Suites', async function () {
            describe('Prerequisites Addons for UOM Tests', async function () {
                //Test Data
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

            describe('NGX COMPONENETS UI TEST', async function () {
                this.retries(0);

                beforeEach(async function () {
                    driver = await Browser.initiateChrome();
                });

                afterEach(async function () {
                    const webAppLoginPage = new WebAppLoginPage(driver);
                    await webAppLoginPage.collectEndTestData(this);
                    await driver.quit();
                });

                it('POC1: clickig the change btn and reading the logs', async function () {
                    const webAppLoginPage = new WebAppLoginPage(driver);
                    await webAppLoginPage.login(email, password);
                    const webAppHeader = new WebAppHeader(driver);
                    await webAppHeader.openSettings();
                    await driver.getALLConsoleLogs();//clear logs created before entering the addon
                    const ngxLibAddon = new NgxLibComponents(driver);
                    await ngxLibAddon.gotoNgxAddon();
                    do {
                        //1. are all classes from NGX presented on the element
                        expect(await ngxLibAddon.areAllClassesIncluded()).to.be.true;
                        let browserConsoleLog = (await driver.getALLConsoleLogs()).join();
                        if (await ngxLibAddon.isComponentWithIcon()) {
                            //2. is icon found
                            let iconName: string = await ngxLibAddon.getIconNameOutOfExpectedData();
                            await isIconFound(this, browserConsoleLog, `We could not find the Icon with the name ${iconName},\\n                did you add it to the Icon registry?`, iconName);
                        }
                        else {
                            const truedH = (await ngxLibAddon.getActualComponentSize()).height;
                            const truedW = (await ngxLibAddon.getActualComponentSize()).width;
                            const expectedH = (await ngxLibAddon.getExpectedComponentSize()).height;
                            const expectedW = (await ngxLibAddon.getExpectedComponentSize()).width;
                            //3. is size correct
                            expect(expectedH).to.equal(truedH);
                            expect(expectedW).to.equal(truedW);
                        }
                        //4. pre click color test
                        await testColor(ngxLibAddon, 0);
                        await ngxLibAddon.clickComponent();//clicking component
                        //5. post click color test
                        await testColor(ngxLibAddon, 1);
                        browserConsoleLog = (await driver.getALLConsoleLogs()).join();
                        //6. component clicked test
                        const ActualComponentData: string = await ngxLibAddon.getComponentData();
                        isButtonClicked(this, browserConsoleLog, `clicked button: ${ActualComponentData}`);
                        await ngxLibAddon.changeStyle();
                    } while (await checkIfAlertAlreadyPresented() !== 'button testing ended');
                    (await driver.switchToAlertElement()).dismiss();
                    await ngxLibAddon.disableBtn();
                    await ngxLibAddon.clickComponent();
                    let browserConsoleLog = (await driver.getALLConsoleLogs()).join();
                    let componentData = await ngxLibAddon.getComponentData();
                    //7. is disabled button clicked
                    isButtonNOTClicked(this, browserConsoleLog, `clicked button: ${componentData}`);
                    await ngxLibAddon.disableBtn();//to return the btn to not disable state
                    await ngxLibAddon.changeVisibilityOfBtn();
                    //8. is not visibale element is indeed not visiale
                    expect(await ngxLibAddon.isComponentVisibale()).to.be.false;
                });
            });
        });
    });

    async function testColor(ngxLibAddon: NgxLibComponents, index: number): Promise<void> {
        let trueBgColor = await ngxLibAddon.getActualBgColor();
        let expectedBgColor = await ngxLibAddon.getExpectedBgColor(index);
        expect(expectedBgColor).to.equal(trueBgColor);
    }

    async function checkIfAlertAlreadyPresented(): Promise<string> {
        try {
            let alert: Alert = await driver.switchToAlertElement();
            return await alert.getText();
        } catch (e: any) {
            if (e.name !== 'NoSuchAlertError') {
                throw e;
            } else {
                return "";
            }
        }
    }

    function isButtonClicked(that: any, consoleOutput: string, expectedValueInConsole: string): void {
        if (!consoleOutput.includes(expectedValueInConsole)) {
            addContext(that, {
                title: `the button: '${expectedValueInConsole.substring(expectedValueInConsole.indexOf(':') + 1)}' wasn't clicked`,
                value: `current log value: ${consoleOutput}, expected to find: '${expectedValueInConsole}'`,
            });
        }
        expect(consoleOutput).to.include(expectedValueInConsole);
    }

    function isButtonNOTClicked(that: any, consoleOutput: string, expectedValueInConsole: string): void {
        if (consoleOutput.includes(expectedValueInConsole)) {
            addContext(that, {
                title: `the button: '${expectedValueInConsole.substring(expectedValueInConsole.indexOf(':') + 1)}' was clicked although is disabled`,
                value: `current log value: ${consoleOutput}, expected to find: '${expectedValueInConsole}'`,
            });
        }
        expect(consoleOutput).to.not.include(expectedValueInConsole);
    }

    async function isIconFound(that: any, consoleOutput: string, valueExpectedToNotShow: string, iconName: string): Promise<void> {
        let base64Image = await driver.saveScreenshots();
        if (consoleOutput.includes(valueExpectedToNotShow)) {
            addContext(that, {
                title: `the icon: '${iconName}' isn't presented (${valueExpectedToNotShow.substring(valueExpectedToNotShow.indexOf("\n") - 1)})`,
                value: 'data:image/png;base64,' + base64Image,
            });
        }
    }
}