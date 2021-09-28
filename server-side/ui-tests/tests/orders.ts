import { Browser } from '../utilities/browser';
import { describe, it, beforeEach, afterEach } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppLoginPage, WebAppHeader, WebAppHomePage, WebAppList, WebAppTopBar, WebAppDialog } from '../pom/index';
import addContext from 'mochawesome/addContext';
import GeneralService from '../../services/general.service';
import { Key } from 'selenium-webdriver';

chai.use(promised);

export async function OrdersTest(email: string, password: string, generalService: GeneralService) {
    let driver: Browser;

    describe('Orders UI Tests Suit', async function () {
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
            await driver.close();
        });

        it('Order the most expensive three items', async function () {
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
            await webAppDialog.selectDialogBox();

            //Sorting items by price
            const oren: string[][] = await webAppList.getCartListGridlineAsMatrix();
            console.table(oren);
            const sorteByPrice = oren.sort(compareArrayByPriceInDollar);
            console.table(sorteByPrice);

            //Adding most expensive items to cart
            for (let i = 0; i < 3; i++) {
                console.log(Key.ENTER);
                console.log(sorteByPrice[i][1] + Key.ENTER);
                await webAppList.sendKeys(webAppTopBar.SearchFieldInput, sorteByPrice[i][1] + Key.ENTER);
                await webAppList.sendKysToInputListRowWebElement(0, 1);
                await driver.sleep(500);
            }

            await webAppList.click(webAppTopBar.CartViewBtn);
            await webAppList.click(webAppTopBar.CartSumbitBtn);

            debugger;
            throw new Error(`Yoni amar`);
            // console.log(cards);
            // console.table(cards);
            debugger;
            //.header-content .main-layout
            //.ul-advance-search
            //pep-list .table-row-fieldset
            expect(webAppHeader.CompanyLogo.isDisplayed()).eventually.to.be.true;
        });
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
