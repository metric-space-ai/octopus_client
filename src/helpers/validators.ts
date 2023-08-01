export const authValidator = {
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
