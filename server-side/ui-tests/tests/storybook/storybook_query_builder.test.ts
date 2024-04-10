import { Browser } from '../../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../../pom';
import { StoryBookPage } from '../../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { QueryBuilder } from '../../pom/Pages/StorybookComponents/QueryBuilder';

chai.use(promised);

export async function StorybookQueryBuilderTests() {
    const queryBuilderInputs = ['maxDepth', 'fields', 'query'];
    const queryBuilderOutputs = ['formValidationChange', 'queryChange'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let queryBuilder: QueryBuilder;
    let queryBuilderInputsTitles;
    let queryBuilderOutputsTitles;

    describe('Storybook "Query Builder" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            queryBuilder = new QueryBuilder(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* QueryBuilder Component * Initial Testing', () => {
            afterEach(async function () {
                await webAppHomePage.collectEndTestData(this);
            });

            it(`Enter Story Book Site & Choose Latest Master Build`, async function () {
                await storyBookPage.navigate();
                await storyBookPage.chooseLatestBuild();
                const base64ImageBuild = await driver.saveScreenshots();
                addContext(this, {
                    title: `Were Running On This Build Of StoryBook`,
                    value: 'data:image/png;base64,' + base64ImageBuild,
                });
            });
            it(`Enter Table Of Contents of Storybook`, async function () {
                await storyBookPage.enterTableOfContents();
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Enter ** QueryBuilder ** Component StoryBook - SCREENSHOT`, async function () {
                await storyBookPage.chooseComponent('query-builder');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** QueryBuilder ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await queryBuilder.doesQueryBuilderComponentFound();
                queryBuilderInputsTitles = await queryBuilder.getInputsTitles();
                console.info('queryBuilderInputsTitles:', JSON.stringify(queryBuilderInputsTitles, null, 2));
                queryBuilderOutputsTitles = await queryBuilder.getOutputsTitles();
                console.info('queryBuilderOutputsTitles:', JSON.stringify(queryBuilderOutputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(queryBuilderInputsTitles).to.eql(queryBuilderInputs);
                expect(queryBuilderOutputsTitles).to.eql(queryBuilderOutputs);
                driver.sleep(5 * 1000);
            });
        });
        queryBuilderInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await queryBuilder.getInputRowSelectorByName(input));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${input}' input`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
                it(`switch to iframe`, async function () {
                    try {
                        await driver.findElement(storyBookPage.StorybookIframe, 5000);
                        await driver.switchTo(storyBookPage.StorybookIframe);
                    } catch (error) {
                        console.error(error);
                        console.info('ALREADY ON IFRAME');
                    }
                });
                it(`open inputs if it's closed`, async function () {
                    const inputsMainTableRowElement = await driver.findElement(queryBuilder.Inputs_mainTableRow);
                    if ((await inputsMainTableRowElement.getAttribute('title')).includes('Show')) {
                        await inputsMainTableRowElement.click();
                    }
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${input}' input`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
                switch (input) {
                    case 'maxDepth':
                        it(`it '${input}'`, async function () {
                            expect(queryBuilderInputsTitles.includes('maxDepth')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'fields':
                        it(`it '${input}'`, async function () {
                            expect(queryBuilderInputsTitles.includes('fields')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'query':
                        it(`it '${input}'`, async function () {
                            expect(queryBuilderInputsTitles.includes('query')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Input: "${input}" is not covered in switch!`);
                    // break;
                }
            });
        });
        queryBuilderOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await queryBuilder.getOutputRowSelectorByName(output));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${output}' output`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
                switch (output) {
                    case 'formValidationChange':
                        it(`it '${output}'`, async function () {
                            expect(queryBuilderOutputsTitles.includes('formValidationChange')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'queryChange':
                        it(`it '${output}'`, async function () {
                            expect(queryBuilderOutputsTitles.includes('queryChange')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Output: "${output}" is not covered in switch!`);
                    // break;
                }
            });
        });
    });
}
