DROP DATABASE IF EXISTS todo;
CREATE DATABASE todo;
USE todo;

CREATE TABLE todo_user(
	id int NOT NULL,
    user_name varchar(255),
    email varchar(255),
    PRIMARY KEY (id),
);

CREATE TABLE todo_list(
	id int NOT NULL,
    list_name varchar(255),
    owner_id int NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE task(
	id int NOT NULL,
    task_name varchar(255),
    tagged boolean,
    completed boolean,
    remind_at timestamp,
    user_id int,
    todo_id int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (todo_id) REFERENCES todo_list(id)
);
