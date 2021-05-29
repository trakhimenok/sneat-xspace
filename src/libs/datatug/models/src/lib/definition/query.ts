import {IProjItemBrief} from './project';
import {IParameterDef} from './parameter';
import {IRecordsetDefinition} from "./recordset";

export type QueryType = 'SQL' | 'GraphQL' | 'HTTP';

export interface IQueryFolder extends IProjItemBrief {
	folders?: IQueryFolder[];
	items?: IQueryDef[];
}

export interface IQueryDef extends IProjItemBrief {
	type: QueryType
	text: string;
	draft?: boolean;
	parameters?: IParameterDef[];
	dbModel?: string;
	targets?: IQueryTarget[];
	recordsets?: IRecordsetDefinition[];
}

export type QueryItem = IQueryDef | IQueryFolder;

export interface IQueryTarget {
	host?: string;
	port?: number;
	catalog?: string;
	credentials?: ICredentials;
}


export interface ICredentials {
	username: string;
}
