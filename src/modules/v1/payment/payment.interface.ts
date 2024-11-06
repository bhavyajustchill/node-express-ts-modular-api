export interface Payment {
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  paymentId: string;
  orderId: string;
  signature: string;
  createdAt?: Date;
  updatedAt?: Date;
}
