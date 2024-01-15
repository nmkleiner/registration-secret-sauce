export interface Address {
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  isAddress: boolean;
  streetAddress?: string;
}

export function isAddress(obj: any | null): obj is Address {
  return obj && obj.isAddress;
}
