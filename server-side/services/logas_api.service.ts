import { PapiClient } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export interface LogsPayload {
    Groups: AwsCloudwatchGroups[];
    Filter?: string;
    Fields?: AwsCloudwatchFields[];
    DateTimeStamp?: DateTimeStamp;
    PageSize?: number;
    Page?: number;
    OrderBy?: string;
}

export interface LogsResponse {
    DistributorUUID?: string;
    DateTimeStamp?: string;
    Level?: string;
    Message?: string;
    UserUUID?: string;
    Source?: string;
    ActionUUID?: string;
    DistributorID?: string;
    UserID?: string;
    Version?: string;
}

interface DateTimeStamp {
    Start?: string;
    End?: string;
}

type AwsCloudwatchFields =
    "Level" |
    "Source" |
    "Message" |
    "ActionUUID" |
    "UserUUID" |
    "DateTimeStamp" |
    "DistributorID" |
    "UserID" |
    "Version";

type AwsCloudwatchGroups =
    "AsyncAddon" |
    "CodeJobs" |
    "Addon" |
    "SyncOperation" |
    "CustomDomain" |
    "LogFetcher" |
    "PAPI" |
    "CPAPI" |
    "PFS" |
    "PNS" |
    "FileIntegration" |
    "CPAS" |
    "OperationInvoker";



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

    getLogsByPayload(logsPayload: LogsPayload): Promise<LogsResponse[]> {
        return this.papiClient.post('/logs', logsPayload);
    }
}

