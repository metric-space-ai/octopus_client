export const authValidator = {
  id: {
    required: 'This field is required.',
  },
  name:{
    required: 'This field is required.',
  },
  desc:{
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
    pattern: /^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/i,
    minLength: 5,
  },
};
