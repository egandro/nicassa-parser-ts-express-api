import { Metadata } from './metadata';
import { Filter } from './filter';

export interface NicassaParserTSExpressApi {
    formatVersion: string;
    lastUpdateUTC: string;
    entryFile: string;
    metadata?: Metadata;
    filter?: Filter;
}
