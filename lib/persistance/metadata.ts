// taken from https://github.com/lukeautry/tsoa
export interface Metadata {
  Controllers: Controller[];
  ReferenceTypes: { [typeName: string]: ReferenceType };
}

export interface Controller {
  location: string;
  methods: Method[];
  name: string;
  path: string;
  jwtUserProperty: string;
}

export interface Method {
  description: string;
  example: any;
  method: string;
  name: string;
  parameters: Parameter[];
  path: string;
  type: Type;
  tags: string[];
}

export type InjectType = 'request' | 'inject';

export interface Parameter {
  description: string;
  in: string;
  name: string;
  required: boolean;
  type: Type;
  injected?: InjectType;
}

export type Type = PrimitiveType | ReferenceType | ArrayType;

export type PrimitiveType = string;

export interface ReferenceType {
  description: string;
  name: string;
  properties: Property[];
}

export interface Property {
  description: string;
  name: string;
  type: Type;
  required: boolean;
}

export interface ArrayType {
  elementType: Type;
}
