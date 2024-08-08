# Pepperi's Automation Framework 

## High Level
The Automation Framwork is Pepperi's main testing tool, contaning API & E2E tests and the CI/CD component responsible for running the tests once a development release branch is merged, developed & maintained by the QA team.

---

## Releases
Our releases are done based on need, not a release plan, always use latest available version.

---

## Deployment
Use "publish-addon" manually.

---

## Debugging
You can create breakpoints by using "debugger" command OR using VSC breakpoints.

1. for E2E tests which are found inside the 'ui-tests' folder, use the "Listen To NPM Scripts" launch target command, once debugger is running, you need to run the relevant test using npm.
2. for API tests which are found inside the 'api-tests' folder, use the "Launch API Server" launch target command, once debugger is running, you need to call the relevant test endpoint using postman.

---

### Local specific
- make sure you have the var_sk file which is ignored in Git.
- make sure you have the body template to call test endpoints:
```json
{
    "varKeyPro": "{{varKeyPro}}",
    "varKeyEU": "{{varKeyEU}}",
    "varKeyStage": "{{varKeyStage}}",
    "addonUUID": "eb26afcd-3cf2-482e-9ab1-b53c41a6adbe"
}
```

---

### Online specific
- Log groups: 
  - for API tests which run on async lambdas: `/aws/lambda/`ExecuteAsyncTaskExecutionSystemAddonSync`, filter by action UUID.
  - for tests which run using CLI on Jenkins / locally - your only option is reading Jenkins / local logs.

- Running data for async lambda tests is taken from "qa automation" bitbucket repo.

---

## Dependencies

NONE.

---

## APIs
1. every test which is exposed using API calls is found under - '/tests/<TEST_NAME>', which you should call using POST method with the template body.
2. other tests are using NPM CLI API, calling: 'npm run ui-show-report' command.

---