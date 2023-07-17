import addContext from 'mochawesome/addContext';
import fs from 'fs';
import path from 'path';
import { ConsoleColors } from '../../../services/general.service';
import { Browser } from '../../utilities/browser';

export abstract class BasePomObject {
    public constructor(protected browser: Browser) {}

    /**
     *
     * @param that Should be the "this" of the mocha test, this will help connect data from this function to test reports
     */
    public async collectEndTestData(that): Promise<void> {
        if (that.currentTest.state != 'passed') {
            console.log('%cTest Failed', ConsoleColors.Error);
            await this.addUrlToContext(that);
            await this.addScreenshotsToContext(that);
            // if(overwriteConsoleLogs || !that.currentTest.context.find(x => x.title == 'Console Logs')){
            //Waiting for all the logs to be printed (this usually takes more than 3 seconds)
            this.browser.sleep(6006);
            await this.addConsoleLogsToContext(that);
            // }
        } else if (that.currentTest.state == 'passed') {
            console.log('%cTest Passed', ConsoleColors.Success);
        } else {
            console.log(`%cTest Ended With State: ${that.currentTest.state}`, ConsoleColors.Information);
        }
        return;
    }

    /**
     *
     * @param that Should be the "this" of the mocha test, this will help connect data from this function to test reports
     */
    public async collectEndTestData2(that): Promise<void> {
        if (that.currentTest.state != 'passed') {
            console.log('%cTest Failed', ConsoleColors.Error);
            await this.addUrlToContext(that);
            // if(overwriteConsoleLogs || !that.currentTest.context.find(x => x.title == 'Console Logs')){
            //Waiting for all the logs to be printed (this usually takes more than 3 seconds)
            this.browser.sleep(6006);
            await this.addConsoleLogsToContext(that);
            // }
        } else if (that.currentTest.state == 'passed') {
            console.log('%cTest Passed', ConsoleColors.Success);
        } else {
            console.log(`%cTest Ended With State: ${that.currentTest.state}`, ConsoleColors.Information);
        }
        return;
    }

    public async addConsoleLogsToContext(that) {
        const contextTitle = 'Console Logs';
        const existingLogs: string[] | undefined = that?.currentTest?.context?.find((x) => x.title == contextTitle);
        const consoleLogs: string[] = existingLogs ? existingLogs : [];
        try {
            const logsFromBrowser = await this.browser.getConsoleLogs();
            consoleLogs.push(...logsFromBrowser);
        } catch (error) {
            console.log(`%cError in collectEndTestData getConsoleLogs: ${error}`, ConsoleColors.Error);
            consoleLogs.push('Error In Console Logs');
        }
        addContext(that, {
            title: contextTitle,
            value: consoleLogs,
        });
    }

    public async addUrlToContext(that) {
        let url = 'Error In Getting URL';
        try {
            url = await this.browser.getCurrentUrl();
        } catch (error) {
            console.log(`%cError in collectEndTestData getCurrentUrl: ${error}`, ConsoleColors.Error);
        }
        addContext(that, {
            title: 'URL',
            value: url,
        });
    }

    //TODO: Modify method to add additional screenshots in case 'Image' context already contains an image.
    public async addScreenshotsToContext(that) {
        const imagePath = `${__dirname.split('server-side')[0]}server-side\\api-tests\\test-data\\Error_Image.jpg`;
        const file = fs.readFileSync(path.resolve(imagePath));
        let base64Image = file.toString('base64');
        try {
            base64Image = await this.browser.saveScreenshots();
        } catch (error) {
            console.log(`%cError in collectEndTestData saveScreenshots: ${error}`, ConsoleColors.Error);
        }
        addContext(that, {
            title: `Image`,
            value: 'data:image/png;base64,' + base64Image,
        });
    }
}
