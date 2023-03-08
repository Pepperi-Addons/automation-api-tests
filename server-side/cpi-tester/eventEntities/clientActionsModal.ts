import { EventResponseModal, ModalActionExecutionResult } from "../constants";
import { EventsService } from "../services/events.service";
import {EventResult}  from "./index";


export class ClientActionModal extends EventResult 
{
	constructor(protected eventsService: EventsService, protected data: EventResponseModal)
	{
		super(eventsService, data);
	}
	
	get eventData() 
	{
		return this.data.Value.Data;
	}

	public async setResult(resultToSet: ModalActionExecutionResult): Promise<EventResult>;
	public async setResult(resultToSet: any): Promise<EventResult>;
	
	public async setResult(resultToSet: any): Promise<EventResult> 
	{
		return await super.setResult(resultToSet);
	}
}
