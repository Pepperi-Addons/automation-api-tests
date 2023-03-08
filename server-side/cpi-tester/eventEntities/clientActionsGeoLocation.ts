import { EventResponseGeoLocation, GeoLocationActionExecutionResult } from "../constants";
import { EventsService } from "../services/events.service";
import {EventResult}  from "./index";


interface accountGeoData {
  City: string;
  Country: string;
  Street: string;
  Latitude?: number;
  Longitude?: number;
}

const accountData1: accountGeoData = {
	City: "Havelberg",
	Country: "Germany",
	Street: "Pritzwalker Str.70",
	Latitude: 52.83634,
	Longitude: 12.0816,
};

const accountData2: accountGeoData = {
	City: "Rostock",
	Country: "Germany",
	Street: "Seidenstraße 5",
	Latitude: 54.0902,
	Longitude: 12.14491,
};

const accountData3: accountGeoData = {
	City: "Wedemark",
	Country: "Germany",
	Street: "Langer Acker 1",
	Latitude: 52.51669,
	Longitude: 9.73096,
};

const accountData4: accountGeoData = {
	City: "Radeberg",
	Country: "Germany",
	Street: "Pulsnitzer Str. 33",
	Latitude: 51.12013,
	Longitude: 13.92224,
};

const accountDataArr: accountGeoData[] = [
	accountData1,
	accountData2,
	accountData3,
	accountData4,
];

export class ClientActionGeoLocation extends EventResult 
{
	constructor(protected eventsService: EventsService, protected data: EventResponseGeoLocation)
	{
		super(eventsService, data);
	}
	
	get eventData() 
	{
		return this.data.Value.Data;
	}

	/**
    This method sets a random location in response to a geo location request.
    @return {@link Promise} of {@link EventResult} containing the random location information
    */
	async setRandomLocation(): Promise<EventResult> 
	{
		const randIndex = Math.floor(Math.random() * 3) + 1;
		const randAccuracy = Math.floor(Math.random() * 100) + 1;

		const result: GeoLocationActionExecutionResult = {
			EventKey: this.data.Value.Callback,
			EventData: {
				Success: this.data.Success,
				Longitude: accountDataArr[randIndex].Longitude!,
				Latitude: accountDataArr[randIndex].Latitude!,
				Accuracy: randAccuracy,
			}
		};

		return await this.setResult(result);
	}

	public async setResult(resultToSet: GeoLocationActionExecutionResult): Promise<EventResult>;
	public async setResult(resultToSet: any): Promise<EventResult>;
	
	public async setResult(resultToSet: any): Promise<EventResult> 
	{
		return await super.setResult(resultToSet);
	}
}
