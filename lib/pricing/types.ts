export type Priority = "standard" | "rush" | "emergency";

export type PartLine = {
  name: string;
  priceCents: number;
  quantity: number;
};

export type JobInput = {
  laborMinutes: number;
  laborRateCentsPerHour: number;
  parts: PartLine[];
  priority: string;
  isRepeatCustomer: boolean;
};

export type Quote = {
  laborCents: number;
  partsCents: number;
  surchargeCents: number;
  discountCents: number;
  totalCents: number;
};
