import { AddonVersion, InstalledAddon } from '@pepperi-addons/papi-sdk';
import GeneralService, { TesterFunctions } from '../services/general.service';
import fetch from 'node-fetch';

export interface TestDataBody {
    ApiData: {
        maintenanceData: {
            MaintenanceWindow: string;
            AutomaticUpgradeAfter: string;
            ['AutomaticUpgradeAfterX%']: any;
        };
        installedAddons: [];
        installedAddonsVersions: [];
        systemAddonsToInstall: [];
        systemAddonsPhasedVersions: [];
    };
    InitiateDistributor: boolean;
}

export interface TestExecutionData {
    testDate?: Date;
    setUpgradePercent?: number;
    setTotalAddons?: number;
    setVersionsPerAddon?: number;
    changePhasedGroupVersionDays?: number;
}

//#region Prerequisites for Addons API Tests
//TestData

//#region Test Config area
const testConfigObj = {
    isOnlineServer: true, //Run on the online server
    isAddonsAPI: false, //Addons API
    isAddonsWithDependenciesAPI: false, //Addons Dependencies API
    //isMaintenanceConsole: false, //Maintenance Console Table Print - can only work on browsers not on the server.
    isMaintenanceSingle: false, //Maintenance Single
    isMaintenanceUpgrade: false, //Maintenance Upgrade Distribution
    isMaintenanceInstall: false, //Maintenance Install Distribution
    isMaintenanceFull: false, //Maintenance Full Distribution
};

function testDataNewAddon(testNumber) {
    return { Name: 'Test ' + testNumber };
}

function testDataNewAddonVersion(addonUUID, testNumber) {
    return {
        AddonUUID: addonUUID,
        Version: 'Version Test ' + testNumber,
    };
}

//This was never used
// function testDataNewAddonVersionBulk(addonUUID, testNumberArr) {
//     for (let index = 0; index < testNumberArr.length; index++) {
//         return [
//             {
//                 AddonUUID: addonUUID,
//                 Version: 'Version Test ' + testNumberArr[index],
//             },
//         ];
//     }
// }

function createRandomUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

//Prerequisites for test
let testDate = new Date();
//const isCallBackArr = [] as any;

function addInstalledAddonTestObject(testDataBody, installedVersionName) {
    //installedAddons
    testDataBody.ApiData.installedAddons.push({
        SystemData: '{"Version":"5.5.8","AutomaticUpgrade":"true"}',
        UUID: createRandomUUID(),
        Version: installedVersionName,
        Addon: { UUID: createRandomUUID() },
    } as InstalledAddon);
}

function addInstalledAddonVersionsTestObject(testDataBody, installedAddons, newVersionName, newVersionDate) {
    //installedAddonsVersions
    testDataBody.ApiData.installedAddonsVersions.push({
        AddonUUID: installedAddons.Addon.UUID,
        Available: true,
        Phased: newVersionName == 'ver2' || newVersionName == 'ver4' ? false : true,
        //Hidden: false,
        Version: newVersionName,
        CreationDateTime: newVersionDate.toISOString(),
        StartPhasedDateTime: newVersionDate.toISOString(),
        //ModificationDateTime: testDate.toISOString(),
        UUID: createRandomUUID(),
        Addon: { UUID: installedAddons.Addon.UUID },
    } as AddonVersion);
}

function addSystemAddonsToInstallTestObject(testDataBody) {
    //installedAddons
    testDataBody.ApiData.systemAddonsToInstall.push({
        UUID: createRandomUUID(),
    } as InstalledAddon);
}

function addSystemAddonsPhasedVersionsTestObject(testDataBody, installedAddons, newVersionName, newVersionDate) {
    //installedAddonsVersions
    testDataBody.ApiData.systemAddonsPhasedVersions.push({
        AddonUUID: installedAddons.UUID,
        Available: true,
        Phased: true,
        //Hidden: false,
        Version: newVersionName,
        CreationDateTime: newVersionDate.toISOString(),
        StartPhasedDateTime: newVersionDate.toISOString(),
        //ModificationDateTime: testDate.toISOString(),
        UUID: createRandomUUID(),
        Addon: { UUID: installedAddons.UUID },
    } as AddonVersion);
}

function createNewMaintenanceTestDataObject(upgradeAfterDate, upgradeAfterPercent, addonsAmount, versionsAmount) {
    //Prerequisites for test
    testDate = new Date();
    const testDataBody: TestDataBody = {
        ApiData: {
            maintenanceData: {
                MaintenanceWindow: '01:00:00.0000000', //This part does nothing
                AutomaticUpgradeAfter: upgradeAfterDate,
                ['AutomaticUpgradeAfterX%']: upgradeAfterPercent,
            },
            installedAddons: [],
            installedAddonsVersions: [],
            systemAddonsToInstall: [],
            systemAddonsPhasedVersions: [],
        },
        InitiateDistributor: false,
    };

    //installedAddons
    for (let index = 0; index < addonsAmount; index++) {
        addInstalledAddonTestObject(testDataBody, 'ver1');
    }

    //installedAddonsVersions
    for (let j = 0; j < testDataBody.ApiData.installedAddons.length; j++) {
        for (let index = 0; index < versionsAmount; index++) {
            addInstalledAddonVersionsTestObject(
                testDataBody,
                testDataBody.ApiData.installedAddons[j],
                `ver${index + 1}`,
                new Date(testDate.getTime() - 1000 * 1 - index),
            );
        }
        testDate = new Date(testDate.getTime() - 1000 * 1 - 1);
    }

    //systemAddonsToInstall
    for (let index = 0; index < addonsAmount; index++) {
        addSystemAddonsToInstallTestObject(testDataBody);
    }

    //systemAddonsPhasedVersions
    for (let j = 0; j < testDataBody.ApiData.systemAddonsToInstall.length; j++) {
        for (let index = 0; index < versionsAmount; index++) {
            addSystemAddonsPhasedVersionsTestObject(
                testDataBody,
                testDataBody.ApiData.systemAddonsToInstall[j],
                `ver${index + 2}`,
                new Date(testDate.getTime() - 1000 * 1 - index),
            );
        }
        testDate = new Date(testDate.getTime() - 1000 * 1 - 1);
    }
    return testDataBody;
}

//#endregion Prerequisites for Addons API Tests

// All Addons API Tests
export async function BaseAddonsTests(generalService: GeneralService, request, tester: TesterFunctions) {
    (testConfigObj.isAddonsAPI = true), //Addons API
        (testConfigObj.isAddonsWithDependenciesAPI = false), //true, //Addons Dependencies API
        (testConfigObj.isMaintenanceSingle = false), //Maintenance Single
        (testConfigObj.isMaintenanceUpgrade = false), //Maintenance Upgrade Distribution
        (testConfigObj.isMaintenanceInstall = false), //Maintenance Install Distribution
        (testConfigObj.isMaintenanceFull = false), //Maintenance Full Distribution
        await ExecuteAddonsTests(generalService, request, tester);
}

export async function SingleMaintenanceAndDependenciesAddonsTests(
    generalService: GeneralService,
    request,
    tester: TesterFunctions,
) {
    (testConfigObj.isAddonsAPI = false), //Addons API
        (testConfigObj.isAddonsWithDependenciesAPI = true), //true, //Addons Dependencies API
        (testConfigObj.isMaintenanceSingle = true), //Maintenance Single
        (testConfigObj.isMaintenanceUpgrade = false), //Maintenance Upgrade Distribution
        (testConfigObj.isMaintenanceInstall = false), //Maintenance Install Distribution
        (testConfigObj.isMaintenanceFull = false), //Maintenance Full Distribution
        await ExecuteAddonsTests(generalService, request, tester);
}

export async function MaintenanceFullTests(generalService: GeneralService, request, tester: TesterFunctions) {
    (testConfigObj.isAddonsAPI = false), //Addons API
        (testConfigObj.isAddonsWithDependenciesAPI = false), //true, //Addons Dependencies API
        (testConfigObj.isMaintenanceSingle = false), //Maintenance Single
        (testConfigObj.isMaintenanceUpgrade = true), //Maintenance Upgrade Distribution
        (testConfigObj.isMaintenanceInstall = true), //Maintenance Install Distribution
        (testConfigObj.isMaintenanceFull = true), //Maintenance Full Distribution
        await ExecuteAddonsTests(generalService, request, tester);
}

