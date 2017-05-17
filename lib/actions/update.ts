let fs = require('fs');
let path = require('path');
let slash = require('slash');
let process = require('process');

import { Filter } from '../persistance/filter';
import { NicassaParserTSExpressApi } from '../persistance/nicassaparsertsexpressapi';
import { TopLevel } from '../persistance/toplevel';

import { Metadata } from '../persistance/metadata';
import { MetadataGenerator } from'../metadata/metadataGenerator';

export class UpdateMetaDataTable {
    fileName: string;
    filter: Filter;

    run(opts: any) {
        this.fileName = opts.file;

        if (!fs.existsSync(this.fileName)) {
            console.error('error: file "' + this.fileName + '" does not exists');
            process.exit(-1);
        }

        let str = null;

        try {
            str = fs.readFileSync(this.fileName);
        } catch (err) {
            console.error('error: can\'t read file "' + this.fileName + '"');
            // console.error(err);
            process.exit(-1);
        }

        let toplevel: TopLevel = JSON.parse(str);

        if (toplevel.nicassaParserTSExpressApi === null) {
            console.log('error: no \'nicassaParserTSExpressApi\' section found in config file');
            process.exit(-1);
        }

        let nicassaParserTSExpressApi: NicassaParserTSExpressApi = <NicassaParserTSExpressApi>toplevel.nicassaParserTSExpressApi;
        this.filter = <Filter>nicassaParserTSExpressApi.filter;

        if (!fs.existsSync(nicassaParserTSExpressApi.entryFile)) {
            console.error('error: entry file "' + nicassaParserTSExpressApi.entryFile + '" does not exists');
            process.exit(-1);
        }

        this.readMetaData(nicassaParserTSExpressApi.entryFile);
    }

    protected readMetaData(entryFile: string) {
        let generator = new MetadataGenerator(entryFile);
        let metadata = generator.Generate();
        this.makeRelativePath(metadata, entryFile);
        this.updateJsonFile(metadata);
    }

    protected makeRelativePath(metadata: Metadata, entryFile: string) {
        if (metadata === undefined || metadata === null) {
            return;
        }

        if (metadata.Controllers === undefined || metadata.Controllers === null || metadata.Controllers.length === 0) {
            return;
        }

        let entryFileAbsolute = path.resolve(entryFile);
        let basePath = path.dirname(entryFileAbsolute);

        for (let i = 0; i < metadata.Controllers.length; i++) {
            let ctrl = metadata.Controllers[i];
            ctrl.location = './' + slash(path.relative(basePath, ctrl.location));
        }
    }

    protected updateJsonFile(data: Metadata) {
        let str = '';
        try {
            str = fs.readFileSync(this.fileName);
        } catch (err) {
            console.error('error: can\'t read file "' + this.fileName + '"');
            process.exit(-1);
        }

        let toplevel: any = JSON.parse(str);

        toplevel.nicassaParserTSExpressApi.formatVersion = '1.0';
        toplevel.nicassaParserTSExpressApi.lastUpdateUTC = (new Date()).toUTCString();
        toplevel.nicassaParserTSExpressApi.metadata = data;

        str = JSON.stringify(toplevel, null, 2);

        try {
            fs.writeFileSync(this.fileName, str);
        } catch (err) {
            console.error('error: can\'t update file "' + this.fileName + '"');
            process.exit(-1);
        }
    }
}

export default function run(opts: any) {
    let instance = new UpdateMetaDataTable();
    return instance.run(opts);
}
