CREATE TYPE item_type_enum AS ENUM ('TASK', 'GOAL', 'DREAM');
CREATE TYPE item_priority_enum AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE item_period_enum AS ENUM ('WEEK', 'DAY', 'MONTH');
CREATE TYPE item_status_enum AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');

CREATE TABLE IF NOT EXISTS items (
  item_id VARCHAR PRIMARY KEY,
  user_id BIGINT NOT NULL,
  title VARCHAR NOT NULL,
  item_type item_type_enum,
  target_date DATE,
  item_priority item_priority_enum,
  duration INT,
  time_spent INT,
  rec_times INT,
  rec_period item_period_enum,
  rec_progress INT,
  rec_updated_at TIMESTAMP,
  parent_id VARCHAR,
  item_status item_status_enum,
  updated_at TIMESTAMP,
  created_at TIMESTAMP
);

CREATE INDEX idx_user_id ON items (user_id);


ALTER TABLE items ENABLE ELECTRIC;