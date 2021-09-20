import tester from '../tester';
// import { ObjectsService } from './../services/objects.service';
// import { DataIndexService } from './../services/data-index.service';
// import GeneralService, { TesterFunctions } from '../services/general.service';
import { Browser /*, ensure*/ } from '../browser';
// import { Builder, ThenableWebDriver, WebElement, By, WebElementPromise, until } from 'selenium-webdriver';
// import { AllPages } from '../pages';

const { describe, expect, it, run } = tester(undefined, 'CLI', 'Stage');

// testEnvironment = client.BaseURL.includes('staging')
// ? 'Sandbox'
// : client.BaseURL.includes('papi-eu')
// ? 'Production-EU'
// : 'Production';
// const { describe, expect, it, run } = tester(client, testName, testEnvironment);

// export async function DataIndexTests(generalService: GeneralService, request, tester: TesterFunctions) {
// const objectsService = new ObjectsService(generalService);
// const dataIndexService = new DataIndexService(generalService);

// const service = new GeneralService(client);

describe('First UI Tests Suit', function () {
    it('Login', async function () {
        const driver = new Browser('chrome');
        await driver.navigate('https://app.pepperi.com/');
        // generalService.sleep(6000)
        debugger;
        //Take Screen Shot
        // // let testCaseName: string = this.currentTest.title;
        // driver.takeScreenshot().then((data) => {
        //     const screenshotPath = `TestResults/Screenshots/${'First UI Tests Suit'}.png`;
        //     console.log(`Saving Screenshot as: ${screenshotPath}`);
        //     // fs.writeFileSync(screenshotPath, data, 'base64');
        // });
        const emailField = await driver.findElement('#email');
        await emailField.click();
        await emailField.sendKeys('This is how simple it is');
        debugger;
        // let pages = new AllPages(new Browser('chrome'));
        expect(true).to.be.true;
    });
});

describe('learning about mocha in parallel (base)', function () {
    it('check properties on object in base', async function () {
        expect(true).to.be.true;
    });

    it('Positive Promise Base', async function () {
        let base;
        await new Promise((resolve) => {
            const intervalInPromiseBase = setInterval(() => {
                clearInterval(intervalInPromiseBase);
                resolve(null);
                console.log('wait 3 seconds in promise base');
                base = true;
            }, 30);
        });
        expect(base).to.be.true;
    });

    it('Negative Promise One', async function () {
        let base;
        await new Promise((resolve) => {
            const intervalInPromiseOne = setInterval(() => {
                clearInterval(intervalInPromiseOne);
                resolve(null);
                console.log('wait 3 seconds in promise one');
                base = false;
            }, 30);
        });
        expect(base).to.be.false;
    });
});

describe('learning about mocha parallel (two)', function () {
    it('Negative Promise Two', async function () {
        let base;
        await new Promise((resolve) => {
            const intervalInPromiseTwo = setInterval(() => {
                clearInterval(intervalInPromiseTwo);
                resolve(null);
                console.log('wait 3 seconds in promise two');
                base = false;
            }, 30);
        });
        expect(base).to.be.false;
    });

    it('Negative Promise Three', async function () {
        let base;
        await new Promise((resolve) => {
            const intervalInPromiseThree = setInterval(() => {
                clearInterval(intervalInPromiseThree);
                resolve(null);
                console.log('wait 2 seconds in promise three');
                base = false;
            }, 20);
        });
        expect(base).to.be.false;
    });

    it('Negative Promise Four', async function () {
        let base;
        await new Promise((resolve) => {
            const intervalInPromiseFour = setInterval(() => {
                clearInterval(intervalInPromiseFour);
                resolve(null);
                console.log('wait 4 seconds in promise four');
                base = false;
            }, 40);
        });
        expect(base).to.be.false;
    });

    it('Positive Promise Five', async function () {
        let base;
        await new Promise((resolve) => {
            const intervalInPromiseFive = setInterval(() => {
                clearInterval(intervalInPromiseFive);
                resolve(null);
                console.log('wait 3 seconds in promise five');
                base = true;
            }, 30);
        });
        expect(base).to.be.true;
    });

    it('Promise All Tests', async function () {
        const f = async () => {
            return {
                InternalID: 0,
                Title: '2',
                Name: '3',
            };
        };

        return Promise.all([
            expect(f()).and.eventually.to.include({
                InternalID: 0,
                Title: '2',
            }),
            expect(f()).and.eventually.to.include({
                InternalID: 0,
                Title: '2',
            }),
            expect(f()).and.eventually.to.include({
                InternalID: 0,
                Title: '2',
            }),
            expect(f()).and.eventually.to.include({
                InternalID: 0,
                Title: '2',
            }),
        ]);
    });

    it('check properties on object', function () {
        const res = [
            {
                InternalID: 0,
                Title: '2',
                Name: '3',
            },
        ];
        return Promise.all([
            expect(res).to.be.an('array').with.lengthOf(1),
            expect(res[0]).to.include({
                InternalID: 0,
                Title: '2',
            }),
        ]);
    });
});

run();
