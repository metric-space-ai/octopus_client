export interface ITokenAudit {
  id: string;
  chat_id: string;
  chat_message_id: string;
  company_id: string;
  user_id: string;
  input_tokens: number;
  llm: string;
  model: string;
  output_tokens: number;
  created_at: string;
}

// {
//   "id": "e90ebede-36fa-4b8b-88e9-a2104984002d",
//   "chat_id": "7196cf7b-5877-4a01-b4d1-bad4ec24cdea",
//   "chat_message_id": "fa24712f-3337-45b7-8141-959889cca6e3",
//   "company_id": "85635696-7d21-4870-943d-3b290ac43efc",
//   "user_id": "26178dd8-60a1-4b47-84db-7ffbff8b8ebc",
//   "input_tokens": 962,
//   "llm": "openai",
//   "model": "gpt-4o-mini-2024-07-18",
//   "output_tokens": 370,
//   "created_at": "2024-08-29T08:09:25Z"
// }

// Type for chat token data, including input and output tokens
export type ChatTokenData = {
  input_tokens: number;
  output_tokens: number;
};

// Type for mapping chat service data, e.g., different models within a service like "openai"
export type ChatServiceData = {
  [modelName: string]: ChatTokenData;
};

// Type for mapping user reports in chat token audits, keyed by email address
export type ChatTokenUserReport = {
  [email: string]: {
    [serviceName: string]: ChatServiceData;
  };
};

// Type for the overall structure of the chat-token-audits API response
export type ChatTokenAuditCompanyReport = {
  ends_at: string;
  report: ChatTokenUserReport;
  starts_at: string;
};

export type ChatTokenAuditCompanyReportRequestBody = {
  company_id: string;
  ends_at: string;
  starts_at: string;
};

// export interface ITokenAuditCompanyReport {
//   ends_at: '2024-08-29T14:01:19.908242788Z';
//   report: {
//     'michael.welsch@metric-space.ai': {
//       openai: {
//         'gpt-4o-mini-2024-07-18': {
//           input_tokens: 80924;
//           output_tokens: 10280;
//         };
//       };
//     };
//     'test1@test.com': {
//       openai: {
//         'gpt-4o-mini-2024-07-18': {
//           input_tokens: 12446941;
//           output_tokens: 18905;
//         };
//       };
//     };
//   };
//   starts_at: '2024-08-01T00:00:00Z';
// }
