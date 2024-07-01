export type TThemeName = 'default-dark' | 'default' | 'harting' | 'topwerk' | 'statista' | 'rotodecor';

export type TImageDetails = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};
export interface IThemeData {
  mode?: 'dark' | 'light';
  cssVariables: Record<string, string>;
  content: {
    title: string;
    head_logo?: TImageDetails;
    chat_logo?: TImageDetails;
  };
  font: string;
}
