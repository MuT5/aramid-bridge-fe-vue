export enum StorageConfigurationTypeEnum {
  base64Aes256KeyAppIVEnv = 'base64Aes256KeyAppIVEnv',
  plain = 'plain'
}
export type StorageConfiguration = {
  encryption: StorageConfigurationTypeEnum
  data: string
}
