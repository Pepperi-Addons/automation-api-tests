import { Browser } from '../utilities/browser';
import { describe, it, before, after } from 'mocha';
import { WebAppHeader, WebAppLoginPage } from '../pom/index';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { upgradeDependenciesTests } from './test.index';
import { Components, NgxLibComponents } from '../pom/addons/NgxLibComponents';
import { Alert, Locator, WebElement } from 'selenium-webdriver';

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
    describe('NGX Tests Suites', async function () {
        describe('Prerequisites Addons for NGX Tests', async function () {
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
                    const expectedData = await ngxLibAddon.getExpectedData();
                    const parsedExpectedData: (string | boolean)[] = prepareExpectedData(expectedData);
                    const [style, state, size, icon, autoSize, autoColor] = parsedExpectedData;
                    //1. are all classes from NGX presented on the element
                    expect(await ngxLibAddon.areAllClassesIncluded(style, state, size)).to.be.true;
                    const browserConsoleLog = (await driver.getALLConsoleLogs()).join();
                    if (icon !== 'undefined') {
                        await isIconFound(
                            this,
                            browserConsoleLog,
                            `We could not find the Icon with the name ${icon},\\n                did you add it to the Icon registry?`,
                            icon as string,
                        );
                    } else {
                        //only buttons w/o icon are tested for size
                        const truedH: number = (await ngxLibAddon.getActualComponentSize(Components.Button)).height;
                        const truedW: number = (await ngxLibAddon.getActualComponentSize(Components.Button)).width;
                        const expectedH: number = (await ngxLibAddon.getExpectedComponentSize(autoSize as string))
                            .height;
                        const expectedW: number = (await ngxLibAddon.getExpectedComponentSize(autoSize as string))
                            .width;
                        //3. is size correct
                        expect(expectedH).to.equal(truedH);
                        expect(expectedW).to.equal(truedW);
                    }
                    //4. pre click color test
                    let colorValues = await ngxLibAddon.getExpectedAndActualElemColor(
                        0,
                        ngxLibAddon.insideButton,
                        'background-color',
                        autoColor as string,
                    );
                    expect(colorValues.expected).to.equal(colorValues.true);
                    await ngxLibAddon.clickNGXButton(); //clicking component
                    //5. post click color test
                    colorValues = await ngxLibAddon.getExpectedAndActualElemColor(
                        1,
                        ngxLibAddon.insideButton,
                        'background-color',
                        autoColor as string,
                    );
                    expect(colorValues.expected).to.equal(colorValues.true);
                    //6. component clicked test
                    await isTextPresentedInConsole(this, `clicked button: ${style} ${state} ${size}`);
                    await ngxLibAddon.changeStyle();
                } while ((await checkIfAlertAlreadyPresented()) !== 'button testing ended');
                await dismissAlert();
                await ngxLibAddon.disableBtn();
                await ngxLibAddon.clickNGXButton();
                const expectedData = await ngxLibAddon.getExpectedData();
                const parsedExpectedData: (string | boolean)[] = prepareExpectedData(expectedData);
                const [style, state, size, icon, autoSize, autoColor] = parsedExpectedData;
                //7. is disabled button clicked
                await isTextNOTFound(this, `clicked button: ${style} ${state} ${size}`);
                await ngxLibAddon.disableBtn(); //to return the btn to not disable state
                await ngxLibAddon.changeVisibilityOfBtn();
                //8. is not visibale element is indeed not visiale
                expect(await ngxLibAddon.isComponentVisibale()).to.be.false;
            });

            it('pep-attachment testing', async function () {
                const ngxLibAddon = new NgxLibComponents(driver);
                await ngxLibAddon.gotoNextTest();
                do {
                    const expectedData = await ngxLibAddon.getExpectedData();
                    const parsedExpectedData: (string | boolean)[] = prepareExpectedData(expectedData);
                    const [isMandatory, xAligment, showTitle, size] = parsedExpectedData;
                    //1. is mandatory icon shown if the element is cnofigured as mandatory
                    await testIfElementShown(isMandatory as boolean, ngxLibAddon.pepIconMandatory);
                    //2. is title label shown if it should
                    await testIfElementShown(showTitle as boolean, ngxLibAddon.titleLabel);
                    const truedH: number = (await ngxLibAddon.getActualComponentSize(Components.Attachment)).height;
                    const truedW: number = (await ngxLibAddon.getActualComponentSize(Components.Attachment)).width;
                    const expectedH: number = (
                        await ngxLibAddon.getExpectedComponentSize((size as string).split('->')[1])
                    ).height;
                    const expectedW: number = (
                        await ngxLibAddon.getExpectedComponentSize((size as string).split('->')[1])
                    ).width;
                    //3. is size correct
                    expect(expectedH).to.equal(truedH);
                    expect(expectedW).to.equal(truedW);
                    //4. is aligment correct
                    const formTitleStyle: string = await ngxLibAddon.getXAligment(ngxLibAddon.formTitle);
                    expect(xAligment).to.equal(formTitleStyle);
                    await ngxLibAddon.changeStyle();
                } while ((await checkIfAlertAlreadyPresented()) !== 'attachment testing ended');
                await dismissAlert();
                //5. test 'see original' button
                const urlAfterClick: string = await ngxLibAddon.openSrcLink();
                expect(urlAfterClick).to.equal(
                    'https://idpfiles.sandbox.pepperi.com/f389fd2e-4a31-4965-a21e-3a98b4553300/images/logo.svg',
                );
                await driver.closeCurrentTabAndSwitchToOther(0);
                await isTextPresentedInConsole(this, `element clicked`);
                //6. test deleting icon pressing
                await ngxLibAddon.deleteCurrentAttachment();
                await testIfElementShown(true, ngxLibAddon.noFileTitle);
                await testIfElementShown(true, ngxLibAddon.matError);
                //test file changed function printed to console
                await isTextPresentedInConsole(this, `file changed`);
                //7. test inserting file into the element - dunno how to implement this rn
            });

            it('pep-checkbox testing', async function () {
                const ngxLibAddon = new NgxLibComponents(driver);
                await ngxLibAddon.gotoNextTest();
                do {
                    const expectedData = await ngxLibAddon.getExpectedData();
                    const parsedExpectedData: (string | boolean)[] = prepareExpectedData(expectedData);
                    const [value, label, type, alignment, , , renderTitle, visible, mandatory, disabled] =
                        parsedExpectedData;
                    if (visible) {
                        const checkBoxValueBool = await ngxLibAddon.getCheckBoxValue(type as string);
                        expect(checkBoxValueBool).to.equal(value);
                        const checkBoxLabelText = await ngxLibAddon.getCheckBoxLabelText(type as string);
                        expect(label).to.equal(checkBoxLabelText);
                        const isCheckboxShown = await ngxLibAddon.getIfCheckBoxShown(
                            type as string,
                            value as boolean,
                            disabled as boolean,
                        );
                        expect(isCheckboxShown).to.be.true;
                        if (mandatory && renderTitle) {
                            const checkBoxFieldTitle = await ngxLibAddon.getXAligment(ngxLibAddon.checkBoxFieldTitle);
                            expect(checkBoxFieldTitle).to.equal(alignment);
                        }
                        expect(await ngxLibAddon.validateDisabledCheckbox(disabled as boolean)).to.be.true;
                        await testIfElementShown((mandatory && renderTitle) as boolean, ngxLibAddon.pepIconMandatory);
                    }
                    await testIfElementShown(visible as boolean, ngxLibAddon.checkBoxComponent);
                    await ngxLibAddon.changeStyle();
                } while ((await checkIfAlertAlreadyPresented()) !== 'checkbox testing ended');
                await dismissAlert();
                expect(await ngxLibAddon.validateClick(ngxLibAddon.checkBoxComponent)).to.be.true;
            });

            it('pep-color testing', async function () {
                const ngxLibAddon = new NgxLibComponents(driver);
                await ngxLibAddon.gotoNextTest();
                do {
                    await driver.getALLConsoleLogs(); //to clean the log
                    const expectedData = await ngxLibAddon.getExpectedData();
                    const parsedExpectedData: (string | boolean)[] = prepareExpectedData(expectedData);
                    const [value, disabdled, xAlignment, type, showTitle, showAAComplient, expectedColor] =
                        parsedExpectedData; //value dosent work
                    if (!disabdled) {
                        await testIfElementShown(showTitle as boolean, ngxLibAddon.titleLabel);
                        if (showTitle as boolean) {
                            const dateTitle = await ngxLibAddon.getXAligment(ngxLibAddon.titleLabel);
                            expect(dateTitle).to.equal(xAlignment);
                        }
                        let colorValues = await ngxLibAddon.getExpectedAndActualElemColor(
                            0,
                            ngxLibAddon.outterComponentColor,
                            'background-color',
                            expectedColor as string,
                        );
                        expect(colorValues.expected).to.equal(colorValues.true);
                        await ngxLibAddon.getIntoColorDialog();
                        driver.sleep(1000);
                        colorValues = await ngxLibAddon.getExpectedAndActualElemColor(
                            0,
                            ngxLibAddon.currentColor,
                            'background-color',
                            expectedColor as string,
                            (expectedColor as string).includes('/') ? 1 : undefined,
                        );
                        expect(colorValues.expected).to.equal(colorValues.true);
                        await ngxLibAddon.moveSlider(ngxLibAddon.changeHueSlider, 5);
                        await ngxLibAddon.moveSlider(ngxLibAddon.changeSaturationSlider, 5);
                        await ngxLibAddon.moveSlider(ngxLibAddon.changeLightnessSlider, 1);
                        await testIfElementShown(showAAComplient as boolean, ngxLibAddon.AAcomp);
                        if (showAAComplient) {
                            await ngxLibAddon.disableAAComp();
                            await testIfElementShown(!showAAComplient as boolean, ngxLibAddon.AAcomp);
                        }
                        driver.sleep(1100);
                        colorValues = await ngxLibAddon.getExpectedAndActualElemColor(
                            1,
                            ngxLibAddon.currentColor,
                            'background-color',
                            expectedColor as string,
                        );
                        expect(colorValues.expected).to.equal(colorValues.true);
                        await ngxLibAddon.okColorDialog();
                        driver.sleep(1000);
                        await isTextPresentedInConsole(this, 'color changed');
                        driver.sleep(1500);
                        colorValues = await ngxLibAddon.getExpectedAndActualElemColor(
                            1,
                            ngxLibAddon.outterComponentColor,
                            'background-color',
                            expectedColor as string,
                        );
                        expect(colorValues.expected).to.equal(colorValues.true);
                    } else if (disabdled) {
                        await ngxLibAddon.getIntoColorDialog();
                        await testIfElementShown(false, ngxLibAddon.currentColor);
                    }
                    await ngxLibAddon.changeStyle();
                } while ((await checkIfAlertAlreadyPresented()) !== 'color testing ended');
                await dismissAlert();
                const expectedData = await ngxLibAddon.getExpectedData();
                const parsedExpectedData: (string | boolean)[] = prepareExpectedData(expectedData);
                const [value, disabdled, xAlignment, type, showTitle, showAAComplient, expectedColor] =
                    parsedExpectedData; //value dosent work
                const colorValues = await ngxLibAddon.getExpectedAndActualElemColor(
                    1,
                    ngxLibAddon.outterComponentColor,
                    'background-color',
                    expectedColor as string,
                    1,
                );
                expect(colorValues.expected).to.equal(colorValues.true);
            });

            it('pep-date testing', async function () {
                const hardCodedDeafultDate = '01/01/2020'; //this shouldnt be here -- here for now because of a bug in the component
                const ngxLibAddon = new NgxLibComponents(driver);
                await ngxLibAddon.gotoNextTest();
                do {
                    await driver.getALLConsoleLogs(); //to clean the log
                    const expectedData = await ngxLibAddon.getExpectedData();
                    const parsedExpectedData: (string | boolean)[] = prepareExpectedData(expectedData);
                    const [
                        value,
                        label,
                        dateType,
                        isMandatory,
                        disabled,
                        textColor,
                        xAligment,
                        showTitle,
                        renderTitle,
                        renderError,
                        renderSymbol,
                    ] = parsedExpectedData;
                    if (showTitle && (renderTitle as boolean)) {
                        const titleElem = await driver.findElement(ngxLibAddon.titleLabel);
                        expect(await titleElem.getText()).to.equal(label);
                        const dateTitle = await ngxLibAddon.getXAligment(ngxLibAddon.titleLabel);
                        expect(dateTitle).to.equal(xAligment);
                    }
                    await testIfElementShown(
                        (renderSymbol && xAligment !== 'center' && !disabled) as boolean,
                        dateType === 'date' ? ngxLibAddon.pepDateIcon : ngxLibAddon.pepDateTimeIcon,
                    );
                    const dateValue = await driver.findElement(ngxLibAddon.dateValue);
                    const dateValueTitle = await dateValue.getAttribute('title');
                    expect(dateValueTitle).to.include(hardCodedDeafultDate); //this shouldnt be here -- here for now because of a bug in date component
                    if (!disabled) {
                        await driver.getALLConsoleLogs(); //to clean the log
                        const dateValueTitle = await ngxLibAddon.changeDateAndReturnNew(
                            dateType as string,
                            renderSymbol as boolean,
                            xAligment as string,
                        );
                        if (dateType === 'date') {
                            expect('01/08/2020').to.equal(dateValueTitle);
                        } else {
                            expect(hardCodedDeafultDate + ' 1:30 PM').to.equal(dateValueTitle);
                        }
                        await isTextPresentedInConsole(this, 'date changed');
                        await driver.getALLConsoleLogs(); //to clean the log
                        await ngxLibAddon.resetDateToDeafult(dateType as string);
                    } else {
                        await driver.click(ngxLibAddon.pepDate);
                        await testIfElementShown(false, ngxLibAddon.datePicker);
                        await isTextNOTFound(this, 'date changed');
                    }
                    const colorValues = await ngxLibAddon.getExpectedAndActualElemColor(
                        0,
                        ngxLibAddon.dateValue,
                        'color',
                        textColor as string,
                    );
                    expect(colorValues.expected).to.equal(colorValues.true);
                    await testIfElementShown((isMandatory && renderTitle) as boolean, ngxLibAddon.pepIconMandatory);
                    await ngxLibAddon.changeStyle();
                } while ((await checkIfAlertAlreadyPresented()) !== 'date testing ended');
                await dismissAlert();
            });
        });
    });

    async function dismissAlert() {
        await (await driver.switchToAlertElement()).dismiss();
    }

    function prepareExpectedData(expectedData: string[]): (string | boolean)[] {
        const parsedExpectedData: (string | boolean)[] = [];
        expectedData.forEach((element) => {
            element = element.split(':')[1];
            const bool = element === 'true' || element === 'false' ? element === 'true' : undefined;
            parsedExpectedData.push(bool === true || bool === false ? bool : element);
        });
        return parsedExpectedData;
    }

    async function testIfElementShown(isFound: boolean, locator: Locator): Promise<void> {
        let foundElement: WebElement | undefined = undefined;
        try {
            foundElement = await driver.findElement(locator, 3500);
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
