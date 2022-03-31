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
