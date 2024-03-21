export interface IKeywordsCollection {
  title: string;
  in_scope: string[];
  out_scope: string[];
}

export interface IMessageItem {
  content: string;
  role: 'user' | 'system';
}

export interface IPostResquestErrorResponse {
  error: string;
}
export interface IPostTopicResponse {
  Mixed?: [
    {
      Text?: {
        response: string;
      };
    },
  ];
  Error?: {
    error: string;
  };
}

export interface IPostTopicResponseParsed {
  status: string;
  result: IKeywordsCollection[];
}

export interface IPostSpecificationsResponseParsed {
  status: string;
  result: TExemplaryKeywords[];
}
export type TExemplaryKeywords = string[];

export interface ISearchInGoogleResponse {
  status: string;
  result: ISearchInGoogleResponseResult[];
}
export interface ISearchInGoogleResponseResult {
  'Contained information': string;
  Index: number;
  Occurrences: number;
  'Source link': string;
  'Source name': string;
  Text: string | null;
}

export interface IResearchResult {
  containedInformation: string;
  index: number;
  occurrences: number;
  sourceLink: string;
  sourceName: string;
  text: string | null;
  messages: IMessageItem[] | null;
}

export interface IChatItem {
  content: string;
  role: 'user' | 'system';
}
export interface IChatResponseResult {
  chat: (IChatItem | IChatItem[])[];
  status: string;
}
