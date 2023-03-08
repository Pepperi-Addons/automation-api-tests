import { FilePickerActionExecutionResult  } from "../constants";
import {EventResult}  from "./index";


export class ClientActionFilePicker extends EventResult 
{
	public async setResult(resultToSet: FilePickerActionExecutionResult): Promise<EventResult>;
	public async setResult(resultToSet: any): Promise<EventResult>;
	
	public async setResult(resultToSet: any): Promise<EventResult> 
	{
		return await super.setResult(resultToSet);
	}
}
