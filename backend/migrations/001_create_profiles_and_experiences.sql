CREATE TABLE IF NOT EXISTS profiles (
    id BIGSERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    school TEXT NOT NULL DEFAULT '',
    department TEXT NOT NULL DEFAULT '',
    bio TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT profiles_username_format
      CHECK (username ~ '^[a-z0-9]+$')
);

CREATE TABLE IF NOT EXISTS experiences (
    id BIGSERIAL PRIMARY KEY,
    profile_id BIGINT NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    role TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    attendance INTEGER NOT NULL DEFAULT 0,
    photo_url TEXT NOT NULL DEFAULT '',
    organizer TEXT NOT NULL DEFAULT '',
    summary TEXT NOT NULL DEFAULT '',
    challenge TEXT NOT NULL DEFAULT '',
    outcome TEXT NOT NULL DEFAULT '',
    learning TEXT NOT NULL DEFAULT '',
    url TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT experiences_attendance_nonnegative
      CHECK (attendance >= 0),
    CONSTRAINT experiences_end_after_start
      CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS experience_areas (
    experience_id BIGINT NOT NULL REFERENCES experiences (id) ON DELETE CASCADE,
    area TEXT NOT NULL,
    PRIMARY KEY (experience_id, area)
);

CREATE TABLE IF NOT EXISTS experience_event_types (
    experience_id BIGINT NOT NULL REFERENCES experiences (id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    PRIMARY KEY (experience_id, event_type)
);

CREATE TABLE IF NOT EXISTS experience_responsibilities (
    experience_id BIGINT NOT NULL REFERENCES experiences (id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL,
    body TEXT NOT NULL,
    PRIMARY KEY (experience_id, sort_order)
);
