export const authValidator = {
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
    required: 'This field is required.',
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
    minLength: 5,
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
