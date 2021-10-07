import { ObjectsService } from './../../services/objects.service';
import { Browser } from '../utilities/browser';
import { describe, it, beforeEach, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import {
    WebAppLoginPage,
    WebAppHeader,
    WebAppHomePage,
    WebAppList,
    WebAppTopBar,
    WebAppDialog,
    WebAppTransaction,
} from '../pom/index';
import addContext from 'mochawesome/addContext';
import GeneralService from '../../services/general.service';
import { Client } from '@pepperi-addons/debug-server';
import { Account, Catalog, Transaction } from '@pepperi-addons/papi-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Key } from 'selenium-webdriver';

chai.use(promised);

export async function OrdersTest(email: string, password: string, client: Client) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);

    let driver: Browser;

    describe('Orders UI Tests Suit (New Browser per test (it) scenarios)', async function () {
        beforeEach(async function () {
            driver = new Browser('chrome');
        });

        afterEach(async function () {
            if (this.currentTest.state != 'passed') {
                const base64Image = await driver.saveScreenshots();
                const url = await driver.getCurrentUrl();
                addContext(this, {
                    title: 'URL',
                    value: url,
                });
                addContext(this, {
                    title: `Image`,
                    value: 'data:image/png;base64,' + base64Image,
                });
            }
            await driver.quit();
        });

        it('Order The Most Expensive Three Items and validate with API', async function () {
            //LogIn
            const webAppLoginPage = new WebAppLoginPage(driver);
            await webAppLoginPage.navigate();
            await webAppLoginPage.signInAs(email, password);
            const webAppHeader = new WebAppHeader(driver);
            await expect(webAppHeader.untilIsVisible(webAppHeader.CompanyLogo, 90000)).eventually.to.be.true;

            //StartOrder
            const webAppHomePage = new WebAppHomePage(driver);
            await webAppHomePage.click(webAppHomePage.Main);

            //Get to Items
            const webAppList = new WebAppList(driver);
            await webAppList.clickOnFromListRowWebElement();
            const webAppTopBar = new WebAppTopBar(driver);
            await webAppTopBar.click(webAppTopBar.DoneBtn);
            await webAppList.click(webAppList.CardListElements);

            //Validating new order
            const webAppDialog = new WebAppDialog(driver);
            await webAppDialog.selectDialogBoxBeforeNewOrder();

            //Sorting items by price
            const oren: string[][] = await webAppList.getCartListGridlineAsMatrix();
            console.table(oren);
            const sorteByPrice = oren.sort(compareArrayByPriceInDollar);
            console.table(sorteByPrice);

            addContext(this, {
                title: `The items from the UI (soreted by price)`,
                value: sorteByPrice,
            });

            const totalPrice =
                Number(sorteByPrice[0][2].substring(1)) +
                Number(sorteByPrice[1][2].substring(1)) +
                Number(sorteByPrice[2][2].substring(1));
            //Adding most expensive items to cart
            for (let i = 0; i < 3; i++) {
                await webAppList.sendKeys(webAppTopBar.SearchFieldInput, sorteByPrice[i][1] + Key.ENTER);
                await webAppList.sendKysToInputListRowWebElement(0, 1);
                const base64Image = await driver.saveScreenshots();
                addContext(this, {
                    title: `Image of order item number: ${i}`,
                    value: 'data:image/png;base64,' + base64Image,
                });
                driver.sleep(500);
            }

            await webAppList.click(webAppTopBar.CartViewBtn);
            await webAppList.click(webAppTopBar.CartSumbitBtn);

            //Wait 5 seconds and validate there are no dialogs opening up after placing order
            //Exmaple on how to write test over a known bug - let the test pass but add information to the report
            try {
                await expect(driver.findElement(webAppDialog.Title, 5000, 2)).eventually.to.be.rejectedWith(
                    'After few retires the maxAttmpts of: 2, Riched: 0',
                );
            } catch (error) {
                const base64Image = await driver.saveScreenshots();
                addContext(this, {
                    title: `This bug happen some time, don't stop the test here, but add this as image(DI-OREN123)`,
                    value: 'https://pepperi.atlassian.net/browse/DI-17083',
                });
                addContext(this, {
                    title: `This bug happen some time, don't stop the test here, but add this as image(DI-OREN123)`,
                    value: 'data:image/png;base64,' + base64Image,
                });

                //Remove this dialog box and continue the test
                await webAppDialog.selectDialogBox('Close');
                driver.sleep(400);
                const base64Image2 = await driver.saveScreenshots();
                addContext(this, {
                    title: `Closed the dialog box`,
                    value: 'data:image/png;base64,' + base64Image2,
                });
            }

            //Validating transaction created via the API
            const lastTransaction = await objectsService.getTransaction({ order_by: 'ModificationDateTime DESC' });
            const lastTransactionLines = await objectsService.getTransactionLines({
                where: `Transaction.InternalID=${lastTransaction[0].InternalID}`,
            });

            addContext(this, {
                title: `Last transaction lines total price from API`,
                value: lastTransaction[0].GrandTotal,
            });

            expect(lastTransaction[0].GrandTotal).to.equal(totalPrice);

            //Adding information that is probably important to the test report
            Object.keys(lastTransactionLines[0]).forEach(
                (key) => lastTransactionLines[0][key] == null && delete lastTransactionLines[0][key],
            );
            Object.keys(lastTransactionLines[1]).forEach(
                (key) => lastTransactionLines[1][key] == null && delete lastTransactionLines[1][key],
            );
            Object.keys(lastTransactionLines[2]).forEach(
                (key) => lastTransactionLines[2][key] == null && delete lastTransactionLines[2][key],
            );

            addContext(this, {
                title: `Last transaction lines from API`,
                value: lastTransactionLines,
            });

            //Validating what are the 3 most expensive items via the API are the same as from the UI and ending the tests
            const threeMostExpnsiveItems = await objectsService.getItems({ page_size: 3, order_by: 'Price DESC' });
            const PriceOfMostExpensiveItems = threeMostExpnsiveItems.reduce(
                (total, item) => total + Number(item.Price),
                0,
            );

            expect(PriceOfMostExpensiveItems).to.equal(totalPrice);
            await expect(webAppHeader.untilIsVisible(webAppHeader.CompanyLogo)).eventually.to.be.true;
        });
    });

    describe('Orders UI Tests Suit (One browser per suite (describe) scenarios)', async function () {
        let accountId;
        let catalogId;
        let activityTypeId;
        let transactionId;
        let transactionUUID;
        before(async function () {
            driver = new Browser('chrome');
        });

        after(async function () {
            await driver.quit();
        });

        afterEach(async function () {
            if (this.currentTest.state != 'passed') {
                const base64Image = await driver.saveScreenshots();
                const url = await driver.getCurrentUrl();
                addContext(this, {
                    title: 'URL',
                    value: url,
                });
                addContext(this, {
                    title: `Image`,
                    value: 'data:image/png;base64,' + base64Image,
                });
            }
        });

        it('Create WebApp Seasion', async function () {
            const webAppLoginPage = new WebAppLoginPage(driver);
            await webAppLoginPage.navigate();
            await webAppLoginPage.signInAs(email, password);
            const webAppHeader = new WebAppHeader(driver);
            await expect(webAppHeader.untilIsVisible(webAppHeader.CompanyLogo, 90000)).eventually.to.be.true;
        });

        it('Create Account And Get Catalog', async function () {
            const newAccount: Account = await objectsService.createAccount({
                ExternalID: 'Account for orders scenarios',
                Discount: 0,
            });
            accountId = newAccount.InternalID;

            const catalogsArr: Catalog[] = await objectsService.getCatalogs({ page_size: 1 });
            catalogId = catalogsArr[0].InternalID;

            const transactionArr: Transaction[] = await objectsService.getTransaction({
                where: `Type LIKE '%Sales Order%'`,
                page_size: 1,
            });
            activityTypeId = transactionArr[0].ActivityTypeID as number;
        });

        const testDataDiscountPercentage = [0, 5, 10, 20, 50, 75, 100, 200];
        for (let index = 0; index < testDataDiscountPercentage.length; index++) {
            const discount = testDataDiscountPercentage[index];
            describe(`${discount}% Discount Suit`, async function () {
                it(`Create Transaction With API With ${discount}% Discount`, async function () {
                    const testDataTransaction: Transaction = await objectsService.createTransaction({
                        ActivityTypeID: activityTypeId,
                        UUID: uuidv4(),
                        Status: 1,
                        DiscountPercentage: discount,
                        Account: {
                            Data: {
                                InternalID: accountId,
                            },
                        },
                        Catalog: {
                            Data: {
                                InternalID: catalogId,
                            },
                        },
                    });
                    transactionId = testDataTransaction.InternalID;
                    transactionUUID = testDataTransaction.UUID;
                });

                it(`Order The Most Expensive Three Items And Validate ${discount}% Discount`, async function () {
                    const webAppLoginPage = new WebAppTransaction(driver, transactionUUID);
                    await webAppLoginPage.navigate();

                    //Sorting items by price
                    const webAppList = new WebAppList(driver);
                    const oren: string[][] = await webAppList.getCartListGridlineAsMatrix();
                    console.table(oren);
                    const sorteByPrice = oren.sort(compareArrayByPriceInDollar);
                    console.table(sorteByPrice);

                    addContext(this, {
                        title: `The items from the UI (soreted by price)`,
                        value: sorteByPrice,
                    });

                    const totalPrice =
                        Number(sorteByPrice[0][2].substring(1)) +
                        Number(sorteByPrice[1][2].substring(1)) +
                        Number(sorteByPrice[2][2].substring(1));
                    //Adding most expensive items to cart
                    const webAppTopBar = new WebAppTopBar(driver);
                    for (let i = 0; i < 3; i++) {
                        await webAppList.sendKeys(webAppTopBar.SearchFieldInput, sorteByPrice[i][1] + Key.ENTER);
                        await webAppList.sendKysToInputListRowWebElement(0, 1);
                    }

                    await webAppList.click(webAppTopBar.CartViewBtn);
                    await webAppList.click(webAppTopBar.CartSumbitBtn);

                    //Wait 5 seconds and validate there are no dialogs opening up after placing order
                    //Exmaple on how to write test over a known bug - let the test pass but add information to the report
                    const webAppDialog = new WebAppDialog(driver);
                    try {
                        await expect(driver.findElement(webAppDialog.Title, 5000, 2)).eventually.to.be.rejectedWith(
                            'After few retires the maxAttmpts of: 2, Riched: 0',
                        );
                    } catch (error) {
                        const base64Image = await driver.saveScreenshots();
                        addContext(this, {
                            title: `This bug happen some time, don't stop the test here, but add this as image(DI-OREN123)`,
                            value: 'https://pepperi.atlassian.net/browse/DI-17083',
                        });
                        addContext(this, {
                            title: `This bug happen some time, don't stop the test here, but add this as image(DI-OREN123)`,
                            value: 'data:image/png;base64,' + base64Image,
                        });

                        //Remove this dialog box and continue the test
                        await webAppDialog.selectDialogBox('Close');
                        driver.sleep(400);
                        const base64Image2 = await driver.saveScreenshots();
                        addContext(this, {
                            title: `Closed the dialog box`,
                            value: 'data:image/png;base64,' + base64Image2,
                        });
                    }

                    //Validating transaction created via the API
                    const lastTransaction = await objectsService.getTransaction({
                        order_by: 'ModificationDateTime DESC',
                    });

                    addContext(this, {
                        title: `Last transaction lines total price from API`,
                        value: lastTransaction[0].GrandTotal,
                    });

                    //Validating price after discount
                    expect(Number(lastTransaction[0].GrandTotal).toFixed(4)).to.equal(
                        (totalPrice - (totalPrice / 100) * discount).toFixed(4),
                    );

                    //Validating what are the 3 most expensive items via the API are the same as from the UI and ending the tests
                    const threeMostExpnsiveItems = await objectsService.getItems({
                        page_size: 3,
                        order_by: 'Price DESC',
                    });
                    const PriceOfMostExpensiveItems = threeMostExpnsiveItems.reduce(
                        (total, item) => total + Number(item.Price),
                        0,
                    );

                    //Validate the correct price of the items from the API and end the test
                    expect(PriceOfMostExpensiveItems).to.equal(totalPrice);

                    const webAppHeader = new WebAppHeader(driver);
                    await expect(webAppHeader.untilIsVisible(webAppHeader.CompanyLogo)).eventually.to.be.true;
                });

                it('Delete Transaction', async function () {
                    const testDataTransaction = await objectsService.deleteTransaction(transactionId);
                    expect(testDataTransaction).to.be.true;
                });
            });
        }
    });
}

const compareArrayByPriceInDollar = (a, b) => {
    for (let i = 0; i < a.length; i++) {
        if (!a[i].includes('$')) {
            continue;
        }
        const priceA = Number(a[i].substring(1));
        const priceB = Number(b[i].substring(1));
        if (priceA > priceB) {
            return -1;
        } else if (priceA < priceB) {
            return 1;
        }
    }
    return 0;
};
