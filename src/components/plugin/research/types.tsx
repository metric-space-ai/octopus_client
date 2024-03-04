export interface IKeywordsCollection {
  title: string;
  in_scope: string[];
  out_scope: string[];
}

export interface IKeyword {
  definitionId: string;
  value: string;
}

export interface IExamples {
  id: string;
  value: string;
}

export interface IResearchResult {
  id: string;
  name: string;
  url: string;
  grade: number;
  information: string;
  messages: IMessageItem[];
}

export interface IMessageItem {
  id: string;
  message: string;
  response: string;
  status: 'asking' | 'answered';
}

export interface IPostTopicResponse {
  Text?: {
    response: string;
  };
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
