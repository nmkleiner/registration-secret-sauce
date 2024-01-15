export interface UpdateOnwardApplicantDto {
  contactId: string;
  applicationId: string;
  tripOfferingId?: number;
  secondaryTripChoices?: OnwardSecondaryTripChoice[];
  seasonSettingId?: string;
  urlParams?: Record<string, string>;
}

export interface OnwardSecondaryTripChoice {
  priority: number;
  value: number;
  isSelected: boolean;
}
