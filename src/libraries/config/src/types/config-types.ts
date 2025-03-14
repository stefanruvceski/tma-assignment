export type EnvType = {
  [key: string]: string | undefined;
  SERVICE_NAME: string;
};

export type Config = {
  service_name: string;
  test_env: string;
  db_connection_string: string;
  event_stream_endpoint: string;
  port: number;
  aws_access_key_id: string;
  aws_secret_access_key: string;
  aws_region: string;
  aws_stream_name: string;
  pretty_print: boolean;
};

export const configKey = {
  port: 'port' as keyof Config,
  test_env: 'test_env' as keyof Config,
  service_name: 'service_name' as keyof Config,
  db_connection_string: 'db_connection_string' as keyof Config,
  event_stream_endpoint: 'event_stream_endpoint' as keyof Config,
  aws_access_key_id: 'aws_access_key_id' as keyof Config,
  aws_secret_access_key: 'aws_secret_access_key' as keyof Config,
  aws_region: 'aws_region' as keyof Config,
  aws_stream_name: 'aws_stream_name' as keyof Config,
  pretty_print: 'pretty_print' as keyof Config,
};
