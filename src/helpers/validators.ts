import {RegisterOptions} from 'react-hook-form';

export const authValidator: Record<string, RegisterOptions> = {
  id: {
    required: 'This field is required.',
  },
  name: {
    required: 'This field is required.',
  },
  desc: {
    required: 'This field is required.',
  },
  first_name: {
    required: 'This field is required.',
  },
  last_name: {
    required: 'This field is required.',
  },
  job_title: {
    required: false,
  },
  username: {
    required: 'This field is required.',
  },
  email: {
    required: 'This field is required.',
    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  },
  password: {
    required: 'This field is required.',
    // pattern: /^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/i,
    pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.*[^a-zA-Z0-9@!#$%&]).{8,}$/i,
    minLength: 8,
  },
};

export const loginFormValidator: Record<string, RegisterOptions> = {
  email: {
    required: 'This field is required.',
    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  },
  password: {
    required: 'This field is required.',
    minLength: {
      value: 8,
      message: 'The password must contain at least 8 characters',
    },
  },
};

export const companyFormValidator: Record<string, RegisterOptions> = {
  name: {
    required: 'This field is required.',
  },
  address: {
    required: 'This field is required.',
  },
};
export const resetPassValidator: Record<string, RegisterOptions> = {
  newPassword: {
    required: 'This field is required.',
    minLength: {
      value: 8,
      message: 'The password must contain at least 8 characters',
    },
  },
};

export const keywordValidator = {
  keyword: {
    required: 'this field is required',
    maxLength: 150,
  },
};

export const parameterValidator = {
  name: {
    required: 'this field is required',
    maxLength: 40,
  },
  value: {
    required: 'this field is required',
    maxLength: 2000,
  },
};

export const waspAppFormValidator = {
  name: {
    required: 'this field is required',
    maxLength: 40,
  },
  description: {
    required: 'this field is required',
  },
};
