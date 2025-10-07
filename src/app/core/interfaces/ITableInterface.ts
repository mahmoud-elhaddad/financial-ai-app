export interface ITableInterface {
    key: string;
    displayName: string;
    imageKey?: string;  
    nameKey?: string;  
    isLink?: boolean;
    isStatus?: boolean;
    isTextStatus?: boolean;
    isPrice?: boolean;
    isAction?: boolean;
    isCard?: boolean;
    isImage?: boolean;
    isDate?: boolean;
    isNumber?: boolean;
    isDateTime?: boolean;
    isArray?: boolean;  
    subFields?: { key: string }[]; 
    actions?: { type: string, allowedStatuses: string}[];
    statusType?: string
}
