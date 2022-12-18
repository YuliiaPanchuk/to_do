DROP DATABASE IF EXISTS todo;
CREATE DATABASE todo;
USE todo;

CREATE TABLE status_list(
	id int NOT NULL AUTO_INCREMENT,
    status_name varchar(255),
    PRIMARY KEY (id)
);

CREATE TABLE task(
	id int NOT NULL AUTO_INCREMENT,
    task_name varchar(255),
    todo_id int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (todo_id) REFERENCES status_list(id)
);
CREATE TABLE sub_task(
	id int NOT NULL AUTO_INCREMENT,
    sub_task_name varchar(255),
    task_id int NOT NULL,
	PRIMARY KEY (id),
    FOREIGN KEY (task_id) REFERENCES task(id)
);
