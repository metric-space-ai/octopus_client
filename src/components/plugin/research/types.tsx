export interface IKeywordsCollection {
  id: string;
  title: string;
  definitions_in: IKeyword[];
  definitions_out: IKeyword[];
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
