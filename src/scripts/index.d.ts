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

type TimeEntry = {
  id: number;
  pid: number;

  start: string;
  stop: string;

  description: string;
  duration: number;
  tags: Array<string> | null;
  billable: boolean;
};

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
