type User = {
  id: number,
  username: string,
  password: string,
}

interface NewUserInfo {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  streetAddressTwo: string;
  city: string;
  planet: string;
  postalCode: string;
}

type OrderInfo = {
  name: string;
  email: string;
  streetAddress: string;
  streetAddressTwo: string;
  city: string;
  planet: string;
  postalCode: string;
  phone: string;
  userId: string;
}
