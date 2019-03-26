type TimeEntry = {
  id: number;
  pid: number;

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

declare module "*.svg" {
  const content: any;
  export default content;
}
