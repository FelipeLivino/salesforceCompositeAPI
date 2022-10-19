import * as dotenv from 'dotenv';
dotenv.config();
import * as path from 'path';
import { fileURLToPath } from 'url';
import qs from 'qs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

exports.login = async function () { 
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

