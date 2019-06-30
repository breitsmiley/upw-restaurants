const config = {
  type: "mysql",
  host: "r-db",
  port: 3306,
  username: "rest",
  password: "rest",
  database: "rest",
  synchronize: false,
  logging: true,
  entities: [
    "src/entity/**/*.ts"
  ],
  migrations: [
    "src/migration/**/*.ts"
  ],
  cli: {
    migrationsDir: 'src/migration'
  },
};

export = config;
