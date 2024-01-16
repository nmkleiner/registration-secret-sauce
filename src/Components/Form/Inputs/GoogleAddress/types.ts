export interface FullAddress {
  administrative_area_level_1: string;
  administrative_area_level_2: string;
  country: string;
  locality: string;
  postal_code: string;
  route: string;
  street_number: string;
}

export interface Place {
  formatted_address: string;
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
}
