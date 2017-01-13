import * as parser from 'nomnom';

export class CmdLineParser {
    public static parse(): any {
        parser.command('init')
            .option('file', {
                abbr: 'f',
                metavar: 'nicassa.json',
                required: true,
                help: 'path for to a nicassa.json config file [required]'
            })
            .help('creates a new nicassa.json config file or adds a section to an existing json file');

        parser.command('update')
            .option('file', {
                abbr: 'f',
                metavar: 'nicassa.json',
                required: true,
                help: 'path to a nicassa.json config file [required]'
            })
            .help('updates the symbol table in a given nicassa.json config file');

        var opts = parser.parse();
        var action = null;

        if (opts[0] === undefined || opts[0] === '') {
            action = null;
        } else {
            action = {
                module: '../lib/actions/' + opts[0],
                opts: opts
            };
        }

        return action;
    }
}
