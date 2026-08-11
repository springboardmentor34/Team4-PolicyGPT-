export type Gender = 'Male' | 'Female' | 'Other';

export type EducationLevel =
  | '10th'
  | '12th'
  | 'Graduate'
  | 'Post Graduate';

export type SocialCategory =
  | 'General'
  | 'OBC'
  | 'SC'
  | 'ST'
  | 'EWS';

export type DisabilityStatus = 'Yes' | 'No';

export interface UserProfile {
  age: number;
  gender: Gender;
  income: number;
  occupation: string;
  education: EducationLevel;
  location: string;
  socialCategory: SocialCategory;
  disabilityStatus: DisabilityStatus;
}