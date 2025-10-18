export interface BaseFilter {
  is_active?: boolean;
  created_at_from?: Date;
  created_at_to?: Date;
  updated_at_from?: Date;
  updated_at_to?: Date;
}

export interface EntityFilter extends BaseFilter {
  subscriber_id?: string;
  entity_type?: string;
  status?: string;
  risk_level?: string;
  screening_status?: string;
  name?: string;
}

export interface UserFilter extends BaseFilter {
  subscriber_id?: string;
  role?: string;
  email?: string;
  name?: string;
}

export interface LogFilter extends BaseFilter {
  subscriber_id?: string;
  user_id?: string;
  action_type?: string;
  severity?: string;
  status?: string;
}

export interface FilterOptions {
  search?: string;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}