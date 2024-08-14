CREATE TABLE `statistic_record` (
  `id` bigint NOT NULL,
  `record_datetime` datetime DEFAULT NULL,
  `new_user_count` bigint unsigned DEFAULT NULL,
  `total_user_count` bigint unsigned DEFAULT NULL,
  `active_user_count` bigint unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `new_user_android` bigint DEFAULT '0',
  `active_user_web` bigint DEFAULT '0',
  `active_user_ios` bigint DEFAULT '0',
  `active_user_android` bigint DEFAULT '0',
  `total_user_web` bigint DEFAULT '0',
  `total_user_ios` bigint DEFAULT '0',
  `total_user_android` bigint DEFAULT '0',
  `new_user_web` bigint DEFAULT '0',
  `new_user_ios` bigint DEFAULT '0',
  `active_p2p_chat` bigint DEFAULT '0',
  `active_group_chat` bigint DEFAULT '0',
  `total_call` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE cmsdb.users (
    id BIGINT NOT NULL,
    name VARCHAR(255) DEFAULT NULL,
    username VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255) DEFAULT NULL,
    password_hash VARCHAR(255) DEFAULT NULL,
    phone_number VARCHAR(255) DEFAULT NULL,
    `role` VARCHAR(255) DEFAULT NULL,
    CONSTRAINT users_pk PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

ALTER TABLE
    cmsdb.users
ADD
    created_at DATETIME NULL;

ALTER TABLE
    cmsdb.users
ADD
    updated_at DATETIME NULL;

CREATE TABLE cmsdb.access_token (
    token VARCHAR(255) PRIMARY KEY,
    user_id BIGINT,
    expiry DATETIME,
    invalidated BOOLEAN DEFAULT false,
    user_agent TEXT,
    registration_datetime DATETIME,
    CONSTRAINT fk_user_access_token FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
