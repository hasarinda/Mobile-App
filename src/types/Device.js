//@flow

export type Device = {
  jwt: string,
  id: string,
  dev: string,
  usr: string,
  iat?: number,
  exp?: number,
  res?: Array<string>,
  name?: string,
  desc?: string,
  isFetching: boolean,
  isOnline: boolean,
  isAuthorized: boolean,
  server: string,
  hasServerConnection: boolean
};

// Devices keyed by id, as stored in the `devices` reducer.
export type DeviceMap = { [id: string]: Device };
