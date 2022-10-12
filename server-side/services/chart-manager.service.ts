import { PapiClient } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export interface Chart {
    Type?: string;
    CreationDateTime?: string;
    Hidden?: boolean;
    ModificationDateTime?: string;
    Key?: string;
    Description?: string; //just to make sure i could send w\o any desc. although rn its impossible (returns 400)
    FileID?: string;
    Name: string;
    ScriptURI: any;
    UID?: string;
    System?: boolean;
}

export class ChartsManagerService {
    papiClient: PapiClient;
    generalService: GeneralService;

    constructor(public service: GeneralService) {
        this.papiClient = service.papiClient;
        this.generalService = service;
    }

    //This should be replace with return this.papiClient.charts.find(); once SDK is developed
    async getCharts(): Promise<Chart[]> {
        const chartResponse = await this.papiClient.get('/charts?page_size=-1');
        return chartResponse;
    }

    async getChartByKey(key: string): Promise<Chart> {
        const chartResponse = await this.papiClient.get(
            `/charts?where=Key='${key}'`,
        );
        return chartResponse;
    }

    postChart(chart: Chart): Promise<Chart> {
        return this.papiClient.post('/charts', chart);
    }

    //Remove all test Charts (Hidden = true)
    async TestCleanUp() {
        const allChartsObjects: Chart[] = await this.getCharts();
        let deletedCounter = 0;

        for (let index = 0; index < allChartsObjects.length; index++) {
            if (
                allChartsObjects[index].System === false
            ) {
                allChartsObjects[index].Hidden = true;
                await this.postChart(allChartsObjects[index]);
                deletedCounter++;
            }
        }
        console.log('Hidded Charts: ' + deletedCounter);
        return deletedCounter;
    }
}
