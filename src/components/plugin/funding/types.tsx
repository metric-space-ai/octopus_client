export interface IKeywordsCollection {
  id: string;
  title: string;
  keywords: IKeyword[];
}

export interface IKeyword {
  keywordId: string;
  value: string;
}

export interface IFormulationResult {
  // id: string;
  title: string;
  description: string;
  // communicates: IFormulationResultCommunicate[];
}
export interface IFormulationResultCommunicate {
  id: string;
  message: string;
  response: string;
  status: 'asking' | 'answered';
}
export interface IFormulationResultCommunicate {}
export interface IPostResquestErrorResponse {
  error: string;
}
export interface IFormulationResultCommunicateResponse {
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

export interface IFormulationResultCreateNewFundingTopicParsed {
  result: IFundingBulletPoint[];
  status: string;
}

export interface IFundingBulletPoint {
  phrases: string[];
  title: string;
}

export interface IFundingImproveWritingResultParsed {
  result: string;
  status: string;
  character_count: number
}

export interface IFormulationResultImprovePhraseParsed {
  result: string[];
  status: string;
}

export interface IFundingResultCreateTextsParsed {
  result: IFundingText[];
  status: string;
}

export interface IFundingText {
  text: string;
  title: string;
}

export interface IFundingImprovePhraseRequest {
  topic: string;
  phrases: string[];
  max_website: number;
  pdf_urls: string[];
  kategorie: string;
}
