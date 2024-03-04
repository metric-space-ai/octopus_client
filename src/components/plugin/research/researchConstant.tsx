import {IExamples, IKeywordsCollection, IResearchResult} from './types';

export const RESEARCHSTEPS = {
  startTopic: 1,
  Specification: 2,
  Examples: 3,
  ResearchResults: 4,
};

export const RESEARCHRESULTS: IResearchResult[] = [
  {
    id: 'def1001',
    name: 'Euromonitor',
    url: 'https://www.euromonitor.co...',
    grade: 1,
    information: 'text',
    messages: [
      {
        id: 'question-001',
        message:
          "What key insights does Euromonitor's research provide regarding the laundry care and household cleaners industry?",
        response:
          "Euromonitor's research offers valuable insights into the laundry care and household cleaners industry",
        status: 'answered',
      },
      {
        id: 'question-002',
        message:
          "How does Euromonitor's research address the impact of emerging technologies on product innovation within the laundry care and household cleaners market?",
        response:
          "Euromonitor's research provides a comprehensive analysis of the impact of emerging technologies on product innovation within the laundry care and household cleaners market.",
        status: 'answered',
      },
    ],
  },
  {
    id: 'def1002',
    name: 'Nielsen',
    url: 'https://www.nielsen.com/d...',
    grade: 1,
    information: 'text',
    messages: [
      {
        id: 'question-003',
        message:
          "How does Euromonitor's research address the impact of emerging technologies on product innovation within the laundry care and household cleaners market?",
        response: '',
        status: 'asking',
      },
    ],
  },
  {
    id: 'def1003',
    name: 'IKW',
    url: 'https://www.ikw.org/hausha...',
    grade: 1,
    information: 'text',
    messages: [],
  },
  {
    id: 'def1004',
    name: 'TechSci Research',
    url: 'https://www.techsciresearc...',
    grade: 1,
    information: 'text',
    messages: [],
  },
  {
    id: 'def1005',
    name: 'Wiener Zeitung',
    url: 'https://www.wienerzeitung...',
    grade: 1,
    information: 'text',
    messages: [],
  },
  {
    id: 'def1006',
    name: 'Digitalmag',
    url: 'http://www.digitalmag.net/',
    grade: 1,
    information: 'text',
    messages: [],
  },
];
