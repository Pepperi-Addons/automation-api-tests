import { DialogActionExecutionResult, EventResponseDialog } from "../constants";
import { EventsService } from "../services/events.service";
import {EventResult}  from "./index";


export class ClientActionDialog extends EventResult 
{
	constructor(protected eventsService: EventsService, protected data: EventResponseDialog)
	{
		super(eventsService, data);
	}
	
	get eventData() 
	{
		return this.data.Value.Data;
	}

	/**
    Selects an action based on the given index.
    @param {number} k - The index of the action to select.
    @return {Promise<EventResult>} - A promise that resolves to the resulting EventResult.
    */
	public async selectActionK(k: number): Promise<EventResult>
	{
		const result: DialogActionExecutionResult = {
			EventKey: this.data.Value.Callback,
			EventData: {
				SelectedAction: this.data.Value.Data?.Actions[k].Key!
			}
		};

		return await this.setResult(result);
	}

	public async setResult(resultToSet: DialogActionExecutionResult): Promise<EventResult>;
	public async setResult(resultToSet: any): Promise<EventResult>;
	
	public async setResult(resultToSet: any): Promise<EventResult> 
	{
		return await super.setResult(resultToSet);
	}
}
