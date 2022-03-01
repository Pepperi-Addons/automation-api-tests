import { Browser } from '../utilities/browser';
import { describe, it, before, after } from 'mocha';
import { WebAppHeader, WebAppLoginPage } from '../pom/index';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { upgradeDependenciesTests } from './test.index';
import { Components, NgxLibComponents } from '../pom/addons/NgxLibComponents';
import { Alert, By, Locator, WebElement } from 'selenium-webdriver';
import addContext from 'mochawesome/addContext';

chai.use(promised);

export async function NgxTests(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    // const objectsService = new ObjectsService(generalService);
    let driver: Browser;

    //#region Upgrade ngx-lib-testing addon + dependencies
    const testData = {
        'ngx-lib-testing': ['47db1b61-e1a7-42bd-9d55-93dd85044e91', ''],
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

                before(async function () {
                    driver = await Browser.initiateChrome();
                });

                after(async function () {
                    const webAppLoginPage = new WebAppLoginPage(driver);
                    await webAppLoginPage.collectEndTestData(this);
                    await driver.quit();
                });

                it('pep-button testing', async function () {
                    const webAppLoginPage = new WebAppLoginPage(driver);
                    await webAppLoginPage.login(email, password);
                    const webAppHeader = new WebAppHeader(driver);
                    await webAppHeader.openSettings();
                    await driver.getALLConsoleLogs(); //clear logs created before entering the addon
                    const ngxLibAddon = new NgxLibComponents(driver);
                    await ngxLibAddon.gotoNgxAddon();

                    do {
                        //1. are all classes from NGX presented on the element
                        expect(await ngxLibAddon.areAllClassesIncluded()).to.be.true;
                        const browserConsoleLog = (await driver.getALLConsoleLogs()).join();
                        if (await ngxLibAddon.isComponentWithIcon()) {
                            //2. is icon found
                            const iconName: string = await ngxLibAddon.getIconNameOutOfExpectedData();
                            await isIconFound(
                                this,
                                browserConsoleLog,
                                `We could not find the Icon with the name ${iconName},\\n                did you add it to the Icon registry?`,
                                iconName,
                            );
                        } else {//only buttons w/o icon are tested for size
                            const truedH: number = (await ngxLibAddon.getActualComponentSize(Components.Button)).height;
                            const truedW: number = (await ngxLibAddon.getActualComponentSize(Components.Button)).width;
                            const expectedH: number = (await ngxLibAddon.getExpectedComponentSize(Components.Button)).height;
                            const expectedW: number = (await ngxLibAddon.getExpectedComponentSize(Components.Button)).width;
                            //3. is size correct
                            expect(expectedH).to.equal(truedH);
                            expect(expectedW).to.equal(truedW);//problem here
                        }
                        //4. pre click color test
                        await testColor(ngxLibAddon, 0);
                        await ngxLibAddon.clickComponent(); //clicking component
                        //5. post click color test
                        await testColor(ngxLibAddon, 1);
                        //6. component clicked test
                        const ActualComponentData: string = await ngxLibAddon.getComponentData();
                        isTextPresentedInConsole(this, `clicked button: ${ActualComponentData}`);
                        await ngxLibAddon.changeStyle();
                    } while ((await checkIfAlertAlreadyPresented()) !== 'button testing ended');

                    (await driver.switchToAlertElement()).dismiss();
                    await ngxLibAddon.disableBtn();
                    await ngxLibAddon.clickComponent();
                    const componentData = await ngxLibAddon.getComponentData();
                    //7. is disabled button clicked
                    isTextNOTFound(this, `clicked button: ${componentData}`);
                    await ngxLibAddon.disableBtn(); //to return the btn to not disable state
                    await ngxLibAddon.changeVisibilityOfBtn();
                    //8. is not visibale element is indeed not visiale
                    expect(await ngxLibAddon.isComponentVisibale()).to.be.false;
                });

                it('pep-attachment testing', async function () {
                    const ngxLibAddon = new NgxLibComponents(driver);
                    await ngxLibAddon.gotoNextTest();
                    do {
                        let expectedData = (await ngxLibAddon.getExpectedData()).split(',');
                        let parsedExpectedData: (string | boolean)[] = [];
                        expectedData.forEach(element => {
                            element = element.split(':')[1];
                            let bool = (element === "true" || element === "false") ? element === "true" : undefined;
                            parsedExpectedData.push(bool === true || bool === false ? bool : element);
                        });
                        let [isMandatory, xAligment, showTitle] = parsedExpectedData;
                        //1. is mandatory icon shown if the element is cnofigured as mandatory
                        await testIfElementShown(isMandatory as boolean, ngxLibAddon.pepIconMandatory);
                        //2. is title label shown if it should
                        await testIfElementShown(showTitle as boolean, ngxLibAddon.titleLabel);
                        const truedH: number = (await ngxLibAddon.getActualComponentSize(Components.Attachment)).height;
                        const truedW: number = (await ngxLibAddon.getActualComponentSize(Components.Attachment)).width;
                        const expectedH: number = (await ngxLibAddon.getExpectedComponentSize(Components.Attachment)).height;
                        const expectedW: number = (await ngxLibAddon.getExpectedComponentSize(Components.Attachment)).width;
                        //3. is size correct
                        expect(expectedH).to.equal(truedH);
                        expect(expectedW).to.equal(truedW);
                        //4. is aligment correct
                        const formTitle: WebElement = await driver.findElement(ngxLibAddon.formTitle);
                        const formTitleStyle: string = await formTitle.getCssValue("text-align");
                        expect(xAligment).to.equal(formTitleStyle);
                        await ngxLibAddon.changeStyle();
                    } while ((await checkIfAlertAlreadyPresented()) !== 'attachment testing ended');
                    (await driver.switchToAlertElement()).dismiss();
                    //5. test 'see original' button
                    await driver.click(ngxLibAddon.openSrcButton);
                    driver.sleep(1500);
                    await driver.switchToTab(1);
                    let urlAfterClick = await driver.getCurrentUrl();
                    expect(urlAfterClick).to.equal("https://idpfiles.sandbox.pepperi.com/f389fd2e-4a31-4965-a21e-3a98b4553300/images/logo.svg");
                    await driver.closeCurrentTabAndSwitchToOther(0);
                    isTextPresentedInConsole(this, `element clicked`);
                    //6. test deleting icon pressing 
                    await driver.click(ngxLibAddon.pepIconTrash);
                    await testIfElementShown(true, ngxLibAddon.noFileTitle);
                    await testIfElementShown(true, ngxLibAddon.matError);
                    //test file changed function printed to console
                    isTextPresentedInConsole(this, `file changed`);
                    //7. test inserting file into the element - dunno how to implement this rn
                });

                it('pep-checkbox testing', async function () {
                    const ngxLibAddon = new NgxLibComponents(driver);
                    await ngxLibAddon.gotoNextTest();
                    do {
                        let expectedData = (await ngxLibAddon.getExpectedData()).split(';');
                        let parsedExpectedData: (string | boolean)[] = prepareExpectedData(expectedData);
                        let [value, label, type, alignment, , , renderTitle, visible, mandatory, disabled] = parsedExpectedData;
                        if (visible) {
                            let checkBoxValueBool = await ngxLibAddon.getCheckBoxValue(type as string);
                            expect(checkBoxValueBool).to.equal(value);
                            let checkBoxLabelText = await ngxLibAddon.getCheckBoxLabelText(type as string);
                            expect(label).to.equal(checkBoxLabelText);
                            const isCheckboxShown = await ngxLibAddon.getIfCheckBoxShown(type as string, value as boolean, disabled as boolean);
                            expect(isCheckboxShown).to.be.true;
                            if (mandatory && renderTitle) {
                                const checkBoxFieldTitle = await (await driver.findElement(ngxLibAddon.checkBoxFieldTitle)).getCssValue("text-align");
                                expect(checkBoxFieldTitle).to.equal(alignment);
                            }
                            expect(await ngxLibAddon.validateDisabledCheckbox(disabled as boolean)).to.be.true;
                            //show title??
                            await testIfElementShown((mandatory && renderTitle) as boolean, ngxLibAddon.pepIconMandatory);
                        }
                        await testIfElementShown(visible as boolean, ngxLibAddon.checkBoxComponent);
                        await ngxLibAddon.changeStyle();
                    } while ((await checkIfAlertAlreadyPresented()) !== 'checkbox testing ended');
                    (await driver.switchToAlertElement()).dismiss();
                    expect(await ngxLibAddon.validateClick(ngxLibAddon.checkBoxComponent)).to.be.true;
                });
            });
        });
    });

    function prepareExpectedData(expectedData: string[]): (string | boolean)[] {
        let parsedExpectedData: (string | boolean)[] = [];
        expectedData.forEach(element => {
            element = element.split(':')[1];
            let bool = (element === "true" || element === "false") ? element === "true" : undefined;
            parsedExpectedData.push(bool === true || bool === false ? bool : element);
        });
        return parsedExpectedData;
    }

    async function testIfElementShown(isFound: boolean, locator: Locator) {
        let foundElement: WebElement | undefined = undefined;
        try {
            foundElement = await driver.findElement(locator);
        } catch (e: any) {
            if (e.message.includes(`'${locator.valueOf()['value']}', The test must end, The element is: undefined`)) {
                foundElement = undefined;
            } else throw e;
        }
        if (isFound) {
            expect(foundElement).to.not.be.undefined;
        } else {
            expect(foundElement).to.be.undefined;
        }
    }

    async function testColor(ngxLibAddon: NgxLibComponents, index: number): Promise<void> {
        const trueBgColor = await ngxLibAddon.getActualBgColor();
        const expectedBgColor = await ngxLibAddon.getExpectedBgColor(index);
        expect(expectedBgColor).to.equal(trueBgColor);
    }

    async function checkIfAlertAlreadyPresented(): Promise<string> {
        try {
            const alert: Alert = await driver.switchToAlertElement();
            return await alert.getText();
        } catch (e: any) {
            if (e.name !== 'NoSuchAlertError') {
                throw e;
            } else {
                return '';
            }
        }
    }

    async function isTextPresentedInConsole(that: any, expectedValueInConsole: string): Promise<void> {
        const consoleOutput = (await driver.getALLConsoleLogs()).join();
        if (!consoleOutput.includes(expectedValueInConsole)) {
            addContext(that, {
                title: `the button: '${expectedValueInConsole.substring(
                    expectedValueInConsole.indexOf(':') + 1,
                )}' wasn't clicked`,
                value: `current log value: ${consoleOutput}, expected to find: '${expectedValueInConsole}'`,
            });
        }
        expect(consoleOutput).to.include(expectedValueInConsole);
    }

    async function isTextNOTFound(that: any, expectedValueInConsole: string): Promise<void> {
        const consoleOutput = (await driver.getALLConsoleLogs()).join();
        if (consoleOutput.includes(expectedValueInConsole)) {
            addContext(that, {
                title: `the button: '${expectedValueInConsole.substring(
                    expectedValueInConsole.indexOf(':') + 1,
                )}' was clicked although is disabled`,
                value: `current log value: ${consoleOutput}, expected to find: '${expectedValueInConsole}'`,
            });
        }
        expect(consoleOutput).to.not.include(expectedValueInConsole);
    }

    async function isIconFound(
        that: any,
        consoleOutput: string,
        valueExpectedToNotShow: string,
        iconName: string,
    ): Promise<void> {
        const base64Image = await driver.saveScreenshots();
        if (consoleOutput.includes(valueExpectedToNotShow)) {
            addContext(that, {
                title: `the icon: '${iconName}' isn't presented (${valueExpectedToNotShow.substring(
                    valueExpectedToNotShow.indexOf('\n') - 1,
                )})`,
                value: 'data:image/png;base64,' + base64Image,
            });
        }
    }
}

