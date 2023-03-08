// import EventResult from "./eventResult";
import {EventResult}  from "./index";


export class FinishEvent extends EventResult
{
	public async setResult(resultToSet: any): Promise<EventResult> 
	{
		throw new Error('Cannot set an event result on a "Finish" event.');
	}
}
