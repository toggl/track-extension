import origins, { CustomScripts as customScripts } from './origins';

declare const _default = origins as {
  [key: string]: {
    name: string;
    url: string;
    file?: string;
  };
};

export default _default;

export declare const CustomScripts = customScripts as {
  [key: string]: {
    name: string;
    file?: string;
  };
}
