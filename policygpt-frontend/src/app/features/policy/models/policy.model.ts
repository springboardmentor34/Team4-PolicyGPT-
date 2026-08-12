export interface Policy {
  policy_id: string;
  title: string;
  category: string | null;
  department: string | null;
  ministry: string | null;
  state: string | null;
  file_url: string | null;
  published_date: string | null;
  status: string;
  uploaded_by?: string | null;
  approved_by?: string | null;
  created_at: string;

  // Compatibility fields for legacy frontend templates & bindings
  id?: string;
  policyName?: string;
  schemeName?: string;
  description?: string;
  sector?: string;
  publicationDate?: string;
}