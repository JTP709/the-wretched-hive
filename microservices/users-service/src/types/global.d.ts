interface User {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  streetAddressTwo: string;
  city: string;
  planet: string;
  postalCode: string;
}

interface NewUserInfo extends User {
  password: string;
}
