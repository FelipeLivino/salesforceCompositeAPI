import * as dotenv from 'dotenv';
dotenv.config();
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as salesforce from '../ws/salesforce.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


async function loadFiles() { 
    console.log('Start'); 
    const directoryPath = path.join(__dirname, '..', '..', 'public', 'upload', 'new');
    var loginInfo = await salesforce.login();
    console.log('Login info ', loginInfo);
    
    if (!loginInfo.access_token)
        throw "Invalid login";
    
    console.log('Login ok'); 
    console.log('Start read Files'); 
    
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            console.log('Unable to scan directory: ' + err);
        } 
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            let pathFileName = path.join(directoryPath, file);
            let fileData = fs.readFileSync(pathFileName, 'utf-8');
            fileData = JSON.parse(fileData);
            salesforce.compositeAPI(loginInfo, fileData, file);
        });
    });

}

loadFiles();