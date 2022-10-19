import * as dotenv from 'dotenv';
dotenv.config();
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

exports.makeFile = function() {
    const directoryPath = path.join(__dirname, 'public', 'csv');
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            let pathFileName = path.join(__dirname, 'public', 'csv', file);
            let fileData = getFileData(pathFileName);
            let jsonArrayFile = createJson(fileData);
            saveFile(jsonArrayFile);
        });
    });
};

function getFileData(pathFileName) { 
    return fs.readFileSync(pathFileName, 'utf-8');
}

function createJson(fileData) {
    var fileArr = fileData.split('\n');
    var tabela = new Array();
    for (var i=1; i<fileArr.length; i++) {
        var valorLinha = {};
        let fields = fileArr[0].split(',');
        let val = fileArr[i].split(',');
        let isValid = false;
        fields.forEach((row, index) => {
            if (row && val[index]) {
                let t = `${row}`.trim();
                let l = val[index].trim();
                valorLinha[t] = l ? l : null; 
                isValid = true;
            }
        });
        if (isValid) { 
            valorLinha['attributes'] = {"type": process.env.objectToLoad};
            tabela.push(valorLinha);
        }
    }
    return tabela;
}

function saveFile(jsonArrayFile) { 
    let limitPerFile = process.env.limitPerFile;
    let arrayFile = new Array();
    for (let i = 0; i < jsonArrayFile.length; i++) { 
        if (i != 0 && i % limitPerFile == 0) { 
            writeFile(arrayFile);
            arrayFile = new Array();
        } 
        arrayFile.push(jsonArrayFile[i]);
    }
}

function writeFile(arrayFile) { 
    var mountJson = {
        "allOrNone": false,
        "records": arrayFile
    };
    let jsonAsString = JSON.stringify(mountJson);
    const fileName = 'upload_' + new Date().getTime() + '.json';
    const directoryPath = path.join(__dirname, 'public', 'upload' );
    fs.writeFileSync((directoryPath +'/'+ fileName), jsonAsString);
}