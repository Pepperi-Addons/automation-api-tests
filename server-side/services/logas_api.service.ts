import { PapiClient } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export interface LogsPayload {
    Groups: string[];
    Filter?: string;
    Fields?: string[];
    DateTimeStamp?: DateTimeStamp;
    PageSize?: number;
    Page?: number;
    OrderBy?: string;
}

interface DateTimeStamp {
    Start: string;
    End: string;
}

export class LogsService {
    papiClient: PapiClient;
    generalService: GeneralService;

    constructor(public service: GeneralService) {
        this.papiClient = service.papiClient;
        this.generalService = service;
    }

    // //This should be replace with return this.papiClient.charts.find(); once SDK is developed
    // async getQueries(): Promise<DataQuerie[]> {
    //     const chartResponse = await this.papiClient.get('/logs?page_size=-1');
    //     return chartResponse;
    // }

    // async getQueriesByKey(key: string): Promise<DataQuerie> {//??
    //     const chartResponse = await this.papiClient.get(`/logs?where=Key='${key}'`);
    //     return chartResponse;
    // }

    getLogsByPayload(logsPayload: LogsPayload): Promise<LogsPayload[]> {
        return this.papiClient.post('/logs', logsPayload);
    }
}
//TODO : response interface:

// DateTimeStamp:'2022-03-31 14:08:37.365'
// DistributorUUID:'3b490454-4a84-42c8-b8c7-f8a5855d217e'
// Level:'INFO'
// Message:'"NotifyEndJobExecution: Finish function for action UUID = 26187b9f-193b-4b69-a6e1-2c537878cce1"'
// UserUUID:'e67cdb90-70e1-40bf-90fb-85e5543a4b8c'