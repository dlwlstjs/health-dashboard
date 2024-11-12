-- User 테이블 생성
CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    gender TEXT NOT NULL,
    birthdate TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    link TEXT
);

-- Health 테이블 생성
CREATE TABLE IF NOT EXISTS Health (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    score INTEGER NOT NULL,
    FOREIGN KEY (email) REFERENCES User (email) ON DELETE CASCADE
);
