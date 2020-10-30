import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AddonApiService } from '../addon-api.service';
// @ts-ignore
import { UserService } from "pepperi-user-service";

@Component({
  selector: 'app-api-tester',
  templateUrl: './api-tester.component.html',
  styleUrls: ['./api-tester.component.scss']
})
export class ApiTesterComponent implements OnInit {

  data: any
  apiEndpoint: string

  constructor(
    private translate: TranslateService,
    private backendApiService: AddonApiService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  testEndpoint(endpoint, successFunc = null, errorFunc = null) {
    const self = this;
    this.backendApiService.getApiEndpoint(endpoint).subscribe( 
      (res: any) => {
       
        if (successFunc){
          successFunc(res);
        }
        else {
          self.data = res;
          self.userService.setShowLoading(false)
        }
      },
    (error) => {
      if (errorFunc){
        errorFunc(error);
      }
    },
    () => self.userService.setShowLoading(false)
    )
  }

  getExecutionLog(executionUUID, successFunc, errorFunc = null) {
    let url = "/audit_logs?where=(UUID='" + executionUUID + "')";
    this.backendApiService.get(url).subscribe(
        res => {
            if (successFunc){
              successFunc(res);
            }
        },
        (error) => {
          if (errorFunc){
            errorFunc(error);
          }
        },
        () => this.userService.setShowLoading(false)
        )
}

  pollExecution(endpoint, pollingInterval = 30000,
    stopConditionFunction = (res) => {return res.length > 0 && (res[0].Status.Name === 'Failure' || res[0].Status.Name === 'Success')} ) {    
    //res[0].AuditInfo.ResultObject
    this.testEndpoint(endpoint, jobRes=>{ 
      let self = this;
      const interval = window.setInterval(()=>{
        this.getExecutionLog(jobRes.ExecutionUUID, 
          logRes=>{           
              if (stopConditionFunction(logRes)) {
              //debugger;
                if(logRes[0].Status.Name === 'Success'){              
                  self.data = JSON.parse(logRes[0].AuditInfo.ResultObject);
                }
                else{
                  alert("Test failed . The status = Failure!!!");
                }
                window.clearInterval(interval);
                this.userService.setShowLoading(false);
              }
             
          }, 
          ()=>{
            window.clearInterval(interval);
            this.userService.setShowLoading(false);
          }
        );
      
      } , pollingInterval);
    });
      
  }

}
