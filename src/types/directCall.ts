export interface TDirectCallResponse {
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
