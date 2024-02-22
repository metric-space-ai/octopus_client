export interface IConsultantChat {
  question: string;
  answer: string;
}
export interface IConsultantResponseCallbackData {
  Selbstauskunft: string;
  Sachverhalt?: string;
  Kernfrage: string;
  chat: string[][];
  //   chat: IConsultantChat[];
}
export interface IConsultantChatResponseCallbackData {
  Selbstauskunft: string;
  Kernfrage: string;
  Sachverhalt?: string;
  chat: IConsultantChat[];
}
export interface IConsultantRequestCallbackData {
  Selbstauskunft: string;
  Kernfrage: string;
  chat: IConsultantChat[];
}
export interface IConsultantResponse {
  result: string;
  next_endpoint?: string;
  callback_data?: IConsultantChatResponseCallbackData | string;
}

export interface IConsultantChatResponse {
  result: string;
  next_endpoint?: string;
  callback_data?: IConsultantChatResponseCallbackData;
  status?: string;
}

export interface IConsultantRequestPayload {
  callback_data: IConsultantRequestCallbackData;
  UserAnswer: string;
}

export interface IFinalConsultationRequest {
  result: string;
  status: string;
}
