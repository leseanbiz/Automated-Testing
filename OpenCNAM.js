//Instructions via CMD:
    //command to start test: testcafe chrome OpenCNAM.js
        //this creates a date stamped Excel file in the test directory
        //this file has the phone numbers spliced into 'currentUseArr'
        //verify that these numbers did not hit our servers

//Imports
import { Selector } from 'testcafe';
import Excel from 'exceljs';

//selector variables
const loginButton = Selector('a')
                        .withAttribute('href', '/login/auth');
const SigninButton = Selector('input')
                        .withAttribute('class', 'login-btn');
const queryTool = Selector('a')
                        .withAttribute('href', "/dashboard/delivery/query-tool");
const executeQuery = Selector('button')
                        .withExactText("Run CNAM Query");
const valueService = Selector('button')
                        .withExactText("VALUE");
const standardService = Selector('button')
                        .withExactText("STANDARD");
const plusService = Selector('button')
                        .withExactText("PLUS");

//test data object
const data = {"logins": 
                {
                    username: "***********",
                    password: "***********"
                },
                "numbers": ["+12013235793",
                            "+12014246807",
                            "+12014191357",
                            "+12015546807",
                            "+12017246887",
                            "+12027357902",
                            "+12019813578",
                            "+12019814680",
                            "+12019562468",
                            "+12032135790",
                            "+16313579316",
                            "+16313579856",
                            "+16314135730",
                            "+16317213571",
                            "+16318135705",
                            "+16318135760",
                            ],
                "serviceLevel": [valueService,
                                 standardService,
                                 plusService],
            }

//currently grabs a random section of 10 numbers from the data.numbers array
const currentUseArr = data.numbers.splice(Math.floor((Math.random() * 90 - 10) + 1),10);

//Generating timestamp for excel file name
var dt = new Date();
var datetime = `${(dt.getMonth() + 1)}-${(dt.getDay() + 1)}-${dt.getFullYear()}`;

//Create date-stamped excel file with phone numbers from currentUseArr in it.
const workbook = new Excel.Workbook();
var worksheet = workbook.addWorksheet('My Sheet');
        worksheet.columns = [
            { header: 'Id', key: 'id', width: 10 },
            { header: 'Phone', key: 'Phone', width: 32 }
        ];
        for(let i = 0; i < currentUseArr.length; i++){
            worksheet.getCell(`A${[i + 2]}`).value = [i + 1];
            worksheet.getCell(`B${[i + 2]}`).value = currentUseArr[i];
        }
workbook.xlsx.writeFile(`OpenCNAM automated testing - ${datetime}.xlsx`);

//Begin testing
fixture `OpenCNAM automated testing`
    .page `https://opencnam.com`;

    test('My First Test', async t => {
        await t

        // Login Sequence
            .click(loginButton)
            .typeText('#email', data.logins.username)
            .typeText('#password', data.logins.password)
            .click(SigninButton)
            .click('.collapsible')
            .click(queryTool)
            //loop enters each element in numbers array into input once for each service level
            for(let i = 0; i < data.serviceLevel.length; i++){
                for(let j = 0; j < currentUseArr.length; j++){
                    await t 
                        .pressKey('ctrl+a delete')
                        .typeText('#input-phone', currentUseArr[j])
                        .click(data.serviceLevel[i])
                        .click(executeQuery)
                        .click('#input-phone')
                        .wait(5000);    
                }            
            }
    });
