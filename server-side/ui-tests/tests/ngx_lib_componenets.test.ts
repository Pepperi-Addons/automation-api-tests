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
import { Alert, AlertPromise, WebDriver, WebElement } from 'selenium-webdriver';
import addContext from 'mochawesome/addContext';


chai.use(promised);

export async function NgxTests(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
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
                    driver.sleep(2200);
                    do {
                        //TODO: refactor code
                        const insideButtonComponentActualClasses = await (await driver.findElement(ngxLibAddon.insideButton)).getAttribute("class");
                        const expectedComponentClasses: string = await (await driver.findElement(ngxLibAddon.autoData)).getText();
                        let expectedComponentClassesSplited = expectedComponentClasses.split(' ');
                        let browserConsoleLog = await driver.getALLConsoleLogs();
                        for (let i = 0; i < 3; i++) {
                            assertIsClassFound(expectedComponentClasses[i], insideButtonComponentActualClasses);
                        }
                        let browserConsoleLogJoined = browserConsoleLog.join();
                        let componentData = await ngxLibAddon.getComponentData();
                        if (expectedComponentClassesSplited.length === 6) {
                            let iconName = expectedComponentClassesSplited[expectedComponentClassesSplited.length - 3];
                            console.log(browserConsoleLogJoined);
                            isIconFound(this, browserConsoleLogJoined, `We could not find the Icon with the name ${iconName},\\n                did you add it to the Icon registry?`, iconName);
                        }
                        const btnComp = await driver.findElement(ngxLibAddon.componentButton);
                        // let color = await (await driver.findElement(ngxLibAddon.insideButton)).getCssValue("background-color");
                        const size = await btnComp.getRect();
                        const truedH = size.height;
                        const truedW = size.width;
                        const expectedH = expectedComponentClassesSplited[expectedComponentClassesSplited.length - 2].split('x')[0];
                        const expectedW = expectedComponentClassesSplited[expectedComponentClassesSplited.length - 2].split('x')[1];
                        expect(parseInt(expectedH)).to.equal(truedH);
                        expect(parseInt(expectedW)).to.equal(truedW);
                        let trueBgColor = await (await driver.findElement(ngxLibAddon.insideButton)).getCssValue("background-color");
                        let expectedBgColor = expectedComponentClassesSplited[expectedComponentClassesSplited.length - 1].split(';')[0].replace(/,/g, ", ");
                        expect(expectedBgColor).to.equal(trueBgColor);//pre click
                        await ngxLibAddon.clickComponent();
                        trueBgColor = await (await driver.findElement(ngxLibAddon.insideButton)).getCssValue("background-color");
                        expectedBgColor = expectedComponentClassesSplited[expectedComponentClassesSplited.length - 1].split(';')[1].replace(/,/g, ", ");
                        expect(expectedBgColor).to.equal(trueBgColor);//post click
                        browserConsoleLog = await driver.getALLConsoleLogs();
                        browserConsoleLogJoined = browserConsoleLog.join();
                        console.log(browserConsoleLogJoined);
                        isButtonClicked(this, browserConsoleLogJoined, `clicked button: ${componentData}`);
                        await ngxLibAddon.changeStyle();
                    } while (await checkIfAlertAlreadyPresented() !== 'button testing ended');
                    (await driver.switchToAlertElement()).dismiss();
                });
            });




        });
    });
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

    function isIconFound(that: any, consoleOutput: string, valueExpectedToNotShow: string, iconName: string): void {
        if (consoleOutput.includes(valueExpectedToNotShow)) {
            addContext(that, {
                title: `the icon: '${iconName}' isn't found`,
                value: `browser console log showed the next warning: '${valueExpectedToNotShow}'`,
            });
        }
    }

    function assertIsClassFound(expectedClass: string, allElementsClasses: string) {
        expect(allElementsClasses).to.include(expectedClass);

    }
}



//We could not find the Icon with the name <arrow_back_left>,\\n                did you add it to the Icon registry?