export interface IUser {
  userId: string;
  walletID: string;
  firstName: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
  email: string;
  photoUrl: string;
  gender: 'male' | 'female'; // Assuming gender can only be 'male' or 'female'
  isWalletActive: boolean;
  updatedAt: string; // ISO date string format
  createdAt: string; // ISO date string format
}
