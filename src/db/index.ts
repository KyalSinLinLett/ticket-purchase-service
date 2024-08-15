import { Sequelize } from 'sequelize'

export const loadSequelize = async (
  dbHost: string,
  dbPort: number,
  dbName: string,
  dbUsn: string,
  dbPassword: string,
  poolMax: number,
  isEnableLogging: boolean,
): Promise<Sequelize> => {
  const poolMaxCon = poolMax ?? 2

  return new Sequelize(dbName, dbUsn, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'postgres',
    pool: {
      max: poolMaxCon,
      min: 0,
      idle: 0,
      acquire: 30000,
      evict: 300000,
    },
    define: {
      charset: 'utf8mb4_unicode_ci',
      underscored: true,
    },
    sync: { force: false },
    logging: isEnableLogging,
  })
}
