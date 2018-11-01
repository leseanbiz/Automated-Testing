//Instructions via CMD:
//testcafe chrome OpenCNAM.js
    //this creates a date stamped  Excel file 
    //this file has the phone numbers spliced into 'currentUseArr'
    //verify that these numbers did not hit our servers on pe-pdx-sql0[RT_Queries]

//Imports
import { Selector } from 'testcafe';
import Excel from 'exceljs';

//selector variables
const loginButton = Selector('a')
                        .withAttribute('href', '/login');
const signinButton = Selector('button')
                        .withAttribute('type', 'submit');
const executeQuery = Selector('button')
                        .withText('RUN QUERY');

//test data object
const data = {"logins": //make logins an array of logins and add a larger, outer loop to go through each one.
                {
                    username: "**********",
                    password: "**********"
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
                            "+16318135705"],
            }

//currently grabs a random section of 10 numbers from the data.numbers array
const currentUseArr = data.numbers.splice(Math.floor((Math.random() * 90 - 10) + 1),10);

//Generating timestamp for file name
var dt = new Date();
var datetime = `${(dt.getMonth() + 1)}-${(dt.getDay() + 1)}-${dt.getFullYear()}`;


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
workbook.xlsx.writeFile(`Everyone API automated testing - ${datetime}.xlsx`);

fixture `Everyone API automated testing`
    .page `https://www.everyoneapi.com/`;

    test('My First Test', async t => {
        await t
        // Login Sequence
            .click(loginButton)
            .typeText('#userEmail', data.logins.username)
            .typeText('#userPassword', data.logins.password)
            .click(signinButton)
            .wait(5000)
                for(let i = 0; i < currentUseArr.length; i++){
                    await t 
                        .click('#phone-input')
                        .wait(5000)
                        .pressKey('ctrl+a')
                        .wait(5000)
                        .pressKey('ctrl+a')
                        .pressKey('backspace')
                        .wait(5000)
                        .typeText('#phone-input', currentUseArr[i])
                        .click(executeQuery)
                        .wait(5000)
                }            
    });
