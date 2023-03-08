import { EventResponseHud, HUDActionExecutionResult } from "../constants";
import { EventsService } from "../services/events.service";
import {EventResult}  from "./index";


export class ClientActionHUD extends EventResult
{	
	constructor(protected eventsService: EventsService, protected data: EventResponseHud)
	{
		super(eventsService, data);
	}
	
	get eventData() 
	{
		return this.data.Value.Data;
	}
	
	public async setResult(resultToSet: HUDActionExecutionResult): Promise<EventResult>;
	public async setResult(resultToSet: any): Promise<EventResult>;
	
	public async setResult(resultToSet: any): Promise<EventResult> 
	{
		return await super.setResult(resultToSet);
	}
}
