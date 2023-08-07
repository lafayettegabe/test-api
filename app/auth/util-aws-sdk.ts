import { curry, defaultTo } from "ramda";

const DEFAULT_REGION = "sa-east-1";

const orDefaultRegion = defaultTo(DEFAULT_REGION);

const createClientForRegion = curry(
  (region : any, ClientConstructor : any) =>
    new ClientConstructor({ region: orDefaultRegion(region) })
);

const createClientForDefaultRegion = createClientForRegion(null);

export {
  DEFAULT_REGION,
  createClientForDefaultRegion,
  createClientForRegion,
  orDefaultRegion,
};