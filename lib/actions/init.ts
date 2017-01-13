let fs = require('fs');
let process = require('process');

import { Filter } from '../persistance/filter';
import { NicassaParserTSExpressApi } from '../persistance/nicassaparsertsexpressapi';
import { TopLevel } from '../persistance/toplevel';

export class Init {
    fileName: string;

    run(opts: any) {
        this.fileName = opts.file;

        if (fs.existsSync(this.fileName)) {
            if (this.sectionExistInFile()) {
                console.error('error: section already exist in "' + this.fileName + '"');
                process.exit(-1);
            }
        }

        let data = this.createJsonString();

        try {
            fs.writeFileSync(this.fileName, data);
        } catch (err) {
            console.error('error: can\'t create file "' + this.fileName + '"');
            // console.error(err);
            process.exit(-1);
        }
    }

    protected sectionExistInFile(): boolean {
        let str = null;

        try {
            str = fs.readFileSync(this.fileName);
        } catch (err) {
            console.error('error: can\'t read file "' + this.fileName + '"');
            // console.error(err);
            process.exit(-1);
        }

        let toplevel: TopLevel = JSON.parse(str);
        return (toplevel.nicassaParserTSExpressApi !== undefined);
    }

    protected createJsonString(): string {
        let str = null;

        try {
            if (fs.existsSync(this.fileName)) {
                str = fs.readFileSync(this.fileName);
            }
        } catch (err) {
            console.error('error: can\'t read file "' + this.fileName + '"');
            // console.error(err);
            process.exit(-1);
        }

        if (str === null) {
            let toplevel: TopLevel = {
                nicassaParserTSExpressApi: <any>null
            }
            str = JSON.stringify(toplevel, null, 2);
        }

        let filter: Filter = {
            exculdeController: [],
            onlyController: []
        }

        let nicassaParserTSExpressApi: NicassaParserTSExpressApi = {
            formatVersion: '1.0',
            lastUpdateUTC: (new Date()).toUTCString(),
            entryFile: 'server.ts',
            metadata: <any>null,
            filter: filter
        }

        let toplevel: TopLevel = JSON.parse(str);
        toplevel.nicassaParserTSExpressApi = nicassaParserTSExpressApi;

        let result = JSON.stringify(toplevel, null, 2);
        return result;
    }

}

export default function run(opts: any) {
    let instance = new Init();
    return instance.run(opts);
}
