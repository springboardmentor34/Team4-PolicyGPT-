export type SchemeStatus = 'draft' | 'active' | 'inactive' | 'expired';

export interface Scheme {
  scheme_id: string;

  name: string;

  category: string | null;

  department: string | null;

  state: string | null;

  benefits: string | null;

  application_start_date: string | null;

  application_end_date: string | null;

  status: SchemeStatus;

  created_by: string | null;

  created_at: string;
}