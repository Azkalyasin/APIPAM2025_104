interface registerUserType {
  username: string;
  email: string;
  password: string;
}

interface loginUserType {
  email: string;
  password: string;
}

export { registerUserType, loginUserType };