export async function ExecuteAddonsTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    const setNewTestHeadline = tester.setNewTestHeadline;
    const addTestResultUnderHeadline = tester.addTestResultUnderHeadline;
    const printTestResults = tester.printTestResults;

    console.log('Initiate Addons Tests | ' + generalService.getTime());

    if (!generalService.getClientData('Server').includes('sandbox')) {
        throw new Error(`Test can't run on: ${generalService.getClientData('Server')}`);
    }

    //Interval
    let intervalCounter = 0;

    //make sure all tests are finished before printing results
    const waitForAllTestsResults = await setInterval(() => {
        if (intervalCounter < 1) {
            clearInterval(waitForAllTestsResults);
            intervalCounter--;
        }
    }, 100);

    //Install
    const installAddonWithoutVersionFiles = 'Install addon without version files (Negative)';
    setNewTestHeadline(installAddonWithoutVersionFiles);

    const installAddonwithoutExistingVersion = 'Install addon without existing version – Version 4 (Negative)';
    setNewTestHeadline(installAddonwithoutExistingVersion);

    const installAddonWithNonAvailableVersion = 'Install addon with non available version - Version 3 (Negative)';
    setNewTestHeadline(installAddonWithNonAvailableVersion);

    const installNewestAddonWithoutVersion = 'Install newest addon without version - Version 2';
    setNewTestHeadline(installNewestAddonWithoutVersion);

    const installAddonWithVersion = 'Install addon with first version - Version 1';
    setNewTestHeadline(installAddonWithVersion);

    //Upgrade
    const upgradeAddonWithoutNewVersionFiles = 'Upgrade addon without new version files - Deleted version 2 (Negative)';
    setNewTestHeadline(upgradeAddonWithoutNewVersionFiles);

    const upgradeAddonwithoutExistingVersion = 'Upgrade addon without existing version – Version 4 (Negative)';
    setNewTestHeadline(upgradeAddonwithoutExistingVersion);

    const upgradeAddonWithNonAvailableVersion = 'Upgrade addon with non available version - Version 3 (Negative)';
    setNewTestHeadline(upgradeAddonWithNonAvailableVersion);

    const upgradeToNewestAddonVersion = 'Upgrade to newest addon version - Version 2';
    setNewTestHeadline(upgradeToNewestAddonVersion);

    const upgradeToNewestAddonVersionWithoutVersion = 'Upgrade to newest addon version without version - Version 2';
    setNewTestHeadline(upgradeToNewestAddonVersionWithoutVersion);

    const upgradeToNewestAddonVersionWithoutAvailableVersion =
        'Upgrade to newest addon version without available version (Negative)';
    setNewTestHeadline(upgradeToNewestAddonVersionWithoutAvailableVersion);

    const upgradeToNewestAddonVersionWithoutPhasedVersion =
        'Upgrade to newest addon version without phased version (Negative)';
    setNewTestHeadline(upgradeToNewestAddonVersionWithoutPhasedVersion);

    const upgradeAddonWithOldVersion = 'Upgrade addon with first version - Version 1 (Negative)';
    setNewTestHeadline(upgradeAddonWithOldVersion);

    //Downgrade
    const downgradeAddonWithoutOldVersionFiles =
        'Downgrade addon without old version files - Deleted version 2 (Negative)';
    setNewTestHeadline(downgradeAddonWithoutOldVersionFiles);

    const downgradeAddonwithoutExistingVersion = 'Downgrade addon without existing version – Version 4 (Negative)';
    setNewTestHeadline(downgradeAddonwithoutExistingVersion);

    const downgradeAddonWithNonAvailableVersion = 'Downgrade addon with non available version - Version 3 (Negative)';
    setNewTestHeadline(downgradeAddonWithNonAvailableVersion);

    const downgradeToOldestAddonVersion = 'Downgrade to oldest addon version - Version 1';
    setNewTestHeadline(downgradeToOldestAddonVersion);

    const downgradeAddonWithNewVersion = 'Downgrade addon with second version - Version 2 (Negative)';
    setNewTestHeadline(downgradeAddonWithNewVersion);

    //Uninstall
    const uninstallAddon = 'Uninstall addon';
    setNewTestHeadline(uninstallAddon);

    const uninstallAddonWithDeletedVersion = 'Uninstall With deleted addon version';
    setNewTestHeadline(uninstallAddonWithDeletedVersion);

    const uninstallAddonWithDeletedAddon = 'Uninstall with deleted addon';
    setNewTestHeadline(uninstallAddonWithDeletedAddon);

    const uninstallAddonAndUpgrade = 'Upgrade Uninstalled addon (Negative)';
    setNewTestHeadline(uninstallAddonAndUpgrade);

    const uninstallAddonAndDowngrade = 'Downgrade Uninstalled addon (Negative)';
    setNewTestHeadline(uninstallAddonAndDowngrade);

    //Dependencies
    const installAddonWithDependencies = 'Install addon with Dependencies';
    setNewTestHeadline(installAddonWithDependencies);

    const upgradeAddonWithDependencies = 'Upgrade addon with Dependencies';
    setNewTestHeadline(upgradeAddonWithDependencies);

    const downgradeAddonWithDependencies = 'Downgrade addon with Dependencies';
    setNewTestHeadline(downgradeAddonWithDependencies);

    const installAddonWithDependenciesTahatIsNotInstalled = 'Install addon with Dependencies That is not Installed';
    setNewTestHeadline(installAddonWithDependenciesTahatIsNotInstalled);

    const installAddonWithDependenciesNegative = 'Install addon with Dependencies (Negative)';
    setNewTestHeadline(installAddonWithDependenciesNegative);

    const upgradeAddonWithDependenciesNegative = 'Upgrade addon with Dependencies (Negative)';
    setNewTestHeadline(upgradeAddonWithDependenciesNegative);

    const downgradeAddonWithDependenciesNegative = 'Downgrade addon with Dependencies (Negative)';
    setNewTestHeadline(downgradeAddonWithDependenciesNegative);

    const installAddonWithDependenciesTahatIsNotInstalledNegative =
        'Install addon with Dependencies That is not Installed (Negative)';
    setNewTestHeadline(installAddonWithDependenciesTahatIsNotInstalledNegative);

    const installAddonWithDependenciesTahatIsNotInstalledAndNotExistNegative =
        'Install addon with Dependencies That is not Installed And Not Exist (Negative)';
    setNewTestHeadline(installAddonWithDependenciesTahatIsNotInstalledAndNotExistNegative);

    //Phased maintenance
    const phasedMaintenanceOnlyAllowed = 'Phased Maintenance Only Upgrade Available Phased and StartPhasedDateTime';
    setNewTestHeadline(phasedMaintenanceOnlyAllowed);

    const phasedMaintenanceOfOlderVersions21DaysHappensNow =
        'Phased Maintenance Of Older Versions (-21 days) Happens Now';
    setNewTestHeadline(phasedMaintenanceOfOlderVersions21DaysHappensNow);

    const phasedMaintenanceOfOlderVersions14DaysHappensNow =
        'Phased Maintenance Of Older Versions (-14 days) Happens Now';
    setNewTestHeadline(phasedMaintenanceOfOlderVersions14DaysHappensNow);

    const phasedMaintenanceOfOlderVersions7DaysHappensNow =
        'Phased Maintenance Of Older Versions (-7 days) Happens Now';
    setNewTestHeadline(phasedMaintenanceOfOlderVersions7DaysHappensNow);

    const phasedMaintenanceUpgradeStartDateIn7Days = 'Phased Maintenance Upgrade Start Date (+7 days)';
    setNewTestHeadline(phasedMaintenanceUpgradeStartDateIn7Days);

    const phasedMaintenanceUpgradeStartDateIn14Days = 'Phased Maintenance Upgrade Start Date (+14 days)';
    setNewTestHeadline(phasedMaintenanceUpgradeStartDateIn14Days);

    const phasedMaintenanceUpgradeStartDateIn20Days = 'Phased Maintenance Upgrade Start Date (+20 days)';
    setNewTestHeadline(phasedMaintenanceUpgradeStartDateIn20Days);

    const phasedMaintenanceUpgradeStartDateIn21Days = 'Phased Maintenance Upgrade Start Date (+21 days)';
    setNewTestHeadline(phasedMaintenanceUpgradeStartDateIn21Days);

    const phasedMaintenanceInstallStartDateIn7Days = 'Phased Maintenance Install Start Date (+7 days)';
    setNewTestHeadline(phasedMaintenanceInstallStartDateIn7Days);

    const phasedMaintenanceInstallStartDateIn14Days = 'Phased Maintenance Install Start Date (+14 days)';
    setNewTestHeadline(phasedMaintenanceInstallStartDateIn14Days);

    const phasedMaintenanceInstallStartDateIn20Days = 'Phased Maintenance Install Start Date (+20 days)';
    setNewTestHeadline(phasedMaintenanceInstallStartDateIn20Days);

    const phasedMaintenanceInstallStartDateIn21Days = 'Phased Maintenance Install Start Date (+21 days)';
    setNewTestHeadline(phasedMaintenanceInstallStartDateIn21Days);

    const upgradePhasedMaintenanceDistribution = 'Upgrade Phased Maintenance Distribution';
    setNewTestHeadline(upgradePhasedMaintenanceDistribution);

    const installPhasedMaintenanceDistribution = 'Install Phased Maintenance Distribution';
    setNewTestHeadline(installPhasedMaintenanceDistribution);

    const fullPhasedMaintenanceDistribution = 'Full Phased Maintenance Distribution';
    setNewTestHeadline(fullPhasedMaintenanceDistribution);

    const phasedMaintenanceOfOlderVersions14DaysHappensNowNegative =
        'Phased Maintenance Of Older Versions (-14 days) (AutomaticUpgrade = false) (Negative)';
    setNewTestHeadline(phasedMaintenanceOfOlderVersions14DaysHappensNowNegative);

    const phasedMaintenanceUpgradeStartDateIn14DaysNegative =
        'Phased Maintenance Upgrade Start Date (+14 days) (AutomaticUpgrade = false) (Negative)';
    setNewTestHeadline(phasedMaintenanceUpgradeStartDateIn14DaysNegative);

    const fullPhasedMaintenanceDistributionNegative =
        'Full Phased Maintenance Distribution (AutomaticUpgrade = false) (Negative)';
    setNewTestHeadline(fullPhasedMaintenanceDistributionNegative);

    if (testConfigObj.isAddonsAPI) {
        //Install
        await executeInstallAddonWithoutVersionFilesTest(
            installAddonWithoutVersionFiles,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeInstallAddonWithoutExistingVersionTest(
            installAddonwithoutExistingVersion,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeInstallAddonWithNonAvailableVersionTest(
            installAddonWithNonAvailableVersion,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeInstallNewestAddonWithoutVersionTest(
            installNewestAddonWithoutVersion,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeInstallAddonWithVersionTest(
            installAddonWithVersion,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        //Upgrade
        await executeUpgradeAddonWithoutNewVersionFilesTest(
            upgradeAddonWithoutNewVersionFiles,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeUpgradeAddonWithoutExistingVersionTest(
            upgradeAddonwithoutExistingVersion,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeUpgradeAddonWithNonAvailableVersionTest(
            upgradeAddonWithNonAvailableVersion,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeUpgradeToNewestAddonVersionTest(
            upgradeToNewestAddonVersion,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeUpgradeToNewestAddonVersionWithoutVersionTest(
            upgradeToNewestAddonVersionWithoutVersion,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeUpgradeToNewestAddonVersionWithoutAvailableVersionTest(
            upgradeToNewestAddonVersionWithoutAvailableVersion,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeUpgradeToNewestAddonVersionWithoutPhasedVersionTest(
            upgradeToNewestAddonVersionWithoutPhasedVersion,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeUpgradeAddonWithOldVersionTest(
            upgradeAddonWithOldVersion,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        //Downgrade
        await executeDowngradeAddonWithoutOldVersionFilesTest(
            downgradeAddonWithoutOldVersionFiles,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeDowngradeAddonWithoutExistingVersionTest(
            downgradeAddonwithoutExistingVersion,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeDowngradeAddonWithNonAvailableVersionTest(
            downgradeAddonWithNonAvailableVersion,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeDowngradeToOldestAddonVersionTest(
            downgradeToOldestAddonVersion,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeDowngradeAddonWithNewVersionTest(
            downgradeAddonWithNewVersion,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        //Uninstall
        await executeUninstallAddonTest(
            uninstallAddon,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeUninstallAddonWithDeletedVersionTest(
            uninstallAddonWithDeletedVersion,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeUninstallAddonWithDeletedAddonTest(
            uninstallAddonWithDeletedAddon,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeUninstallAddonAndUpgradeTest(
            uninstallAddonAndUpgrade,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeUninstallAddonAndDowngradeTest(
            uninstallAddonAndDowngrade,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );
    }

    if (testConfigObj.isAddonsWithDependenciesAPI) {
        await executeDependenciesInstallTest(
            installAddonWithDependencies,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeDependenciesUpgradeTest(
            upgradeAddonWithDependencies,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeDependenciesDowngradeTest(
            downgradeAddonWithDependencies,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeDependenciesInstallWithDependencyInstallationTest(
            installAddonWithDependenciesTahatIsNotInstalled,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeDependenciesInstallTest(
            installAddonWithDependenciesNegative,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeDependenciesUpgradeTest(
            upgradeAddonWithDependenciesNegative,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeDependenciesDowngradeTest(
            downgradeAddonWithDependenciesNegative,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeDependenciesInstallWithDependencyInstallationTest(
            installAddonWithDependenciesTahatIsNotInstalledNegative,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );

        await executeDependenciesInstallWithDependencyInstallationTest(
            installAddonWithDependenciesTahatIsNotInstalledAndNotExistNegative,
            testDataNewAddon(Math.floor(Math.random() * 1000000).toString()),
        );
    }

    //#region Prerequisites Phased Maintenance
    let testExecutionData: TestExecutionData = {};

    //Set Date AutomaticUpgradeAfter
    testExecutionData.testDate = new Date(testDate.getTime() + 0);

    //Set Date AutomaticUpgradeAfterX%
    testExecutionData.setUpgradePercent = 0;

    //Create Test Data Object
    testExecutionData.setTotalAddons = 104;
    testExecutionData.setVersionsPerAddon = 4;
    testExecutionData.changePhasedGroupVersionDays = 0;
    //#endregion Prerequisites Phased Maintenance

    //#region Phased maintenance table tests
    // if (testConfigObj.isMaintenanceConsole) {
    //     //This test will print a big table in the console and will take long time
    //     //This test can only be executed on the real server, not locally
    //     const testTempObjectConsoleTable = Object.assign({}, testExecutionData);
    //     await executePhasedMaintenanceTestWithTable(testTempObjectConsoleTable, true);
    //     ////executePhasedMaintenanceTestWithTable(testTempObjectConsoleTable, true testConfigArr[isOnlineServer]); //Can't be executed locally
    // }
    //#endregion Phased maintenance table tests

    //#region Phased maintenance single maintenance executions

    if (testConfigObj.isMaintenanceSingle) {
        //Set Date AutomaticUpgradeAfter
        testExecutionData.testDate = new Date(testDate.getTime() + 0);

        //Set Date AutomaticUpgradeAfterX%
        testExecutionData.setUpgradePercent = 0;

        //Create Test Data Object
        testExecutionData.setTotalAddons = 4;
        testExecutionData.setVersionsPerAddon = 4;
        testExecutionData.changePhasedGroupVersionDays = 0;
        const testTempObjectAllNegative = Object.assign({}, testExecutionData);
        await executePhasedMaintenanceOnlyUpgradeAvailablePhasedandStartPhasedDateTimeTest(
            phasedMaintenanceOnlyAllowed,
            testTempObjectAllNegative,
            testConfigObj.isOnlineServer,
        );

        //Change Test Data Object
        testExecutionData.setTotalAddons = 104;

        testExecutionData.changePhasedGroupVersionDays = -21;
        const testTempObject1 = Object.assign({}, testExecutionData);
        await executePhasedMaintenanceOfOlderVersionsHappensNowTest(
            phasedMaintenanceOfOlderVersions21DaysHappensNow,
            testTempObject1,
            testConfigObj.isOnlineServer,
        );

        //Change Test Data Object
        testExecutionData.changePhasedGroupVersionDays = -14;
        const testTempObject2 = Object.assign({}, testExecutionData);
        await executePhasedMaintenanceOfOlderVersionsHappensNowTest(
            phasedMaintenanceOfOlderVersions14DaysHappensNow,
            testTempObject2,
            testConfigObj.isOnlineServer,
        );

        //Change Test Data Object
        testExecutionData.changePhasedGroupVersionDays = -7;
        const testTempObject3 = Object.assign({}, testExecutionData);
        await executePhasedMaintenanceOfOlderVersionsHappensNowTest(
            phasedMaintenanceOfOlderVersions7DaysHappensNow,
            testTempObject3,
            testConfigObj.isOnlineServer,
        );

        const datePlusZero = new Date();
        testExecutionData.changePhasedGroupVersionDays = 0;
        //Change Test Data Object
        testExecutionData.testDate = new Date(datePlusZero.getTime() + 1000 * 60 * 60 * 24 * 7);
        const testTempObject4 = Object.assign({}, testExecutionData);
        await executePhasedMaintenanceUpgradeStartDateInFewDaysTest(
            phasedMaintenanceUpgradeStartDateIn7Days,
            testTempObject4,
            testConfigObj.isOnlineServer,
        );

        //Change Test Data Object
        testExecutionData.testDate = new Date(datePlusZero.getTime() + 1000 * 60 * 60 * 24 * 14);
        const testTempObject5 = Object.assign({}, testExecutionData);
        await executePhasedMaintenanceUpgradeStartDateInFewDaysTest(
            phasedMaintenanceUpgradeStartDateIn14Days,
            testTempObject5,
            testConfigObj.isOnlineServer,
        );

        //Change Test Data Object
        testExecutionData.testDate = new Date(datePlusZero.getTime() + 1000 * 60 * 60 * 24 * 20);
        const testTempObject6 = Object.assign({}, testExecutionData);
        await executePhasedMaintenanceUpgradeStartDateInFewDaysTest(
            phasedMaintenanceUpgradeStartDateIn20Days,
            testTempObject6,
            testConfigObj.isOnlineServer,
        );

        //Change Test Data Object
        testExecutionData.testDate = new Date(datePlusZero.getTime() + 1000 * 60 * 60 * 24 * 21);
        const testTempObject7 = Object.assign({}, testExecutionData);
        await executePhasedMaintenanceUpgradeStartDateInFewDaysTest(
            phasedMaintenanceUpgradeStartDateIn21Days,
            testTempObject7,
            testConfigObj.isOnlineServer,
        );

        //Change Test Data Object
        testExecutionData.testDate = new Date(datePlusZero.getTime() + 1000 * 60 * 60 * 24 * 7);
        const testTempObject8 = Object.assign({}, testExecutionData);
        await executePhasedMaintenanceInstallStartDateInFewDaysTest(
            phasedMaintenanceInstallStartDateIn7Days,
            testTempObject8,
            testConfigObj.isOnlineServer,
        );

        //Change Test Data Object
        testExecutionData.testDate = new Date(datePlusZero.getTime() + 1000 * 60 * 60 * 24 * 14);
        const testTempObject9 = Object.assign({}, testExecutionData);
        await executePhasedMaintenanceInstallStartDateInFewDaysTest(
            phasedMaintenanceInstallStartDateIn14Days,
            testTempObject9,
            testConfigObj.isOnlineServer,
        );

        //Change Test Data Object
        testExecutionData.testDate = new Date(datePlusZero.getTime() + 1000 * 60 * 60 * 24 * 20);
        const testTempObject10 = Object.assign({}, testExecutionData);
        await executePhasedMaintenanceInstallStartDateInFewDaysTest(
            phasedMaintenanceInstallStartDateIn20Days,
            testTempObject10,
            testConfigObj.isOnlineServer,
        );

        //Change Test Data Object
        testExecutionData.testDate = new Date(datePlusZero.getTime() + 1000 * 60 * 60 * 24 * 21);
        const testTempObject11 = Object.assign({}, testExecutionData);
        await executePhasedMaintenanceInstallStartDateInFewDaysTest(
            phasedMaintenanceInstallStartDateIn21Days,
            testTempObject11,
            testConfigObj.isOnlineServer,
        );

        //Change Test Data Object
        testExecutionData.changePhasedGroupVersionDays = -14;
        const testTempObject2N = Object.assign({}, testExecutionData);
        await executePhasedMaintenanceOfOlderVersionsHappensNowTest(
            phasedMaintenanceOfOlderVersions14DaysHappensNowNegative,
            testTempObject2N,
            testConfigObj.isOnlineServer,
        );

        //Change Test Data Object
        testExecutionData.testDate = new Date(datePlusZero.getTime() + 1000 * 60 * 60 * 24 * 14);
        const testTempObject5N = Object.assign({}, testExecutionData);
        await executePhasedMaintenanceUpgradeStartDateInFewDaysTest(
            phasedMaintenanceUpgradeStartDateIn14DaysNegative,
            testTempObject5N,
            testConfigObj.isOnlineServer,
        );
    }

    //Change Test Data Object
    testExecutionData = {};
    testExecutionData.testDate = new Date(testDate.getTime() + 0);
    testExecutionData.setUpgradePercent = 0;
    testExecutionData.setTotalAddons = 104; //10004;
    testExecutionData.setVersionsPerAddon = 4;
    testExecutionData.changePhasedGroupVersionDays = 0;

    if (testConfigObj.isMaintenanceUpgrade) {
        const datePlusZero = new Date();
        testExecutionData.changePhasedGroupVersionDays = 0;
        testExecutionData.testDate = new Date(datePlusZero.getTime() + 0);
        const testTempObject12 = Object.assign({}, testExecutionData);
        await executePhasedMaintenanceMaintenanceUpgradeDistributionTest(
            upgradePhasedMaintenanceDistribution,
            testTempObject12,
            testConfigObj.isOnlineServer,
        );
    }

    if (testConfigObj.isMaintenanceInstall) {
        const datePlusZero = new Date();
        testExecutionData.changePhasedGroupVersionDays = 0;
        testExecutionData.testDate = new Date(datePlusZero.getTime() + 0);
        const testTempObject13 = Object.assign({}, testExecutionData);
        await executePhasedMaintenanceMaintenanceInstallDistributionTest(
            installPhasedMaintenanceDistribution,
            testTempObject13,
            testConfigObj.isOnlineServer,
        );
    }

    if (testConfigObj.isMaintenanceFull) {
        let datePlusZero = new Date();
        testExecutionData.changePhasedGroupVersionDays = 0;
        testExecutionData.testDate = new Date(datePlusZero.getTime() + 0);
        const testTempObject14 = Object.assign({}, testExecutionData);
        await executePhasedMaintenanceMaintenanceFullDistributionTest(
            fullPhasedMaintenanceDistribution,
            testTempObject14,
            testConfigObj.isOnlineServer,
        );

        datePlusZero = new Date();
        testExecutionData.changePhasedGroupVersionDays = 0;
        testExecutionData.testDate = new Date(datePlusZero.getTime() + 0);
        const testTempObject14N = Object.assign({}, testExecutionData);
        await executePhasedMaintenanceMaintenanceFullDistributionTest(
            fullPhasedMaintenanceDistributionNegative,
            testTempObject14N,
            testConfigObj.isOnlineServer,
        );
    }
    //#endregion Phased maintenance single maintenance executions

    //Careful - This method can delete all the Addons!!!
    //Never change this, you can comment this out, but don't play with it.
    await executeRemoveAllInstalledAddons();
    //#endregion Test Config area

    //Print Report
    printTestResults(describe, expect, it, 'Addons');

    //#region Tests
    //#region Addons Tests
    //Test Install addon without version files (Negative)
    async function executeInstallAddonWithoutVersionFilesTest(testName, testDataBody) {
        const mandatoryStepsInstallAddonWithoutVersionFiles = {
            createAddon: false,
            failedToInstallAddon: false,
            deleteAddon: false,
        };

        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());

            mandatoryStepsInstallAddonWithoutVersionFiles.createAddon = testDataBody.Name == createApiResponse.Name;

            //Install without version
            const postInstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install();
            console.log({ Post_Addon_Without_Version_Files: postInstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(postInstallAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Addon_Without_Version: postAddonApiResponse });

            mandatoryStepsInstallAddonWithoutVersionFiles.failedToInstallAddon =
                postAddonApiResponse.Status.Name == 'Failure';
            addTestResultUnderHeadline(
                testName,
                'Install Addon Without Version Files',
                postAddonApiResponse.Status.Name == 'Failure',
            );
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Delete Addon
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsInstallAddonWithoutVersionFiles.deleteAddon = !JSON.stringify(deleteApiResponse).includes(
                'fault',
            );
        }

        if (
            mandatoryStepsInstallAddonWithoutVersionFiles.createAddon == true &&
            mandatoryStepsInstallAddonWithoutVersionFiles.failedToInstallAddon == true &&
            mandatoryStepsInstallAddonWithoutVersionFiles.deleteAddon == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Install addon without version files (Negative) Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Install addon without version files (Negative) Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Install addon without existing version – version 4 (Negative)
    async function executeInstallAddonWithoutExistingVersionTest(testName, testDataBody) {
        const mandatoryStepsInstallAddonWithoutExistingVersion = {
            createAddon: false,
            failedToInstallAddon: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsInstallAddonWithoutExistingVersion.createAddon = testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                if (index == 2) {
                    versionTestDataBody.Available = false;
                }
                versionTestDataBody.Phased = true;
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody) as any,
                    },
                ).then((response) => response.json());
            }

            //Install non existing version
            const postInstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install('Non Existing Version');
            console.log({ Post_Addon_With_Non_Existing_Version: postInstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(postInstallAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Addon_Without_Version: postAddonApiResponse });

            mandatoryStepsInstallAddonWithoutExistingVersion.failedToInstallAddon =
                postAddonApiResponse.Status.Name == 'Failure';
            addTestResultUnderHeadline(
                testName,
                'Install Addon Without Existing Version',
                postAddonApiResponse.Status.Name == 'Failure',
            );
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());
                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }

            //Try to elso delete non exitting version if created
            const deleteVersionApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                    '/var/addons/versions/Non Existing Version',
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            if (!deleteVersionApiResponse) {
                console.log({ Post_Var_Addons_Non_Existing_Versions_Delete: deleteVersionApiResponse });
            }

            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsInstallAddonWithoutExistingVersion.deleteAddon = !JSON.stringify(deleteApiResponse).includes(
                'fault',
            );
        }

        if (
            mandatoryStepsInstallAddonWithoutExistingVersion.createAddon == true &&
            mandatoryStepsInstallAddonWithoutExistingVersion.failedToInstallAddon == true &&
            mandatoryStepsInstallAddonWithoutExistingVersion.deleteAddon == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Install addon without existing version – version 4 (Negative) Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Install addon without existing version – version 4 (Negative) Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Install addon with non available version – version 3 (Available = false) (Negative)
    async function executeInstallAddonWithNonAvailableVersionTest(testName, testDataBody) {
        const mandatoryStepsInstallAddonWithNonAvailableVersion = {
            createAddon: false,
            failedToInstallAddon: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsInstallAddonWithNonAvailableVersion.createAddon = testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                if (index == 2) {
                    versionTestDataBody.Available = false;
                }
                versionTestDataBody.Phased = true;
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody) as any,
                    },
                ).then((response) => response.json());
            }

            //Install non available version
            const postInstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install(versionsArr[2].Version);
            console.log({ Post_Addon_With_Non_Available_Version: postInstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(postInstallAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Addon_Without_Version: postAddonApiResponse });

            mandatoryStepsInstallAddonWithNonAvailableVersion.failedToInstallAddon =
                postAddonApiResponse.Status.Name == 'Failure';
            addTestResultUnderHeadline(
                testName,
                'Install Addon With Non Available Version',
                postAddonApiResponse.Status.Name == 'Failure',
            );
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());

                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsInstallAddonWithNonAvailableVersion.deleteAddon = !JSON.stringify(deleteApiResponse).includes(
                'fault',
            );
        }

        if (
            mandatoryStepsInstallAddonWithNonAvailableVersion.createAddon == true &&
            mandatoryStepsInstallAddonWithNonAvailableVersion.failedToInstallAddon == true &&
            mandatoryStepsInstallAddonWithNonAvailableVersion.deleteAddon == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Install addon With Non Available version – version 3 (Negative) Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Install addon With Non Available version – version 3 (Negative) Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Install Newest Addon Without Version - Version 2
    async function executeInstallNewestAddonWithoutVersionTest(testName, testDataBody) {
        const mandatoryStepsInstallNewestAddonWithoutVersion = {
            createAddon: false,
            installAddon: false,
            InstallCorrectAddon: false,
            unInstallAddon: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsInstallNewestAddonWithoutVersion.createAddon = testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                if (index == 2) {
                    versionTestDataBody.Available = false;
                }
                versionTestDataBody.Phased = true;
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody) as any,
                    },
                ).then((response) => response.json());
            }

            //Install newest available without version
            const postInstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install();
            console.log({ Post_Addon_Without_Version: postInstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(postInstallAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Addon_Without_Version: postAddonApiResponse });

            //If no Audit log was found
            if (postAddonApiResponse == undefined) {
                postAddonApiResponse = {};
                //postAddonApiResponse.result = {};
                postAddonApiResponse.AuditInfo = {};
                postAddonApiResponse.AuditInfo.ToVersion = {};
                postAddonApiResponse.AuditInfo.ToVersion = 'Error - Audit Log was not found';
            }

            mandatoryStepsInstallNewestAddonWithoutVersion.installAddon = postAddonApiResponse.Status.Name == 'Success';
            addTestResultUnderHeadline(
                testName,
                'Install Addon Without Version',
                postAddonApiResponse.Status.Name == 'Success',
            );

            //Installed version results
            const isRightVersion = versionsArr[1].Version == postAddonApiResponse.AuditInfo.ToVersion;
            mandatoryStepsInstallNewestAddonWithoutVersion.InstallCorrectAddon = isRightVersion;
            addTestResultUnderHeadline(
                testName,
                'Install Latest Addon Without Version',
                mandatoryStepsInstallNewestAddonWithoutVersion.InstallCorrectAddon
                    ? true
                    : 'The response is: ' +
                          postAddonApiResponse.AuditInfo.ToVersion +
                          ' Expected response is: ' +
                          versionsArr[1].Version,
            );

            if (!isRightVersion) {
                console.log({ Version_One_ID: versionsArr[0].Version });
                console.log({ Version_Two_ID: versionsArr[1].Version });
                console.log({ Version_Three_ID: versionsArr[2].Version });
                console.log({ Installed_Version_ID: postAddonApiResponse.AuditInfo.ToVersion });
            }
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Uninstall addon
            const postUninstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .uninstall();
            console.log({ Post_Addon_Uninstall: postUninstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            if (postUninstallAddonApiResponse.URI != undefined) {
                do {
                    generalService.sleep(2000);
                    postAddonApiResponse = await generalService.papiClient.get(postUninstallAddonApiResponse.URI);
                    maxLoopsCounter--;
                } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                console.log({ Audit_Log_Addon_Uninstall: postAddonApiResponse });
                //Uninstall results
                mandatoryStepsInstallNewestAddonWithoutVersion.unInstallAddon = postAddonApiResponse.Status.ID == 1;
                addTestResultUnderHeadline(
                    testName,
                    'Uninstall Addon',
                    mandatoryStepsInstallNewestAddonWithoutVersion.unInstallAddon,
                );
            } else {
                //Uninstall results
                mandatoryStepsInstallNewestAddonWithoutVersion.unInstallAddon = false;
                addTestResultUnderHeadline(testName, 'Uninstall Addon', postUninstallAddonApiResponse);
            }

            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());
                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsInstallNewestAddonWithoutVersion.deleteAddon = !JSON.stringify(deleteApiResponse).includes(
                'fault',
            );
        }

        if (
            mandatoryStepsInstallNewestAddonWithoutVersion.createAddon == true &&
            mandatoryStepsInstallNewestAddonWithoutVersion.installAddon == true &&
            mandatoryStepsInstallNewestAddonWithoutVersion.InstallCorrectAddon == true &&
            mandatoryStepsInstallNewestAddonWithoutVersion.unInstallAddon == true &&
            mandatoryStepsInstallNewestAddonWithoutVersion.deleteAddon == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Install Newest Addon Without Version - Version 2 Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Install Newest Addon Without Version - Version 2 Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Install Addon With Version - Version
    async function executeInstallAddonWithVersionTest(testName, testDataBody) {
        const mandatoryStepsInstallAddonWithVersion = {
            createAddon: false,
            installAddon: false,
            InstallCorrectAddon: false,
            unInstallAddon: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsInstallAddonWithVersion.createAddon = testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                if (index == 2) {
                    versionTestDataBody.Available = false;
                }
                versionTestDataBody.Phased = true;
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody) as any,
                    },
                ).then((response) => response.json());
            }

            //Install with available version
            const postInstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install(versionsArr[0].Version);
            console.log({ Post_Addon_with_Version: postInstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(postInstallAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Addon_With_Version: postAddonApiResponse });

            //If no Audit log was found
            if (postAddonApiResponse == undefined) {
                postAddonApiResponse = {};
                //postAddonApiResponse.result = {};
                postAddonApiResponse.AuditInfo = {};
                postAddonApiResponse.AuditInfo.ToVersion = {};
                postAddonApiResponse.AuditInfo.ToVersion = 'Error - Audit Log was not found';
            }

            //Install results
            mandatoryStepsInstallAddonWithVersion.installAddon = postAddonApiResponse.Status.Name == 'Success';
            addTestResultUnderHeadline(
                testName,
                'Install Addon With Version',
                postAddonApiResponse.Status.Name == 'Success',
            );

            //Installed version results
            const isRightVersion = versionsArr[0].Version == postAddonApiResponse.AuditInfo.ToVersion;
            mandatoryStepsInstallAddonWithVersion.InstallCorrectAddon = isRightVersion;
            addTestResultUnderHeadline(
                testName,
                'Install First Addon With Version',
                mandatoryStepsInstallAddonWithVersion.InstallCorrectAddon
                    ? true
                    : 'The response is: ' +
                          postAddonApiResponse.AuditInfo.ToVersion +
                          ' Expected response is: ' +
                          versionsArr[0].Version,
            );

            if (!isRightVersion) {
                console.log({ Version_One_ID: versionsArr[0].Version });
                console.log({ Version_Two_ID: versionsArr[1].Version });
                console.log({ Version_Three_ID: versionsArr[2].Version });
                console.log({ Installed_Version_ID: postAddonApiResponse.AuditInfo.ToVersion });
            }
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Uninstall addon
            const postUninstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .uninstall();
            console.log({ Post_Addon_Uninstall: postUninstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            if (postUninstallAddonApiResponse.URI != undefined) {
                do {
                    generalService.sleep(2000);
                    postAddonApiResponse = await generalService.papiClient.get(postUninstallAddonApiResponse.URI);
                    maxLoopsCounter--;
                } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                console.log({ Audit_Log_Addon_Uninstall: postAddonApiResponse });
                //Uninstall results
                mandatoryStepsInstallAddonWithVersion.unInstallAddon = postAddonApiResponse.Status.ID == 1;
                addTestResultUnderHeadline(
                    testName,
                    'Uninstall Addon',
                    mandatoryStepsInstallAddonWithVersion.unInstallAddon,
                );
            } else {
                //Uninstall results
                mandatoryStepsInstallAddonWithVersion.unInstallAddon = false;
                addTestResultUnderHeadline(testName, 'Uninstall Addon', postUninstallAddonApiResponse);
            }

            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());
                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsInstallAddonWithVersion.deleteAddon = !JSON.stringify(deleteApiResponse).includes('fault');
        }

        if (
            mandatoryStepsInstallAddonWithVersion.createAddon == true &&
            mandatoryStepsInstallAddonWithVersion.installAddon == true &&
            mandatoryStepsInstallAddonWithVersion.InstallCorrectAddon == true &&
            mandatoryStepsInstallAddonWithVersion.unInstallAddon == true &&
            mandatoryStepsInstallAddonWithVersion.deleteAddon == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Install Addon With Version - Version 1 Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Install Addon With Version - Version 1 Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Upgrade addon without New version files (Negative)
    async function executeUpgradeAddonWithoutNewVersionFilesTest(testName, testDataBody) {
        const mandatoryStepsUpgradeAddonWithoutVersionFiles = {
            createAddon: false,
            failedToUpgradeAddon: false,
            unInstallAddon: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsUpgradeAddonWithoutVersionFiles.createAddon = testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                if (index == 2) {
                    versionTestDataBody.Available = false;
                }
                versionTestDataBody.Phased = true;
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody) as any,
                    },
                ).then((response) => response.json());
            }

            const postInstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install(versionsArr[0].Version);
            console.log({ Post_Addon: postInstallAddonApiResponse });

            //Install without New version files
            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(postInstallAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Post_Addon: postAddonApiResponse });

            //Delete version 2
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                    '/var/addons/versions/' +
                    versionsArr[1].UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Version_Removed: deleteApiResponse });

            //Upgrade to version 2
            const postUpgradeAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .upgrade(versionsArr[1].Version);

            //Make sure that Audit Log created
            postAddonApiResponse;
            maxLoopsCounter = 90;
            do {
                generalService.sleep(1000);
                postAddonApiResponse = await generalService.papiClient.get(postUpgradeAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Upgrade_Addon_Without_New_Version_Files: postAddonApiResponse });

            //If no Audit log was found
            if (postAddonApiResponse == undefined) {
                postAddonApiResponse = {};
                //postAddonApiResponse.result = {};
                postAddonApiResponse.AuditInfo = {};
                postAddonApiResponse.AuditInfo.FromVersion = {};
                postAddonApiResponse.AuditInfo.FromVersion = 'Error - Audit Log was not found';
                postAddonApiResponse.AuditInfo.ToVersion = {};
                postAddonApiResponse.AuditInfo.ToVersion = 'Error - Audit Log was not found';
            }

            //Upgraded version results
            let isErrorMessage = false;
            if (postAddonApiResponse.AuditInfo.ErrorMessage != undefined) {
                isErrorMessage = true;
            }
            mandatoryStepsUpgradeAddonWithoutVersionFiles.failedToUpgradeAddon = isErrorMessage;
            addTestResultUnderHeadline(
                testName,
                'Upgrade Addon Without Version Files',
                isErrorMessage
                    ? true
                    : postAddonApiResponse.AuditInfo.FromVersion +
                          ' Upgraded to Deleted version: ' +
                          postAddonApiResponse.AuditInfo.ToVersion,
            );

            if (!mandatoryStepsUpgradeAddonWithoutVersionFiles.failedToUpgradeAddon) {
                console.log({ Version_One_ID: versionsArr[0].Version });
                console.log({ Version_Two_ID: versionsArr[1].Version });
                console.log({ Version_Three_ID: versionsArr[2].Version });
                console.log({ Upgraded_Version_ID: postAddonApiResponse.AuditInfo.ToVersion });
            }
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Uninstall addon
            const postUninstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .uninstall();
            console.log({ Post_Addon_Uninstall: postUninstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            if (postUninstallAddonApiResponse.URI != undefined) {
                do {
                    generalService.sleep(2000);
                    postAddonApiResponse = await generalService.papiClient.get(postUninstallAddonApiResponse.URI);
                    maxLoopsCounter--;
                } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                console.log({ Audit_Log_Addon_Uninstall: postAddonApiResponse });
                //Uninstall results
                mandatoryStepsUpgradeAddonWithoutVersionFiles.unInstallAddon = postAddonApiResponse.Status.ID == 1;
                addTestResultUnderHeadline(
                    testName,
                    'Uninstall Addon',
                    mandatoryStepsUpgradeAddonWithoutVersionFiles.unInstallAddon,
                );
            } else {
                //Uninstall results
                mandatoryStepsUpgradeAddonWithoutVersionFiles.unInstallAddon = false;
                addTestResultUnderHeadline(testName, 'Uninstall Addon', postUninstallAddonApiResponse);
            }

            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());
                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsUpgradeAddonWithoutVersionFiles.deleteAddon = !JSON.stringify(deleteApiResponse).includes(
                'fault',
            );
        }

        if (
            mandatoryStepsUpgradeAddonWithoutVersionFiles.createAddon == true &&
            mandatoryStepsUpgradeAddonWithoutVersionFiles.failedToUpgradeAddon == true &&
            mandatoryStepsUpgradeAddonWithoutVersionFiles.unInstallAddon == true &&
            mandatoryStepsUpgradeAddonWithoutVersionFiles.deleteAddon == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Upgrade addon without version files (Negative) Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Upgrade addon without version files (Negative) Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Upgrade addon without existing version – version 4 (Negative)
    async function executeUpgradeAddonWithoutExistingVersionTest(testName, testDataBody) {
        const mandatoryStepsUpgradeAddonWithoutExistingVersion = {
            createAddon: false,
            failedToUpgradeAddon: false,
            unInstallAddon: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsUpgradeAddonWithoutExistingVersion.createAddon = testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                if (index == 2) {
                    versionTestDataBody.Available = false;
                }
                versionTestDataBody.Phased = true;
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody),
                    },
                ).then((response) => response.json());
            }

            //Install addon with version
            const postInstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install(versionsArr[1].Version);
            console.log({ Post_Addon: postInstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(postInstallAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Post_Addon: postAddonApiResponse });

            //Upgrade to non existing version
            const postUpgradeAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .upgrade('Non Existing Version');

            //Make sure that Audit Log created
            postAddonApiResponse;
            maxLoopsCounter = 90;
            do {
                generalService.sleep(1000);
                postAddonApiResponse = await generalService.papiClient.get(postUpgradeAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Upgrade_Addon_Without_New_Version_Files: postAddonApiResponse });

            //If no Audit log was found
            if (postAddonApiResponse == undefined) {
                postAddonApiResponse = {};
                //postAddonApiResponse.result = {};
                postAddonApiResponse.AuditInfo = {};
                postAddonApiResponse.AuditInfo.FromVersion = {};
                postAddonApiResponse.AuditInfo.FromVersion = 'Error - Audit Log was not found';
                postAddonApiResponse.AuditInfo.ToVersion = {};
                postAddonApiResponse.AuditInfo.ToVersion = 'Error - Audit Log was not found';
            }

            //Upgraded version results
            let isErrorMessage = false;
            if (postAddonApiResponse.AuditInfo.ErrorMessage != undefined) {
                isErrorMessage = true;
            }
            mandatoryStepsUpgradeAddonWithoutExistingVersion.failedToUpgradeAddon = isErrorMessage;
            addTestResultUnderHeadline(
                testName,
                'Upgrade Addon Without Existing Version',
                isErrorMessage
                    ? true
                    : postAddonApiResponse.AuditInfo.FromVersion +
                          ' Upgraded to non existing version: ' +
                          postAddonApiResponse.AuditInfo.ToVersion,
            );

            if (!mandatoryStepsUpgradeAddonWithoutExistingVersion.failedToUpgradeAddon) {
                console.log({ Version_One_ID: versionsArr[0].Version });
                console.log({ Version_Two_ID: versionsArr[1].Version });
                console.log({ Version_Three_ID: versionsArr[2].Version });
                console.log({ Upgraded_Version_ID: postAddonApiResponse.AuditInfo.ToVersion });
            }
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Uninstall addon
            const postUninstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .uninstall();
            console.log({ Post_Addon_Uninstall: postUninstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            if (postUninstallAddonApiResponse.URI != undefined) {
                do {
                    generalService.sleep(2000);
                    postAddonApiResponse = await generalService.papiClient.get(postUninstallAddonApiResponse.URI);
                    maxLoopsCounter--;
                } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                console.log({ Audit_Log_Addon_Uninstall: postAddonApiResponse });
                //Uninstall results
                mandatoryStepsUpgradeAddonWithoutExistingVersion.unInstallAddon = postAddonApiResponse.Status.ID == 1;
                addTestResultUnderHeadline(
                    testName,
                    'Uninstall Addon',
                    mandatoryStepsUpgradeAddonWithoutExistingVersion.unInstallAddon,
                );
            } else {
                //Uninstall results
                mandatoryStepsUpgradeAddonWithoutExistingVersion.unInstallAddon = false;
                addTestResultUnderHeadline(testName, 'Uninstall Addon', postUninstallAddonApiResponse);
            }

            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());
                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsUpgradeAddonWithoutExistingVersion.deleteAddon = !JSON.stringify(deleteApiResponse).includes(
                'fault',
            );
        }

        if (
            mandatoryStepsUpgradeAddonWithoutExistingVersion.createAddon == true &&
            mandatoryStepsUpgradeAddonWithoutExistingVersion.failedToUpgradeAddon == true &&
            mandatoryStepsUpgradeAddonWithoutExistingVersion.unInstallAddon == true &&
            mandatoryStepsUpgradeAddonWithoutExistingVersion.deleteAddon == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Upgrade addon without existing version – version 4 (Negative) Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Upgrade addon without existing version – version 4 (Negative) Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Upgrade addon with non available version – version 3 (Available = false) (Negative)
    async function executeUpgradeAddonWithNonAvailableVersionTest(testName, testDataBody) {
        const mandatoryStepsUpgradeAddonWithNonAvailableVersion = {
            createAddon: false,
            failedToUpgradeAddon: false,
            unInstallAddon: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsUpgradeAddonWithNonAvailableVersion.createAddon = testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                if (index == 2) {
                    versionTestDataBody.Available = false;
                }
                versionTestDataBody.Phased = true;
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody) as any,
                    },
                ).then((response) => response.json());
            }

            //Install addon with version
            const postInstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install(versionsArr[1].Version);
            console.log({ Post_Addon: postInstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(postInstallAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Addon_With_Non_Available_Version: postAddonApiResponse });

            //Upgrade to non available version
            const postUpgradeAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .upgrade(versionsArr[2].Version);

            //Make sure that Audit Log created
            postAddonApiResponse;
            maxLoopsCounter = 90;
            do {
                generalService.sleep(1000);
                postAddonApiResponse = await generalService.papiClient.get(postUpgradeAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Upgrade_Addon_With_Non_Available_Version_Files: postAddonApiResponse });

            //If no Audit log was found
            if (postAddonApiResponse == undefined) {
                postAddonApiResponse = {};
                //postAddonApiResponse.result = {};
                postAddonApiResponse.AuditInfo = {};
                postAddonApiResponse.AuditInfo.FromVersion = {};
                postAddonApiResponse.AuditInfo.FromVersion = 'Error - Audit Log was not found';
                postAddonApiResponse.AuditInfo.ToVersion = {};
                postAddonApiResponse.AuditInfo.ToVersion = 'Error - Audit Log was not found';
            }

            //Upgraded version results
            let isErrorMessage = false;
            if (postAddonApiResponse.AuditInfo.ErrorMessage != undefined) {
                isErrorMessage = true;
            }
            //Since 24/06/2020 it is allowed to upgrade to non avialable versions
            mandatoryStepsUpgradeAddonWithNonAvailableVersion.failedToUpgradeAddon = !isErrorMessage; //isErrorMessage;
            addTestResultUnderHeadline(
                testName,
                'Upgrade Addon With Non Available Version',
                !isErrorMessage
                    ? true
                    : postAddonApiResponse.AuditInfo.FromVersion +
                          ' Upgraded to non available version: ' +
                          postAddonApiResponse.AuditInfo.ToVersion,
            );

            if (!mandatoryStepsUpgradeAddonWithNonAvailableVersion.failedToUpgradeAddon) {
                console.log({ Version_One_ID: versionsArr[0].Version });
                console.log({ Version_Two_ID: versionsArr[1].Version });
                console.log({ Version_Three_ID: versionsArr[2].Version });
                console.log({ Upgraded_Version_ID: postAddonApiResponse.AuditInfo.ToVersion });
            }
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Uninstall addon
            const postUninstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .uninstall();
            console.log({ Post_Addon_Uninstall: postUninstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            if (postUninstallAddonApiResponse.URI != undefined) {
                do {
                    generalService.sleep(2000);
                    postAddonApiResponse = await generalService.papiClient.get(postUninstallAddonApiResponse.URI);
                    maxLoopsCounter--;
                } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                console.log({ Audit_Log_Addon_Uninstall: postAddonApiResponse });
                //Uninstall results
                mandatoryStepsUpgradeAddonWithNonAvailableVersion.unInstallAddon = postAddonApiResponse.Status.ID == 1;
                addTestResultUnderHeadline(
                    testName,
                    'Uninstall Addon',
                    mandatoryStepsUpgradeAddonWithNonAvailableVersion.unInstallAddon,
                );
            } else {
                //Uninstall results
                mandatoryStepsUpgradeAddonWithNonAvailableVersion.unInstallAddon = false;
                addTestResultUnderHeadline(testName, 'Uninstall Addon', postUninstallAddonApiResponse);
            }

            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());
                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsUpgradeAddonWithNonAvailableVersion.deleteAddon = !JSON.stringify(deleteApiResponse).includes(
                'fault',
            );
        }

        if (
            mandatoryStepsUpgradeAddonWithNonAvailableVersion.createAddon == true &&
            mandatoryStepsUpgradeAddonWithNonAvailableVersion.failedToUpgradeAddon == true &&
            mandatoryStepsUpgradeAddonWithNonAvailableVersion.unInstallAddon == true &&
            mandatoryStepsUpgradeAddonWithNonAvailableVersion.deleteAddon == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Upgrade addon With Non Available version – version 3 (Negative) Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Upgrade addon With Non Available version – version 3 (Negative) Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Upgrade To Newest Addon Version - Version 2
    async function executeUpgradeToNewestAddonVersionTest(testName, testDataBody) {
        const mandatoryStepsUpgradeToNewestAddonVersion = {
            createAddon: false,
            UpgradeCorrectVersion: false,
            unInstallAddon: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsUpgradeToNewestAddonVersion.createAddon = testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                if (index == 2) {
                    versionTestDataBody.Available = false;
                }
                versionTestDataBody.Phased = true;
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody) as any,
                    },
                ).then((response) => response.json());
            }

            //Install addon with version
            const postInstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install(versionsArr[0].Version);
            console.log({ Post_Addon: postInstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(postInstallAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Addon_With_Version: postAddonApiResponse });

            //Upgrade to new version
            const postUpgradeAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .upgrade(versionsArr[1].Version);

            //Make sure that Audit Log created
            postAddonApiResponse;
            maxLoopsCounter = 90;
            do {
                generalService.sleep(1000);
                postAddonApiResponse = await generalService.papiClient.get(postUpgradeAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Upgrade_Addon_Version_Without_Version: postAddonApiResponse });

            //If no Audit log was found
            if (postAddonApiResponse == undefined) {
                postAddonApiResponse = {};
                //postAddonApiResponse.result = {};
                postAddonApiResponse.AuditInfo = {};
                postAddonApiResponse.AuditInfo.FromVersion = {};
                postAddonApiResponse.AuditInfo.FromVersion = 'Error - Audit Log was not found';
                postAddonApiResponse.AuditInfo.ToVersion = {};
                postAddonApiResponse.AuditInfo.ToVersion = 'Error - Audit Log was not found';
            }

            //Upgraded version results
            let isErrorMessage = false;
            if (postAddonApiResponse.AuditInfo.ErrorMessage != undefined) {
                isErrorMessage = true;
            }
            mandatoryStepsUpgradeToNewestAddonVersion.UpgradeCorrectVersion = !isErrorMessage;
            addTestResultUnderHeadline(
                testName,
                'Upgrade Addon With Version',
                !isErrorMessage
                    ? true
                    : postAddonApiResponse.AuditInfo.FromVersion +
                          ' failed to upgraded to version: ' +
                          postAddonApiResponse.AuditInfo.ToVersion,
            );

            if (!mandatoryStepsUpgradeToNewestAddonVersion.UpgradeCorrectVersion) {
                console.log({ Version_One_ID: versionsArr[0].Version });
                console.log({ Version_Two_ID: versionsArr[1].Version });
                console.log({ Version_Three_ID: versionsArr[2].Version });
                console.log({ Upgraded_Version_ID: postAddonApiResponse.AuditInfo.ToVersion });
            }
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Uninstall addon
            const postUninstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .uninstall();
            console.log({ Post_Addon_Uninstall: postUninstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            if (postUninstallAddonApiResponse.URI != undefined) {
                do {
                    generalService.sleep(2000);
                    postAddonApiResponse = await generalService.papiClient.get(postUninstallAddonApiResponse.URI);
                    maxLoopsCounter--;
                } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                console.log({ Audit_Log_Addon_Uninstall: postAddonApiResponse });
                //Uninstall results
                mandatoryStepsUpgradeToNewestAddonVersion.unInstallAddon = postAddonApiResponse.Status.ID == 1;
                addTestResultUnderHeadline(
                    testName,
                    'Uninstall Addon',
                    mandatoryStepsUpgradeToNewestAddonVersion.unInstallAddon,
                );
            } else {
                //Uninstall results
                mandatoryStepsUpgradeToNewestAddonVersion.unInstallAddon = false;
                addTestResultUnderHeadline(testName, 'Uninstall Addon', postUninstallAddonApiResponse);
            }

            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());
                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsUpgradeToNewestAddonVersion.deleteAddon = !JSON.stringify(deleteApiResponse).includes(
                'fault',
            );
        }

        if (
            mandatoryStepsUpgradeToNewestAddonVersion.createAddon == true &&
            mandatoryStepsUpgradeToNewestAddonVersion.UpgradeCorrectVersion == true &&
            mandatoryStepsUpgradeToNewestAddonVersion.unInstallAddon == true &&
            mandatoryStepsUpgradeToNewestAddonVersion.deleteAddon == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Upgrade To Newest Addon Version - Version 2 Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Upgrade To Newest Addon Version - Version 2 Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Upgrade To Newest Addon Version Without Version - Version 2
    async function executeUpgradeToNewestAddonVersionWithoutVersionTest(testName, testDataBody) {
        const mandatoryStepsUpgradeToNewestAddonVersionWithoutVersion = {
            createAddon: false,
            UpgradeCorrectVersionWithoutVersion: false,
            unInstallAddon: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsUpgradeToNewestAddonVersionWithoutVersion.createAddon =
                testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                if (index == 2) {
                    versionTestDataBody.Available = false;
                }
                versionTestDataBody.Phased = true;
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody) as any,
                    },
                ).then((response) => response.json());
            }

            //Install addon with version
            const postInstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install(versionsArr[0].Version);
            console.log({ Post_Addon: postInstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(postInstallAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Addon_With_Version: postAddonApiResponse });

            //Upgrade to new version without version
            const postUpgradeAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .upgrade();

            //Make sure that Audit Log created
            postAddonApiResponse;
            maxLoopsCounter = 90;
            do {
                generalService.sleep(1000);
                postAddonApiResponse = await generalService.papiClient.get(postUpgradeAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Upgrade_Addon_Version_Without_Version: postAddonApiResponse });

            //If no Audit log was found
            if (postAddonApiResponse == undefined) {
                postAddonApiResponse = {};
                //postAddonApiResponse.result = {};
                postAddonApiResponse.AuditInfo = {};
                postAddonApiResponse.AuditInfo.FromVersion = {};
                postAddonApiResponse.AuditInfo.FromVersion = 'Error - Audit Log was not found';
                postAddonApiResponse.AuditInfo.ToVersion = {};
                postAddonApiResponse.AuditInfo.ToVersion = 'Error - Audit Log was not found';
            }

            //Upgraded Version Without Version results
            let isErrorMessage = false;
            if (postAddonApiResponse.AuditInfo.ErrorMessage != undefined) {
                isErrorMessage = true;
            }
            mandatoryStepsUpgradeToNewestAddonVersionWithoutVersion.UpgradeCorrectVersionWithoutVersion = !isErrorMessage;
            addTestResultUnderHeadline(
                testName,
                'Upgrade Addon Without Version',
                !isErrorMessage
                    ? true
                    : postAddonApiResponse.AuditInfo.FromVersion +
                          ' failed to upgraded to version: ' +
                          postAddonApiResponse.AuditInfo.ToVersion,
            );

            if (!mandatoryStepsUpgradeToNewestAddonVersionWithoutVersion.UpgradeCorrectVersionWithoutVersion) {
                console.log({ Version_One_ID: versionsArr[0].Version });
                console.log({ Version_Two_ID: versionsArr[1].Version });
                console.log({ Version_Three_ID: versionsArr[2].Version });
                console.log({ Upgraded_Version_ID: postAddonApiResponse.AuditInfo.ToVersion });
            }
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Uninstall addon
            const postUninstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .uninstall();
            console.log({ Post_Addon_Uninstall: postUninstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            if (postUninstallAddonApiResponse.URI != undefined) {
                do {
                    generalService.sleep(2000);
                    postAddonApiResponse = await generalService.papiClient.get(postUninstallAddonApiResponse.URI);
                    maxLoopsCounter--;
                } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                console.log({ Audit_Log_Addon_Uninstall: postAddonApiResponse });
                //Uninstall results
                mandatoryStepsUpgradeToNewestAddonVersionWithoutVersion.unInstallAddon =
                    postAddonApiResponse.Status.ID == 1;
                addTestResultUnderHeadline(
                    testName,
                    'Uninstall Addon',
                    mandatoryStepsUpgradeToNewestAddonVersionWithoutVersion.unInstallAddon,
                );
            } else {
                //Uninstall results
                mandatoryStepsUpgradeToNewestAddonVersionWithoutVersion.unInstallAddon = false;
                addTestResultUnderHeadline(testName, 'Uninstall Addon', postUninstallAddonApiResponse);
            }

            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());
                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsUpgradeToNewestAddonVersionWithoutVersion.deleteAddon = !JSON.stringify(
                deleteApiResponse,
            ).includes('fault');
        }

        if (
            mandatoryStepsUpgradeToNewestAddonVersionWithoutVersion.createAddon == true &&
            mandatoryStepsUpgradeToNewestAddonVersionWithoutVersion.UpgradeCorrectVersionWithoutVersion == true &&
            mandatoryStepsUpgradeToNewestAddonVersionWithoutVersion.unInstallAddon == true &&
            mandatoryStepsUpgradeToNewestAddonVersionWithoutVersion.deleteAddon == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Upgrade To Newest Addon Version Without Version - Version 2 Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Upgrade To Newest Addon Version Without Version - Version 2 Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Upgrade To Newest Addon Version Without Available Version - Version 2
    async function executeUpgradeToNewestAddonVersionWithoutAvailableVersionTest(testName, testDataBody) {
        const mandatoryStepsUpgradeToNewestAddonVersionWithoutAvailableVersion = {
            createAddon: false,
            failedTUpgradeCorrectVersionWithoutAvailableVersion: false,
            unInstallAddon: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsUpgradeToNewestAddonVersionWithoutAvailableVersion.createAddon =
                testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                //Make all version that are not installed not available
                if (index > 0) {
                    versionTestDataBody.Available = false;
                }
                versionTestDataBody.Phased = true;
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody) as any,
                    },
                ).then((response) => response.json());
            }

            //Install addon with version
            const postInstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install(versionsArr[0].Version);
            console.log({ Post_Addon: postInstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(postInstallAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Addon_With_Version: postAddonApiResponse });

            //Update
            const tempNewAddonVersionBody = versionsArr[0];
            tempNewAddonVersionBody.Available = false;

            const getAdonsVersionApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(tempNewAddonVersionBody),
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Version_Update: getAdonsVersionApiResponse });

            //Upgrade to new version Without Available version
            let isErrorMessage = false;
            const postUpgradeAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .upgrade()
                .catch((errorMessage) => {
                    if (errorMessage.message.includes("doesn't have any phased available version")) {
                        isErrorMessage = true;
                    }
                });

            mandatoryStepsUpgradeToNewestAddonVersionWithoutAvailableVersion.failedTUpgradeCorrectVersionWithoutAvailableVersion = isErrorMessage;
            addTestResultUnderHeadline(
                testName,
                'Failed To Upgrade Addon Without Available Version',
                isErrorMessage
                    ? true
                    : postAddonApiResponse.AuditInfo.FromVersion +
                          ' Error Upgraded To Version Without Available Version: ' +
                          postUpgradeAddonApiResponse,
            );
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Uninstall addon
            const postUninstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .uninstall();
            console.log({ Post_Addon_Uninstall: postUninstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            if (postUninstallAddonApiResponse.URI != undefined) {
                do {
                    generalService.sleep(2000);
                    postAddonApiResponse = await generalService.papiClient.get(postUninstallAddonApiResponse.URI);
                    maxLoopsCounter--;
                } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                console.log({ Audit_Log_Addon_Uninstall: postAddonApiResponse });
                //Uninstall results
                mandatoryStepsUpgradeToNewestAddonVersionWithoutAvailableVersion.unInstallAddon =
                    postAddonApiResponse.Status.ID == 1;
                addTestResultUnderHeadline(
                    testName,
                    'Uninstall Addon',
                    mandatoryStepsUpgradeToNewestAddonVersionWithoutAvailableVersion.unInstallAddon,
                );
            } else {
                //Uninstall results
                mandatoryStepsUpgradeToNewestAddonVersionWithoutAvailableVersion.unInstallAddon = false;
                addTestResultUnderHeadline(testName, 'Uninstall Addon', postUninstallAddonApiResponse);
            }

            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());
                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsUpgradeToNewestAddonVersionWithoutAvailableVersion.deleteAddon = !JSON.stringify(
                deleteApiResponse,
            ).includes('fault');
        }

        if (
            mandatoryStepsUpgradeToNewestAddonVersionWithoutAvailableVersion.createAddon == true &&
            mandatoryStepsUpgradeToNewestAddonVersionWithoutAvailableVersion.failedTUpgradeCorrectVersionWithoutAvailableVersion ==
                true &&
            mandatoryStepsUpgradeToNewestAddonVersionWithoutAvailableVersion.unInstallAddon == true &&
            mandatoryStepsUpgradeToNewestAddonVersionWithoutAvailableVersion.deleteAddon == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Upgrade To Newest Addon Version Without Available Version (Negative) Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Upgrade To Newest Addon Version Without Available Version (Negative) Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Upgrade To Newest Addon Version Without Phased Version - Version 2
    async function executeUpgradeToNewestAddonVersionWithoutPhasedVersionTest(testName, testDataBody) {
        const mandatoryStepsUpgradeToNewestAddonVersionWithoutPhasedVersion = {
            createAddon: false,
            failedTUpgradeCorrectVersionWithoutPhasedVersion: false,
            unInstallAddon: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsUpgradeToNewestAddonVersionWithoutPhasedVersion.createAddon =
                testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                if (index == 2) {
                    versionTestDataBody.Available = false;
                }
                //Make all version that are not installed not phased
                if (index > 0) {
                    versionTestDataBody.Phased = false;
                } else {
                    versionTestDataBody.Phased = true;
                }
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody) as any,
                    },
                ).then((response) => response.json());
            }

            //Install addon with version
            const postInstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install(versionsArr[0].Version);
            console.log({ Post_Addon: postInstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(postInstallAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Addon_With_Version: postAddonApiResponse });

            //Update
            const tempNewAddonVersionBody = versionsArr[0];
            tempNewAddonVersionBody.Phased = false;

            const getAdonsVersionApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(tempNewAddonVersionBody),
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Version_Update: getAdonsVersionApiResponse });

            //Upgrade to new version Without Phased
            let isErrorMessage = false;
            const postUpgradeAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .upgrade()
                .catch((errorMessage) => {
                    if (errorMessage.message.includes("doesn't have any phased available version")) {
                        isErrorMessage = true;
                    }
                });

            mandatoryStepsUpgradeToNewestAddonVersionWithoutPhasedVersion.failedTUpgradeCorrectVersionWithoutPhasedVersion = isErrorMessage;
            addTestResultUnderHeadline(
                testName,
                'Failed To Upgrade Addon Without Phased Version',
                isErrorMessage
                    ? true
                    : postAddonApiResponse.AuditInfo.FromVersion +
                          ' Error Upgraded To Version Without Phased Version: ' +
                          postUpgradeAddonApiResponse,
            );

            if (
                !mandatoryStepsUpgradeToNewestAddonVersionWithoutPhasedVersion.failedTUpgradeCorrectVersionWithoutPhasedVersion
            ) {
                console.log({ Version_One_ID: versionsArr[0].Version });
                console.log({ Version_Two_ID: versionsArr[1].Version });
                console.log({ Version_Three_ID: versionsArr[2].Version });
                console.log({ Upgraded_Version_ID: postAddonApiResponse.AuditInfo.ToVersion });
            }
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Uninstall addon
            const postUninstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .uninstall();
            console.log({ Post_Addon_Uninstall: postUninstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            if (postUninstallAddonApiResponse.URI != undefined) {
                do {
                    generalService.sleep(2000);
                    postAddonApiResponse = await generalService.papiClient.get(postUninstallAddonApiResponse.URI);
                    maxLoopsCounter--;
                } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                console.log({ Audit_Log_Addon_Uninstall: postAddonApiResponse });
                //Uninstall results
                mandatoryStepsUpgradeToNewestAddonVersionWithoutPhasedVersion.unInstallAddon =
                    postAddonApiResponse.Status.ID == 1;
                addTestResultUnderHeadline(
                    testName,
                    'Uninstall Addon',
                    mandatoryStepsUpgradeToNewestAddonVersionWithoutPhasedVersion.unInstallAddon,
                );
            } else {
                //Uninstall results
                mandatoryStepsUpgradeToNewestAddonVersionWithoutPhasedVersion.unInstallAddon = false;
                addTestResultUnderHeadline(testName, 'Uninstall Addon', postUninstallAddonApiResponse);
            }

            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());
                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsUpgradeToNewestAddonVersionWithoutPhasedVersion.deleteAddon = !JSON.stringify(
                deleteApiResponse,
            ).includes('fault');
        }

        if (
            mandatoryStepsUpgradeToNewestAddonVersionWithoutPhasedVersion.createAddon == true &&
            mandatoryStepsUpgradeToNewestAddonVersionWithoutPhasedVersion.failedTUpgradeCorrectVersionWithoutPhasedVersion ==
                true &&
            mandatoryStepsUpgradeToNewestAddonVersionWithoutPhasedVersion.unInstallAddon == true &&
            mandatoryStepsUpgradeToNewestAddonVersionWithoutPhasedVersion.deleteAddon == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Upgrade To Newest Addon Version Without Phased Version (Negative) Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Upgrade To Newest Addon Version Without Phased Version (Negative) Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Upgrade Addon With Old Version - Version 1 (Negative)
    async function executeUpgradeAddonWithOldVersionTest(testName, testDataBody) {
        const mandatoryStepsUpgradeAddonWithVersion = {
            createAddon: false,
            failedtoUpgradeVersion: false,
            unInstallAddon: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsUpgradeAddonWithVersion.createAddon = testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                if (index == 2) {
                    versionTestDataBody.Available = false;
                }
                versionTestDataBody.Phased = true;
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody) as any,
                    },
                ).then((response) => response.json());
            }

            //Install addon with version
            const postInstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install(versionsArr[1].Version);
            console.log({ Post_Addon: postInstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(postInstallAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Addon_With_Version: postAddonApiResponse });

            //Upgrade to old version
            const postUpgradeAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .upgrade(versionsArr[0].Version);

            //Make sure that Audit Log created
            postAddonApiResponse;
            maxLoopsCounter = 90;
            do {
                generalService.sleep(1000);
                postAddonApiResponse = await generalService.papiClient.get(postUpgradeAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Upgrade_Addon_With_Version_Files: postAddonApiResponse });

            //If no Audit log was found
            if (postAddonApiResponse == undefined) {
                postAddonApiResponse = {};
                //postAddonApiResponse.result = {};
                postAddonApiResponse.AuditInfo = {};
                postAddonApiResponse.AuditInfo.FromVersion = {};
                postAddonApiResponse.AuditInfo.FromVersion = 'Error - Audit Log was not found';
                postAddonApiResponse.AuditInfo.ToVersion = {};
                postAddonApiResponse.AuditInfo.ToVersion = 'Error - Audit Log was not found';
            }

            //Upgraded version results
            let isErrorMessage = false;
            if (postAddonApiResponse.AuditInfo.ErrorMessage != undefined) {
                isErrorMessage = true;
            }
            mandatoryStepsUpgradeAddonWithVersion.failedtoUpgradeVersion = isErrorMessage;
            addTestResultUnderHeadline(
                testName,
                'Upgrade to old Addon Version',
                isErrorMessage != null
                    ? true
                    : postAddonApiResponse.AuditInfo.FromVersion +
                          ' failed to upgraded to version: ' +
                          postAddonApiResponse.AuditInfo.ToVersion,
            );

            if (!mandatoryStepsUpgradeAddonWithVersion.failedtoUpgradeVersion) {
                console.log({ Version_One_ID: versionsArr[0].Version });
                console.log({ Version_Two_ID: versionsArr[1].Version });
                console.log({ Version_Three_ID: versionsArr[2].Version });
                console.log({ Upgraded_Version_ID: postAddonApiResponse.AuditInfo.ToVersion });
            }
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Uninstall addon
            const postUninstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .uninstall();
            console.log({ Post_Addon_Uninstall: postUninstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            if (postUninstallAddonApiResponse.URI != undefined) {
                do {
                    generalService.sleep(2000);
                    postAddonApiResponse = await generalService.papiClient.get(postUninstallAddonApiResponse.URI);
                    maxLoopsCounter--;
                } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                console.log({ Audit_Log_Addon_Uninstall: postAddonApiResponse });
                //Uninstall results
                mandatoryStepsUpgradeAddonWithVersion.unInstallAddon = postAddonApiResponse.Status.ID == 1;
                addTestResultUnderHeadline(
                    testName,
                    'Uninstall Addon',
                    mandatoryStepsUpgradeAddonWithVersion.unInstallAddon,
                );
            } else {
                //Uninstall results
                mandatoryStepsUpgradeAddonWithVersion.unInstallAddon = false;
                addTestResultUnderHeadline(testName, 'Uninstall Addon', postUninstallAddonApiResponse);
            }

            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());
                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsUpgradeAddonWithVersion.deleteAddon = !JSON.stringify(deleteApiResponse).includes('fault');
        }

        if (
            mandatoryStepsUpgradeAddonWithVersion.createAddon == true &&
            mandatoryStepsUpgradeAddonWithVersion.failedtoUpgradeVersion == true &&
            mandatoryStepsUpgradeAddonWithVersion.unInstallAddon == true &&
            mandatoryStepsUpgradeAddonWithVersion.deleteAddon == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Upgrade to old Addon Version - Version 1 (Negative) Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Upgrade to old Addon Version - Version 1 (Negative) Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Downgrade addon without Old version files (Negative)
    async function executeDowngradeAddonWithoutOldVersionFilesTest(testName, testDataBody) {
        const mandatoryStepsDowngradeAddonWithoutVersionFiles = {
            createAddon: false,
            failedToDowngradeAddon: false,
            unInstallAddon: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsDowngradeAddonWithoutVersionFiles.createAddon = testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                if (index == 2) {
                    versionTestDataBody.Available = false;
                }
                versionTestDataBody.Phased = true;
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody) as any,
                    },
                ).then((response) => response.json());
            }

            //Install with version
            const postInstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install(versionsArr[1].Version);
            console.log({ Post_Addon: postInstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(postInstallAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Post_Addon: postAddonApiResponse });

            //Delete version 2
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                    '/var/addons/versions/' +
                    versionsArr[0].UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Version_Removed: deleteApiResponse });

            //Downgrade to version 2
            const postDowngradeAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .downgrade(versionsArr[0].Version);

            //Make sure that Audit Log created
            postAddonApiResponse;
            maxLoopsCounter = 90;
            do {
                generalService.sleep(1000);
                postAddonApiResponse = await generalService.papiClient.get(postDowngradeAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Downgrade_Addon_Without_New_Version_Files: postAddonApiResponse });

            //If no Audit log was found
            if (postAddonApiResponse == undefined) {
                postAddonApiResponse = {};
                //postAddonApiResponse.result = {};
                postAddonApiResponse.AuditInfo = {};
                postAddonApiResponse.AuditInfo.FromVersion = {};
                postAddonApiResponse.AuditInfo.FromVersion = 'Error - Audit Log was not found';
                postAddonApiResponse.AuditInfo.ToVersion = {};
                postAddonApiResponse.AuditInfo.ToVersion = 'Error - Audit Log was not found';
            }

            //Downgradeed version results
            let isErrorMessage = false;
            if (postAddonApiResponse.AuditInfo.ErrorMessage != undefined) {
                isErrorMessage = true;
            }
            mandatoryStepsDowngradeAddonWithoutVersionFiles.failedToDowngradeAddon = isErrorMessage;
            addTestResultUnderHeadline(
                testName,
                'Downgrade Addon Without Version Files',
                isErrorMessage
                    ? true
                    : postAddonApiResponse.AuditInfo.FromVersion +
                          ' Downgraded to Deleted version: ' +
                          postAddonApiResponse.AuditInfo.ToVersion,
            );

            if (!mandatoryStepsDowngradeAddonWithoutVersionFiles.failedToDowngradeAddon) {
                console.log({ Version_One_ID: versionsArr[0].Version });
                console.log({ Version_Two_ID: versionsArr[1].Version });
                console.log({ Version_Three_ID: versionsArr[2].Version });
                console.log({ Downgradeed_Version_ID: postAddonApiResponse.AuditInfo.ToVersion });
            }
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Uninstall addon
            const postUninstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .uninstall();
            console.log({ Post_Addon_Uninstall: postUninstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            if (postUninstallAddonApiResponse.URI != undefined) {
                do {
                    generalService.sleep(2000);
                    postAddonApiResponse = await generalService.papiClient.get(postUninstallAddonApiResponse.URI);
                    maxLoopsCounter--;
                } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                console.log({ Audit_Log_Addon_Uninstall: postAddonApiResponse });
                //Uninstall results
                mandatoryStepsDowngradeAddonWithoutVersionFiles.unInstallAddon = postAddonApiResponse.Status.ID == 1;
                addTestResultUnderHeadline(
                    testName,
                    'Uninstall Addon',
                    mandatoryStepsDowngradeAddonWithoutVersionFiles.unInstallAddon,
                );
            } else {
                //Uninstall results
                mandatoryStepsDowngradeAddonWithoutVersionFiles.unInstallAddon = false;
                addTestResultUnderHeadline(testName, 'Uninstall Addon', postUninstallAddonApiResponse);
            }

            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());
                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsDowngradeAddonWithoutVersionFiles.deleteAddon = !JSON.stringify(deleteApiResponse).includes(
                'fault',
            );
        }

        if (
            mandatoryStepsDowngradeAddonWithoutVersionFiles.createAddon == true &&
            mandatoryStepsDowngradeAddonWithoutVersionFiles.failedToDowngradeAddon == true &&
            mandatoryStepsDowngradeAddonWithoutVersionFiles.unInstallAddon == true &&
            mandatoryStepsDowngradeAddonWithoutVersionFiles.deleteAddon == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All downgrade addon without version files (Negative) Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All downgrade addon without version files (Negative) Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Downgrade addon without existing version – version 4 (Negative)
    async function executeDowngradeAddonWithoutExistingVersionTest(testName, testDataBody) {
        const mandatoryStepsDowngradeAddonWithoutExistingVersion = {
            createAddon: false,
            failedToDowngradeAddon: false,
            unInstallAddon: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsDowngradeAddonWithoutExistingVersion.createAddon =
                testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                if (index == 2) {
                    versionTestDataBody.Available = false;
                }
                versionTestDataBody.Phased = true;
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody) as any,
                    },
                ).then((response) => response.json());
            }

            //Install addon with version
            const postInstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install(versionsArr[1].Version);
            console.log({ Post_Addon: postInstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(postInstallAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Addon_With_Non_Existing_Version: postAddonApiResponse });

            //Downgrade to non existing version
            const postDowngradeAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .downgrade('Non Existing Version');

            //Make sure that Audit Log created
            postAddonApiResponse;
            maxLoopsCounter = 90;
            do {
                generalService.sleep(1000);
                postAddonApiResponse = await generalService.papiClient.get(postDowngradeAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Downgrade_Addon_Without_New_Version_Files: postAddonApiResponse });

            //If no Audit log was found
            if (postAddonApiResponse == undefined) {
                postAddonApiResponse = {};
                //postAddonApiResponse.result = {};
                postAddonApiResponse.AuditInfo = {};
                postAddonApiResponse.AuditInfo.FromVersion = {};
                postAddonApiResponse.AuditInfo.FromVersion = 'Error - Audit Log was not found';
                postAddonApiResponse.AuditInfo.ToVersion = {};
                postAddonApiResponse.AuditInfo.ToVersion = 'Error - Audit Log was not found';
            }

            //Downgradeed version results
            let isErrorMessage = false;
            if (postAddonApiResponse.AuditInfo.ErrorMessage != undefined) {
                isErrorMessage = true;
            }
            mandatoryStepsDowngradeAddonWithoutExistingVersion.failedToDowngradeAddon = isErrorMessage;
            addTestResultUnderHeadline(
                testName,
                'Downgrade Addon Without Existing Version',
                isErrorMessage
                    ? true
                    : postAddonApiResponse.AuditInfo.FromVersion +
                          ' Downgraded to non existing version: ' +
                          postAddonApiResponse.AuditInfo.ToVersion,
            );

            if (!mandatoryStepsDowngradeAddonWithoutExistingVersion.failedToDowngradeAddon) {
                console.log({ Version_One_ID: versionsArr[0].Version });
                console.log({ Version_Two_ID: versionsArr[1].Version });
                console.log({ Version_Three_ID: versionsArr[2].Version });
                console.log({ Downgradeed_Version_ID: postAddonApiResponse.AuditInfo.ToVersion });
            }
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Uninstall addon
            const postUninstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .uninstall();
            console.log({ Post_Addon_Uninstall: postUninstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            if (postUninstallAddonApiResponse.URI != undefined) {
                do {
                    generalService.sleep(2000);
                    postAddonApiResponse = await generalService.papiClient.get(postUninstallAddonApiResponse.URI);
                    maxLoopsCounter--;
                } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                console.log({ Audit_Log_Addon_Uninstall: postAddonApiResponse });
                //Uninstall results
                mandatoryStepsDowngradeAddonWithoutExistingVersion.unInstallAddon = postAddonApiResponse.Status.ID == 1;
                addTestResultUnderHeadline(
                    testName,
                    'Uninstall Addon',
                    mandatoryStepsDowngradeAddonWithoutExistingVersion.unInstallAddon,
                );
            } else {
                //Uninstall results
                mandatoryStepsDowngradeAddonWithoutExistingVersion.unInstallAddon = false;
                addTestResultUnderHeadline(testName, 'Uninstall Addon', postUninstallAddonApiResponse);
            }

            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());
                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsDowngradeAddonWithoutExistingVersion.deleteAddon = !JSON.stringify(
                deleteApiResponse,
            ).includes('fault');
        }

        if (
            mandatoryStepsDowngradeAddonWithoutExistingVersion.createAddon == true &&
            mandatoryStepsDowngradeAddonWithoutExistingVersion.failedToDowngradeAddon == true &&
            mandatoryStepsDowngradeAddonWithoutExistingVersion.unInstallAddon == true &&
            mandatoryStepsDowngradeAddonWithoutExistingVersion.deleteAddon == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All downgrade addon without existing version – version 4 (Negative) Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All downgrade addon without existing version – version 4 (Negative) Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Downgrade addon with non available version – version 3 (Available = false) (Negative)
    async function executeDowngradeAddonWithNonAvailableVersionTest(testName, testDataBody) {
        const mandatoryStepsDowngradeAddonWithNonAvailableVersion = {
            createAddon: false,
            failedToDowngradeAddon: false,
            unInstallAddon: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsDowngradeAddonWithNonAvailableVersion.createAddon =
                testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                if (index == 2 || index == 0) {
                    versionTestDataBody.Available = false;
                }
                versionTestDataBody.Phased = true;
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody) as any,
                    },
                ).then((response) => response.json());
            }

            //Install addon with version
            const postInstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install(versionsArr[1].Version);
            console.log({ Post_Addon: postInstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(postInstallAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Addon_With_Non_Available_Version: postAddonApiResponse });

            //Downgrade to non available version
            const postDowngradeAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .downgrade(versionsArr[0].Version);

            //Make sure that Audit Log created
            postAddonApiResponse;
            maxLoopsCounter = 90;
            do {
                generalService.sleep(1000);
                postAddonApiResponse = await generalService.papiClient.get(postDowngradeAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Downgrade_Addon_With_Non_Available_Version_Files: postAddonApiResponse });

            //If no Audit log was found
            if (postAddonApiResponse == undefined) {
                postAddonApiResponse = {};
                //postAddonApiResponse.result = {};
                postAddonApiResponse.AuditInfo = {};
                postAddonApiResponse.AuditInfo.FromVersion = {};
                postAddonApiResponse.AuditInfo.FromVersion = 'Error - Audit Log was not found';
                postAddonApiResponse.AuditInfo.ToVersion = {};
                postAddonApiResponse.AuditInfo.ToVersion = 'Error - Audit Log was not found';
            }

            //Downgradeed version results
            let isErrorMessage = false;
            if (postAddonApiResponse.AuditInfo.ErrorMessage != undefined) {
                isErrorMessage = true;
            }
            //Since 24/06/2020 it is allowed to downgrade to non avialable versions
            mandatoryStepsDowngradeAddonWithNonAvailableVersion.failedToDowngradeAddon = !isErrorMessage; //isErrorMessage;
            addTestResultUnderHeadline(
                testName,
                'Downgrade Addon With Non Available Version',
                !isErrorMessage
                    ? true
                    : postAddonApiResponse.AuditInfo.FromVersion +
                          ' Downgraded to non available version: ' +
                          postAddonApiResponse.AuditInfo.ToVersion,
            );

            if (!mandatoryStepsDowngradeAddonWithNonAvailableVersion.failedToDowngradeAddon) {
                console.log({ Version_One_ID: versionsArr[0].Version });
                console.log({ Version_Two_ID: versionsArr[1].Version });
                console.log({ Version_Three_ID: versionsArr[2].Version });
                console.log({ Downgradeed_Version_ID: postAddonApiResponse.AuditInfo.ToVersion });
            }
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Uninstall addon
            const postUninstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .uninstall();
            console.log({ Post_Addon_Uninstall: postUninstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            if (postUninstallAddonApiResponse.URI != undefined) {
                do {
                    generalService.sleep(2000);
                    postAddonApiResponse = await generalService.papiClient.get(postUninstallAddonApiResponse.URI);
                    maxLoopsCounter--;
                } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                console.log({ Audit_Log_Addon_Uninstall: postAddonApiResponse });
                //Uninstall results
                mandatoryStepsDowngradeAddonWithNonAvailableVersion.unInstallAddon =
                    postAddonApiResponse.Status.ID == 1;
                addTestResultUnderHeadline(
                    testName,
                    'Uninstall Addon',
                    mandatoryStepsDowngradeAddonWithNonAvailableVersion.unInstallAddon,
                );
            } else {
                //Uninstall results
                mandatoryStepsDowngradeAddonWithNonAvailableVersion.unInstallAddon = false;
                addTestResultUnderHeadline(testName, 'Uninstall Addon', postUninstallAddonApiResponse);
            }

            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());
                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsDowngradeAddonWithNonAvailableVersion.deleteAddon = !JSON.stringify(
                deleteApiResponse,
            ).includes('fault');
        }

        if (
            mandatoryStepsDowngradeAddonWithNonAvailableVersion.createAddon == true &&
            mandatoryStepsDowngradeAddonWithNonAvailableVersion.failedToDowngradeAddon == true &&
            mandatoryStepsDowngradeAddonWithNonAvailableVersion.unInstallAddon == true &&
            mandatoryStepsDowngradeAddonWithNonAvailableVersion.deleteAddon == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All downgrade addon With Non Available version – version 3 (Negative) Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All downgrade addon With Non Available version – version 3 (Negative) Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Downgrade To Oldest Addon Version - Version 1
    async function executeDowngradeToOldestAddonVersionTest(testName, testDataBody) {
        const mandatoryStepsDowngradeToOldestAddonVersion = {
            createAddon: false,
            DowngradeCorrectVersion: false,
            unInstallAddon: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsDowngradeToOldestAddonVersion.createAddon = testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                if (index == 2) {
                    versionTestDataBody.Available = false;
                }
                versionTestDataBody.Phased = true;
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody) as any,
                    },
                ).then((response) => response.json());
            }

            //Install addon with version
            const postInstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install(versionsArr[1].Version);
            console.log({ Post_Addon: postInstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(postInstallAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Addon_With_Version: postAddonApiResponse });

            //Downgrade to old version
            const postDowngradeAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .downgrade(versionsArr[0].Version);

            //Make sure that Audit Log created
            postAddonApiResponse;
            maxLoopsCounter = 90;
            do {
                generalService.sleep(1000);
                postAddonApiResponse = await generalService.papiClient.get(postDowngradeAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Downgrade_Addon_With_Version_Files: postAddonApiResponse });

            //If no Audit log was found
            if (postAddonApiResponse == undefined) {
                postAddonApiResponse = {};
                //postAddonApiResponse.result = {};
                postAddonApiResponse.AuditInfo = {};
                postAddonApiResponse.AuditInfo.FromVersion = {};
                postAddonApiResponse.AuditInfo.FromVersion = 'Error - Audit Log was not found';
                postAddonApiResponse.AuditInfo.ToVersion = {};
                postAddonApiResponse.AuditInfo.ToVersion = 'Error - Audit Log was not found';
            }

            //Downgradeed version results
            let isErrorMessage = false;
            if (postAddonApiResponse.AuditInfo.ErrorMessage != undefined) {
                isErrorMessage = true;
            }
            mandatoryStepsDowngradeToOldestAddonVersion.DowngradeCorrectVersion = !isErrorMessage;
            addTestResultUnderHeadline(
                testName,
                'Downgrade Addon With Version',
                !isErrorMessage
                    ? true
                    : postAddonApiResponse.AuditInfo.FromVersion +
                          ' failed to downgraded to version: ' +
                          postAddonApiResponse.AuditInfo.ToVersion,
            );

            if (!mandatoryStepsDowngradeToOldestAddonVersion.DowngradeCorrectVersion) {
                console.log({ Version_One_ID: versionsArr[0].Version });
                console.log({ Version_Two_ID: versionsArr[1].Version });
                console.log({ Version_Three_ID: versionsArr[2].Version });
                console.log({ Downgradeed_Version_ID: postAddonApiResponse.AuditInfo.ToVersion });
            }
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Uninstall addon
            const postUninstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .uninstall();
            console.log({ Post_Addon_Uninstall: postUninstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            if (postUninstallAddonApiResponse.URI != undefined) {
                do {
                    generalService.sleep(2000);
                    postAddonApiResponse = await generalService.papiClient.get(postUninstallAddonApiResponse.URI);
                    maxLoopsCounter--;
                } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                console.log({ Audit_Log_Addon_Uninstall: postAddonApiResponse });
                //Uninstall results
                mandatoryStepsDowngradeToOldestAddonVersion.unInstallAddon = postAddonApiResponse.Status.ID == 1;
                addTestResultUnderHeadline(
                    testName,
                    'Uninstall Addon',
                    mandatoryStepsDowngradeToOldestAddonVersion.unInstallAddon,
                );
            } else {
                //Uninstall results
                mandatoryStepsDowngradeToOldestAddonVersion.unInstallAddon = false;
                addTestResultUnderHeadline(testName, 'Uninstall Addon', postUninstallAddonApiResponse);
            }

            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());
                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsDowngradeToOldestAddonVersion.deleteAddon = !JSON.stringify(deleteApiResponse).includes(
                'fault',
            );
        }

        if (
            mandatoryStepsDowngradeToOldestAddonVersion.createAddon == true &&
            mandatoryStepsDowngradeToOldestAddonVersion.DowngradeCorrectVersion == true &&
            mandatoryStepsDowngradeToOldestAddonVersion.unInstallAddon == true &&
            mandatoryStepsDowngradeToOldestAddonVersion.deleteAddon == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All downgrade To Oldest Addon Version - Version 1 Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All downgrade To Oldest Addon Version - Version 1 Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Downgrade Addon With New Version - Version 2 (Negative)
    async function executeDowngradeAddonWithNewVersionTest(testName, testDataBody) {
        const mandatoryStepsDowngradeAddonWithVersion = {
            createAddon: false,
            failedtoDowngradeVersion: false,
            unInstallAddon: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsDowngradeAddonWithVersion.createAddon = testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                if (index == 2) {
                    versionTestDataBody.Available = false;
                }
                versionTestDataBody.Phased = true;
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody) as any,
                    },
                ).then((response) => response.json());
            }

            //Install addon with version
            const postInstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install(versionsArr[0].Version);
            console.log({ Post_Addon: postInstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(postInstallAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Addon_With_Version: postAddonApiResponse });

            //Downgrade to old version
            const postDowngradeAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .downgrade(versionsArr[1].Version);

            //Make sure that Audit Log created
            postAddonApiResponse;
            maxLoopsCounter = 90;
            do {
                generalService.sleep(1000);
                postAddonApiResponse = await generalService.papiClient.get(postDowngradeAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Downgrade_Addon_With_Version_Files: postAddonApiResponse });

            //If no Audit log was found
            if (postAddonApiResponse == undefined) {
                postAddonApiResponse = {};
                //postAddonApiResponse.result = {};
                postAddonApiResponse.AuditInfo = {};
                postAddonApiResponse.AuditInfo.FromVersion = {};
                postAddonApiResponse.AuditInfo.FromVersion = 'Error - Audit Log was not found';
                postAddonApiResponse.AuditInfo.ToVersion = {};
                postAddonApiResponse.AuditInfo.ToVersion = 'Error - Audit Log was not found';
            }

            //Downgradeed version results
            let isErrorMessage = false;
            if (postAddonApiResponse.AuditInfo.ErrorMessage != undefined) {
                isErrorMessage = true;
            }
            mandatoryStepsDowngradeAddonWithVersion.failedtoDowngradeVersion = isErrorMessage != null;
            addTestResultUnderHeadline(
                testName,
                'Downgrade to old Addon Version',
                isErrorMessage
                    ? true
                    : postAddonApiResponse.AuditInfo.FromVersion +
                          ' failed to downgraded to version: ' +
                          postAddonApiResponse.AuditInfo.ToVersion,
            );

            if (!mandatoryStepsDowngradeAddonWithVersion.failedtoDowngradeVersion) {
                console.log({ Version_One_ID: versionsArr[0].Version });
                console.log({ Version_Two_ID: versionsArr[1].Version });
                console.log({ Version_Three_ID: versionsArr[2].Version });
                console.log({ Downgradeed_Version_ID: postAddonApiResponse.AuditInfo.ToVersion });
            }
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Uninstall addon
            const postUninstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .uninstall();
            console.log({ Post_Addon_Uninstall: postUninstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            if (postUninstallAddonApiResponse.URI != undefined) {
                do {
                    generalService.sleep(2000);
                    postAddonApiResponse = await generalService.papiClient.get(postUninstallAddonApiResponse.URI);
                    maxLoopsCounter--;
                } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                console.log({ Audit_Log_Addon_Uninstall: postAddonApiResponse });
                //Uninstall results
                mandatoryStepsDowngradeAddonWithVersion.unInstallAddon = postAddonApiResponse.Status.ID == 1;
                addTestResultUnderHeadline(
                    testName,
                    'Uninstall Addon',
                    mandatoryStepsDowngradeAddonWithVersion.unInstallAddon,
                );
            } else {
                //Uninstall results
                mandatoryStepsDowngradeAddonWithVersion.unInstallAddon = false;
                addTestResultUnderHeadline(testName, 'Uninstall Addon', postUninstallAddonApiResponse);
            }

            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());
                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsDowngradeAddonWithVersion.deleteAddon = !JSON.stringify(deleteApiResponse).includes('fault');
        }

        if (
            mandatoryStepsDowngradeAddonWithVersion.createAddon == true &&
            mandatoryStepsDowngradeAddonWithVersion.failedtoDowngradeVersion == true &&
            mandatoryStepsDowngradeAddonWithVersion.unInstallAddon == true &&
            mandatoryStepsDowngradeAddonWithVersion.deleteAddon == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All downgrade to new Addon Version - Version 2 (Negative) Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All downgrade to new Addon Version - Version 2 (Negative) Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Uninstall Addon
    async function executeUninstallAddonTest(testName, testDataBody) {
        const mandatoryStepsUninstallAddon = {
            createAddon: false,
            installAddon: false,
            InstallCorrectAddon: false,
            unInstallAddon: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsUninstallAddon.createAddon = testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                if (index == 2) {
                    versionTestDataBody.Available = false;
                }
                versionTestDataBody.Phased = true;
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody) as any,
                    },
                ).then((response) => response.json());
            }

            //Install newest available without version
            const postInstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install();
            console.log({ Post_Addon_Without_Version: postInstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(postInstallAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Addon_Without_Version: postAddonApiResponse });

            //If no Audit log was found
            if (postAddonApiResponse == undefined) {
                postAddonApiResponse = {};
                //postAddonApiResponse.result = {};
                postAddonApiResponse.AuditInfo = {};
                postAddonApiResponse.AuditInfo.ToVersion = {};
                postAddonApiResponse.AuditInfo.ToVersion = 'Error - Audit Log was not found';
            }

            //Install results
            mandatoryStepsUninstallAddon.installAddon = postAddonApiResponse.Status.Name == 'Success';
            addTestResultUnderHeadline(
                testName,
                'Install Addon Without Version',
                postAddonApiResponse.Status.Name == 'Success',
            );

            //Installed version results
            const isRightVersion = versionsArr[1].Version == postAddonApiResponse.AuditInfo.ToVersion;
            mandatoryStepsUninstallAddon.InstallCorrectAddon = isRightVersion;
            addTestResultUnderHeadline(
                testName,
                'Install Latest Addon Without Version',
                mandatoryStepsUninstallAddon.InstallCorrectAddon
                    ? true
                    : 'The response is: ' +
                          postAddonApiResponse.AuditInfo.ToVersion +
                          ' Expected response is: ' +
                          versionsArr[1].Version,
            );

            if (!isRightVersion) {
                console.log({ Version_One_ID: versionsArr[0].Version });
                console.log({ Version_Two_ID: versionsArr[1].Version });
                console.log({ Version_Three_ID: versionsArr[2].Version });
                console.log({ Installed_Version_ID: postAddonApiResponse.AuditInfo.ToVersion });
            }
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Uninstall addon
            const postUninstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .uninstall();
            console.log({ Post_Addon_Uninstall: postUninstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            if (postUninstallAddonApiResponse.URI != undefined) {
                do {
                    generalService.sleep(2000);
                    postAddonApiResponse = await generalService.papiClient.get(postUninstallAddonApiResponse.URI);
                    maxLoopsCounter--;
                } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                console.log({ Audit_Log_Addon_Uninstall: postAddonApiResponse });
                //Uninstall results
                mandatoryStepsUninstallAddon.unInstallAddon = postAddonApiResponse.Status.ID == 1;
                addTestResultUnderHeadline(testName, 'Uninstall Addon', mandatoryStepsUninstallAddon.unInstallAddon);
            } else {
                //Uninstall results
                mandatoryStepsUninstallAddon.unInstallAddon = false;
                addTestResultUnderHeadline(testName, 'Uninstall Addon', postUninstallAddonApiResponse);
            }

            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());
                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsUninstallAddon.deleteAddon = !JSON.stringify(deleteApiResponse).includes('fault');
        }

        if (
            mandatoryStepsUninstallAddon.createAddon == true &&
            mandatoryStepsUninstallAddon.installAddon == true &&
            mandatoryStepsUninstallAddon.InstallCorrectAddon == true &&
            mandatoryStepsUninstallAddon.unInstallAddon == true &&
            mandatoryStepsUninstallAddon.deleteAddon == true
        ) {
            addTestResultUnderHeadline(testName, 'All Uninstall Addon Test mandatory steps complete');
        } else {
            addTestResultUnderHeadline(testName, 'All Uninstall Addon Test mandatory steps complete', false);
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Uninstall With deleted addon version
    async function executeUninstallAddonWithDeletedVersionTest(testName, testDataBody) {
        const mandatoryStepsUninstalAddonWithDeletedAddonVersion = {
            createAddon: false,
            installAddon: false,
            InstallCorrectAddon: false,
            unInstalAddonWithDeletedAddonVersion: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsUninstalAddonWithDeletedAddonVersion.createAddon =
                testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                if (index == 2) {
                    versionTestDataBody.Available = false;
                }
                versionTestDataBody.Phased = true;
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody) as any,
                    },
                ).then((response) => response.json());
            }

            //Install newest available without version
            const postInstalAddonWithDeletedAddonVersionApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install();
            console.log({ Post_Addon_Without_Version: postInstalAddonWithDeletedAddonVersionApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(
                    postInstalAddonWithDeletedAddonVersionApiResponse.URI as any,
                );
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Addon_Without_Version: postAddonApiResponse });

            //If no Audit log was found
            if (postAddonApiResponse == undefined) {
                postAddonApiResponse = {};
                //postAddonApiResponse.result = {};
                postAddonApiResponse.AuditInfo = {};
                postAddonApiResponse.AuditInfo.ToVersion = {};
                postAddonApiResponse.AuditInfo.ToVersion = 'Error - Audit Log was not found';
            }

            //Install results
            mandatoryStepsUninstalAddonWithDeletedAddonVersion.installAddon =
                postAddonApiResponse.Status.Name == 'Success';
            addTestResultUnderHeadline(
                testName,
                'Install Addon Without Version',
                postAddonApiResponse.Status.Name == 'Success',
            );

            //Installed version results
            const isRightVersion = versionsArr[1].Version == postAddonApiResponse.AuditInfo.ToVersion;
            mandatoryStepsUninstalAddonWithDeletedAddonVersion.InstallCorrectAddon = isRightVersion;
            addTestResultUnderHeadline(
                testName,
                'Install Latest Addon Without Version',
                mandatoryStepsUninstalAddonWithDeletedAddonVersion.InstallCorrectAddon
                    ? true
                    : 'The response is: ' +
                          postAddonApiResponse.AuditInfo.ToVersion +
                          ' Expected response is: ' +
                          versionsArr[1].Version,
            );

            if (!isRightVersion) {
                console.log({ Version_One_ID: versionsArr[0].Version });
                console.log({ Version_Two_ID: versionsArr[1].Version });
                console.log({ Version_Three_ID: versionsArr[2].Version });
                console.log({ Installed_Version_ID: postAddonApiResponse.AuditInfo.ToVersion });
            }

            //Delete Addon version
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                    '/var/addons/versions/' +
                    versionsArr[1].UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Version_Delete: deleteApiResponse });
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Uninstall addon
            const postUninstalAddonWithDeletedAddonVersionApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .uninstall();
            console.log({ Post_Addon_Uninstall: postUninstalAddonWithDeletedAddonVersionApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            if (
                postUninstalAddonWithDeletedAddonVersionApiResponse != undefined &&
                postUninstalAddonWithDeletedAddonVersionApiResponse.URI != undefined
            ) {
                do {
                    generalService.sleep(2000);
                    postAddonApiResponse = await generalService.papiClient.get(
                        postUninstalAddonWithDeletedAddonVersionApiResponse.URI,
                    );
                    maxLoopsCounter--;
                } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                console.log({ Audit_Log_Addon_Uninstall: postAddonApiResponse });
                //Uninstall results
                mandatoryStepsUninstalAddonWithDeletedAddonVersion.unInstalAddonWithDeletedAddonVersion =
                    postAddonApiResponse.Status.ID == 1;
                addTestResultUnderHeadline(
                    testName,
                    'Uninstall Addon With deleted addon version',
                    mandatoryStepsUninstalAddonWithDeletedAddonVersion.unInstalAddonWithDeletedAddonVersion,
                );
            } else {
                //Uninstall results
                mandatoryStepsUninstalAddonWithDeletedAddonVersion.unInstalAddonWithDeletedAddonVersion = false;
                addTestResultUnderHeadline(
                    testName,
                    'Uninstall Addon With deleted addon version',
                    postUninstalAddonWithDeletedAddonVersionApiResponse,
                );
            }

            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());
                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsUninstalAddonWithDeletedAddonVersion.deleteAddon = !JSON.stringify(
                deleteApiResponse,
            ).includes('fault');
        }

        if (
            mandatoryStepsUninstalAddonWithDeletedAddonVersion.createAddon == true &&
            mandatoryStepsUninstalAddonWithDeletedAddonVersion.installAddon == true &&
            mandatoryStepsUninstalAddonWithDeletedAddonVersion.InstallCorrectAddon == true &&
            mandatoryStepsUninstalAddonWithDeletedAddonVersion.unInstalAddonWithDeletedAddonVersion == true &&
            mandatoryStepsUninstalAddonWithDeletedAddonVersion.deleteAddon == true
        ) {
            addTestResultUnderHeadline(testName, 'All Uninstall Addon Test mandatory steps complete');
        } else {
            addTestResultUnderHeadline(testName, 'All Uninstall Addon Test mandatory steps complete', false);
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Uninstall with deleted addon
    async function executeUninstallAddonWithDeletedAddonTest(testName, testDataBody) {
        const mandatoryStepsUninstallAddonWithDeletedAddon = {
            createAddon: false,
            installAddon: false,
            InstallCorrectAddon: false,
            unInstalAddonWithDeletedAddon: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsUninstallAddonWithDeletedAddon.createAddon = testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                if (index == 2) {
                    versionTestDataBody.Available = false;
                }
                versionTestDataBody.Phased = true;
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody) as any,
                    },
                ).then((response) => response.json());
            }

            //Install newest available without version
            const postInstalAddonWithDeletedAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install();
            console.log({ Post_Addon_Without_Version: postInstalAddonWithDeletedAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(
                    postInstalAddonWithDeletedAddonApiResponse.URI as any,
                );
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Addon_Without_Version: postAddonApiResponse });

            //If no Audit log was found
            if (postAddonApiResponse == undefined) {
                postAddonApiResponse = {};
                //postAddonApiResponse.result = {};
                postAddonApiResponse.AuditInfo = {};
                postAddonApiResponse.AuditInfo.ToVersion = {};
                postAddonApiResponse.AuditInfo.ToVersion = 'Error - Audit Log was not found';
            }

            //install results
            mandatoryStepsUninstallAddonWithDeletedAddon.installAddon = postAddonApiResponse.Status.ID == 1;
            addTestResultUnderHeadline(
                testName,
                'Install Addon Without Version',
                mandatoryStepsUninstallAddonWithDeletedAddon.installAddon,
            );

            //Installed version results
            const isRightVersion = versionsArr[1].Version == postAddonApiResponse.AuditInfo.ToVersion;
            mandatoryStepsUninstallAddonWithDeletedAddon.InstallCorrectAddon = isRightVersion;
            addTestResultUnderHeadline(
                testName,
                'Install Latest Addon Without Version',
                mandatoryStepsUninstallAddonWithDeletedAddon.InstallCorrectAddon
                    ? true
                    : 'The response is: ' +
                          postAddonApiResponse.AuditInfo.ToVersion +
                          ' Expected response is: ' +
                          versionsArr[1].Version,
            );

            if (!isRightVersion) {
                console.log({ Version_One_ID: versionsArr[0].Version });
                console.log({ Version_Two_ID: versionsArr[1].Version });
                console.log({ Version_Three_ID: versionsArr[2].Version });
                console.log({ Installed_Version_ID: postAddonApiResponse.AuditInfo.ToVersion });
            }
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());
                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsUninstallAddonWithDeletedAddon.deleteAddon = !JSON.stringify(deleteApiResponse).includes(
                'fault',
            );
        }

        //Uninstall addon
        const postUninstalAddonWithDeletedAddonApiResponse = await generalService.papiClient.addons.installedAddons
            .addonUUID(createApiResponse.UUID)
            .uninstall();
        console.log({ Post_Addon_Uninstall: postUninstalAddonWithDeletedAddonApiResponse });

        let postAddonApiResponse;
        let maxLoopsCounter = 90;
        if (
            postUninstalAddonWithDeletedAddonApiResponse != undefined &&
            postUninstalAddonWithDeletedAddonApiResponse.URI != undefined
        ) {
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(
                    postUninstalAddonWithDeletedAddonApiResponse.URI,
                );
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Addon_Uninstall: postAddonApiResponse });
            //Uninstall results
            mandatoryStepsUninstallAddonWithDeletedAddon.unInstalAddonWithDeletedAddon =
                postAddonApiResponse.Status.ID == 1;
            addTestResultUnderHeadline(
                testName,
                'Uninstall Addon With deleted addon',
                mandatoryStepsUninstallAddonWithDeletedAddon.unInstalAddonWithDeletedAddon,
            );
        } else {
            console.log({ Error_In_Uninstall_Result: postUninstalAddonWithDeletedAddonApiResponse });
            //Uninstall results
            mandatoryStepsUninstallAddonWithDeletedAddon.unInstalAddonWithDeletedAddon = false;
            addTestResultUnderHeadline(
                testName,
                'Uninstall Addon With deleted addon',
                postUninstalAddonWithDeletedAddonApiResponse,
            );
        }

        if (
            mandatoryStepsUninstallAddonWithDeletedAddon.createAddon == true &&
            mandatoryStepsUninstallAddonWithDeletedAddon.installAddon == true &&
            mandatoryStepsUninstallAddonWithDeletedAddon.InstallCorrectAddon == true &&
            mandatoryStepsUninstallAddonWithDeletedAddon.unInstalAddonWithDeletedAddon == true &&
            mandatoryStepsUninstallAddonWithDeletedAddon.deleteAddon == true
        ) {
            addTestResultUnderHeadline(testName, 'All Uninstall Addon Test mandatory steps complete');
        } else {
            addTestResultUnderHeadline(testName, 'All Uninstall Addon Test mandatory steps complete', false);
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Upgrade Uninstalled addon (Negative)
    async function executeUninstallAddonAndUpgradeTest(testName, testDataBody) {
        const mandatoryStepsUninstallAddonAndUpgrade = {
            createAddon: false,
            installAddon: false,
            installCorrectAddon: false,
            unInstallAddon: false,
            upgradeUnInstalledAddon: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsUninstallAddonAndUpgrade.createAddon = testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                if (index == 2) {
                    versionTestDataBody.Available = false;
                }
                versionTestDataBody.Phased = true;
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody) as any,
                    },
                ).then((response) => response.json());
            }

            //Install newest available without version
            const postInstalAddonWithDeletedAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install(versionsArr[0].Version);
            console.log({ Post_Addon_Without_Version: postInstalAddonWithDeletedAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(
                    postInstalAddonWithDeletedAddonApiResponse.URI as any,
                );
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Addon_Without_Version: postAddonApiResponse });

            //If no Audit log was found
            if (postAddonApiResponse == undefined) {
                postAddonApiResponse = {};
                //postAddonApiResponse.result = {};
                postAddonApiResponse.AuditInfo = {};
                postAddonApiResponse.AuditInfo.ToVersion = {};
                postAddonApiResponse.AuditInfo.ToVersion = 'Error - Audit Log was not found';
            }

            //Installed results
            mandatoryStepsUninstallAddonAndUpgrade.installAddon = postAddonApiResponse.Status.ID == 1;
            addTestResultUnderHeadline(testName, 'Install Addon', mandatoryStepsUninstallAddonAndUpgrade.installAddon);

            //Installed version results
            const isRightVersion = versionsArr[0].Version == postAddonApiResponse.AuditInfo.ToVersion;
            mandatoryStepsUninstallAddonAndUpgrade.installCorrectAddon = isRightVersion;
            addTestResultUnderHeadline(
                testName,
                'Install Oldest Addon Version',
                mandatoryStepsUninstallAddonAndUpgrade.installCorrectAddon
                    ? true
                    : 'The response is: ' +
                          postAddonApiResponse.AuditInfo.ToVersion +
                          ' Expected response is: ' +
                          versionsArr[1].Version,
            );

            if (!isRightVersion) {
                console.log({ Version_One_ID: versionsArr[0].Version });
                console.log({ Version_Two_ID: versionsArr[1].Version });
                console.log({ Version_Three_ID: versionsArr[2].Version });
                console.log({ Installed_Version_ID: postAddonApiResponse.AuditInfo.ToVersion });
            }

            //Uninstall addon
            const postUninstalAddonWithDeletedAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .uninstall();
            console.log({ Post_Addon_Uninstall: postUninstalAddonWithDeletedAddonApiResponse });

            postAddonApiResponse;
            maxLoopsCounter = 90;
            if (
                postUninstalAddonWithDeletedAddonApiResponse != undefined &&
                postUninstalAddonWithDeletedAddonApiResponse.URI != undefined
            ) {
                do {
                    generalService.sleep(2000);
                    postAddonApiResponse = await generalService.papiClient.get(
                        postUninstalAddonWithDeletedAddonApiResponse.URI,
                    );
                    maxLoopsCounter--;
                } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                console.log({ Audit_Log_Addon_Uninstall: postAddonApiResponse });
                //Uninstall results
                mandatoryStepsUninstallAddonAndUpgrade.unInstallAddon = postAddonApiResponse.Status.ID == 1;
                addTestResultUnderHeadline(
                    testName,
                    'Uninstall Addon',
                    mandatoryStepsUninstallAddonAndUpgrade.unInstallAddon,
                );
            } else {
                console.log({ Error_In_Uninstall_Result: postUninstalAddonWithDeletedAddonApiResponse });
                //Uninstall results
                mandatoryStepsUninstallAddonAndUpgrade.unInstallAddon = false;
                addTestResultUnderHeadline(testName, 'Uninstall Addon', postUninstalAddonWithDeletedAddonApiResponse);
            }

            //Upgrade to new version
            const postUpgradeAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .upgrade(versionsArr[1].Version);
            console.log({ Response_Upgrade_After_Uninstall: postUpgradeAddonApiResponse });

            postAddonApiResponse;
            maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(postUpgradeAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Upgrade_After_Uninstall: postAddonApiResponse });
            //Uninstall results
            mandatoryStepsUninstallAddonAndUpgrade.upgradeUnInstalledAddon = postAddonApiResponse.Status.ID == 0;
            addTestResultUnderHeadline(
                testName,
                'Upgrade Uninstalled Addon',
                mandatoryStepsUninstallAddonAndUpgrade.upgradeUnInstalledAddon,
            );
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());
                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsUninstallAddonAndUpgrade.deleteAddon = !JSON.stringify(deleteApiResponse).includes('fault');
        }

        if (
            mandatoryStepsUninstallAddonAndUpgrade.createAddon == true &&
            mandatoryStepsUninstallAddonAndUpgrade.installAddon == true &&
            mandatoryStepsUninstallAddonAndUpgrade.installCorrectAddon == true &&
            mandatoryStepsUninstallAddonAndUpgrade.unInstallAddon == true &&
            mandatoryStepsUninstallAddonAndUpgrade.upgradeUnInstalledAddon == true &&
            mandatoryStepsUninstallAddonAndUpgrade.deleteAddon == true
        ) {
            addTestResultUnderHeadline(testName, 'All Uninstall Addon Test mandatory steps complete');
        } else {
            addTestResultUnderHeadline(testName, 'All Uninstall Addon Test mandatory steps complete', false);
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Downgrade Uninstalled addon (Negative)
    async function executeUninstallAddonAndDowngradeTest(testName, testDataBody) {
        const mandatoryStepsUninstallAddonAndDowngrade = {
            createAddon: false,
            installAddon: false,
            installCorrectAddon: false,
            unInstallAddon: false,
            downgradeUnInstalledAddon: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsUninstallAddonAndDowngrade.createAddon = testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                if (index == 2) {
                    versionTestDataBody.Available = false;
                }
                versionTestDataBody.Phased = true;
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody) as any,
                    },
                ).then((response) => response.json());
            }

            //Install newest available without version
            const postInstalAddonWithDeletedAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install();
            console.log({ Post_Addon_Without_Version: postInstalAddonWithDeletedAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(
                    postInstalAddonWithDeletedAddonApiResponse.URI as any,
                );
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Addon_Without_Version: postAddonApiResponse });

            //If no Audit log was found
            if (postAddonApiResponse == undefined) {
                postAddonApiResponse = {};
                //postAddonApiResponse.result = {};
                postAddonApiResponse.AuditInfo = {};
                postAddonApiResponse.AuditInfo.ToVersion = {};
                postAddonApiResponse.AuditInfo.ToVersion = 'Error - Audit Log was not found';
            }

            //Installed results
            mandatoryStepsUninstallAddonAndDowngrade.installAddon = postAddonApiResponse.Status.ID == 1;
            addTestResultUnderHeadline(
                testName,
                'Install Addon Without Version',
                mandatoryStepsUninstallAddonAndDowngrade.installAddon,
            );

            //Installed version results
            const isRightVersion = versionsArr[1].Version == postAddonApiResponse.AuditInfo.ToVersion;
            mandatoryStepsUninstallAddonAndDowngrade.installCorrectAddon = isRightVersion;
            addTestResultUnderHeadline(
                testName,
                'Install Latest Addon Version',
                mandatoryStepsUninstallAddonAndDowngrade.installCorrectAddon
                    ? true
                    : 'The response is: ' +
                          postAddonApiResponse.AuditInfo.ToVersion +
                          ' Expected response is: ' +
                          versionsArr[1].Version,
            );

            if (!isRightVersion) {
                console.log({ Version_One_ID: versionsArr[0].Version });
                console.log({ Version_Two_ID: versionsArr[1].Version });
                console.log({ Version_Three_ID: versionsArr[2].Version });
                console.log({ Installed_Version_ID: postAddonApiResponse.AuditInfo.ToVersion });
            }

            //Uninstall addon
            const postUninstalAddonWithDeletedAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .uninstall();
            console.log({ Post_Addon_Uninstall: postUninstalAddonWithDeletedAddonApiResponse });

            postAddonApiResponse;
            maxLoopsCounter = 90;
            if (
                postUninstalAddonWithDeletedAddonApiResponse != undefined &&
                postUninstalAddonWithDeletedAddonApiResponse.URI != undefined
            ) {
                do {
                    generalService.sleep(2000);
                    postAddonApiResponse = await generalService.papiClient.get(
                        postUninstalAddonWithDeletedAddonApiResponse.URI,
                    );
                    maxLoopsCounter--;
                } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                console.log({ Audit_Log_Addon_Uninstall: postAddonApiResponse });
                //Uninstall results
                mandatoryStepsUninstallAddonAndDowngrade.unInstallAddon = postAddonApiResponse.Status.ID == 1;
                addTestResultUnderHeadline(
                    testName,
                    'Uninstall Addon',
                    mandatoryStepsUninstallAddonAndDowngrade.unInstallAddon,
                );
            } else {
                console.log({ Error_In_Uninstall_Result: postUninstalAddonWithDeletedAddonApiResponse });
                //Uninstall results
                mandatoryStepsUninstallAddonAndDowngrade.unInstallAddon = false;
                addTestResultUnderHeadline(testName, 'Uninstall Addon', postUninstalAddonWithDeletedAddonApiResponse);
            }

            //Downgrade to old version
            const postDowngradeAddonApiResponse = await await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .downgrade(versionsArr[1].Version);

            console.log({ Response_Downgrade_After_Uninstall: postDowngradeAddonApiResponse });

            postAddonApiResponse;
            maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(postDowngradeAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Downgrade_After_Uninstall: postAddonApiResponse });

            //Uninstall results
            mandatoryStepsUninstallAddonAndDowngrade.downgradeUnInstalledAddon = postAddonApiResponse.Status.ID == 0;
            addTestResultUnderHeadline(
                testName,
                'Downgrade Uninstalled Addon',
                mandatoryStepsUninstallAddonAndDowngrade.downgradeUnInstalledAddon,
            );
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());
                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsUninstallAddonAndDowngrade.deleteAddon = !JSON.stringify(deleteApiResponse).includes('fault');
        }

        if (
            mandatoryStepsUninstallAddonAndDowngrade.createAddon == true &&
            mandatoryStepsUninstallAddonAndDowngrade.installAddon == true &&
            mandatoryStepsUninstallAddonAndDowngrade.installCorrectAddon == true &&
            mandatoryStepsUninstallAddonAndDowngrade.unInstallAddon == true &&
            mandatoryStepsUninstallAddonAndDowngrade.downgradeUnInstalledAddon == true &&
            mandatoryStepsUninstallAddonAndDowngrade.deleteAddon == true
        ) {
            addTestResultUnderHeadline(testName, 'All Uninstall Addon Test mandatory steps complete');
        } else {
            addTestResultUnderHeadline(testName, 'All Uninstall Addon Test mandatory steps complete', false);
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Dependencies Install
    async function executeDependenciesInstallTest(testName, testDataBody) {
        const mandatoryStepsInstallAddonWithVersion = {
            createAddon: false,
            installAddon: false,
            InstallCorrectAddon: false,
            unInstallAddon: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsInstallAddonWithVersion.createAddon = testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                if (index == 2) {
                    versionTestDataBody.Available = false;
                }
                versionTestDataBody.Phased = true;
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                if (testName.includes('Negative')) {
                    versionTestDataBody.PublishConfig = JSON.stringify({
                        Editors: [
                            {
                                ParentPackageName: `ParentPackageName Install Test ${index}`,
                                PackageName: `PackageName Install Test ${index}`,
                                Description: `Description Install Test ${index}`,
                            },
                            {
                                ParentPackageName: `ParentPackageName Install Test ${index}`,
                                PackageName: `PackageName Install Test ${index}`,
                                Description: `Description Install Test ${index}`,
                            },
                        ],
                        Dependencies: {
                            papi: '9.5.301',
                            cpapi: 'V141.1',
                            webapp: '16.41.34',
                            data_views: '0.0.35',
                        },
                    });
                } else {
                    versionTestDataBody.PublishConfig = JSON.stringify({
                        Editors: [
                            {
                                ParentPackageName: `ParentPackageName Install Test ${index}`,
                                PackageName: `PackageName Install Test ${index}`,
                                Description: `Description Install Test ${index}`,
                            },
                            {
                                ParentPackageName: `ParentPackageName Install Test ${index}`,
                                PackageName: `PackageName Install Test ${index}`,
                                Description: `Description Install Test ${index}`,
                            },
                        ],
                        Dependencies: {
                            papi: '9.5.301',
                            cpapi: 'V141',
                            webapp: '16.41.34',
                            data_views: '0.0.35',
                        },
                    });
                }

                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody) as any,
                    },
                ).then((response) => response.json());
            }

            //Install with available version
            const postInstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install(versionsArr[0].Version);
            console.log({ Post_Addon_with_Version: postInstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(postInstallAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Addon_With_Version: postAddonApiResponse });

            //If no Audit log was found
            if (postAddonApiResponse == undefined) {
                postAddonApiResponse = {};
                //postAddonApiResponse.result = {};
                postAddonApiResponse.AuditInfo = {};
                postAddonApiResponse.AuditInfo.ToVersion = {};
                postAddonApiResponse.AuditInfo.ToVersion = 'Error - Audit Log was not found';
            }

            //Install results
            if (testName.includes('Negative')) {
                mandatoryStepsInstallAddonWithVersion.installAddon = postAddonApiResponse.Status.Name == 'Failure';
                addTestResultUnderHeadline(
                    testName,
                    'Fail To Install Addon With Version',
                    postAddonApiResponse.Status.Name == 'Failure',
                );
            } else {
                mandatoryStepsInstallAddonWithVersion.installAddon = postAddonApiResponse.Status.Name == 'Success';
                addTestResultUnderHeadline(
                    testName,
                    'Install Addon With Version',
                    postAddonApiResponse.Status.Name == 'Success',
                );
            }

            //Installed version results
            if (testName.includes('Negative')) {
                const isErrorMessage = postAddonApiResponse.AuditInfo.ErrorMessage.includes(
                    'Invalid dependencies configuration - cpapi dependency version V141.1 does not exists',
                );
                addTestResultUnderHeadline(testName, 'Correct Dependency Error Message', isErrorMessage);
                mandatoryStepsInstallAddonWithVersion.InstallCorrectAddon = isErrorMessage;
            } else {
                const isRightVersion = versionsArr[0].Version == postAddonApiResponse.AuditInfo.ToVersion;
                mandatoryStepsInstallAddonWithVersion.InstallCorrectAddon = isRightVersion;
                addTestResultUnderHeadline(
                    testName,
                    'Install First Addon With Version',
                    mandatoryStepsInstallAddonWithVersion.InstallCorrectAddon
                        ? true
                        : 'The response is: ' +
                              postAddonApiResponse.AuditInfo.ToVersion +
                              ' Expected response is: ' +
                              versionsArr[0].Version,
                );

                if (!isRightVersion) {
                    console.log({ Version_One_ID: versionsArr[0].Version });
                    console.log({ Version_Two_ID: versionsArr[1].Version });
                    console.log({ Version_Three_ID: versionsArr[2].Version });
                    console.log({ Installed_Version_ID: postAddonApiResponse.AuditInfo.ToVersion });
                }
            }

            const getInstalledAddonsApiResponse = await generalService.papiClient.get(
                '/addons/installed_addons?page_size=-1',
            );
            console.log({ Install_Installed_Addon: getInstalledAddonsApiResponse[0] });
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Uninstall addon
            const postUninstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .uninstall();
            console.log({ Post_Addon_Uninstall: postUninstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            if (postUninstallAddonApiResponse.URI != undefined) {
                do {
                    generalService.sleep(2000);
                    postAddonApiResponse = await generalService.papiClient.get(postUninstallAddonApiResponse.URI);
                    maxLoopsCounter--;
                } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                console.log({ Audit_Log_Addon_Uninstall: postAddonApiResponse });
                //Uninstall results
                if (testName.includes('Negative')) {
                    mandatoryStepsInstallAddonWithVersion.unInstallAddon = postAddonApiResponse.Status.ID == 0;
                    addTestResultUnderHeadline(
                        testName,
                        'Uninstall Addon',
                        mandatoryStepsInstallAddonWithVersion.unInstallAddon,
                    );
                } else {
                    mandatoryStepsInstallAddonWithVersion.unInstallAddon = postAddonApiResponse.Status.ID == 1;
                    addTestResultUnderHeadline(
                        testName,
                        'Uninstall Addon',
                        mandatoryStepsInstallAddonWithVersion.unInstallAddon,
                    );
                }
            } else {
                //Uninstall results
                mandatoryStepsInstallAddonWithVersion.unInstallAddon = false;
                addTestResultUnderHeadline(testName, 'Uninstall Addon', postUninstallAddonApiResponse);
            }

            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());
                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsInstallAddonWithVersion.deleteAddon = !JSON.stringify(deleteApiResponse).includes('fault');
        }

        if (
            mandatoryStepsInstallAddonWithVersion.createAddon == true &&
            mandatoryStepsInstallAddonWithVersion.installAddon == true &&
            mandatoryStepsInstallAddonWithVersion.InstallCorrectAddon == true &&
            mandatoryStepsInstallAddonWithVersion.unInstallAddon == true &&
            mandatoryStepsInstallAddonWithVersion.deleteAddon == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Install Addon With Version - Version 1 Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Install Addon With Version - Version 1 Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Dependencies Install With Dependency Installation Test
    async function executeDependenciesInstallWithDependencyInstallationTest(testName, testDataBody) {
        const mandatoryStepsInstallAddonWithVersion = {
            createAddon: false,
            installAddon: false,
            InstallCorrectAddon: false,
            unInstallAddon: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsInstallAddonWithVersion.createAddon = testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                if (index == 2) {
                    versionTestDataBody.Available = false;
                }
                versionTestDataBody.Phased = true;
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                if (testName.includes('Negative')) {
                    if (testName.includes('Exist')) {
                        versionTestDataBody.PublishConfig = JSON.stringify({
                            Editors: [
                                {
                                    ParentPackageName: `ParentPackageName Install Test ${index}`,
                                    PackageName: `PackageName Install Test ${index}`,
                                    Description: `Description Install Test ${index}`,
                                },
                                {
                                    ParentPackageName: `ParentPackageName Install Test ${index}`,
                                    PackageName: `PackageName Install Test ${index}`,
                                    Description: `Description Install Test ${index}`,
                                },
                            ],
                            Dependencies: {
                                papi: '9.5.301',
                                cpapi: 'V141',
                                webapp: '16.41.34',
                                data_views: '0.0.37.1',
                            },
                        });
                    } else {
                        versionTestDataBody.PublishConfig = JSON.stringify({
                            Editors: [
                                {
                                    ParentPackageName: `ParentPackageName Install Test ${index}`,
                                    PackageName: `PackageName Install Test ${index}`,
                                    Description: `Description Install Test ${index}`,
                                },
                                {
                                    ParentPackageName: `ParentPackageName Install Test ${index}`,
                                    PackageName: `PackageName Install Test ${index}`,
                                    Description: `Description Install Test ${index}`,
                                },
                            ],
                            Dependencies: {
                                papi: '9.5.301',
                                cpapi: 'V141',
                                webapp: '16.41.34',
                                data_views: '0.0.38',
                            },
                        });
                    }
                } else {
                    versionTestDataBody.PublishConfig = JSON.stringify({
                        Editors: [
                            {
                                ParentPackageName: `ParentPackageName Install Test ${index}`,
                                PackageName: `PackageName Install Test ${index}`,
                                Description: `Description Install Test ${index}`,
                            },
                            {
                                ParentPackageName: `ParentPackageName Install Test ${index}`,
                                PackageName: `PackageName Install Test ${index}`,
                                Description: `Description Install Test ${index}`,
                            },
                        ],
                        Dependencies: {
                            papi: '9.5.301',
                            cpapi: 'V141',
                            webapp: '16.41.34',
                            data_views: '0.0.37',
                        },
                    });
                }

                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody) as any,
                    },
                ).then((response) => response.json());
            }

            //https://{{server}}.pepperi.com/V1.0/addons/installed_addons?where=Version='0.0.38'

            //     "UUID": "1a067b97-628c-4783-96c9-1df0513730bc",
            //     "Addon": {
            //         "UUID": "484e7f22-796a-45f8-9082-12a734bac4e8",
            //         "Name": "Data Views API",
            //         "Description": "Data Views API",*/
            // //https://{{server}}.pepperi.com/V1.0/addons/installed_addons/484e7f22-796a-45f8-9082-12a734bac4e8/uninstall

            //   "URI": "/audit_logs/acea0d2f-da40-49a7-a81c-8c5b3dc18b9c"
            // }

            //
            //https://{{server}}.pepperi.com/V1.0/addons/installed_addons/484e7f22-796a-45f8-9082-12a734bac4e8/install

            //https://{{server}}.pepperi.com/V1.0/addons/installed_addons/484e7f22-796a-45f8-9082-12a734bac4e8/upgrade/0.0.38

            //Uninstall Data Views Addon
            const uninstallApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID('484e7f22-796a-45f8-9082-12a734bac4e8')
                .uninstall();
            console.log({ Uninstall_Api_Response: uninstallApiResponse });

            let uninstallAuditLogResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                uninstallAuditLogResponse = await generalService.papiClient.get(uninstallApiResponse.URI as any);
                maxLoopsCounter--;
            } while (uninstallAuditLogResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Uninstall_Audit_Log_Response: uninstallAuditLogResponse });

            //Install with available version
            const postInstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install(versionsArr[0].Version);
            console.log({ Post_Addon_with_Version: postInstallAddonApiResponse });

            let postAddonApiResponse;
            maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(postInstallAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Addon_With_Version: postAddonApiResponse });

            //If no Audit log was found
            if (postAddonApiResponse == undefined) {
                postAddonApiResponse = {};
                //postAddonApiResponse.result = {};
                postAddonApiResponse.AuditInfo = {};
                postAddonApiResponse.AuditInfo.ToVersion = {};
                postAddonApiResponse.AuditInfo.ToVersion = 'Error - Audit Log was not found';
            }

            //Install results
            if (testName.includes('Negative')) {
                mandatoryStepsInstallAddonWithVersion.installAddon = postAddonApiResponse.Status.Name == 'Failure';
                addTestResultUnderHeadline(
                    testName,
                    'Fail To Install Addon With Version',
                    postAddonApiResponse.Status.Name == 'Failure',
                );
            } else {
                mandatoryStepsInstallAddonWithVersion.installAddon = postAddonApiResponse.Status.Name == 'Success';
                addTestResultUnderHeadline(
                    testName,
                    'Install Addon With Version',
                    postAddonApiResponse.Status.Name == 'Success',
                );
            }

            //Installed version results
            if (testName.includes('Negative')) {
                if (testName.includes('Exist')) {
                    const isErrorMessage = postAddonApiResponse.AuditInfo.ErrorMessage.includes(
                        'Invalid dependencies configuration - data_views dependency version 0.0.37.1 does not exists',
                    );
                    addTestResultUnderHeadline(testName, 'Correct Dependency Error Message', isErrorMessage);
                    mandatoryStepsInstallAddonWithVersion.InstallCorrectAddon = isErrorMessage;
                } else {
                    const isErrorMessage = postAddonApiResponse.AuditInfo.ErrorMessage.includes(
                        "The distributor installed addons don't answer the dependencies. Addon data_views needed version is >=0.0.38 but current version is 0.0.37",
                    );
                    addTestResultUnderHeadline(testName, 'Correct Dependency Error Message', isErrorMessage);
                    mandatoryStepsInstallAddonWithVersion.InstallCorrectAddon = isErrorMessage;
                }
            } else {
                const isRightVersion = versionsArr[0].Version == postAddonApiResponse.AuditInfo.ToVersion;
                mandatoryStepsInstallAddonWithVersion.InstallCorrectAddon = isRightVersion;
                addTestResultUnderHeadline(
                    testName,
                    'Install First Addon With Version',
                    mandatoryStepsInstallAddonWithVersion.InstallCorrectAddon
                        ? true
                        : 'The response is: ' +
                              postAddonApiResponse.AuditInfo.ToVersion +
                              ' Expected response is: ' +
                              versionsArr[0].Version,
                );

                if (!isRightVersion) {
                    console.log({ Version_One_ID: versionsArr[0].Version });
                    console.log({ Version_Two_ID: versionsArr[1].Version });
                    console.log({ Version_Three_ID: versionsArr[2].Version });
                    console.log({ Installed_Version_ID: postAddonApiResponse.AuditInfo.ToVersion });
                }
            }

            const getInstalledAddonsApiResponse = await generalService.papiClient.get(
                '/addons/installed_addons?page_size=-1',
            );
            console.log({ Install_Installed_Addon: getInstalledAddonsApiResponse[0] });
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Uninstall addon
            const postUninstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .uninstall();
            console.log({ Post_Addon_Uninstall: postUninstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            if (postUninstallAddonApiResponse.URI != undefined) {
                do {
                    generalService.sleep(2000);
                    postAddonApiResponse = await generalService.papiClient.get(postUninstallAddonApiResponse.URI);
                    maxLoopsCounter--;
                } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                console.log({ Audit_Log_Addon_Uninstall: postAddonApiResponse });
                //Uninstall results
                if (testName.includes('Negative')) {
                    mandatoryStepsInstallAddonWithVersion.unInstallAddon = postAddonApiResponse.Status.ID == 0;
                    addTestResultUnderHeadline(
                        testName,
                        'Uninstall Addon',
                        mandatoryStepsInstallAddonWithVersion.unInstallAddon,
                    );
                } else {
                    mandatoryStepsInstallAddonWithVersion.unInstallAddon = postAddonApiResponse.Status.ID == 1;
                    addTestResultUnderHeadline(
                        testName,
                        'Uninstall Addon',
                        mandatoryStepsInstallAddonWithVersion.unInstallAddon,
                    );
                }
            } else {
                //Uninstall results
                mandatoryStepsInstallAddonWithVersion.unInstallAddon = false;
                addTestResultUnderHeadline(testName, 'Uninstall Addon', postUninstallAddonApiResponse);
            }

            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());
                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsInstallAddonWithVersion.deleteAddon = !JSON.stringify(deleteApiResponse).includes('fault');
        }

        if (
            mandatoryStepsInstallAddonWithVersion.createAddon == true &&
            mandatoryStepsInstallAddonWithVersion.installAddon == true &&
            mandatoryStepsInstallAddonWithVersion.InstallCorrectAddon == true &&
            mandatoryStepsInstallAddonWithVersion.unInstallAddon == true &&
            mandatoryStepsInstallAddonWithVersion.deleteAddon == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Install Addon With Version - Version 1 Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Install Addon With Version - Version 1 Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Dependencies Upgrade
    async function executeDependenciesUpgradeTest(testName, testDataBody) {
        const mandatoryStepsUpgradeToNewestAddonVersion = {
            createAddon: false,
            installCorrectSystemData: false,
            UpgradeCorrectVersion: false,
            UpgradeCorrectSystemData: false,
            unInstallAddon: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsUpgradeToNewestAddonVersion.createAddon = testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                if (index == 2) {
                    versionTestDataBody.Available = false;
                }
                versionTestDataBody.Phased = true;
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                if (testName.includes('Negative') && index > 0) {
                    versionTestDataBody.PublishConfig = JSON.stringify({
                        Editors: [
                            {
                                ParentPackageName: `ParentPackageName Upgrade Test ${index}`,
                                PackageName: `PackageName Upgrade Test ${index}`,
                                Description: `Description Upgrade Test ${index}`,
                            },
                            {
                                ParentPackageName: `ParentPackageName Upgrade Test ${index}`,
                                PackageName: `PackageName Upgrade Test ${index}`,
                                Description: `Description Upgrade Test ${index}`,
                            },
                        ],
                        Dependencies: {
                            papi: '9.5.301',
                            cpapi: 'V141',
                            webapp: '16.41.34.1',
                            data_views: '0.0.35',
                        },
                    });
                } else {
                    versionTestDataBody.PublishConfig = JSON.stringify({
                        Editors: [
                            {
                                ParentPackageName: `ParentPackageName Upgrade Test ${index}`,
                                PackageName: `PackageName Upgrade Test ${index}`,
                                Description: `Description Upgrade Test ${index}`,
                            },
                            {
                                ParentPackageName: `ParentPackageName Upgrade Test ${index}`,
                                PackageName: `PackageName Upgrade Test ${index}`,
                                Description: `Description Upgrade Test ${index}`,
                            },
                        ],
                        Dependencies: {
                            papi: '9.5.301',
                            cpapi: 'V141',
                            webapp: '16.41.34',
                            data_views: '0.0.35',
                        },
                    });
                }
                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody) as any,
                    },
                ).then((response) => response.json());
            }

            //Install addon with version
            const postInstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install(versionsArr[0].Version);
            console.log({ Post_Addon: postInstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(postInstallAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Addon_With_Version: postAddonApiResponse });

            let getInstalledAddonsApiResponse = await generalService.papiClient.get(
                '/addons/installed_addons?page_size=-1',
            );
            console.log({ Install_Installed_Addon: getInstalledAddonsApiResponse[0] });

            //Install results
            mandatoryStepsUpgradeToNewestAddonVersion.installCorrectSystemData = getInstalledAddonsApiResponse[0].SystemData.includes(
                '{"Editors":[{"ParentPackageName":"ParentPackageName Upgrade Test 0","PackageName":"PackageName Upgrade Test 0","Description":"Description Upgrade Test 0"},{"ParentPackageName":"ParentPackageName Upgrade Test 0","PackageName":"PackageName Upgrade Test 0","Description":"Description Upgrade Test 0"}]',
            );
            addTestResultUnderHeadline(
                testName,
                'Installed Addon Correct SystemData',
                mandatoryStepsUpgradeToNewestAddonVersion.installCorrectSystemData,
            );

            //Upgrade to new version
            const postUpgradeAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .upgrade(versionsArr[1].Version);

            //Make sure that Audit Log created
            postAddonApiResponse;
            maxLoopsCounter = 90;
            do {
                generalService.sleep(1000);
                postAddonApiResponse = await generalService.papiClient.get(postUpgradeAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Upgrade_Addon_Version_Without_Version: postAddonApiResponse });

            //If no Audit log was found
            if (postAddonApiResponse == undefined) {
                postAddonApiResponse = {};
                //postAddonApiResponse.result = {};
                postAddonApiResponse.AuditInfo = {};
                postAddonApiResponse.AuditInfo.FromVersion = {};
                postAddonApiResponse.AuditInfo.FromVersion = 'Error - Audit Log was not found';
                postAddonApiResponse.AuditInfo.ToVersion = {};
                postAddonApiResponse.AuditInfo.ToVersion = 'Error - Audit Log was not found';
            }

            //Upgraded version results
            let isErrorMessage = false;
            if (testName.includes('Negative')) {
                isErrorMessage = !postAddonApiResponse.AuditInfo.ErrorMessage.includes(
                    'Invalid dependencies configuration - webapp dependency version 16.41.34.1 does not exists',
                );
                addTestResultUnderHeadline(
                    testName,
                    'Upgrade Addon Failed with Invalid configuration',
                    !isErrorMessage,
                );
            } else if (postAddonApiResponse.AuditInfo.ErrorMessage != undefined) {
                isErrorMessage = true;
                addTestResultUnderHeadline(
                    testName,
                    'Upgrade Addon With Version',
                    !isErrorMessage
                        ? true
                        : postAddonApiResponse.AuditInfo.FromVersion +
                              ' failed to upgraded to version: ' +
                              postAddonApiResponse.AuditInfo.ToVersion,
                );
            }

            mandatoryStepsUpgradeToNewestAddonVersion.UpgradeCorrectVersion = !isErrorMessage;

            getInstalledAddonsApiResponse = await generalService.papiClient.get(
                '/addons/installed_addons?page_size=-1',
            );
            console.log({ Upgrade_Installed_Addon: getInstalledAddonsApiResponse[0] });

            //Upgraded results
            if (testName.includes('Negative')) {
                mandatoryStepsUpgradeToNewestAddonVersion.UpgradeCorrectSystemData = getInstalledAddonsApiResponse[0].SystemData.includes(
                    '{"Editors":[{"ParentPackageName":"ParentPackageName Upgrade Test 0","PackageName":"PackageName Upgrade Test 0","Description":"Description Upgrade Test 0"},{"ParentPackageName":"ParentPackageName Upgrade Test 0","PackageName":"PackageName Upgrade Test 0","Description":"Description Upgrade Test 0"}]',
                );
                addTestResultUnderHeadline(
                    testName,
                    'Upgraded Addon Correct SystemData',
                    mandatoryStepsUpgradeToNewestAddonVersion.UpgradeCorrectSystemData,
                );
            } else {
                mandatoryStepsUpgradeToNewestAddonVersion.UpgradeCorrectSystemData = getInstalledAddonsApiResponse[0].SystemData.includes(
                    '{"Editors":[{"ParentPackageName":"ParentPackageName Upgrade Test 1","PackageName":"PackageName Upgrade Test 1","Description":"Description Upgrade Test 1"},{"ParentPackageName":"ParentPackageName Upgrade Test 1","PackageName":"PackageName Upgrade Test 1","Description":"Description Upgrade Test 1"}]',
                );
                addTestResultUnderHeadline(
                    testName,
                    'Upgraded Addon Correct SystemData',
                    mandatoryStepsUpgradeToNewestAddonVersion.UpgradeCorrectSystemData,
                );
            }

            if (!mandatoryStepsUpgradeToNewestAddonVersion.UpgradeCorrectVersion) {
                console.log({ Version_One_ID: versionsArr[0].Version });
                console.log({ Version_Two_ID: versionsArr[1].Version });
                console.log({ Version_Three_ID: versionsArr[2].Version });
                console.log({ Upgraded_Version_ID: postAddonApiResponse.AuditInfo.ToVersion });
            }
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Uninstall addon
            const postUninstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .uninstall();
            console.log({ Post_Addon_Uninstall: postUninstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            if (postUninstallAddonApiResponse.URI != undefined) {
                do {
                    generalService.sleep(2000);
                    postAddonApiResponse = await generalService.papiClient.get(postUninstallAddonApiResponse.URI);
                    maxLoopsCounter--;
                } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                console.log({ Audit_Log_Addon_Uninstall: postAddonApiResponse });
                //Uninstall results
                mandatoryStepsUpgradeToNewestAddonVersion.unInstallAddon = postAddonApiResponse.Status.ID == 1;
                addTestResultUnderHeadline(
                    testName,
                    'Uninstall Addon',
                    mandatoryStepsUpgradeToNewestAddonVersion.unInstallAddon,
                );
            } else {
                //Uninstall results
                mandatoryStepsUpgradeToNewestAddonVersion.unInstallAddon = false;
                addTestResultUnderHeadline(testName, 'Uninstall Addon', postUninstallAddonApiResponse);
            }

            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());
                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsUpgradeToNewestAddonVersion.deleteAddon = !JSON.stringify(deleteApiResponse).includes(
                'fault',
            );
        }

        if (
            mandatoryStepsUpgradeToNewestAddonVersion.createAddon == true &&
            mandatoryStepsUpgradeToNewestAddonVersion.installCorrectSystemData == true &&
            mandatoryStepsUpgradeToNewestAddonVersion.UpgradeCorrectVersion == true &&
            mandatoryStepsUpgradeToNewestAddonVersion.UpgradeCorrectSystemData == true &&
            mandatoryStepsUpgradeToNewestAddonVersion.unInstallAddon == true &&
            mandatoryStepsUpgradeToNewestAddonVersion.deleteAddon == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All Upgrade To Newest Addon Version - Version 2 Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All Upgrade To Newest Addon Version - Version 2 Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //Test Dependencies Downgrade
    async function executeDependenciesDowngradeTest(testName, testDataBody) {
        const mandatoryStepsDowngradeToOldestAddonVersion = {
            createAddon: false,
            installCorrectSystemData: false,
            DowngradeCorrectVersion: false,
            DowngradeCorrectSystemData: false,
            unInstallAddon: false,
            deleteAddon: false,
        };

        const versionsArr: AddonVersion[] = [];
        versionsArr.length = 3;
        let versionTestDataBody;

        //Create
        //To make sure eddon is deleted no matter what
        let createApiResponse;
        try {
            //Create
            createApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons',
                {
                    method: `POST`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                    body: JSON.stringify(testDataBody),
                },
            ).then((response) => response.json());
            mandatoryStepsDowngradeToOldestAddonVersion.createAddon = testDataBody.Name == createApiResponse.Name;

            for (let index = 0; index < versionsArr.length; index++) {
                versionTestDataBody = testDataNewAddonVersion(
                    createApiResponse.UUID,
                    Math.floor(Math.random() * 1000000).toString(),
                );
                if (index == 2) {
                    versionTestDataBody.Available = false;
                }
                versionTestDataBody.Phased = true;
                versionTestDataBody.StartPhasedDateTime = new Date().toJSON();
                if (testName.includes('Negative') && index < 1) {
                    versionTestDataBody.PublishConfig = JSON.stringify({
                        Editors: [
                            {
                                ParentPackageName: `ParentPackageName Downgrade Test ${index}`,
                                PackageName: `PackageName Downgrade Test ${index}`,
                                Description: `Description Downgrade Test ${index}`,
                            },
                            {
                                ParentPackageName: `ParentPackageName Downgrade Test ${index}`,
                                PackageName: `PackageName Downgrade Test ${index}`,
                                Description: `Description Downgrade Test ${index}`,
                            },
                        ],
                        Dependencies: {
                            papi: '9.5.301',
                            cpapi: 'V141',
                            webapp: '16.41.34',
                            data_views: '0.0.35.1',
                        },
                    });
                } else {
                    versionTestDataBody.PublishConfig = JSON.stringify({
                        Editors: [
                            {
                                ParentPackageName: `ParentPackageName Downgrade Test ${index}`,
                                PackageName: `PackageName Downgrade Test ${index}`,
                                Description: `Description Downgrade Test ${index}`,
                            },
                            {
                                ParentPackageName: `ParentPackageName Downgrade Test ${index}`,
                                PackageName: `PackageName Downgrade Test ${index}`,
                                Description: `Description Downgrade Test ${index}`,
                            },
                        ],
                        Dependencies: {
                            papi: '9.5.301',
                            cpapi: 'V141',
                            webapp: '16.41.34',
                            data_views: '0.0.35',
                        },
                    });
                }
                versionsArr[index] = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions',
                    {
                        method: `POST`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                        body: JSON.stringify(versionTestDataBody) as any,
                    },
                ).then((response) => response.json());
            }

            //Install addon with version
            const postInstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .install(versionsArr[1].Version);
            console.log({ Post_Addon: postInstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            do {
                generalService.sleep(2000);
                postAddonApiResponse = await generalService.papiClient.get(postInstallAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Addon_With_Version: postAddonApiResponse });

            let getInstalledAddonsApiResponse = await generalService.papiClient.get(
                '/addons/installed_addons?page_size=-1',
            );
            console.log({ Install_Installed_Addon: getInstalledAddonsApiResponse[0] });

            //Install results
            mandatoryStepsDowngradeToOldestAddonVersion.installCorrectSystemData = getInstalledAddonsApiResponse[0].SystemData.includes(
                '{"Editors":[{"ParentPackageName":"ParentPackageName Downgrade Test 1","PackageName":"PackageName Downgrade Test 1","Description":"Description Downgrade Test 1"},{"ParentPackageName":"ParentPackageName Downgrade Test 1","PackageName":"PackageName Downgrade Test 1","Description":"Description Downgrade Test 1"}]',
            );
            addTestResultUnderHeadline(
                testName,
                'Installed Addon Correct SystemData',
                mandatoryStepsDowngradeToOldestAddonVersion.installCorrectSystemData,
            );

            //Downgrade to old version
            const postDowngradeAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .downgrade(versionsArr[0].Version);

            //Make sure that Audit Log created
            postAddonApiResponse;
            maxLoopsCounter = 90;
            do {
                generalService.sleep(1000);
                postAddonApiResponse = await generalService.papiClient.get(postDowngradeAddonApiResponse.URI as any);
                maxLoopsCounter--;
            } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
            console.log({ Audit_Log_Downgrade_Addon_With_Version_Files: postAddonApiResponse });

            //If no Audit log was found
            if (postAddonApiResponse == undefined) {
                postAddonApiResponse = {};
                //postAddonApiResponse.result = {};
                postAddonApiResponse.AuditInfo = {};
                postAddonApiResponse.AuditInfo.FromVersion = {};
                postAddonApiResponse.AuditInfo.FromVersion = 'Error - Audit Log was not found';
                postAddonApiResponse.AuditInfo.ToVersion = {};
                postAddonApiResponse.AuditInfo.ToVersion = 'Error - Audit Log was not found';
            }

            //Downgradeed version results
            let isErrorMessage = false;
            if (testName.includes('Negative')) {
                isErrorMessage = !postAddonApiResponse.AuditInfo.ErrorMessage.includes(
                    'Invalid dependencies configuration - data_views dependency version 0.0.35.1 does not exists',
                );
                addTestResultUnderHeadline(
                    testName,
                    'Downgrade Addon Failed with Invalid configuration',
                    !isErrorMessage,
                );
            } else if (postAddonApiResponse.AuditInfo.ErrorMessage != undefined) {
                isErrorMessage = true;
                addTestResultUnderHeadline(
                    testName,
                    'Downgrade Addon With Version',
                    !isErrorMessage
                        ? true
                        : postAddonApiResponse.AuditInfo.FromVersion +
                              ' failed to downgraded to version: ' +
                              postAddonApiResponse.AuditInfo.ToVersion,
                );
            }

            mandatoryStepsDowngradeToOldestAddonVersion.DowngradeCorrectVersion = !isErrorMessage;

            getInstalledAddonsApiResponse = await generalService.papiClient.get(
                '/addons/installed_addons?page_size=-1',
            );
            console.log({ Downgrade_Installed_Addon: getInstalledAddonsApiResponse[0] });

            //Downgrade results
            if (testName.includes('Negative')) {
                mandatoryStepsDowngradeToOldestAddonVersion.DowngradeCorrectSystemData = getInstalledAddonsApiResponse[0].SystemData.includes(
                    '{"Editors":[{"ParentPackageName":"ParentPackageName Downgrade Test 1","PackageName":"PackageName Downgrade Test 1","Description":"Description Downgrade Test 1"},{"ParentPackageName":"ParentPackageName Downgrade Test 1","PackageName":"PackageName Downgrade Test 1","Description":"Description Downgrade Test 1"}]',
                );
                addTestResultUnderHeadline(
                    testName,
                    'Downgrade Addon Correct SystemData',
                    mandatoryStepsDowngradeToOldestAddonVersion.DowngradeCorrectSystemData,
                );
            } else {
                mandatoryStepsDowngradeToOldestAddonVersion.DowngradeCorrectSystemData = getInstalledAddonsApiResponse[0].SystemData.includes(
                    '{"Editors":[{"ParentPackageName":"ParentPackageName Downgrade Test 0","PackageName":"PackageName Downgrade Test 0","Description":"Description Downgrade Test 0"},{"ParentPackageName":"ParentPackageName Downgrade Test 0","PackageName":"PackageName Downgrade Test 0","Description":"Description Downgrade Test 0"}]',
                );
                addTestResultUnderHeadline(
                    testName,
                    'Downgrade Addon Correct SystemData',
                    mandatoryStepsDowngradeToOldestAddonVersion.DowngradeCorrectSystemData,
                );
            }

            if (!mandatoryStepsDowngradeToOldestAddonVersion.DowngradeCorrectVersion) {
                console.log({ Version_One_ID: versionsArr[0].Version });
                console.log({ Version_Two_ID: versionsArr[1].Version });
                console.log({ Version_Three_ID: versionsArr[2].Version });
                console.log({ Downgradeed_Version_ID: postAddonApiResponse.AuditInfo.ToVersion });
            }
        } catch (err) {
            addTestResultUnderHeadline(testName, 'Unexpected Error happened', err);
        } finally {
            //Uninstall addon
            const postUninstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                .addonUUID(createApiResponse.UUID)
                .uninstall();
            console.log({ Post_Addon_Uninstall: postUninstallAddonApiResponse });

            let postAddonApiResponse;
            let maxLoopsCounter = 90;
            if (postUninstallAddonApiResponse.URI != undefined) {
                do {
                    generalService.sleep(2000);
                    postAddonApiResponse = await generalService.papiClient.get(postUninstallAddonApiResponse.URI);
                    maxLoopsCounter--;
                } while (postAddonApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                console.log({ Audit_Log_Addon_Uninstall: postAddonApiResponse });
                //Uninstall results
                mandatoryStepsDowngradeToOldestAddonVersion.unInstallAddon = postAddonApiResponse.Status.ID == 1;
                addTestResultUnderHeadline(
                    testName,
                    'Uninstall Addon',
                    mandatoryStepsDowngradeToOldestAddonVersion.unInstallAddon,
                );
            } else {
                //Uninstall results
                mandatoryStepsDowngradeToOldestAddonVersion.unInstallAddon = false;
                addTestResultUnderHeadline(testName, 'Uninstall Addon', postUninstallAddonApiResponse);
            }

            //Delete Addon
            for (let index = 0; index < versionsArr.length; index++) {
                const deleteVersionApiResponse = await fetch(
                    generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                        '/var/addons/versions/' +
                        versionsArr[index].UUID,
                    {
                        method: `DELETE`,
                        headers: {
                            Authorization: request.body.varKey,
                        },
                    },
                ).then((response) => response.json());
                if (!deleteVersionApiResponse) {
                    console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
                }
            }
            const deleteApiResponse = await fetch(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/' + createApiResponse.UUID,
                {
                    method: `DELETE`,
                    headers: {
                        Authorization: request.body.varKey,
                    },
                },
            ).then((response) => response.json());
            console.log({ Post_Var_Addons_Delete: deleteApiResponse });
            addTestResultUnderHeadline(
                testName,
                'Delete Addon - End Test',
                !JSON.stringify(deleteApiResponse).includes('fault'),
            );
            mandatoryStepsDowngradeToOldestAddonVersion.deleteAddon = !JSON.stringify(deleteApiResponse).includes(
                'fault',
            );
        }

        if (
            mandatoryStepsDowngradeToOldestAddonVersion.createAddon == true &&
            mandatoryStepsDowngradeToOldestAddonVersion.installCorrectSystemData == true &&
            mandatoryStepsDowngradeToOldestAddonVersion.DowngradeCorrectVersion == true &&
            mandatoryStepsDowngradeToOldestAddonVersion.DowngradeCorrectSystemData == true &&
            mandatoryStepsDowngradeToOldestAddonVersion.unInstallAddon == true &&
            mandatoryStepsDowngradeToOldestAddonVersion.deleteAddon == true
        ) {
            addTestResultUnderHeadline(
                testName,
                'All downgrade To Oldest Addon Version - Version 1 Test mandatory steps complete',
            );
        } else {
            addTestResultUnderHeadline(
                testName,
                'All downgrade To Oldest Addon Version - Version 1 Test mandatory steps complete',
                false,
            );
        }

        //This can be use to easily extract the token to the console
        //console.log({ Token: API._Token })
    }

    //#endregion Addons Tests

    //#region Phased Tests

    //Test Phased Maintenance Table
    // async function executePhasedMaintenanceTestWithTable(testExecutionData, isOnlineServer) {
    //     //#region Phased Table Prerequisites
    //     function MaintenanceTable(
    //         /*day1,*/ day2,
    //         day3,
    //         day4,
    //         day5,
    //         day6,
    //         day7,
    //         day8,
    //         day9,
    //         day10,
    //         day11,
    //         day12,
    //         day13,
    //         day14,
    //         day15,
    //         day16,
    //         day17,
    //         day18,
    //         day19,
    //         day20,
    //         day21,
    //     ) {
    //         /*self["Day 1"] = day1;*/
    //         self['Day 2'] = day2;
    //         self['Day 3'] = day3;
    //         self['Day 4'] = day4;
    //         self['Day 5'] = day5;
    //         self['Day 6'] = day6;
    //         self['Day 7'] = day7;
    //         self['Day 8'] = day8;
    //         self['Day 9'] = day9;
    //         self['Day 10'] = day10;
    //         self['Day 11'] = day11;
    //         self['Day 12'] = day12;
    //         self['Day 13'] = day13;
    //         self['Day 14'] = day14;
    //         self['Day 15'] = day15;
    //         self['Day 16'] = day16;
    //         self['Day 17'] = day17;
    //         self['Day 18'] = day18;
    //         self['Day 19'] = day19;
    //         self['Day 20'] = day20;
    //         self['Day 21'] = day21;
    //     }

    //     const maintenanceTableData = {};
    //     maintenanceTableData['1%(0%)'] = [];
    //     maintenanceTableData['2%(1%)'] = [];
    //     maintenanceTableData['5%(4%)'] = [];
    //     maintenanceTableData['10%(9%)'] = [];
    //     maintenanceTableData['20%(19%)'] = [];
    //     maintenanceTableData['50%(49%)'] = [];
    //     maintenanceTableData['100%(99%)'] = [];
    //     maintenanceTableData['day 4'] = [];
    //     maintenanceTableData['day 7'] = [];
    //     maintenanceTableData['day 10'] = [];
    //     maintenanceTableData['day 13'] = [];
    //     maintenanceTableData['day 16'] = [];
    //     maintenanceTableData['day 19'] = [];
    //     maintenanceTableData['day 21'] = [];

    //     let callBacksCounter = 0;
    //     function getCallback(response) {
    //         for (const property in response.resultObject.upgrade) {
    //             //console.log(property, response.resultObject[property].length);
    //             switch (callBacksCounter) {
    //                 case 0:
    //                     maintenanceTableData['1%(0%)'].push(response.resultObject.upgrade[property].length);
    //                     break;
    //                 case 1:
    //                     maintenanceTableData['2%(1%)'].push(response.resultObject.upgrade[property].length);
    //                     break;
    //                 case 2:
    //                     maintenanceTableData['5%(4%)'].push(response.resultObject.upgrade[property].length);
    //                     break;
    //                 case 3:
    //                     maintenanceTableData['10%(9%)'].push(response.resultObject.upgrade[property].length);
    //                     break;
    //                 case 4:
    //                     maintenanceTableData['20%(19%)'].push(response.resultObject.upgrade[property].length);
    //                     break;
    //                 case 5:
    //                     maintenanceTableData['50%(49%)'].push(response.resultObject.upgrade[property].length);
    //                     break;
    //                 case 6:
    //                     maintenanceTableData['100%(99%)'].push(response.resultObject.upgrade[property].length);
    //                     break;
    //                 case 7:
    //                     maintenanceTableData['day 4'].push(response.resultObject.upgrade[property].length);
    //                     break;
    //                 case 8:
    //                     maintenanceTableData['day 7'].push(response.resultObject.upgrade[property].length);
    //                     break;
    //                 case 9:
    //                     maintenanceTableData['day 10'].push(response.resultObject.upgrade[property].length);
    //                     break;
    //                 case 10:
    //                     maintenanceTableData['day 13'].push(response.resultObject.upgrade[property].length);
    //                     break;
    //                 case 11:
    //                     maintenanceTableData['day 16'].push(response.resultObject.upgrade[property].length);
    //                     break;
    //                 case 12:
    //                     maintenanceTableData['day 19'].push(response.resultObject.upgrade[property].length);
    //                     break;
    //                 case 13:
    //                     maintenanceTableData['day 21'].push(response.resultObject.upgrade[property].length);
    //                     break;
    //                 default:
    //                     break;
    //             }
    //         }
    //         callBacksCounter++;
    //         isCallBackArr.pop();
    //     }

    //     //#endregion Phased Table Prerequisites

    //     const waitForAllTestsResults = setInterval(() => {
    //         if (isCallBackArr.length == 0) {
    //             //Print Report
    //             const addToTable = {};
    //             addToTable['1%(0%)'] = new MaintenanceTable(
    //                 /*maintenanceTableData["1%(0%)"][0],*/ maintenanceTableData['1%(0%)'][1],
    //                 maintenanceTableData['1%(0%)'][2],
    //                 maintenanceTableData['1%(0%)'][3],
    //                 maintenanceTableData['1%(0%)'][4],
    //                 maintenanceTableData['1%(0%)'][5],
    //                 maintenanceTableData['1%(0%)'][6],
    //                 maintenanceTableData['1%(0%)'][7],
    //                 maintenanceTableData['1%(0%)'][8],
    //                 maintenanceTableData['1%(0%)'][9],
    //                 maintenanceTableData['1%(0%)'][10],
    //                 maintenanceTableData['1%(0%)'][11],
    //                 maintenanceTableData['1%(0%)'][12],
    //                 maintenanceTableData['1%(0%)'][13],
    //                 maintenanceTableData['1%(0%)'][14],
    //                 maintenanceTableData['1%(0%)'][15],
    //                 maintenanceTableData['1%(0%)'][16],
    //                 maintenanceTableData['1%(0%)'][17],
    //                 maintenanceTableData['1%(0%)'][18],
    //                 maintenanceTableData['1%(0%)'][19],
    //                 maintenanceTableData['1%(0%)'][20],
    //             );
    //             addToTable['2%(1%)'] = new MaintenanceTable(
    //                 /*maintenanceTableData["2%(1%)"][0],*/ maintenanceTableData['2%(1%)'][1],
    //                 maintenanceTableData['2%(1%)'][2],
    //                 maintenanceTableData['2%(1%)'][3],
    //                 maintenanceTableData['2%(1%)'][4],
    //                 maintenanceTableData['2%(1%)'][5],
    //                 maintenanceTableData['2%(1%)'][6],
    //                 maintenanceTableData['2%(1%)'][7],
    //                 maintenanceTableData['2%(1%)'][8],
    //                 maintenanceTableData['2%(1%)'][9],
    //                 maintenanceTableData['2%(1%)'][10],
    //                 maintenanceTableData['2%(1%)'][11],
    //                 maintenanceTableData['2%(1%)'][12],
    //                 maintenanceTableData['2%(1%)'][13],
    //                 maintenanceTableData['2%(1%)'][14],
    //                 maintenanceTableData['2%(1%)'][15],
    //                 maintenanceTableData['2%(1%)'][16],
    //                 maintenanceTableData['2%(1%)'][17],
    //                 maintenanceTableData['2%(1%)'][18],
    //                 maintenanceTableData['2%(1%)'][19],
    //                 maintenanceTableData['2%(1%)'][20],
    //             );
    //             addToTable['5%(4%)'] = new MaintenanceTable(
    //                 /*maintenanceTableData["5%(4%)"][0],*/ maintenanceTableData['5%(4%)'][1],
    //                 maintenanceTableData['5%(4%)'][2],
    //                 maintenanceTableData['5%(4%)'][3],
    //                 maintenanceTableData['5%(4%)'][4],
    //                 maintenanceTableData['5%(4%)'][5],
    //                 maintenanceTableData['5%(4%)'][6],
    //                 maintenanceTableData['5%(4%)'][7],
    //                 maintenanceTableData['5%(4%)'][8],
    //                 maintenanceTableData['5%(4%)'][9],
    //                 maintenanceTableData['5%(4%)'][10],
    //                 maintenanceTableData['5%(4%)'][11],
    //                 maintenanceTableData['5%(4%)'][12],
    //                 maintenanceTableData['5%(4%)'][13],
    //                 maintenanceTableData['5%(4%)'][14],
    //                 maintenanceTableData['5%(4%)'][15],
    //                 maintenanceTableData['5%(4%)'][16],
    //                 maintenanceTableData['5%(4%)'][17],
    //                 maintenanceTableData['5%(4%)'][18],
    //                 maintenanceTableData['5%(4%)'][19],
    //                 maintenanceTableData['5%(4%)'][20],
    //             );
    //             addToTable['10%(9%)'] = new MaintenanceTable(
    //                 /*maintenanceTableData["10%(9%)"][0],*/ maintenanceTableData['10%(9%)'][1],
    //                 maintenanceTableData['10%(9%)'][2],
    //                 maintenanceTableData['10%(9%)'][3],
    //                 maintenanceTableData['10%(9%)'][4],
    //                 maintenanceTableData['10%(9%)'][5],
    //                 maintenanceTableData['10%(9%)'][6],
    //                 maintenanceTableData['10%(9%)'][7],
    //                 maintenanceTableData['10%(9%)'][8],
    //                 maintenanceTableData['10%(9%)'][9],
    //                 maintenanceTableData['10%(9%)'][10],
    //                 maintenanceTableData['10%(9%)'][11],
    //                 maintenanceTableData['10%(9%)'][12],
    //                 maintenanceTableData['10%(9%)'][13],
    //                 maintenanceTableData['10%(9%)'][14],
    //                 maintenanceTableData['10%(9%)'][15],
    //                 maintenanceTableData['10%(9%)'][16],
    //                 maintenanceTableData['10%(9%)'][17],
    //                 maintenanceTableData['10%(9%)'][18],
    //                 maintenanceTableData['10%(9%)'][19],
    //                 maintenanceTableData['10%(9%)'][20],
    //             );
    //             addToTable['20%(19%)'] = new MaintenanceTable(
    //                 /*maintenanceTableData["20%(19%)"][0],*/ maintenanceTableData['20%(19%)'][1],
    //                 maintenanceTableData['20%(19%)'][2],
    //                 maintenanceTableData['20%(19%)'][3],
    //                 maintenanceTableData['20%(19%)'][4],
    //                 maintenanceTableData['20%(19%)'][5],
    //                 maintenanceTableData['20%(19%)'][6],
    //                 maintenanceTableData['20%(19%)'][7],
    //                 maintenanceTableData['20%(19%)'][8],
    //                 maintenanceTableData['20%(19%)'][9],
    //                 maintenanceTableData['20%(19%)'][10],
    //                 maintenanceTableData['20%(19%)'][11],
    //                 maintenanceTableData['20%(19%)'][12],
    //                 maintenanceTableData['20%(19%)'][13],
    //                 maintenanceTableData['20%(19%)'][14],
    //                 maintenanceTableData['20%(19%)'][15],
    //                 maintenanceTableData['20%(19%)'][16],
    //                 maintenanceTableData['20%(19%)'][17],
    //                 maintenanceTableData['20%(19%)'][18],
    //                 maintenanceTableData['20%(19%)'][19],
    //                 maintenanceTableData['20%(19%)'][20],
    //             );
    //             addToTable['50%(49%)'] = new MaintenanceTable(
    //                 /*maintenanceTableData["50%(49%)"][0],*/ maintenanceTableData['50%(49%)'][1],
    //                 maintenanceTableData['50%(49%)'][2],
    //                 maintenanceTableData['50%(49%)'][3],
    //                 maintenanceTableData['50%(49%)'][4],
    //                 maintenanceTableData['50%(49%)'][5],
    //                 maintenanceTableData['50%(49%)'][6],
    //                 maintenanceTableData['50%(49%)'][7],
    //                 maintenanceTableData['50%(49%)'][8],
    //                 maintenanceTableData['50%(49%)'][9],
    //                 maintenanceTableData['50%(49%)'][10],
    //                 maintenanceTableData['50%(49%)'][11],
    //                 maintenanceTableData['50%(49%)'][12],
    //                 maintenanceTableData['50%(49%)'][13],
    //                 maintenanceTableData['50%(49%)'][14],
    //                 maintenanceTableData['50%(49%)'][15],
    //                 maintenanceTableData['50%(49%)'][16],
    //                 maintenanceTableData['50%(49%)'][17],
    //                 maintenanceTableData['50%(49%)'][18],
    //                 maintenanceTableData['50%(49%)'][19],
    //                 maintenanceTableData['50%(49%)'][20],
    //             );
    //             addToTable['100%(99%)'] = new MaintenanceTable(
    //                 /*maintenanceTableData["100%(99%)"][0],*/ maintenanceTableData['100%(99%)'][1],
    //                 maintenanceTableData['100%(99%)'][2],
    //                 maintenanceTableData['100%(99%)'][3],
    //                 maintenanceTableData['100%(99%)'][4],
    //                 maintenanceTableData['100%(99%)'][5],
    //                 maintenanceTableData['100%(99%)'][6],
    //                 maintenanceTableData['100%(99%)'][7],
    //                 maintenanceTableData['100%(99%)'][8],
    //                 maintenanceTableData['100%(99%)'][9],
    //                 maintenanceTableData['100%(99%)'][10],
    //                 maintenanceTableData['100%(99%)'][11],
    //                 maintenanceTableData['100%(99%)'][12],
    //                 maintenanceTableData['100%(99%)'][13],
    //                 maintenanceTableData['100%(99%)'][14],
    //                 maintenanceTableData['100%(99%)'][15],
    //                 maintenanceTableData['100%(99%)'][16],
    //                 maintenanceTableData['100%(99%)'][17],
    //                 maintenanceTableData['100%(99%)'][18],
    //                 maintenanceTableData['100%(99%)'][19],
    //                 maintenanceTableData['100%(99%)'][20],
    //             );
    //             addToTable['day 4'] = new MaintenanceTable(
    //                 /*maintenanceTableData["day 4"][0],*/ maintenanceTableData['day 4'][1],
    //                 maintenanceTableData['day 4'][2],
    //                 maintenanceTableData['day 4'][3],
    //                 maintenanceTableData['day 4'][4],
    //                 maintenanceTableData['day 4'][5],
    //                 maintenanceTableData['day 4'][6],
    //                 maintenanceTableData['day 4'][7],
    //                 maintenanceTableData['day 4'][8],
    //                 maintenanceTableData['day 4'][9],
    //                 maintenanceTableData['day 4'][10],
    //                 maintenanceTableData['day 4'][11],
    //                 maintenanceTableData['day 4'][12],
    //                 maintenanceTableData['day 4'][13],
    //                 maintenanceTableData['day 4'][14],
    //                 maintenanceTableData['day 4'][15],
    //                 maintenanceTableData['day 4'][16],
    //                 maintenanceTableData['day 4'][17],
    //                 maintenanceTableData['day 4'][18],
    //                 maintenanceTableData['day 4'][19],
    //                 maintenanceTableData['day 4'][20],
    //             );
    //             addToTable['day 7'] = new MaintenanceTable(
    //                 /*maintenanceTableData["day 7"][0],*/ maintenanceTableData['day 7'][1],
    //                 maintenanceTableData['day 7'][2],
    //                 maintenanceTableData['day 7'][3],
    //                 maintenanceTableData['day 7'][4],
    //                 maintenanceTableData['day 7'][5],
    //                 maintenanceTableData['day 7'][6],
    //                 maintenanceTableData['day 7'][7],
    //                 maintenanceTableData['day 7'][8],
    //                 maintenanceTableData['day 7'][9],
    //                 maintenanceTableData['day 7'][10],
    //                 maintenanceTableData['day 7'][11],
    //                 maintenanceTableData['day 7'][12],
    //                 maintenanceTableData['day 7'][13],
    //                 maintenanceTableData['day 7'][14],
    //                 maintenanceTableData['day 7'][15],
    //                 maintenanceTableData['day 7'][16],
    //                 maintenanceTableData['day 7'][17],
    //                 maintenanceTableData['day 7'][18],
    //                 maintenanceTableData['day 7'][19],
    //                 maintenanceTableData['day 7'][20],
    //             );
    //             addToTable['day 10'] = new MaintenanceTable(
    //                 /*maintenanceTableData["day 10"][0],*/ maintenanceTableData['day 10'][1],
    //                 maintenanceTableData['day 10'][2],
    //                 maintenanceTableData['day 10'][3],
    //                 maintenanceTableData['day 10'][4],
    //                 maintenanceTableData['day 10'][5],
    //                 maintenanceTableData['day 10'][6],
    //                 maintenanceTableData['day 10'][7],
    //                 maintenanceTableData['day 10'][8],
    //                 maintenanceTableData['day 10'][9],
    //                 maintenanceTableData['day 10'][10],
    //                 maintenanceTableData['day 10'][11],
    //                 maintenanceTableData['day 10'][12],
    //                 maintenanceTableData['day 10'][13],
    //                 maintenanceTableData['day 10'][14],
    //                 maintenanceTableData['day 10'][15],
    //                 maintenanceTableData['day 10'][16],
    //                 maintenanceTableData['day 10'][17],
    //                 maintenanceTableData['day 10'][18],
    //                 maintenanceTableData['day 10'][19],
    //                 maintenanceTableData['day 10'][20],
    //             );
    //             addToTable['day 13'] = new MaintenanceTable(
    //                 /*maintenanceTableData["day 13"][0],*/ maintenanceTableData['day 13'][1],
    //                 maintenanceTableData['day 13'][2],
    //                 maintenanceTableData['day 13'][3],
    //                 maintenanceTableData['day 13'][4],
    //                 maintenanceTableData['day 13'][5],
    //                 maintenanceTableData['day 13'][6],
    //                 maintenanceTableData['day 13'][7],
    //                 maintenanceTableData['day 13'][8],
    //                 maintenanceTableData['day 13'][9],
    //                 maintenanceTableData['day 13'][10],
    //                 maintenanceTableData['day 13'][11],
    //                 maintenanceTableData['day 13'][12],
    //                 maintenanceTableData['day 13'][13],
    //                 maintenanceTableData['day 13'][14],
    //                 maintenanceTableData['day 13'][15],
    //                 maintenanceTableData['day 13'][16],
    //                 maintenanceTableData['day 13'][17],
    //                 maintenanceTableData['day 13'][18],
    //                 maintenanceTableData['day 13'][19],
    //                 maintenanceTableData['day 13'][20],
    //             );
    //             addToTable['day 16'] = new MaintenanceTable(
    //                 /*maintenanceTableData["day 16"][0],*/ maintenanceTableData['day 16'][1],
    //                 maintenanceTableData['day 16'][2],
    //                 maintenanceTableData['day 16'][3],
    //                 maintenanceTableData['day 16'][4],
    //                 maintenanceTableData['day 16'][5],
    //                 maintenanceTableData['day 16'][6],
    //                 maintenanceTableData['day 16'][7],
    //                 maintenanceTableData['day 16'][8],
    //                 maintenanceTableData['day 16'][9],
    //                 maintenanceTableData['day 16'][10],
    //                 maintenanceTableData['day 16'][11],
    //                 maintenanceTableData['day 16'][12],
    //                 maintenanceTableData['day 16'][13],
    //                 maintenanceTableData['day 16'][14],
    //                 maintenanceTableData['day 16'][15],
    //                 maintenanceTableData['day 16'][16],
    //                 maintenanceTableData['day 16'][17],
    //                 maintenanceTableData['day 16'][18],
    //                 maintenanceTableData['day 16'][19],
    //                 maintenanceTableData['day 16'][20],
    //             );
    //             addToTable['day 19'] = new MaintenanceTable(
    //                 /*maintenanceTableData["day 19"][0],*/ maintenanceTableData['day 19'][1],
    //                 maintenanceTableData['day 19'][2],
    //                 maintenanceTableData['day 19'][3],
    //                 maintenanceTableData['day 19'][4],
    //                 maintenanceTableData['day 19'][5],
    //                 maintenanceTableData['day 19'][6],
    //                 maintenanceTableData['day 19'][7],
    //                 maintenanceTableData['day 19'][8],
    //                 maintenanceTableData['day 19'][9],
    //                 maintenanceTableData['day 19'][10],
    //                 maintenanceTableData['day 19'][11],
    //                 maintenanceTableData['day 19'][12],
    //                 maintenanceTableData['day 19'][13],
    //                 maintenanceTableData['day 19'][14],
    //                 maintenanceTableData['day 19'][15],
    //                 maintenanceTableData['day 19'][16],
    //                 maintenanceTableData['day 19'][17],
    //                 maintenanceTableData['day 19'][18],
    //                 maintenanceTableData['day 19'][19],
    //                 maintenanceTableData['day 19'][20],
    //             );
    //             addToTable['day 21'] = new MaintenanceTable(
    //                 /*maintenanceTableData["day 21"][0],*/ maintenanceTableData['day 21'][1],
    //                 maintenanceTableData['day 21'][2],
    //                 maintenanceTableData['day 21'][3],
    //                 maintenanceTableData['day 21'][4],
    //                 maintenanceTableData['day 21'][5],
    //                 maintenanceTableData['day 21'][6],
    //                 maintenanceTableData['day 21'][7],
    //                 maintenanceTableData['day 21'][8],
    //                 maintenanceTableData['day 21'][9],
    //                 maintenanceTableData['day 21'][10],
    //                 maintenanceTableData['day 21'][11],
    //                 maintenanceTableData['day 21'][12],
    //                 maintenanceTableData['day 21'][13],
    //                 maintenanceTableData['day 21'][14],
    //                 maintenanceTableData['day 21'][15],
    //                 maintenanceTableData['day 21'][16],
    //                 maintenanceTableData['day 21'][17],
    //                 maintenanceTableData['day 21'][18],
    //                 maintenanceTableData['day 21'][19],
    //                 maintenanceTableData['day 21'][20],
    //             );
    //             console.table(addToTable);
    //             clearInterval(waitForAllTestsResults);
    //         }
    //     }, 1000);

    //     //#region execute table creation
    //     //Notice that the order of getCallBack called is the order of table prints
    //     //It means that all these call cant be sent to the local server, since the local server is limited and will mix the return oreder
    //     testExecutionData.setUpgradePercent = 0;
    //     isCallBackArr.push(true);
    //     await executePhasedMaintenanceTest(testExecutionData, getCallback, isOnlineServer, false);

    //     testExecutionData.setUpgradePercent = 1;
    //     isCallBackArr.push(true);
    //     await executePhasedMaintenanceTest(testExecutionData, getCallback, isOnlineServer, false);

    //     testExecutionData.setUpgradePercent = 4;
    //     isCallBackArr.push(true);
    //     await executePhasedMaintenanceTest(testExecutionData, getCallback, isOnlineServer, false);

    //     testExecutionData.setUpgradePercent = 9;
    //     isCallBackArr.push(true);
    //     await executePhasedMaintenanceTest(testExecutionData, getCallback, isOnlineServer, false);

    //     testExecutionData.setUpgradePercent = 19;
    //     isCallBackArr.push(true);
    //     await executePhasedMaintenanceTest(testExecutionData, getCallback, isOnlineServer, false);

    //     testExecutionData.setUpgradePercent = 49;
    //     isCallBackArr.push(true);
    //     await executePhasedMaintenanceTest(testExecutionData, getCallback, isOnlineServer, false);

    //     testExecutionData.setUpgradePercent = 99;
    //     isCallBackArr.push(true);
    //     await executePhasedMaintenanceTest(testExecutionData, getCallback, isOnlineServer, false);

    //     let datePlusZero = new Date();
    //     testExecutionData.setUpgradePercent = 0;
    //     testExecutionData.testDate = new Date(datePlusZero.getTime() + 1000 * 60 * 60 * 24 * 3); //Add 3 days in ms
    //     datePlusZero = new Date();
    //     isCallBackArr.push(true);
    //     await executePhasedMaintenanceTest(testExecutionData, getCallback, isOnlineServer, false);

    //     testExecutionData.testDate = new Date(datePlusZero.getTime() + 1000 * 60 * 60 * 24 * 6); //Add 6 days in ms
    //     datePlusZero = new Date();
    //     isCallBackArr.push(true);
    //     await executePhasedMaintenanceTest(testExecutionData, getCallback, isOnlineServer, false);

    //     testExecutionData.testDate = new Date(datePlusZero.getTime() + 1000 * 60 * 60 * 24 * 9); //Add 9 days in ms
    //     datePlusZero = new Date();
    //     isCallBackArr.push(true);
    //     await executePhasedMaintenanceTest(testExecutionData, getCallback, isOnlineServer, false);

    //     testExecutionData.testDate = new Date(datePlusZero.getTime() + 1000 * 60 * 60 * 24 * 12); //Add 12 days in ms
    //     datePlusZero = new Date();
    //     isCallBackArr.push(true);
    //     await executePhasedMaintenanceTest(testExecutionData, getCallback, isOnlineServer, false);

    //     testExecutionData.testDate = new Date(datePlusZero.getTime() + 1000 * 60 * 60 * 24 * 15); //Add 15 days in ms
    //     datePlusZero = new Date();
    //     isCallBackArr.push(true);
    //     await executePhasedMaintenanceTest(testExecutionData, getCallback, isOnlineServer, false);

    //     testExecutionData.testDate = new Date(datePlusZero.getTime() + 1000 * 60 * 60 * 24 * 18); //Add 18 days in ms
    //     datePlusZero = new Date();
    //     isCallBackArr.push(true);
    //     await executePhasedMaintenanceTest(testExecutionData, getCallback, isOnlineServer, false);

    //     testExecutionData.testDate = new Date(datePlusZero.getTime() + 1000 * 60 * 60 * 24 * 20); //Add 20 days in ms
    //     datePlusZero = new Date();
    //     isCallBackArr.push(true);
    //     await executePhasedMaintenanceTest(testExecutionData, getCallback, isOnlineServer, false);

    //     //#endregion execute table creation
    // }

    //#region Phased Maintenance Single Tests

    //Phased Maintenance Only Upgrade Available Phased and StartPhasedDateTime Test
    async function executePhasedMaintenanceOnlyUpgradeAvailablePhasedandStartPhasedDateTimeTest(
        testName,
        testExecutionData,
        isOnlineServer,
    ) {
        let apiResponse;

        function getCallback(response) {
            if (!response.success) {
                apiResponse = response;
                addTestResultUnderHeadline(testName, 'Call back failed', response);
            }
            apiResponse = response;
        }

        let datePlusZero = new Date();
        testExecutionData.setUpgradePercent = 0;
        testExecutionData.testDate = new Date(datePlusZero.getTime() + 1000 * 60 * 60 * 24 * 0); //Add 0 days in ms
        datePlusZero = new Date();
        await executePhasedMaintenanceTest(testExecutionData, getCallback, isOnlineServer, false);

        intervalCounter++;
        let inetrvalLimit = 60000;
        const SetIntervalEvery = 100;
        return await new Promise((resolve) => {
            const getResultObjectInterval = setInterval(() => {
                inetrvalLimit -= SetIntervalEvery;
                if (inetrvalLimit < 1) {
                    resolve();
                    clearInterval(getResultObjectInterval);
                    intervalCounter--;
                    addTestResultUnderHeadline(testName, 'Maintenance response - Intervel Timer', false);
                    return;
                }
                if (apiResponse != undefined) {
                    resolve();
                    clearInterval(getResultObjectInterval);
                    intervalCounter--;
                    let isData = false;
                    for (const property in apiResponse.resultObject.upgrade) {
                        apiResponse.resultObject.upgrade[property].forEach(validateEmpty);
                    }

                    function validateEmpty(value) {
                        addTestResultUnderHeadline(
                            testName,
                            'Maintenance response contain date for non upgradable addon uuid: ',
                            value,
                        );
                        isData = true;
                    }

                    //Print the API response
                    console.log({ Maintenance_Result_Object: apiResponse });

                    addTestResultUnderHeadline(
                        testName,
                        "Maintenance response don't contain date for non upgradable Test: ",
                        !isData,
                    );

                    //Report test result
                    if (
                        JSON.stringify(apiResponse.resultObject.upgrade).includes(
                            new Date().toISOString().split('T')[0],
                        ) &&
                        'Z'
                    ) {
                        addTestResultUnderHeadline(testName, 'Maintenance Date Valid Response');
                    } else {
                        addTestResultUnderHeadline(testName, 'Maintenance Date Valid Response', apiResponse);
                    }
                }
            }, SetIntervalEvery);
        });
    }

    //Phased Maintenance Of Older Versions Happens Now Test
    async function executePhasedMaintenanceOfOlderVersionsHappensNowTest(testName, testExecutionData, isOnlineServer) {
        if (testName.includes('Negative')) {
            testExecutionData.setNewInstallAddonsSystemData = '{"Version":"5.5.8","AutomaticUpgrade":"false"}';
        }

        let apiResponse;

        function getCallback(response) {
            if (!response.success) {
                apiResponse = response;
                addTestResultUnderHeadline(testName, 'Call back failed', response);
            }
            apiResponse = response;
        }

        let datePlusZero = new Date();
        testExecutionData.setUpgradePercent = 0;
        testExecutionData.testDate = new Date(datePlusZero.getTime() + 1000 * 60 * 60 * 24 * 0); //Add 0 days in ms
        datePlusZero = new Date();
        await executePhasedMaintenanceTest(testExecutionData, getCallback, isOnlineServer, false);

        intervalCounter++;
        let inetrvalLimit = 60000;
        const SetIntervalEvery = 100;
        return await new Promise((resolve) => {
            const getResultObjectInterval = setInterval(() => {
                inetrvalLimit -= SetIntervalEvery;
                if (inetrvalLimit < 1) {
                    resolve();
                    clearInterval(getResultObjectInterval);
                    intervalCounter--;
                    addTestResultUnderHeadline(testName, 'Maintenance response - Intervel Timer', false);
                    return;
                }
                if (apiResponse != undefined) {
                    resolve();
                    clearInterval(getResultObjectInterval);
                    intervalCounter--;
                    let isData = false;
                    for (const property in apiResponse.resultObject.upgrade) {
                        apiResponse.resultObject.upgrade[property].forEach(() => {
                            if (apiResponse.resultObject.upgrade[property].length > 100) {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Maintenance response contain date for non upgradable addon uuid: ',
                                    apiResponse.resultObject.upgrade[property][0].toString(),
                                );
                                isData = true;
                            }
                        });
                        const tempDate = new Date();
                        tempDate.setDate(tempDate.getDate() + testExecutionData.changePhasedGroupVersionDays);
                        const propertyDate = new Date(property);
                        const totalAddonsForToday = apiResponse.resultObject.upgrade[property].length;
                        let deltaSincePhased = (propertyDate.getTime() - tempDate.getTime()) / 1000 / 60 / 60 / 24;
                        //console.log(`Used: ${Math.round(deltaSincePhased)} Actual: ${deltaSincePhased} and : ${totalAddonsForToday}`);
                        deltaSincePhased = Math.round(deltaSincePhased);

                        if (testName.includes('Negative')) {
                            if (totalAddonsForToday > 0) {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Expected for date ' +
                                        property.split('T')[0] +
                                        ' to have 0 maintenance results' +
                                        ' and there are ' +
                                        totalAddonsForToday +
                                        ' results',
                                    false,
                                );
                            } else {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Expected for date ' +
                                        property.split('T')[0] +
                                        ' to have 0 maintenance results' +
                                        ' and there are ' +
                                        totalAddonsForToday +
                                        ' results',
                                    true,
                                );
                            }
                        } else {
                            if (deltaSincePhased < 18 && totalAddonsForToday < 100) {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Expected for date ' +
                                        property.split('T')[0] +
                                        ' to have less then 100 maintenance results' +
                                        ' and there are ' +
                                        totalAddonsForToday +
                                        ' results',
                                    true,
                                );
                            } else if (deltaSincePhased < 18 && totalAddonsForToday >= 100) {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Expected for date ' +
                                        property.split('T')[0] +
                                        ' to have less then 100 maintenance results' +
                                        'but there are ' +
                                        totalAddonsForToday +
                                        ' results.',
                                    'API response size: ' + apiResponse.resultObject.upgrade[property].length,
                                );
                            } else if (deltaSincePhased >= 18 && totalAddonsForToday == 100) {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Expected for date ' + property.split('T')[0] + ' to have 100 maintenance results',
                                    true,
                                );
                            } else if (deltaSincePhased >= 18) {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Expected for date ' +
                                        property.split('T')[0] +
                                        ' to have 100 maintenance results' +
                                        'but there are ' +
                                        totalAddonsForToday +
                                        ' results.',
                                    'API response size: ' + apiResponse.resultObject.upgrade[property].length,
                                );
                            }
                        }
                    }

                    //Print the API response
                    console.log({ Maintenance_Result_Object: apiResponse });

                    addTestResultUnderHeadline(
                        testName,
                        "Maintenance response don't contain date for non upgradable Test: ",
                        !isData,
                    );

                    //Report test result
                    if (
                        JSON.stringify(apiResponse.resultObject.upgrade).includes(
                            new Date().toISOString().split('T')[0],
                        ) &&
                        'Z'
                    ) {
                        addTestResultUnderHeadline(testName, 'Maintenance Date Valid Response');
                    } else {
                        addTestResultUnderHeadline(testName, 'Maintenance Date Valid Response', apiResponse);
                    }
                }
            }, SetIntervalEvery);
        });
    }

    //Phased Maintenance Upgrade Start Date In Few Days Test
    async function executePhasedMaintenanceUpgradeStartDateInFewDaysTest(testName, testExecutionData, isOnlineServer) {
        if (testName.includes('Negative')) {
            testExecutionData.setNewInstallAddonsSystemData = '{"Version":"5.5.8","AutomaticUpgrade":"false"}';
        }

        let apiResponse;

        function getCallback(response) {
            if (!response.success) {
                apiResponse = response;
                addTestResultUnderHeadline(testName, 'Call back failed', response);
            }
            apiResponse = response;
        }

        testExecutionData.setUpgradePercent = 0;
        await executePhasedMaintenanceTest(testExecutionData, getCallback, isOnlineServer, false);

        intervalCounter++;
        let inetrvalLimit = 60000;
        const SetIntervalEvery = 100;
        return await new Promise((resolve) => {
            const getResultObjectInterval = setInterval(() => {
                inetrvalLimit -= SetIntervalEvery;
                if (inetrvalLimit < 1) {
                    resolve();
                    clearInterval(getResultObjectInterval);
                    intervalCounter--;
                    addTestResultUnderHeadline(testName, 'Maintenance response - Intervel Timer', false);
                    return;
                }
                if (apiResponse != undefined) {
                    resolve();
                    clearInterval(getResultObjectInterval);
                    intervalCounter--;

                    let isData = false;
                    for (const property in apiResponse.resultObject.upgrade) {
                        apiResponse.resultObject.upgrade[property].forEach(() => {
                            if (apiResponse.resultObject.upgrade[property].length > 100) {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Maintenance response contain date for non upgradable addon uuid: ',
                                    apiResponse.resultObject.upgrade[property][0].toString(),
                                );
                                isData = true;
                            }
                        });
                        const propertyDate = new Date(property);
                        const totalAddonsForToday = apiResponse.resultObject.upgrade[property].length;
                        const deltaUntilStart =
                            (propertyDate.getTime() - testExecutionData.testDate.getTime()) / 1000 / 60 / 60 / 24;
                        if (testName.includes('Negative')) {
                            if (totalAddonsForToday > 0) {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Expected for date ' +
                                        property.split('T')[0] +
                                        ' to have 0 maintenance results' +
                                        ' and there are ' +
                                        totalAddonsForToday +
                                        ' results',
                                    false,
                                );
                            } else {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Expected for date ' +
                                        property.split('T')[0] +
                                        ' to have 0 maintenance results' +
                                        ' and there are ' +
                                        totalAddonsForToday +
                                        ' results',
                                    true,
                                );
                            }
                        } else {
                            if (deltaUntilStart < 0 && totalAddonsForToday == 0) {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Expected for date ' +
                                        property.split('T')[0] +
                                        ' to have 0 maintenance results' +
                                        ' and there are ' +
                                        totalAddonsForToday +
                                        ' results',
                                    true,
                                );
                            } else if (deltaUntilStart < 0 && totalAddonsForToday != 0) {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Expected for date ' +
                                        property.split('T')[0] +
                                        ' to have 0 maintenance results' +
                                        ' but there are ' +
                                        totalAddonsForToday +
                                        ' results',
                                    apiResponse.resultObject.upgrade[property].length.toString(),
                                );
                            } else if (deltaUntilStart > 0 && totalAddonsForToday == 0) {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Expected for date ' +
                                        property.split('T')[0] +
                                        ' to have more then 0 maintenance results' +
                                        ' but there are ' +
                                        totalAddonsForToday +
                                        ' results.',
                                    'API response size: ' + apiResponse.resultObject.upgrade[property].length,
                                );
                            } else if (deltaUntilStart > 0 && totalAddonsForToday > 100) {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Expected for date ' +
                                        property.split('T')[0] +
                                        ' to have less then 100 maintenance results' +
                                        ' but there are ' +
                                        totalAddonsForToday +
                                        ' results.',
                                    'API response size: ' + apiResponse.resultObject.upgrade[property].length,
                                );
                            } else if (deltaUntilStart > 0 && totalAddonsForToday <= 100) {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Expected for date ' +
                                        property.split('T')[0] +
                                        ' to have less or 100 maintenance results' +
                                        'and there are ' +
                                        totalAddonsForToday +
                                        ' results.',
                                    true,
                                );
                            }
                        }
                    }

                    //Print the API response
                    console.log({ Maintenance_Result_Object: apiResponse });

                    addTestResultUnderHeadline(
                        testName,
                        "Maintenance response don't contain date for non upgradable Test: ",
                        !isData,
                    );

                    //Report test result
                    if (
                        JSON.stringify(apiResponse.resultObject.upgrade).includes(
                            new Date().toISOString().split('T')[0],
                        ) &&
                        'Z'
                    ) {
                        addTestResultUnderHeadline(testName, 'Maintenance Date Valid Response');
                    } else {
                        addTestResultUnderHeadline(testName, 'Maintenance Date Valid Response', apiResponse);
                    }
                }
            }, SetIntervalEvery);
        });
    }

    //Phased Maintenance Install Start Date In Few Days Test
    async function executePhasedMaintenanceInstallStartDateInFewDaysTest(testName, testExecutionData, isOnlineServer) {
        let apiResponse;

        function getCallback(response) {
            if (!response.success) {
                apiResponse = response;
                addTestResultUnderHeadline(testName, 'Call back failed', response);
            }
            apiResponse = response;
        }

        testExecutionData.setUpgradePercent = 0;
        await executePhasedMaintenanceTest(testExecutionData, getCallback, isOnlineServer, true);

        intervalCounter++;
        let inetrvalLimit = 60000;
        const SetIntervalEvery = 100;
        return await new Promise((resolve) => {
            const getResultObjectInterval = setInterval(() => {
                inetrvalLimit -= SetIntervalEvery;
                if (inetrvalLimit < 1) {
                    resolve();
                    clearInterval(getResultObjectInterval);
                    intervalCounter--;
                    addTestResultUnderHeadline(testName, 'Maintenance response - Intervel Timer', false);
                    return;
                }
                if (apiResponse != undefined) {
                    resolve();
                    clearInterval(getResultObjectInterval);
                    intervalCounter--;

                    let isData = false;
                    for (const property in apiResponse.resultObject.install) {
                        apiResponse.resultObject.install[property].forEach(() => {
                            if (apiResponse.resultObject.install[property].length > 100) {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Maintenance response contain date for non upgradable addon uuid: ',
                                    apiResponse.resultObject.install[property][0].toString(),
                                );
                                isData = true;
                            }
                        });
                        const propertyDate = new Date(property);
                        const totalAddonsForToday = apiResponse.resultObject.install[property].length;
                        const deltaUntilStart =
                            (propertyDate.getTime() - testExecutionData.testDate.getTime()) / 1000 / 60 / 60 / 24;
                        if (deltaUntilStart < 0 && totalAddonsForToday == 0) {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected for date ' +
                                    property.split('T')[0] +
                                    ' to have 0 maintenance results' +
                                    ' and there are ' +
                                    totalAddonsForToday +
                                    ' results',
                                true,
                            );
                        } else if (deltaUntilStart < 0 && totalAddonsForToday != 0) {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected for date ' +
                                    property.split('T')[0] +
                                    ' to have 0 maintenance results' +
                                    ' but there are ' +
                                    totalAddonsForToday +
                                    ' results',
                                apiResponse.resultObject.install[property].length.toString(),
                            );
                        } else if (deltaUntilStart > 0 && totalAddonsForToday == 0) {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected for date ' +
                                    property.split('T')[0] +
                                    ' to have more then 0 maintenance results' +
                                    ' but there are ' +
                                    totalAddonsForToday +
                                    ' results.',
                                'API response size: ' + apiResponse.resultObject.install[property].length,
                            );
                        } else if (deltaUntilStart > 0 && totalAddonsForToday > 100) {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected for date ' +
                                    property.split('T')[0] +
                                    ' to have less then 100 maintenance results' +
                                    ' but there are ' +
                                    totalAddonsForToday +
                                    ' results.',
                                'API response size: ' + apiResponse.resultObject.install[property].length,
                            );
                        } else if (deltaUntilStart > 0 && totalAddonsForToday <= 100) {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected for date ' +
                                    property.split('T')[0] +
                                    ' to have less or 100 maintenance results' +
                                    'and there are ' +
                                    totalAddonsForToday +
                                    ' results.',
                                true,
                            );
                        }
                    }

                    //Print the API response
                    console.log({ Maintenance_Result_Object: apiResponse });

                    addTestResultUnderHeadline(
                        testName,
                        "Maintenance response don't contain date for non upgradable Test: ",
                        !isData,
                    );

                    //Report test result
                    if (
                        JSON.stringify(apiResponse.resultObject.install).includes(
                            new Date().toISOString().split('T')[0],
                        ) &&
                        'Z'
                    ) {
                        addTestResultUnderHeadline(testName, 'Maintenance Date Valid Response');
                    } else {
                        addTestResultUnderHeadline(testName, 'Maintenance Date Valid Response', apiResponse);
                    }
                }
            }, SetIntervalEvery);
        });
    }

    //Phased Maintenance Upgrade Distribution Test
    async function executePhasedMaintenanceMaintenanceUpgradeDistributionTest(
        testName,
        testExecutionData,
        isOnlineServer,
    ) {
        let apiResponse;

        function getCallback(response) {
            if (!response.success) {
                apiResponse = response;
                addTestResultUnderHeadline(testName, 'Call back failed', response);
            }
            apiResponse = response;
        }

        function isInRangeOf(size, rangeMidPoint) {
            return (
                100 - Number(((rangeMidPoint / size) * 100).toFixed(1)) >= -10 &&
                100 - Number(((rangeMidPoint / size) * 100).toFixed(1)) <= 10
            );
        }

        testExecutionData.setUpgradePercent = 0;
        await executePhasedMaintenanceTest(testExecutionData, getCallback, isOnlineServer, false);

        intervalCounter++;
        let inetrvalLimit = 60000;
        const SetIntervalEvery = 500;
        return await new Promise((resolve) => {
            const getResultObjectInterval = setInterval(() => {
                inetrvalLimit -= SetIntervalEvery;
                if (inetrvalLimit < 1) {
                    resolve();
                    clearInterval(getResultObjectInterval);
                    intervalCounter--;
                    addTestResultUnderHeadline(testName, 'Maintenance response - Intervel Timer', false);
                    return;
                }
                if (apiResponse != undefined) {
                    resolve();
                    clearInterval(getResultObjectInterval);
                    intervalCounter--;

                    let isData = false;
                    for (const property in apiResponse.resultObject.upgrade) {
                        const propertyDate = new Date(property);
                        const deltaUntilStart =
                            (propertyDate.getTime() - testExecutionData.testDate.getTime()) / 1000 / 60 / 60 / 24;
                        const totalAddonsForToday = apiResponse.resultObject.upgrade[property].length;
                        const maxAddons = testExecutionData.setTotalAddons - 4;
                        const pointOnePercent = maxAddons / 100;
                        const pointTwoPercent = maxAddons / 50;
                        const pointFivePercent = maxAddons / 20;
                        const pointTenPercent = maxAddons / 10;
                        const pointTwentyPercent = maxAddons / 5;
                        const pointFiftyPercent = maxAddons / 2;
                        const pointAll = maxAddons;
                        const limitMin = 0.9;
                        const limitMax = 1.1;
                        apiResponse.resultObject.upgrade[property].forEach(() => {
                            if (apiResponse.resultObject.upgrade[property].length > maxAddons) {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Maintenance response contain date for non upgradable addon uuid: ',
                                    apiResponse.resultObject.upgrade[property][0].toString(),
                                );
                                isData = true;
                            }
                        });
                        if (deltaUntilStart < 3) {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected for date ' +
                                    property.split('T')[0] +
                                    ' to have between ' +
                                    parseInt((pointOnePercent * limitMin) as any) +
                                    ' and ' +
                                    parseInt((pointOnePercent * limitMax) as any) +
                                    ' maintenance results' +
                                    ' and there are ' +
                                    totalAddonsForToday +
                                    ' results (' +
                                    (100 - (totalAddonsForToday / pointOnePercent) * 100).toFixed(1) +
                                    '% from expected)',
                                isInRangeOf(totalAddonsForToday, pointOnePercent),
                            );
                        } else if (deltaUntilStart < 6) {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected for date ' +
                                    property.split('T')[0] +
                                    ' to have between ' +
                                    parseInt((pointTwoPercent * limitMin) as any) +
                                    ' and ' +
                                    parseInt((pointTwoPercent * limitMax) as any) +
                                    ' maintenance results' +
                                    ' and there are ' +
                                    totalAddonsForToday +
                                    ' results (' +
                                    (100 - (totalAddonsForToday / pointTwoPercent) * 100).toFixed(1) +
                                    '% from expectedd)',
                                isInRangeOf(totalAddonsForToday, pointTwoPercent),
                            );
                        } else if (deltaUntilStart < 9) {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected for date ' +
                                    property.split('T')[0] +
                                    ' to have between ' +
                                    parseInt((pointFivePercent * limitMin) as any) +
                                    ' and ' +
                                    parseInt((pointFivePercent * limitMax) as any) +
                                    ' maintenance results' +
                                    ' and there are ' +
                                    totalAddonsForToday +
                                    ' results (' +
                                    (100 - (totalAddonsForToday / pointFivePercent) * 100).toFixed(1) +
                                    '% from expected)',
                                isInRangeOf(totalAddonsForToday, pointFivePercent),
                            );
                        } else if (deltaUntilStart < 12) {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected for date ' +
                                    property.split('T')[0] +
                                    ' to have between ' +
                                    parseInt((pointTenPercent * limitMin) as any) +
                                    ' and ' +
                                    parseInt((pointTenPercent * limitMax) as any) +
                                    ' maintenance results' +
                                    ' and there are ' +
                                    totalAddonsForToday +
                                    ' results (' +
                                    (100 - (totalAddonsForToday / pointTenPercent) * 100).toFixed(1) +
                                    '% from expected)',
                                isInRangeOf(totalAddonsForToday, pointTenPercent),
                            );
                        } else if (deltaUntilStart < 15) {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected for date ' +
                                    property.split('T')[0] +
                                    ' to have between ' +
                                    parseInt((pointTwentyPercent * limitMin) as any) +
                                    ' and ' +
                                    parseInt((pointTwentyPercent * limitMax) as any) +
                                    ' maintenance results' +
                                    ' and there are ' +
                                    totalAddonsForToday +
                                    ' results (' +
                                    (100 - (totalAddonsForToday / pointTwentyPercent) * 100).toFixed(1) +
                                    '% from expected)',
                                isInRangeOf(totalAddonsForToday, pointTwentyPercent),
                            );
                        } else if (deltaUntilStart < 18) {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected for date ' +
                                    property.split('T')[0] +
                                    ' to have between ' +
                                    parseInt((pointFiftyPercent * limitMin) as any) +
                                    ' and ' +
                                    parseInt((pointFiftyPercent * limitMax) as any) +
                                    ' maintenance results' +
                                    ' and there are ' +
                                    totalAddonsForToday +
                                    ' results (' +
                                    (100 - (totalAddonsForToday / pointFiftyPercent) * 100).toFixed(1) +
                                    '% from expected)',
                                isInRangeOf(totalAddonsForToday, pointFiftyPercent),
                            );
                        } else {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected for date ' +
                                    property.split('T')[0] +
                                    ' to have ' +
                                    pointAll +
                                    ' maintenance results' +
                                    ' and there are ' +
                                    totalAddonsForToday +
                                    ' results (' +
                                    (100 - (totalAddonsForToday / pointAll) * 100).toFixed(1) +
                                    '% from expected)',
                                totalAddonsForToday == pointAll,
                            );
                        }
                    }

                    //Print the API response
                    console.log({ Maintenance_Result_Object: apiResponse });

                    addTestResultUnderHeadline(
                        testName,
                        "Maintenance response don't contain date for non upgradable Test: ",
                        !isData,
                    );

                    //Report test result
                    if (
                        JSON.stringify(apiResponse.resultObject.upgrade).includes(
                            new Date().toISOString().split('T')[0],
                        ) &&
                        'Z'
                    ) {
                        addTestResultUnderHeadline(testName, 'Maintenance Date Valid Response');
                    } else {
                        addTestResultUnderHeadline(testName, 'Maintenance Date Valid Response', apiResponse);
                    }
                }
            }, SetIntervalEvery);
        });
    }

    //Phased Maintenance Install Distribution Test
    async function executePhasedMaintenanceMaintenanceInstallDistributionTest(
        testName,
        testExecutionData,
        isOnlineServer,
    ) {
        let apiResponse;

        function getCallback(response) {
            if (!response.success) {
                apiResponse = response;
                addTestResultUnderHeadline(testName, 'Call back failed', response);
            }
            apiResponse = response;
        }

        function isInRangeOf(size, rangeMidPoint) {
            return (
                100 - Number(((rangeMidPoint / size) * 100).toFixed(1)) >= -10 &&
                100 - Number(((rangeMidPoint / size) * 100).toFixed(1)) <= 10
            );
        }

        testExecutionData.setUpgradePercent = 0;
        await executePhasedMaintenanceTest(testExecutionData, getCallback, isOnlineServer, true);

        intervalCounter++;
        let inetrvalLimit = 60000;
        const SetIntervalEvery = 500;
        return await new Promise((resolve) => {
            const getResultObjectInterval = setInterval(() => {
                inetrvalLimit -= SetIntervalEvery;
                if (inetrvalLimit < 1) {
                    resolve();
                    clearInterval(getResultObjectInterval);
                    intervalCounter--;
                    addTestResultUnderHeadline(testName, 'Maintenance response - Intervel Timer', false);
                    return;
                }
                if (apiResponse != undefined) {
                    resolve();
                    clearInterval(getResultObjectInterval);
                    intervalCounter--;
                    for (const property in apiResponse.resultObject.install) {
                        const propertyDate = new Date(property);
                        const deltaUntilStart =
                            (propertyDate.getTime() - testExecutionData.testDate.getTime()) / 1000 / 60 / 60 / 24;
                        const totalAddonsForToday = apiResponse.resultObject.install[property].length;
                        const maxAddons = testExecutionData.setTotalAddons - 4;
                        const pointOnePercent = maxAddons / 100;
                        const pointTwoPercent = maxAddons / 50;
                        const pointFivePercent = maxAddons / 20;
                        const pointTenPercent = maxAddons / 10;
                        const pointTwentyPercent = maxAddons / 5;
                        const pointFiftyPercent = maxAddons / 2;
                        const pointAll = maxAddons;
                        const limitMin = 0.9;
                        const limitMax = 1.1;
                        if (deltaUntilStart < 3) {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected for date ' +
                                    property.split('T')[0] +
                                    ' to have between ' +
                                    parseInt((pointOnePercent * limitMin) as any) +
                                    ' and ' +
                                    parseInt((pointOnePercent * limitMax) as any) +
                                    ' maintenance results' +
                                    ' and there are ' +
                                    totalAddonsForToday +
                                    ' results (' +
                                    (100 - (totalAddonsForToday / pointOnePercent) * 100).toFixed(1) +
                                    '% from expected)',
                                isInRangeOf(totalAddonsForToday, pointOnePercent),
                            );
                        } else if (deltaUntilStart < 6) {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected for date ' +
                                    property.split('T')[0] +
                                    ' to have between ' +
                                    parseInt((pointTwoPercent * limitMin) as any) +
                                    ' and ' +
                                    parseInt((pointTwoPercent * limitMax) as any) +
                                    ' maintenance results' +
                                    ' and there are ' +
                                    totalAddonsForToday +
                                    ' results (' +
                                    (100 - (totalAddonsForToday / pointTwoPercent) * 100).toFixed(1) +
                                    '% from expectedd)',
                                isInRangeOf(totalAddonsForToday, pointTwoPercent),
                            );
                        } else if (deltaUntilStart < 9) {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected for date ' +
                                    property.split('T')[0] +
                                    ' to have between ' +
                                    parseInt((pointFivePercent * limitMin) as any) +
                                    ' and ' +
                                    parseInt((pointFivePercent * limitMax) as any) +
                                    ' maintenance results' +
                                    ' and there are ' +
                                    totalAddonsForToday +
                                    ' results (' +
                                    (100 - (totalAddonsForToday / pointFivePercent) * 100).toFixed(1) +
                                    '% from expected)',
                                isInRangeOf(totalAddonsForToday, pointFivePercent),
                            );
                        } else if (deltaUntilStart < 12) {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected for date ' +
                                    property.split('T')[0] +
                                    ' to have between ' +
                                    parseInt((pointTenPercent * limitMin) as any) +
                                    ' and ' +
                                    parseInt((pointTenPercent * limitMax) as any) +
                                    ' maintenance results' +
                                    ' and there are ' +
                                    totalAddonsForToday +
                                    ' results (' +
                                    (100 - (totalAddonsForToday / pointTenPercent) * 100).toFixed(1) +
                                    '% from expected)',
                                isInRangeOf(totalAddonsForToday, pointTenPercent),
                            );
                        } else if (deltaUntilStart < 15) {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected for date ' +
                                    property.split('T')[0] +
                                    ' to have between ' +
                                    parseInt((pointTwentyPercent * limitMin) as any) +
                                    ' and ' +
                                    parseInt((pointTwentyPercent * limitMax) as any) +
                                    ' maintenance results' +
                                    ' and there are ' +
                                    totalAddonsForToday +
                                    ' results (' +
                                    (100 - (totalAddonsForToday / pointTwentyPercent) * 100).toFixed(1) +
                                    '% from expected)',
                                isInRangeOf(totalAddonsForToday, pointTwentyPercent),
                            );
                        } else if (deltaUntilStart < 18) {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected for date ' +
                                    property.split('T')[0] +
                                    ' to have between ' +
                                    parseInt((pointFiftyPercent * limitMin) as any) +
                                    ' and ' +
                                    parseInt((pointFiftyPercent * limitMax) as any) +
                                    ' maintenance results' +
                                    ' and there are ' +
                                    totalAddonsForToday +
                                    ' results (' +
                                    (100 - (totalAddonsForToday / pointFiftyPercent) * 100).toFixed(1) +
                                    '% from expected)',
                                isInRangeOf(totalAddonsForToday, pointFiftyPercent),
                            );
                        } else {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected for date ' +
                                    property.split('T')[0] +
                                    ' to have ' +
                                    pointAll +
                                    ' maintenance results' +
                                    ' and there are ' +
                                    totalAddonsForToday +
                                    ' results (' +
                                    (100 - (totalAddonsForToday / pointAll) * 100).toFixed(1) +
                                    '% from expected)',
                                totalAddonsForToday == pointAll,
                            );
                        }
                    }

                    //Print the API response
                    console.log({ Maintenance_Result_Object: apiResponse });

                    //Report test result
                    if (
                        JSON.stringify(apiResponse.resultObject.install).includes(
                            new Date().toISOString().split('T')[0],
                        ) &&
                        'Z'
                    ) {
                        addTestResultUnderHeadline(testName, 'Maintenance Date Valid Response');
                    } else {
                        addTestResultUnderHeadline(testName, 'Maintenance Date Valid Response', apiResponse);
                    }
                }
            }, SetIntervalEvery);
        });
    }

    //Phased Maintenance Full Distribution Test
    async function executePhasedMaintenanceMaintenanceFullDistributionTest(
        testName,
        testExecutionData,
        isOnlineServer,
    ) {
        if (testName.includes('Negative')) {
            testExecutionData.setNewInstallAddonsSystemData = '{"Version":"5.5.8","AutomaticUpgrade":"false"}';
        }

        let apiResponse;

        function getCallback(response) {
            if (!response.success) {
                apiResponse = response;
                addTestResultUnderHeadline(testName, 'Call back failed', response);
            }
            apiResponse = response;
        }

        function isInRangeOf(size, rangeMidPoint) {
            return (
                100 - Number(((rangeMidPoint / size) * 100).toFixed(1)) >= -10 &&
                100 - Number(((rangeMidPoint / size) * 100).toFixed(1)) <= 10
            );
        }

        testExecutionData.setUpgradePercent = 0;
        await executePhasedMaintenanceTest(testExecutionData, getCallback, isOnlineServer, undefined);

        intervalCounter++;
        let inetrvalLimit = 60000;
        const SetIntervalEvery = 500;
        return await new Promise((resolve) => {
            const getResultObjectInterval = setInterval(() => {
                inetrvalLimit -= SetIntervalEvery;
                if (inetrvalLimit < 1) {
                    resolve();
                    clearInterval(getResultObjectInterval);
                    intervalCounter--;
                    addTestResultUnderHeadline(testName, 'Maintenance response - Intervel Timer', false);
                    return;
                }
                if (apiResponse != undefined) {
                    resolve();
                    clearInterval(getResultObjectInterval);
                    intervalCounter--;

                    //Install Test
                    for (const property in apiResponse.resultObject.install) {
                        const propertyDate = new Date(property);
                        const deltaUntilStart =
                            (propertyDate.getTime() - testExecutionData.testDate.getTime()) / 1000 / 60 / 60 / 24;
                        const totalAddonsForToday = apiResponse.resultObject.install[property].length;
                        const maxAddons = testExecutionData.setTotalAddons - 4;
                        const pointOnePercent = maxAddons / 100;
                        const pointTwoPercent = maxAddons / 50;
                        const pointFivePercent = maxAddons / 20;
                        const pointTenPercent = maxAddons / 10;
                        const pointTwentyPercent = maxAddons / 5;
                        const pointFiftyPercent = maxAddons / 2;
                        const pointAll = maxAddons;
                        const limitMin = 0.9;
                        const limitMax = 1.1;
                        if (deltaUntilStart < 3) {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected Install for date ' +
                                    property.split('T')[0] +
                                    ' to have between ' +
                                    parseInt((pointOnePercent * limitMin) as any) +
                                    ' and ' +
                                    parseInt((pointOnePercent * limitMax) as any) +
                                    ' maintenance results' +
                                    ' and there are ' +
                                    totalAddonsForToday +
                                    ' results (' +
                                    (100 - (totalAddonsForToday / pointOnePercent) * 100).toFixed(1) +
                                    '% from expected)',
                                isInRangeOf(totalAddonsForToday, pointOnePercent),
                            );
                        } else if (deltaUntilStart < 6) {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected Install for date ' +
                                    property.split('T')[0] +
                                    ' to have between ' +
                                    parseInt((pointTwoPercent * limitMin) as any) +
                                    ' and ' +
                                    parseInt((pointTwoPercent * limitMax) as any) +
                                    ' maintenance results' +
                                    ' and there are ' +
                                    totalAddonsForToday +
                                    ' results (' +
                                    (100 - (totalAddonsForToday / pointTwoPercent) * 100).toFixed(1) +
                                    '% from expectedd)',
                                isInRangeOf(totalAddonsForToday, pointTwoPercent),
                            );
                        } else if (deltaUntilStart < 9) {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected Install for date ' +
                                    property.split('T')[0] +
                                    ' to have between ' +
                                    parseInt((pointFivePercent * limitMin) as any) +
                                    ' and ' +
                                    parseInt((pointFivePercent * limitMax) as any) +
                                    ' maintenance results' +
                                    ' and there are ' +
                                    totalAddonsForToday +
                                    ' results (' +
                                    (100 - (totalAddonsForToday / pointFivePercent) * 100).toFixed(1) +
                                    '% from expected)',
                                isInRangeOf(totalAddonsForToday, pointFivePercent),
                            );
                        } else if (deltaUntilStart < 12) {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected Install for date ' +
                                    property.split('T')[0] +
                                    ' to have between ' +
                                    parseInt((pointTenPercent * limitMin) as any) +
                                    ' and ' +
                                    parseInt((pointTenPercent * limitMax) as any) +
                                    ' maintenance results' +
                                    ' and there are ' +
                                    totalAddonsForToday +
                                    ' results (' +
                                    (100 - (totalAddonsForToday / pointTenPercent) * 100).toFixed(1) +
                                    '% from expected)',
                                isInRangeOf(totalAddonsForToday, pointTenPercent),
                            );
                        } else if (deltaUntilStart < 15) {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected Install for date ' +
                                    property.split('T')[0] +
                                    ' to have between ' +
                                    parseInt((pointTwentyPercent * limitMin) as any) +
                                    ' and ' +
                                    parseInt((pointTwentyPercent * limitMax) as any) +
                                    ' maintenance results' +
                                    ' and there are ' +
                                    totalAddonsForToday +
                                    ' results (' +
                                    (100 - (totalAddonsForToday / pointTwentyPercent) * 100).toFixed(1) +
                                    '% from expected)',
                                isInRangeOf(totalAddonsForToday, pointTwentyPercent),
                            );
                        } else if (deltaUntilStart < 18) {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected Install for date ' +
                                    property.split('T')[0] +
                                    ' to have between ' +
                                    parseInt((pointFiftyPercent * limitMin) as any) +
                                    ' and ' +
                                    parseInt((pointFiftyPercent * limitMax) as any) +
                                    ' maintenance results' +
                                    ' and there are ' +
                                    totalAddonsForToday +
                                    ' results (' +
                                    (100 - (totalAddonsForToday / pointFiftyPercent) * 100).toFixed(1) +
                                    '% from expected)',
                                isInRangeOf(totalAddonsForToday, pointFiftyPercent),
                            );
                        } else {
                            addTestResultUnderHeadline(
                                testName,
                                'Expected Install for date ' +
                                    property.split('T')[0] +
                                    ' to have ' +
                                    pointAll +
                                    ' maintenance results' +
                                    ' and there are ' +
                                    totalAddonsForToday +
                                    ' results (' +
                                    (100 - (totalAddonsForToday / pointAll) * 100).toFixed(1) +
                                    '% from expected)',
                                totalAddonsForToday == pointAll,
                            );
                        }
                    }

                    //Print the API response
                    console.log({ Maintenance_Result_Object: apiResponse });

                    //Report test result
                    if (
                        JSON.stringify(apiResponse.resultObject.install).includes(
                            new Date().toISOString().split('T')[0],
                        ) &&
                        'Z'
                    ) {
                        addTestResultUnderHeadline(testName, 'Maintenance Date Install Valid Response');
                    } else {
                        addTestResultUnderHeadline(testName, 'Maintenance Date Install Valid Response', apiResponse);
                    }

                    //Uprade Test
                    let isData = false;
                    for (const property in apiResponse.resultObject.upgrade) {
                        const propertyDate = new Date(property);
                        const deltaUntilStart =
                            (propertyDate.getTime() - testExecutionData.testDate.getTime()) / 1000 / 60 / 60 / 24;
                        const totalAddonsForToday = apiResponse.resultObject.upgrade[property].length;
                        const maxAddons = testExecutionData.setTotalAddons - 4;
                        const pointOnePercent = maxAddons / 100;
                        const pointTwoPercent = maxAddons / 50;
                        const pointFivePercent = maxAddons / 20;
                        const pointTenPercent = maxAddons / 10;
                        const pointTwentyPercent = maxAddons / 5;
                        const pointFiftyPercent = maxAddons / 2;
                        const pointAll = maxAddons;
                        const limitMin = 0.9;
                        const limitMax = 1.1;
                        apiResponse.resultObject.upgrade[property].forEach(() => {
                            if (apiResponse.resultObject.upgrade[property].length > maxAddons) {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Maintenance response contain date for non upgradable addon uuid: ',
                                    apiResponse.resultObject.upgrade[property][0].toString(),
                                );
                                isData = true;
                            }
                        });
                        if (testName.includes('Negative')) {
                            if (totalAddonsForToday > 0) {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Expected for date ' +
                                        property.split('T')[0] +
                                        ' to have 0 maintenance results' +
                                        ' and there are ' +
                                        totalAddonsForToday +
                                        ' results',
                                    false,
                                );
                            } else {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Expected for date ' +
                                        property.split('T')[0] +
                                        ' to have 0 maintenance results' +
                                        ' and there are ' +
                                        totalAddonsForToday +
                                        ' results',
                                    true,
                                );
                            }
                        } else {
                            if (deltaUntilStart < 3) {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Expected Upgrade for date ' +
                                        property.split('T')[0] +
                                        ' to have between ' +
                                        parseInt((pointOnePercent * limitMin) as any) +
                                        ' and ' +
                                        parseInt((pointOnePercent * limitMax) as any) +
                                        ' maintenance results' +
                                        ' and there are ' +
                                        totalAddonsForToday +
                                        ' results (' +
                                        (100 - (totalAddonsForToday / pointOnePercent) * 100).toFixed(1) +
                                        '% from expected)',
                                    isInRangeOf(totalAddonsForToday, pointOnePercent),
                                );
                            } else if (deltaUntilStart < 6) {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Expected Upgrade for date ' +
                                        property.split('T')[0] +
                                        ' to have between ' +
                                        parseInt((pointTwoPercent * limitMin) as any) +
                                        ' and ' +
                                        parseInt((pointTwoPercent * limitMax) as any) +
                                        ' maintenance results' +
                                        ' and there are ' +
                                        totalAddonsForToday +
                                        ' results (' +
                                        (100 - (totalAddonsForToday / pointTwoPercent) * 100).toFixed(1) +
                                        '% from expectedd)',
                                    isInRangeOf(totalAddonsForToday, pointTwoPercent),
                                );
                            } else if (deltaUntilStart < 9) {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Expected Upgrade for date ' +
                                        property.split('T')[0] +
                                        ' to have between ' +
                                        parseInt((pointFivePercent * limitMin) as any) +
                                        ' and ' +
                                        parseInt((pointFivePercent * limitMax) as any) +
                                        ' maintenance results' +
                                        ' and there are ' +
                                        totalAddonsForToday +
                                        ' results (' +
                                        (100 - (totalAddonsForToday / pointFivePercent) * 100).toFixed(1) +
                                        '% from expected)',
                                    isInRangeOf(totalAddonsForToday, pointFivePercent),
                                );
                            } else if (deltaUntilStart < 12) {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Expected Upgrade for date ' +
                                        property.split('T')[0] +
                                        ' to have between ' +
                                        parseInt((pointTenPercent * limitMin) as any) +
                                        ' and ' +
                                        parseInt((pointTenPercent * limitMax) as any) +
                                        ' maintenance results' +
                                        ' and there are ' +
                                        totalAddonsForToday +
                                        ' results (' +
                                        (100 - (totalAddonsForToday / pointTenPercent) * 100).toFixed(1) +
                                        '% from expected)',
                                    isInRangeOf(totalAddonsForToday, pointTenPercent),
                                );
                            } else if (deltaUntilStart < 15) {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Expected Upgrade for date ' +
                                        property.split('T')[0] +
                                        ' to have between ' +
                                        parseInt((pointTwentyPercent * limitMin) as any) +
                                        ' and ' +
                                        parseInt((pointTwentyPercent * limitMax) as any) +
                                        ' maintenance results' +
                                        ' and there are ' +
                                        totalAddonsForToday +
                                        ' results (' +
                                        (100 - (totalAddonsForToday / pointTwentyPercent) * 100).toFixed(1) +
                                        '% from expected)',
                                    isInRangeOf(totalAddonsForToday, pointTwentyPercent),
                                );
                            } else if (deltaUntilStart < 18) {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Expected Upgrade for date ' +
                                        property.split('T')[0] +
                                        ' to have between ' +
                                        parseInt((pointFiftyPercent * limitMin) as any) +
                                        ' and ' +
                                        parseInt((pointFiftyPercent * limitMax) as any) +
                                        ' maintenance results' +
                                        ' and there are ' +
                                        totalAddonsForToday +
                                        ' results (' +
                                        (100 - (totalAddonsForToday / pointFiftyPercent) * 100).toFixed(1) +
                                        '% from expected)',
                                    isInRangeOf(totalAddonsForToday, pointFiftyPercent),
                                );
                            } else {
                                addTestResultUnderHeadline(
                                    testName,
                                    'Expected Upgrade for date ' +
                                        property.split('T')[0] +
                                        ' to have ' +
                                        pointAll +
                                        ' maintenance results' +
                                        ' and there are ' +
                                        totalAddonsForToday +
                                        ' results (' +
                                        (100 - (totalAddonsForToday / pointAll) * 100).toFixed(1) +
                                        '% from expected)',
                                    totalAddonsForToday == pointAll,
                                );
                            }
                        }
                    }

                    addTestResultUnderHeadline(
                        testName,
                        "Maintenance response don't contain date for non upgradable Test: ",
                        !isData,
                    );

                    //Report test result
                    if (
                        JSON.stringify(apiResponse.resultObject.upgrade).includes(
                            new Date().toISOString().split('T')[0],
                        ) &&
                        'Z'
                    ) {
                        addTestResultUnderHeadline(testName, 'Maintenance Date Upgrade Valid Response');
                    } else {
                        addTestResultUnderHeadline(testName, 'Maintenance Date Upgrade Valid Response', apiResponse);
                    }
                }
            }, SetIntervalEvery);
        });
    }

    //#endregion Phased Maintenance Single Tests

    //Test Phased Maintenance
    async function executePhasedMaintenanceTest(testExecutionData, callBack, runOnline, IncludeInstall) {
        //Test Data
        const startUpgradeDate = testExecutionData.testDate ? testExecutionData.testDate : testDate;
        const startUpgradePercent = testExecutionData.setUpgradePercent;
        const totalAddons = testExecutionData.setTotalAddons;
        const newVersionsPerAddon = testExecutionData.setVersionsPerAddon;
        const testDataObject: any = createNewMaintenanceTestDataObject(
            startUpgradeDate.toISOString(),
            startUpgradePercent,
            totalAddons,
            newVersionsPerAddon,
        );
        if (testExecutionData.setNewInstallAddonsSystemData != undefined) {
            for (let index = 0; index < testDataObject.ApiData.installedAddons.length; index++) {
                testDataObject.ApiData.installedAddons[index].SystemData =
                    testExecutionData.setNewInstallAddonsSystemData;
            }
        }
        for (let index = 0; index < 4; index++) {
            testDataObject['ApiData']['systemAddonsToInstall'].shift();
        }
        for (let index = 0; index < 4 * newVersionsPerAddon; index++) {
            testDataObject['ApiData']['systemAddonsPhasedVersions'].shift();
        }

        if (IncludeInstall) {
            //Remove uneeded data from the test object
            testDataObject.ApiData.installedAddonsVersions = [];
            testDataObject.ApiData.installedAddons = [];
        } else {
            //Remove uneeded data from the test object
            if (IncludeInstall != undefined) {
                testDataObject.ApiData.systemAddonsPhasedVersions = [];
                testDataObject.ApiData.systemAddonsToInstall = [];
            }

            for (let index = 0; index < newVersionsPerAddon; index++) {
                testDataObject['ApiData']['installedAddonsVersions'][index].Available = false;
                testDataObject['ApiData']['installedAddonsVersions'][index].Phased = true;
            }
            for (let index = newVersionsPerAddon; index < 2 * newVersionsPerAddon; index++) {
                testDataObject['ApiData']['installedAddonsVersions'][index].Available = true;
                testDataObject['ApiData']['installedAddonsVersions'][index].Phased = false;
            }
            for (let index = 2 * newVersionsPerAddon; index < 3 * newVersionsPerAddon; index++) {
                testDataObject['ApiData']['installedAddonsVersions'][index].StartPhasedDateTime = new Date(
                    testDate.getTime() + 1000 * 60 * 60 * 24 * 30,
                ).toISOString();
                testDate = new Date(testDate.getTime() - 1000 * 1 - 1);
            }
            for (let index = 3 * newVersionsPerAddon; index < 4 * newVersionsPerAddon; index++) {
                testDataObject['ApiData']['installedAddonsVersions'][index].Available = false;
                testDataObject['ApiData']['installedAddonsVersions'][index].Phased = false;
                testDataObject['ApiData']['installedAddonsVersions'][index].StartPhasedDateTime = new Date(
                    testDate.getTime() + 1000 * 60 * 60 * 24 * 30,
                ).toISOString();
                testDate = new Date(testDate.getTime() - 1000 * 1 - 1);
            }

            //Phased Group One
            for (let j = 0; j < (totalAddons - 4) * newVersionsPerAddon; j += newVersionsPerAddon) {
                for (let index = 4 * newVersionsPerAddon; index < 5 * newVersionsPerAddon; index++) {
                    const tempFifthDate = new Date(
                        testDate.getTime() + testExecutionData.changePhasedGroupVersionDays * 1000 * 60 * 60 * 24,
                    );
                    testDataObject['ApiData']['installedAddonsVersions'][index + j].StartPhasedDateTime = new Date(
                        tempFifthDate,
                    ).toISOString();
                    if (testDataObject['ApiData']['installedAddonsVersions'][index + j].Version == 'ver1') {
                        testDataObject['ApiData']['installedAddonsVersions'][index + j].StartPhasedDateTime = new Date(
                            Number(tempFifthDate) - 1000 * 60 - 1,
                        ).toISOString();
                        testDataObject['ApiData']['installedAddonsVersions'][index + j].CreationDateTime = new Date(
                            testDate.getTime() - 1000 * 60 - 1,
                        ).toISOString();
                    }
                    testDate = new Date(testDate.getTime() - 1000 * 1 - 1);
                }
                //Make the order of versions DESC
                if (testDataObject['ApiData']['installedAddonsVersions'][0 + j].Version == 'ver1') {
                    const tempVersion = testDataObject['ApiData']['installedAddonsVersions'][0 + j];
                    testDataObject['ApiData']['installedAddonsVersions'][0 + j] =
                        testDataObject['ApiData']['installedAddonsVersions'][1 + j];
                    testDataObject['ApiData']['installedAddonsVersions'][1 + j] =
                        testDataObject['ApiData']['installedAddonsVersions'][2 + j];
                    testDataObject['ApiData']['installedAddonsVersions'][2 + j] =
                        testDataObject['ApiData']['installedAddonsVersions'][3 + j];
                    testDataObject['ApiData']['installedAddonsVersions'][3 + j] = tempVersion;
                }
            }
        }

        //#region Algoritem tests Ido
        //This area can help to deep investigate bugs in the scheduler algoritem
        //Upgrade
        if (false) {
            let apiDataForAlgoTestUUIDArr: any = [];
            let apiDataForAlgoTestDateTimeArr: any = [];

            for (let j = 4; j < testDataObject.ApiData.installedAddons.length; j++) {
                apiDataForAlgoTestUUIDArr.push(testDataObject.ApiData.installedAddons[j].Addon.UUID);
            }
            for (
                let j = 5 * newVersionsPerAddon;
                j < testDataObject.ApiData.installedAddons.length * newVersionsPerAddon;
                j += newVersionsPerAddon
            ) {
                apiDataForAlgoTestDateTimeArr.push(testDataObject.ApiData.installedAddonsVersions[j].CreationDateTime);
            }

            for (let index = 0; index < apiDataForAlgoTestUUIDArr.length; index++) {
                const startDateTime = new Date(apiDataForAlgoTestDateTimeArr[index]);
                const seed = startDateTime.getMilliseconds() % 100;

                //const UUIDParts = apiDataForAlgoTestUUIDArr[index].toString().split('-');
                const distModulo = parseInt('0x' + 'fa05f8f28b01' /*UUIDParts[UUIDParts.length - 1]*/) % 100;
                // Ido
                const phases = [1, 2, 5, 10, 20, 50, 100];
                for (let index = 0; index < phases.length; index++) {
                    console.log(`Test for index: ${phases[index]}`);

                    let limit = seed + phases[index];
                    let shouldUpgrade = false;
                    if (limit > 100) {
                        // if limit is bigger than 100 we substract the 100 so check against distModue which is between 0-99
                        //i.e seed = 82, precentage = 20% -> limit = 102
                        //new limit = 102-100=2
                        //the conditions (0 < distModulo < 2) || (82(seed) <= distModulo < 100)
                        limit = limit - 100;
                        if ((0 <= distModulo && distModulo < limit) || (seed <= distModulo && distModulo < 100))
                            shouldUpgrade = true;
                    }

                    // in case limit is between 0-100 check if distModulo is between the seed and limit (i.e. seed+phased%)
                    else if (seed <= distModulo && distModulo < limit) {
                        shouldUpgrade = true;
                    }

                    console.log(
                        `UUID: ${apiDataForAlgoTestUUIDArr[index]} is: ${distModulo}, CreationDateTime: ${apiDataForAlgoTestDateTimeArr[index]}, should upgrade: ${shouldUpgrade}`,
                    );
                    console.log(`UUID: ${apiDataForAlgoTestUUIDArr[index]}, Seed is: ${seed}`);
                }
            }
            //Install
            if (false) {
                apiDataForAlgoTestUUIDArr = [];
                apiDataForAlgoTestDateTimeArr = [];

                for (let j = 0; j < testDataObject.ApiData.systemAddonsToInstall.length; j++) {
                    apiDataForAlgoTestUUIDArr.push(testDataObject.ApiData.systemAddonsToInstall[j].UUID);
                }
                for (
                    let j = 0;
                    j < testDataObject.ApiData.systemAddonsToInstall.length * newVersionsPerAddon;
                    j += newVersionsPerAddon
                ) {
                    apiDataForAlgoTestDateTimeArr.push(
                        testDataObject.ApiData.systemAddonsPhasedVersions[j].CreationDateTime,
                    );
                }

                for (let index = 0; index < apiDataForAlgoTestUUIDArr.length; index++) {
                    const startDateTime = new Date(apiDataForAlgoTestDateTimeArr[index]);
                    const seed = startDateTime.getMilliseconds() % 100;

                    //const UUIDParts = apiDataForAlgoTestUUIDArr[index].toString().split('-');
                    const distModulo = parseInt('0x' + 'fa05f8f28b01' /*UUIDParts[UUIDParts.length - 1]*/) % 100;
                    // Ido
                    const phases = [1, 2, 5, 10, 20, 50, 100];
                    for (let index = 0; index < phases.length; index++) {
                        console.log(`Test for index: ${phases[index]}`);

                        let limit = seed + phases[index];
                        let shouldUpgrade = false;
                        if (limit > 100) {
                            // if limit is bigger than 100 we substract the 100 so check against distModue which is between 0-99
                            //i.e seed = 82, precentage = 20% -> limit = 102
                            //new limit = 102-100=2
                            //the conditions (0 < distModulo < 2) || (82(seed) <= distModulo < 100)
                            limit = limit - 100;
                            if ((0 <= distModulo && distModulo < limit) || (seed <= distModulo && distModulo < 100))
                                shouldUpgrade = true;
                        }

                        // in case limit is between 0-100 check if distModulo is between the seed and limit (i.e. seed+phased%)
                        else if (seed <= distModulo && distModulo < limit) {
                            shouldUpgrade = true;
                        }

                        console.log(
                            `UUID: ${apiDataForAlgoTestUUIDArr[index]} is: ${distModulo}, CreationDateTime: ${apiDataForAlgoTestDateTimeArr[index]}, should upgrade: ${shouldUpgrade}`,
                        );
                        console.log(`UUID: ${apiDataForAlgoTestUUIDArr[index]}, Seed is: ${seed}`);
                    }
                }
            }
        }
        //#endregion Algoritem tests

        console.log(testDataObject);

        //Test Phased Maintenance Locally
        if (runOnline) {
            // const getInstalledAddonsApiResponse = await generalService.papiClient.get(
            //     '/addons/installed_addons?page_size=-1',
            // );

            //Change so the test will run also on users without the Services addon
            const addonUUID = '00000000-0000-0000-0000-000000000a91';
            const installedAddonVersion = await generalService.papiClient.addons.installedAddons
                .addonUUID(`${addonUUID}`)
                .get();
            const getAPIVersion = installedAddonVersion.Version;
            console.log({ Services_Addon_Version: getAPIVersion });

            //Can be used to run the test on the specific Service addon of the user
            //     for (let index = 0; index < getInstalledAddonsApiResponse.length; index++) {
            //     if (getInstalledAddonsApiResponse[index].Addon.UUID == ("00000000-0000-0000-0000-000000000a91")) {
            //         getAPIVersion = getInstalledAddonsApiResponse[index].Version;
            //         console.log({ Services_Addon_Version: getAPIVersion });
            //         break;
            //     }
            // }

            //This function can install the API adoon on every distributor that don't have it
            // if (getAPIVersion == undefined) {
            //     await generalService.papiClient.'POST', "addons/installed_addons/" + "00000000-0000-0000-0000-000000000a91" + "/install");
            //     for (let index = 0; index < getInstalledAddonsApiResponse.length; index++) {
            //         if (getInstalledAddonsApiResponse[index].Addon.UUID == ("00000000-0000-0000-0000-000000000a91")) {
            //             getAPIVersion = getInstalledAddonsApiResponse[index].Version;
            //             console.log({ Services_Addon_Version: getAPIVersion });
            //             break;
            //         }
            //     }
            // }

            //var maintenanceApiResponse = await generalService.papiClient.'POST', "addons/api/00000000-0000-0000-0000-000000000a91/version/" + getAPIVersion + "/installation.js/maintenance", testDataObject);
            const maintenanceApiResponse = await generalService.papiClient.post(
                '/addons/api/00000000-0000-0000-0000-000000000a91/version/' +
                    getAPIVersion +
                    '/installation.js/maintenance',
                testDataObject,
            );

            return callBack(maintenanceApiResponse);
        } else {
            const callToLocal = await fetch('http://localhost:4400/maintenance/maintenance', {
                method: `POST`,
                headers: {
                    Authorization: request.body.varKey,
                },
                body: JSON.stringify(testDataObject),
            }).then((response) => response.json());

            console.log({ Services_Addon_Version: 'Local Version' });
            return callBack(callToLocal);
        }
    }
    //debugger;
    //This can be use to easily extract the token to the console
    //console.log({ Token: API._Token })

    //#endregion Phased Tests

    //Test Remove All Installed Addons - not working yet
    //Don't Change it if your name is not Oren Vilderman! (You can delete it if you want)
    async function executeRemoveAllInstalledAddons() {
        // //Install the testing addon with the new framwrok and upgrade and get autid log result
        // var postInstallAddonApiResponse = await generalService.papiClient.'POST', "addons/installed_addons/" + "eb26afcd-3cf2-482e-9ab1-b53c41a6adbe" + "/install" + "/0.0.20");

        // //For the new addons framwrok
        // var postUpgradeAddonApiResponse = await generalService.papiClient.'POST', "addons/installed_addons/" + "eb26afcd-3cf2-482e-9ab1-b53c41a6adbe" + "/upgrade/0.0.20");
        // //var postUpgradeAddonApiResponse = await generalService.papiClient.'POST', "addons/installed_addons/" + "a8f4698f-eb75-4a75-bdf6-1524eb9f6baf" + "/upgrade/v1.0");
        // debugger;
        // var autit1 = await generalService.papiClient.get(postUpgradeAddonApiResponse.URI as any);
        // debugger;
        // var autit2 = await generalService.papiClient.get(postUpgradeAddonApiResponse.URI as any);
        // debugger;
        // var autit3 = await generalService.papiClient.get(postUpgradeAddonApiResponse.URI as any);

        // //For the addons manager
        // var postUpgradeAddonApiResponse = await generalService.papiClient.'POST', "addons/installed_addons/" + "bd629d5f-a7b4-4d03-9e7c-67865a6d82a9" + "/upgrade/0.0.26");
        // //oren.addons.framework
        // var postUpgradeAddonApiResponse1 = wait fetch(
        //     generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions/ccce8ae4-b889-45f0-97e8-bb8f0e0f631c',
        //     {
        //         method: `DELETE`,
        //         headers: {
        //             Authorization: request.body.varKey,
        //         },
        //     },
        // ).then((response) => response.json());
        // //oren.v
        // var postUpgradeAddonApiResponse2 = wait fetch(
        //     generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions/38bf0bf7-e78f-4be5-a3b6-363b3e2d44a9',
        //     {
        //         method: `DELETE`,
        //         headers: {
        //             Authorization: request.body.varKey,
        //         },
        //     },
        // ).then((response) => response.json());
        // //Test 4
        // var postUpgradeAddonApiResponse3 = wait fetch(
        //     generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions/9fb5371a-724b-48c5-8ce7-b227819bb1ff',
        //     {
        //         method: `DELETE`,
        //         headers: {
        //             Authorization: request.body.varKey,
        //         },
        //     },
        // ).then((response) => response.json());
        // var o1 = await generalService.papiClient.get(postUpgradeAddonApiResponse1.URI)
        // var o2 = await generalService.papiClient.get(postUpgradeAddonApiResponse2.URI)
        // var o3 = await generalService.papiClient.get(postUpgradeAddonApiResponse2.URI)
        // debugger;

        const getInstalledAddonsApiResponse = await generalService.papiClient.get(
            '/addons/installed_addons?page_size=-1',
        );
        //const getInstalledAddonsApiResponse = await generalService.papiClient.get("addons/versions");
        //const getInstalledAddonsApiResponse = await generalService.papiClient.get("addons");

        console.log('There are ' + getInstalledAddonsApiResponse.length + ' Installed Addons');

        //debugger;
        for (let index = 0; index < getInstalledAddonsApiResponse.length; index++) {
            if (
                getInstalledAddonsApiResponse[index].Version.startsWith('Version Test') &&
                //getInstalledAddonsApiResponse[index].SystemData == "{}" &&
                parseInt(getInstalledAddonsApiResponse[index].Version.split(' ')[2]) > 1000
            ) {
                //Uninstall
                const postUninstallAddonApiResponse = await generalService.papiClient.addons.installedAddons
                    .addonUUID(getInstalledAddonsApiResponse[index].Addon.UUID)
                    .uninstall();
                let getUninstallAuditLogApiResponse;
                let maxLoopsCounter = 90;
                do {
                    generalService.sleep(2000);
                    getUninstallAuditLogApiResponse = await generalService.papiClient.get(
                        postUninstallAddonApiResponse.URI as any,
                    );
                    maxLoopsCounter--;
                } while (getUninstallAuditLogApiResponse.Status.ID == 2 && maxLoopsCounter > 0);
                console.log({ 'Addone uninstalled: ': getInstalledAddonsApiResponse[index] });
                console.log({ Get_Audit_Log_Uninstall: getUninstallAuditLogApiResponse });

                //Delete
                let deleteApiResponse;
                let getDeleteAuditLogApiResponse;
                try {
                    deleteApiResponse = await fetch(
                        generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                            '/var/addons/versions/' +
                            getInstalledAddonsApiResponse[index].Addon.UUID,
                        {
                            method: `DELETE`,
                            headers: {
                                Authorization: request.body.varKey,
                            },
                        },
                    ).then((response) => response.json());
                } catch (error) {
                    deleteApiResponse = error;
                }

                maxLoopsCounter = 90;
                if (deleteApiResponse.URI != null) {
                    getDeleteAuditLogApiResponse = deleteApiResponse;
                } else {
                    do {
                        generalService.sleep(2000);
                        getDeleteAuditLogApiResponse = await generalService.papiClient.get(deleteApiResponse.URI);
                        maxLoopsCounter--;
                    } while (
                        (getDeleteAuditLogApiResponse.result != null ||
                            getDeleteAuditLogApiResponse.success == false) &&
                        getDeleteAuditLogApiResponse.success.ID == 2 &&
                        maxLoopsCounter > 0
                    );
                }
                console.log({ 'Addone deleted: ': getInstalledAddonsApiResponse[index] });
                console.log({ Post_Var_Addons_Delete: getDeleteAuditLogApiResponse });
            }
        }

        // //Delete Addon Version
        // const deleteVersionApiResponse = await fetch(
        //     generalService['client'].BaseURL.replace('papi-eu', 'papi') + '/var/addons/versions/' + createVersionApiResponse.UUID,
        //     {
        //         method: `DELETE`,
        //         headers: {
        //             Authorization: request.body.varKey,
        //         },
        //     },
        // ).then((response) => response.json());
        // if (!deleteVersionApiResponse) {
        //     console.log({ Post_Var_Addons_Versions_Delete: deleteVersionApiResponse });
        // }

        //This can be use to easily extract the token to the console
        //console.log({ Token: VarAPI._Token })
    }
    //#endregion Tests
}
