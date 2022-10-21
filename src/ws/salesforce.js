import * as dotenv from 'dotenv';
dotenv.config();
import * as path from 'path';
import { fileURLToPath } from 'url';
import qs from 'qs';
import * as fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function login() {
    console.log('Iniciando login');
    const endpoint = process.env.loginUrl + '/services/oauth2/token';
    const data = {
        'grant_type': 'password',
        'client_id': process.env.clientId,
        'client_secret': process.env.clientSecret,
        'username': process.env.userName,
        'password': process.env.password,
    };
    return await doLogin(endpoint, data);
}

async function doLogin(url = '', data = {}) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    myHeaders.append('Content-Length', qs.stringify(data).length.toString());
    myHeaders.append('Accept', '*/*');
    myHeaders.append('Accept-Encoding', 'gzip, deflate, br');
    const response = await fetch(url, {
        method: 'POST',
        headers: myHeaders,
        referrerPolicy: 'no-referrer',
        body: qs.stringify(data) 
    });
    return response.json();
}

export async function compositeAPI(loginInfo = {}, data = {}, fileName = '') { 
    console.log('Start load');

    const endpoint = loginInfo.instance_url + '/services/data/v55.0/composite/sobjects';
    const accessToken = loginInfo.token_type + ' ' + loginInfo.access_token;
    var resp = await callCompositeAPI(endpoint, accessToken, data);
    console.log('End load');
    writeFile(resp,fileName);
    return;
}

async function callCompositeAPI(url = '', token = '', data = {}) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', token);
    // myHeaders.append('Content-Length', JSON.stringify(data).length.toString());
    myHeaders.append('Accept', '*/*');
    myHeaders.append('Accept-Encoding', 'gzip, deflate, br');
    
    const response = await fetch(url, {
        method: 'POST',
        headers: myHeaders,
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });
    return response.json();
}

function writeFile(arrayFile, fileName) { 
    console.log('Write log ');
    fileName = fileName.replace('.json', '.csv');
    var mountJson = '';
    for (var i = 0; i < arrayFile.length; i++) { 
        let line = i + 1;
        let hasSuccess = arrayFile[i].success;
        let errors = !arrayFile[i].success ? JSON.stringify(arrayFile[i].errors) : '';
        mountJson += line + ',' + hasSuccess + ',' + errors + '\n';
    }

    let jsonAsString = mountJson;
    // const fileName = 'result_' + new Date().getTime() + '.csv';
    const directoryPath = path.join(__dirname,'..','..', 'public', 'upload', 'result');
    fs.writeFileSync((directoryPath + '/' + fileName), jsonAsString);
    console.log('End log ',fileName);
}