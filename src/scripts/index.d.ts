
interface Window {
  PopUp: any;
}

interface Process {
  env: {
    NODE_ENV?: 'PRODUCTION';
    DEBUG?: string;
    BUGSNAG_API_KEY?: string;
    VERSION: string;
    TOGGL_WEB_HOST: string;
  }
}

type Project = {
  id: number;
  hex_color: string;
  name: string;
};

type IdMap<T> = {
  [index: string]: T
}
declare module "*.svg" {
  const content: any;
  export default content;
}

declare let process: Process;

declare module Toggl {
  export interface Project {
    id: number;
    wid: number;
    cid: number;
    name: string;
    billable: boolean;
    is_private: boolean;
    active: boolean;
    template: boolean;
    at: string;
    created_at: string;
    color: string;
    auto_estimates: boolean;
    actual_hours: number;
    rate: number;
    currency: string;
    hex_color: string;
    server_deleted_at?: string;
    estimated_hours?: number;
    guid?: string;
  }
  export interface TimeEntry {
    id: number;
    wid: number;
    billable: boolean;
    start: string;
    stop: string;
    duration: number;
    description: string;
    duronly: boolean;
    at: string;
    uid: number;
    tags: string[] | null;
    pid?: number;
    tid?: number;
  }
  export interface CSVUpload {
    at: string;
    log_id: number;
  }

  export interface Workspace {
    id: number;
    name: string;
    profile: number;
    premium: boolean;
    admin: boolean;
    default_hourly_rate: number;
    default_currency: string;
    only_admins_may_create_projects: boolean;
    only_admins_see_billable_rates: boolean;
    only_admins_see_team_dashboard: boolean;
    projects_billable_by_default: boolean;
    rounding: number;
    rounding_minutes: number;
    api_token: string;
    at: string;
    logo_url: string;
    ical_url: string;
    ical_enabled: boolean;
    csv_upload: CSVUpload;
  }

  export interface Tag {
    id: number;
    wid: number;
    name: string;
    at: string;
}

  export interface Client extends Tag {
    guid?: string;
    notes?: string;
  }

  export interface OBM {
    included: boolean;
    nr: number;
    actions: string;
  }

  export interface ProjectMap {
    [projectName: string]: Project;
  }

  export interface ClientMap {
    [clientId: number]: Client;
  }

  export interface ClientNameMap {
    [clientName: string]: Client;
  }

  export interface Task {
    id: number;
    name: string;
    wid: number;
    pid: number;
    active: boolean;
    at: string;
    estimated_seconds: number;
    tracked_seconds?: number;
    uid?: number;
  }

  export interface ProjectTaskList {
    [pid: number]: Task[];
  }

  export interface User {
    id: number;
    api_token: string;
    default_wid: number;
    email: string;
    fullname: string;
    jquery_timeofday_format: string;
    jquery_date_format: string;
    timeofday_format: string;
    date_format: string;
    store_start_and_stop_time: boolean;
    beginning_of_week: number;
    language: string;
    image_url: string;
    sidebar_piechart: boolean;
    at: string;
    created_at: string;
    retention: number;
    record_timeline: boolean;
    render_timeline: boolean;
    timeline_enabled: boolean;
    timeline_experiment: boolean;
    should_upgrade: boolean;
    achievements_enabled: boolean;
    timezone: string;
    openid_enabled: boolean;
    openid_email: string;
    send_product_emails: boolean;
    send_weekly_report: boolean;
    send_timer_notifications: boolean;
    last_blog_entry: string;
    projects: Project[];
    tags: Tag[];
    tasks: Task[];
    time_entries: TimeEntry[];
    workspaces: Workspace[];
    clients: Client[];
    used_next: boolean;
    duration_format: string;
    obm: OBM;
    projectMap: ProjectMap;
    clientMap: ClientMap;
    clientNameMap: ClientNameMap;
    projectTaskList: ProjectTaskList;
  }
}

type TogglButton = {
  $user: Toggl.User | null;
}

type TogglDB = {
  get<T>(key: string): Promise<T | null>;
}

interface LoginRequest {
  type: 'login';
  username: string;
  password: string;
}

type ButtonRequest = LoginRequest;

interface SuccessResponse {
  success: true;
}

interface FailureResponse {
  success: false;
  error: string;
}

type ButtonResponse = SuccessResponse | FailureResponse;
