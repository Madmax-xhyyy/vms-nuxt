declare type TSystemInfo = {
  _id?: string;
  clinicName: string;
  tagline?: string;
  description?: string;
  email: string;
  phone: string;
  address: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  operatingHours: {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }[];
  footerText?: string;
  privacyPolicy?: string;
  termsAndConditions?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}