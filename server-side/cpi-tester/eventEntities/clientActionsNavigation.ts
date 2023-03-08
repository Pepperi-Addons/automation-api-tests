import { EventResponseNavigation } from "../constants";
import { EventsService } from "../services/events.service";
import {EventResult}  from "./index";


export class ClientActionNavigation extends EventResult 
{
	constructor(protected eventsService: EventsService, protected data: EventResponseNavigation)
	{
		super(eventsService, data);
	}
	
	get eventData() 
	{
		return this.data.Value.Data;
	}

	public async setResult(resultToSet: any): Promise<EventResult> 
	{
		throw new Error('Cannot set an event result on a "Navigation" client action.');
	}
}
