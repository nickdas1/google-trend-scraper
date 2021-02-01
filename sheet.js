const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = class Sheet {

    constructor() {
        this.doc = new GoogleSpreadsheet('1ohCixlIRHyGrlcueyd3Ar2s1SZArsMotLAzOHKRDkPU');
    }
    async load() { 
        await this.doc.useServiceAccountAuth(require('./credentials.json'));
        await this.doc.loadInfo();
    }
    async addRows(rows) {
        const sheet = this.doc.sheetsByIndex[0]; 
        await sheet.addRows(rows);
    }
    async addSheet(title, headerValues) {
        await this.doc.addSheet(title, headerValues); 
    }
}