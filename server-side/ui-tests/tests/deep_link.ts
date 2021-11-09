import { Browser } from '../utilities/browser';
import { describe, it, afterEach, beforeEach } from 'mocha';
import { WebAppHomePage, WebAppList, WebAppLoginPage, WebAppTopBar } from '../pom/index';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import { DataViewsService } from '../../services/data-views.service';
import { expect } from 'chai';
import addContext from 'mochawesome/addContext';
import { SelectSmartSearchRange } from '../pom/WebAppList';

export async function DeepLink(email: string, password: string, client: Client) {
    let driver: Browser;

    describe('Deep Link UI Tests Suit', async function () {
        this.retries(0);

        beforeEach(async function () {
            driver = new Browser('chrome');
        });

        afterEach(async function () {
            const webAppLoginPage = new WebAppLoginPage(driver);
            await webAppLoginPage.collectEndTestData(this);
            await driver.close();
        });

        // it('Accounts With Phone SmartSearch', async function () {
        //     const generalService = new GeneralService(client);
        //     const dataViews = new DataViewsService(generalService.papiClient);
        //     const accountsSmartSearchDataView = await dataViews.getDataViews({
        //         where: `Context.Name='AccountSmartSearch'`,
        //     });

        //     expect(accountsSmartSearchDataView[0].Fields?.length).to.be.above(0);

        //     //TODO: Create a way to edit all the data views of accounts and make this test run on new accounts list with smart search
        //     // for (const key in accountsSmartSearchDataView[0].Fields) {
        //     //     if (accountsSmartSearchDataView[0].Fields[key].FieldID == 'Phone') {
        //     //         accountsSmartSearchDataView[0].Fields.splice(Number(key));
        //     //     }
        //     // }
        //     // accountsSmartSearchDataView[0].Fields?.push({
        //     //     FieldID: 'Phone',
        //     //     Type: 'TextBox',
        //     //     Title: 'Phone',
        //     //     Mandatory: false,
        //     //     ReadOnly: false,
        //     //     Layout: {
        //     //         Origin: {
        //     //             X: 0,
        //     //             Y: 0,
        //     //         },
        //     //         Size: {
        //     //             Width: 1,
        //     //             Height: 1,
        //     //         },
        //     //     },
        //     //     Style: {
        //     //         Alignment: {
        //     //             Vertical: 'Center',
        //     //             Horizontal: 'Stretch',
        //     //         },
        //     //     },
        //     // });
        //     // await dataViews.postDataView(accountsSmartSearchDataView[0]);

        //     const webAppLoginPage = new WebAppLoginPage(driver);
        //     await webAppLoginPage.login(email, password);

        //     const webAppHomePage = new WebAppHomePage(driver);
        //     await webAppHomePage.clickOnBtn('Accounts');

        //     const webAppList = new WebAppList(driver);
        //     await webAppList.selectSmartSearchByTitle('Phone');
        //     const smartSearchChackBoxArr = await driver.findElements(webAppList.SmartSearchCheckBoxTitleArr);
        //     const smartSearchOptions: string[] = [];
        //     for (let index = 0; index < smartSearchChackBoxArr.length; index++) {
        //         smartSearchOptions.push(await smartSearchChackBoxArr[index].getText());
        //     }
        //     try {
        //         expect(smartSearchOptions.length).to.be.above(2);
        //     } catch (error) {
        //         // TODO: https://pepperi.atlassian.net/browse/DI-16069 - When this bug will be solved -
        //         // New lists should be created and API might change, so for now this try and catch is a temp patch,
        //         // Patch should be resolved when bug is closed and Chasky Hoffmann will will create new lists.
        //         const base64Image = await driver.saveScreenshots();
        //         addContext(this, {
        //             title: `Image Of Bug (DI-16069)`,
        //             value: 'data:image/png;base64,' + base64Image,
        //         });

        //         addContext(this, {
        //             title: 'Known bug with list showing two options when there is only one',
        //             value: 'https://pepperi.atlassian.net/browse/DI-16069',
        //         });
        //         // throw error;
        //     }

        //     await webAppList.selectSmartSearchByIndex(0);

        //     await driver.click(webAppList.SmartSearchCheckBoxDone);
        //     await webAppHomePage.isSpinnerDone();

        //     const urlBefore = await driver.getCurrentUrl();
        //     const totalItemsBefore = await (await driver.findElement(webAppList.TotalResultsText)).getText();

        //     const base64ImageBefore = await driver.saveScreenshots();
        //     addContext(this, {
        //         title: `Image Before`,
        //         value: 'data:image/png;base64,' + base64ImageBefore,
        //     });

        //     await driver.close();
        //     driver = new Browser('chrome');
        //     const webAppLoginPageAfter = new WebAppLoginPage(driver);
        //     const webAppListAfter = new WebAppList(driver);

        //     try {
        //         await webAppLoginPageAfter.loginDeepLink(urlBefore, email, password);
        //     } catch (error) {
        //         if (
        //             error instanceof Error &&
        //             error.message ==
        //                 'After wait time of: 30000, for selector of [data-qa="orgLogo"], The test must end, The element is not visible'
        //         ) {
        //             const base64ImageNoIcon = await driver.saveScreenshots();
        //             addContext(this, {
        //                 title: `Image NO Icon bug`,
        //                 value: 'data:image/png;base64,' + base64ImageNoIcon,
        //             });
        //         } else {
        //             throw error;
        //         }
        //     }

        //     const urlAfter = await driver.getCurrentUrl();
        //     const totalItemsAfter = await (await driver.findElement(webAppListAfter.TotalResultsText)).getText();

        //     const base64ImageAfter = await driver.saveScreenshots();
        //     addContext(this, {
        //         title: `Image After`,
        //         value: 'data:image/png;base64,' + base64ImageAfter,
        //     });

        //     expect(urlBefore).to.equal(urlAfter);
        //     expect(totalItemsBefore).to.equal(totalItemsAfter);
        // });

        // it('Activities With Grand Total SmartSearch', async function () {
        //     const webAppLoginPage = new WebAppLoginPage(driver);
        //     await webAppLoginPage.login(email, password);

        //     const webAppHomePage = new WebAppHomePage(driver);
        //     await webAppHomePage.clickOnBtn('Activities');

        //     const webAppTopBar = new WebAppTopBar(driver);
        //     await webAppTopBar.selectFromMenuByText(webAppTopBar.ChangeListButton, 'All Sales Transactions');

        //     const webAppList = new WebAppList(driver);
        //     await webAppList.selectSmartSearchByTitle('Grand Total');

        //     await webAppList.selectRange(SelectSmartSearchRange.Between, 1, 100);

        //     await webAppHomePage.isSpinnerDone();

        //     const urlBefore = await driver.getCurrentUrl();
        //     const totalItemsBefore = await (await driver.findElement(webAppList.TotalResultsText)).getText();

        //     const base64ImageBefore = await driver.saveScreenshots();
        //     addContext(this, {
        //         title: `Image Before`,
        //         value: 'data:image/png;base64,' + base64ImageBefore,
        //     });

        //     await driver.close();
        //     driver = new Browser('chrome');
        //     const webAppLoginPageAfter = new WebAppLoginPage(driver);
        //     const webAppListAfter = new WebAppList(driver);

        //     try {
        //         await webAppLoginPageAfter.loginDeepLink(urlBefore, email, password);
        //     } catch (error) {
        //         if (
        //             error instanceof Error &&
        //             error.message ==
        //                 'After wait time of: 30000, for selector of [data-qa="orgLogo"], The test must end, The element is not visible'
        //         ) {
        //             const base64ImageNoIcon = await driver.saveScreenshots();
        //             addContext(this, {
        //                 title: `Image NO Icon bug`,
        //                 value: 'data:image/png;base64,' + base64ImageNoIcon,
        //             });
        //         } else {
        //             throw error;
        //         }
        //     }

        //     const urlAfter = await driver.getCurrentUrl();
        //     const totalItemsAfter = await (await driver.findElement(webAppListAfter.TotalResultsText)).getText();

        //     const base64ImageAfter = await driver.saveScreenshots();
        //     addContext(this, {
        //         title: `Image After`,
        //         value: 'data:image/png;base64,' + base64ImageAfter,
        //     });

        //     expect(urlBefore).to.equal(urlAfter);
        //     expect(totalItemsBefore).to.equal(totalItemsAfter);
        // });

        // it('Contacts With Mobile SmartSearch', async function () {
        //     const webAppLoginPage = new WebAppLoginPage(driver);
        //     await webAppLoginPage.login(email, password);

        //     const webAppHomePage = new WebAppHomePage(driver);
        //     await webAppHomePage.clickOnBtn('Contacts');

        //     const webAppList = new WebAppList(driver);
        //     await webAppList.selectSmartSearchByTitle('Mobile');

        //     await webAppList.selectSmartSearchCheckBoxByTitle('806806');
        //     await driver.click(webAppList.SmartSearchCheckBoxDone);

        //     await webAppHomePage.isSpinnerDone();

        //     const urlBefore = await driver.getCurrentUrl();
        //     const totalItemsBefore = await (await driver.findElement(webAppList.TotalResultsText)).getText();

        //     const base64ImageBefore = await driver.saveScreenshots();
        //     addContext(this, {
        //         title: `Image Before`,
        //         value: 'data:image/png;base64,' + base64ImageBefore,
        //     });

        //     await driver.close();
        //     driver = new Browser('chrome');
        //     const webAppLoginPageAfter = new WebAppLoginPage(driver);
        //     const webAppListAfter = new WebAppList(driver);

        //     try {
        //         await webAppLoginPageAfter.loginDeepLink(urlBefore, email, password);
        //     } catch (error) {
        //         if (
        //             error instanceof Error &&
        //             error.message ==
        //                 'After wait time of: 30000, for selector of [data-qa="orgLogo"], The test must end, The element is not visible'
        //         ) {
        //             const base64ImageNoIcon = await driver.saveScreenshots();
        //             addContext(this, {
        //                 title: `Image NO Icon bug`,
        //                 value: 'data:image/png;base64,' + base64ImageNoIcon,
        //             });
        //         } else {
        //             throw error;
        //         }
        //     }

        //     const urlAfter = await driver.getCurrentUrl();
        //     const totalItemsAfter = await (await driver.findElement(webAppListAfter.TotalResultsText)).getText();

        //     const base64ImageAfter = await driver.saveScreenshots();
        //     addContext(this, {
        //         title: `Image After`,
        //         value: 'data:image/png;base64,' + base64ImageAfter,
        //     });

        //     expect(urlBefore).to.equal(urlAfter);
        //     expect(totalItemsBefore).to.equal(totalItemsAfter);
        // });

        // it('Users With Role Name SmartSearch', async function () {
        //     const webAppLoginPage = new WebAppLoginPage(driver);
        //     await webAppLoginPage.login(email, password);

        //     const webAppHomePage = new WebAppHomePage(driver);
        //     await webAppHomePage.clickOnBtn('Users');

        //     const webAppList = new WebAppList(driver);
        //     await webAppList.selectSmartSearchByTitle('Role Name');

        //     await webAppList.selectSmartSearchCheckBoxByTitle('No Role');
        //     await webAppList.selectSmartSearchCheckBoxByTitle('OneRole');
        //     await driver.click(webAppList.SmartSearchCheckBoxDone);

        //     await webAppHomePage.isSpinnerDone();

        //     const urlBefore = await driver.getCurrentUrl();
        //     const totalItemsBefore = await (await driver.findElement(webAppList.TotalResultsText)).getText();

        //     const base64ImageBefore = await driver.saveScreenshots();
        //     addContext(this, {
        //         title: `Image Before`,
        //         value: 'data:image/png;base64,' + base64ImageBefore,
        //     });

        //     await driver.close();
        //     driver = new Browser('chrome');
        //     const webAppLoginPageAfter = new WebAppLoginPage(driver);
        //     const webAppListAfter = new WebAppList(driver);

        //     try {
        //         await webAppLoginPageAfter.loginDeepLink(urlBefore, email, password);
        //     } catch (error) {
        //         if (
        //             error instanceof Error &&
        //             error.message ==
        //                 'After wait time of: 30000, for selector of [data-qa="orgLogo"], The test must end, The element is not visible'
        //         ) {
        //             const base64ImageNoIcon = await driver.saveScreenshots();
        //             addContext(this, {
        //                 title: `Image NO Icon bug`,
        //                 value: 'data:image/png;base64,' + base64ImageNoIcon,
        //             });
        //         } else {
        //             throw error;
        //         }
        //     }

        //     const urlAfter = await driver.getCurrentUrl();
        //     const totalItemsAfter = await (await driver.findElement(webAppListAfter.TotalResultsText)).getText();

        //     const base64ImageAfter = await driver.saveScreenshots();
        //     addContext(this, {
        //         title: `Image After`,
        //         value: 'data:image/png;base64,' + base64ImageAfter,
        //     });

        //     expect(urlBefore).to.equal(urlAfter);
        //     expect(totalItemsBefore).to.equal(totalItemsAfter);
        // });

        it('Activities With Grand Total SmartSearch From Accounts', async function () {
            const webAppLoginPage = new WebAppLoginPage(driver);
            await webAppLoginPage.login(email, password);

            const base64ImageLogin= await driver.saveScreenshots();
            addContext(this, {
                title: `base64ImageLogin`,
                value: 'data:image/png;base64,' + base64ImageLogin,
            });

            const webAppHomePage = new WebAppHomePage(driver);
            await webAppHomePage.clickOnBtn('Accounts');
            const base64ImageAccoounts = await driver.saveScreenshots();
            addContext(this, {
                title: `base64ImageAccoounts`,
                value: 'data:image/png;base64,' + base64ImageAccoounts,
            });

            await webAppHomePage.isSpinnerDone();

            const webAppList = new WebAppList(driver);
            await webAppList.clickOnLinkFromListRowWebElement(1);
            const Selected = await driver.saveScreenshots();
            addContext(this, {
                title: `Selected`,
                value: 'data:image/png;base64,' + Selected,
            });

            const webAppTopBar = new WebAppTopBar(driver);
            await webAppTopBar.selectFromMenuByText(webAppTopBar.ChangeListButton, 'All Sales Transactions');
            const AllSales = await driver.saveScreenshots();
            addContext(this, {
                title: `AllSales`,
                value: 'data:image/png;base64,' + AllSales,
            });

            await webAppList.selectSmartSearchByTitle('Grand Total');

            await webAppList.selectRange(SelectSmartSearchRange.Between, 1, 100);

            await webAppHomePage.isSpinnerDone();

            const urlBefore = await driver.getCurrentUrl();
            const totalItemsBefore = await (await driver.findElement(webAppList.TotalResultsText)).getText();

            const base64ImageBefore = await driver.saveScreenshots();
            addContext(this, {
                title: `Image Before`,
                value: 'data:image/png;base64,' + base64ImageBefore,
            });

            await driver.close();
            driver = new Browser('chrome');
            const webAppLoginPageAfter = new WebAppLoginPage(driver);
            const webAppListAfter = new WebAppList(driver);

            try {
                await webAppLoginPageAfter.loginDeepLink(urlBefore, email, password);
            } catch (error) {
                if (
                    error instanceof Error &&
                    error.message ==
                        'After wait time of: 30000, for selector of [data-qa="orgLogo"], The test must end, The element is not visible'
                ) {
                    const base64ImageNoIcon = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Image NO Icon bug`,
                        value: 'data:image/png;base64,' + base64ImageNoIcon,
                    });
                } else {
                    throw error;
                }
            }

            const after = await driver.saveScreenshots();
            addContext(this, {
                title: `after`,
                value: 'data:image/png;base64,' + after,
            });

            const urlAfter = await driver.getCurrentUrl();
            const totalItemsAfter = await (await driver.findElement(webAppListAfter.TotalResultsText)).getText();

            const base64ImageAfter = await driver.saveScreenshots();
            addContext(this, {
                title: `Image After`,
                value: 'data:image/png;base64,' + base64ImageAfter,
            });

            expect(urlBefore).to.equal(urlAfter);
            expect(totalItemsBefore).to.equal(totalItemsAfter);
        });
    });
}
