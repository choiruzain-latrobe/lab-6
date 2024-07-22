# LAB 6 WALKTROUGH POSTGRE THROUGH CONTAINER

# SETUP
## Remove the previous container

```sh
docker compose down -v
```
Additional commands if needed (can be skipped)
```shell
#remove containers
docker rm -f $(docker ps -aq)

#remove volumes
docker volume prune -f

#remove all images
docker rmi $(docker images -q)

```
## Set docker-compose.yml

```sh
version: "3.8" 
 
name: lab-6-postgres 
 
services: 
  backend: 
    container_name: lab-6-backend 
    build: backend 
    environment: 
      - NODE_ENV=development 
    volumes: 
      - "./backend:/app" 
    env_file: 
      - ./env/postgres.env 
    links: 
      - db 
  db: 
    container_name: lab-6-db 
    image: postgres:15.4-alpine3.18 
    environment: 
      - POSTGRES_DB=development_db 
    env_file: 
      - ./env/postgres.env 
    volumes: 
      - pg_data:/var/lib/postgresql/data 
       
volumes: 
    pg_data: 
      external: false
```

## Create a file named postgres.env
Copy and paste the following setting:
```sh
POSTGRES_USER=postgres 
POSTGRES_PASSWORD=password 
POSTGRES_HOST=db 
POSTGRES_PORT=5432
```

## Change the configuration of \backend\connect_db.js file

To show all tables in the current database, run the following command in the MySQL shell:

```sh
/** 
 * Requiring this file will connect to the database and return the 
 * Sequelize database connection object. 
 */ 
 
const Sequelize = require('sequelize'); 
 
const dbConfig = { 
  host: process.env.POSTGRES_HOST, 
  port: process.env.POSTGRES_PORT, 
  // here we are selecting mysql as the database type we will be using 
  dialect: 'postgres' 
}; 
 
// Here we connect to the database 
const db = new Sequelize( 
  'development_db', 
  process.env.POSTGRES_USER, 
  process.env.POSTGRES_PASSWORD, 
  dbConfig); 
 
module.exports = db;
```

## Configure of /backend/package.json

```json
{ 
  "name": "backend", 
  "version": "0.0.1", 
  "private": true, 
  "dependencies": { 
    "postgres": "3.3.5", 
    "sequelize": "6.32.0" 
  } 
} 
```

## Configure /backend/Dockerfile

```json
# Base this image on an official Node.js long term support image. 
FROM node:18.16.0-alpine 
 
# Install some additional packages that we need. 
RUN apk add --no-cache tini curl bash sudo 
 
# Use Tini as the init process. Tini will take care of important system stuff 
# for us, like forwarding signals and reaping zombie processes. 
ENTRYPOINT ["/sbin/tini", "--"] 
 
# Create a working directory for our application. 
RUN mkdir -p /app 
WORKDIR /app 
 
# Install the project's NPM dependencies. 
COPY package.json /app/ 
RUN npm --silent install 
RUN npm install pg --save 
RUN mkdir /deps && mv node_modules /deps/node_modules 
 
# Set environment variables to point to the installed NPM modules. 
ENV NODE_PATH=/deps/node_modules \ 
    PATH=/deps/node_modules/.bin:$PATH 
 
# Copy our application files into the image. 
COPY . /app 
 
# Switch to a non-privileged user for running commands inside the container. 
RUN chown -R node:node /app /deps \ 
 && echo "node ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/90-node 
USER node 
 
# Run an interactive shell 
CMD [ "bash" ] 
```

# RUNNING THE CONTAINER
## IN THE ROOT FOLDER (lab-6)
Run:
```json
docker compose up --build
```
Your database is ready when you see this output
```json
lab-6 % docker compose up db --build 
[+] Running 1/0
 ✔ Container lab-6-db  Recreated                                                                                                                                                            0.0s 
Attaching to lab-6-db
lab-6-db  | The files belonging to this database system will be owned by user "postgres".
lab-6-db  | This user must also own the server process.
lab-6-db  | 
lab-6-db  | The database cluster will be initialized with locale "en_US.utf8".
lab-6-db  | The default database encoding has accordingly been set to "UTF8".
lab-6-db  | The default text search configuration will be set to "english".
lab-6-db  | 
lab-6-db  | Data page checksums are disabled.
lab-6-db  | 
lab-6-db  | fixing permissions on existing directory /var/lib/postgresql/data ... ok
lab-6-db  | creating subdirectories ... ok
lab-6-db  | selecting dynamic shared memory implementation ... posix
lab-6-db  | selecting default max_connections ... 100
lab-6-db  | selecting default shared_buffers ... 128MB
lab-6-db  | selecting default time zone ... UTC
lab-6-db  | creating configuration files ... ok
lab-6-db  | running bootstrap script ... ok
lab-6-db  | sh: locale: not found
lab-6-db  | 2024-07-22 11:39:37.268 UTC [30] WARNING:  no usable system locales were found
lab-6-db  | performing post-bootstrap initialization ... ok
lab-6-db  | syncing data to disk ... ok
lab-6-db  | 
lab-6-db  | 
lab-6-db  | Success. You can now start the database server using:
lab-6-db  | 
lab-6-db  |     pg_ctl -D /var/lib/postgresql/data -l logfile start
lab-6-db  | 
lab-6-db  | initdb: warning: enabling "trust" authentication for local connections
lab-6-db  | initdb: hint: You can change this by editing pg_hba.conf or using the option -A, or --auth-local and --auth-host, the next time you run initdb.
lab-6-db  | waiting for server to start....2024-07-22 11:39:37.701 UTC [36] LOG:  starting PostgreSQL 15.4 on aarch64-unknown-linux-musl, compiled by gcc (Alpine 12.2.1_git20220924-r10) 12.2.1 20220924, 64-bit
lab-6-db  | 2024-07-22 11:39:37.702 UTC [36] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
lab-6-db  | 2024-07-22 11:39:37.705 UTC [39] LOG:  database system was shut down at 2024-07-22 11:39:37 UTC
lab-6-db  | 2024-07-22 11:39:37.708 UTC [36] LOG:  database system is ready to accept connections
lab-6-db  |  done
lab-6-db  | server started
lab-6-db  | CREATE DATABASE
lab-6-db  |
lab-6-db  |
lab-6-db  | /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*
lab-6-db  |
lab-6-db  | waiting for server to shut down....2024-07-22 11:39:37.844 UTC [36] LOG:  received fast shutdown request
lab-6-db  | 2024-07-22 11:39:37.850 UTC [36] LOG:  aborting any active transactions
lab-6-db  | 2024-07-22 11:39:37.851 UTC [36] LOG:  background worker "logical replication launcher" (PID 42) exited with exit code 1
lab-6-db  | 2024-07-22 11:39:37.851 UTC [37] LOG:  shutting down
lab-6-db  | 2024-07-22 11:39:37.852 UTC [37] LOG:  checkpoint starting: shutdown immediate
lab-6-db  | 2024-07-22 11:39:37.900 UTC [37] LOG:  checkpoint complete: wrote 918 buffers (5.6%); 0 WAL file(s) added, 0 removed, 0 recycled; write=0.015 s, sync=0.032 s, total=0.049 s; sync files=301, longest=0.018 s, average=0.001 s; distance=4222 kB, estimate=4222 kB
lab-6-db  | 2024-07-22 11:39:37.906 UTC [36] LOG:  database system is shut down
lab-6-db  |  done
lab-6-db  | server stopped
lab-6-db  |
lab-6-db  | PostgreSQL init process complete; ready for start up.
lab-6-db  |
lab-6-db  | 2024-07-22 11:39:37.969 UTC [1] LOG:  starting PostgreSQL 15.4 on aarch64-unknown-linux-musl, compiled by gcc (Alpine 12.2.1_git20220924-r10) 12.2.1 20220924, 64-bit
lab-6-db  | 2024-07-22 11:39:37.969 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
lab-6-db  | 2024-07-22 11:39:37.969 UTC [1] LOG:  listening on IPv6 address "::", port 5432
lab-6-db  | 2024-07-22 11:39:37.970 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
lab-6-db  | 2024-07-22 11:39:37.973 UTC [52] LOG:  database system was shut down at 2024-07-22 11:39:37 UTC
lab-6-db  | 2024-07-22 11:39:37.977 UTC [1] LOG:  database system is ready to accept connections
lab-6-db  | 2024-07-22 11:44:38.081 UTC [50] LOG:  checkpoint starting: time
lab-6-db  | 2024-07-22 11:44:42.343 UTC [50] LOG:  checkpoint complete: wrote 44 buffers (0.3%); 0 WAL file(s) added, 0 removed, 0 recycled; write=4.246 s, sync=0.007 s, total=4.262 s; sync files=12, longest=0.004 s, average=0.001 s; distance=252 kB, estimate=252 kB
```
## Open New terminal
Run the following command:
```json
docker exec -it lab-6-db bash 
```

You will have a docker terminal similar to the output below:

```json
Lab06 % docker exec -it lab-6-db bash
c116a0ee5b3a:/# 
```

Inside the docker container, try to access PostgreSQL database. Run the following
```json
ab53eeeb5f63:/# 
PGPASSWORD=$POSTGRES_PASSWORD psql -U $POSTGRES_USER -h $POSTGRES_HOST -d $POSTGRES_DB 
```
The overall output can be seen as follows:

```json
% docker exec -it lab-6-db bash
c116a0ee5b3a:/# PGPASSWORD=$POSTGRES_PASSWORD psql -U $POSTGRES_USER -h $POSTGRES_HOST -d $POSTGRES_DB
psql (15.4)
Type "help" for help.

development_db=#
```
Now your PostgreSQL has been setup
# Populate data into database using Sequelize

## Open New Terminal
Under the backend folder, run the following command to run sequelize on JavaScript code:

```json
docker compose run --rm backend node populate_data1.js 
```

You may see the similar to the output below:
```json
Executing (default): DROP TABLE IF EXISTS "articles" CASCADE;
Executing (default): SELECT DISTINCT tc.constraint_name as constraint_name, tc.constraint_schema as constraint_schema, tc.constraint_catalog as constraint_catalog, tc.table_name as table_name,tc.table_schema as table_schema,tc.table_catalog as table_catalog,tc.initially_deferred as initially_deferred,tc.is_deferrable as is_deferrable,kcu.column_name as column_name,ccu.table_schema  AS referenced_table_schema,ccu.table_catalog  AS referenced_table_catalog,ccu.table_name  AS referenced_table_name,ccu.column_name AS referenced_column_name FROM information_schema.table_constraints AS tc JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name WHERE constraint_type = 'FOREIGN KEY' AND tc.table_name = 'articles' AND tc.table_catalog = 'development_db'
Executing (default): DROP TABLE IF EXISTS "articles" CASCADE;
Executing (default): DROP TABLE IF EXISTS "articles" CASCADE;
Executing (default): CREATE TABLE IF NOT EXISTS "articles" ("id"   SERIAL , "title" VARCHAR(255), "content" TEXT, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));
Executing (default): SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey, array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid) AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND t.relkind = 'r' and t.relname = 'articles' GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;
Executing (default): INSERT INTO "articles" ("id","title","content","createdAt","updatedAt") VALUES (DEFAULT,$1,$2,$3,$4) RETURNING "id","title","content","createdAt","updatedAt";
Executing (default): INSERT INTO "articles" ("id","title","content","createdAt","updatedAt") VALUES (DEFAULT,$1,$2,$3,$4) RETURNING "id","title","content","createdAt","updatedAt";
Executing (default): INSERT INTO "articles" ("id","title","content","createdAt","updatedAt") VALUES (DEFAULT,$1,$2,$3,$4) RETURNING "id","title","content","createdAt","updatedAt";
Executing (default): INSERT INTO "articles" ("id","title","content","createdAt","updatedAt") VALUES (DEFAULT,$1,$2,$3,$4) RETURNING "id","title","content","createdAt","updatedAt";
Executing (default): INSERT INTO "articles" ("id","title","content","createdAt","updatedAt") VALUES (DEFAULT,$1,$2,$3,$4) RETURNING "id","title","content","createdAt","updatedAt";
```

## Run populate_data2.js
```json
% docker compose run --rm backend node populate_data2.js 
[+] Creating 1/0
 ✔ Container lab-6-db  Running                                                                                                                                                              0.0s 
Executing (default): DROP TABLE IF EXISTS "employees" CASCADE;
Executing (default): DROP TABLE IF EXISTS "companies" CASCADE;
Executing (default): SELECT DISTINCT tc.constraint_name as constraint_name, tc.constraint_schema as constraint_schema, tc.constraint_catalog as constraint_catalog, tc.table_name as table_name,tc.table_schema as table_schema,tc.table_catalog as table_catalog,tc.initially_deferred as initially_deferred,tc.is_deferrable as is_deferrable,kcu.column_name as column_name,ccu.table_schema  AS referenced_table_schema,ccu.table_catalog  AS referenced_table_catalog,ccu.table_name  AS referenced_table_name,ccu.column_name AS referenced_column_name FROM information_schema.table_constraints AS tc JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name WHERE constraint_type = 'FOREIGN KEY' AND tc.table_name = 'companies' AND tc.table_catalog = 'development_db'
Executing (default): SELECT DISTINCT tc.constraint_name as constraint_name, tc.constraint_schema as constraint_schema, tc.constraint_catalog as constraint_catalog, tc.table_name as table_name,tc.table_schema as table_schema,tc.table_catalog as table_catalog,tc.initially_deferred as initially_deferred,tc.is_deferrable as is_deferrable,kcu.column_name as column_name,ccu.table_schema  AS referenced_table_schema,ccu.table_catalog  AS referenced_table_catalog,ccu.table_name  AS referenced_table_name,ccu.column_name AS referenced_column_name FROM information_schema.table_constraints AS tc JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name WHERE constraint_type = 'FOREIGN KEY' AND tc.table_name = 'employees' AND tc.table_catalog = 'development_db'
Executing (default): DROP TABLE IF EXISTS "companies" CASCADE;
Executing (default): DROP TABLE IF EXISTS "employees" CASCADE;
Executing (default): DROP TABLE IF EXISTS "companies" CASCADE;
Executing (default): CREATE TABLE IF NOT EXISTS "companies" ("id"   SERIAL , "name" VARCHAR(255), "profit" FLOAT, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));
Executing (default): SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey, array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid) AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND t.relkind = 'r' and t.relname = 'companies' GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;
Executing (default): DROP TABLE IF EXISTS "employees" CASCADE;
Executing (default): CREATE TABLE IF NOT EXISTS "employees" ("id"   SERIAL , "name" VARCHAR(255), "age" INTEGER, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "companyId" INTEGER REFERENCES "companies" ("id") ON DELETE SET NULL ON UPDATE CASCADE, PRIMARY KEY ("id"));
Executing (default): SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey, array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid) AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND t.relkind = 'r' and t.relname = 'employees' GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;
Executing (default): INSERT INTO "companies" ("id","name","profit","createdAt","updatedAt") VALUES (DEFAULT,$1,$2,$3,$4) RETURNING "id","name","profit","createdAt","updatedAt";
Executing (default): INSERT INTO "companies" ("id","name","profit","createdAt","updatedAt") VALUES (DEFAULT,$1,$2,$3,$4) RETURNING "id","name","profit","createdAt","updatedAt";
Executing (default): INSERT INTO "employees" ("id","name","age","createdAt","updatedAt","companyId") VALUES (DEFAULT,$1,$2,$3,$4,$5) RETURNING "id","name","age","createdAt","updatedAt","companyId";
Executing (default): INSERT INTO "employees" ("id","name","age","createdAt","updatedAt","companyId") VALUES (DEFAULT,$1,$2,$3,$4,$5) RETURNING "id","name","age","createdAt","updatedAt","companyId";
Executing (default): INSERT INTO "employees" ("id","name","age","createdAt","updatedAt","companyId") VALUES (DEFAULT,$1,$2,$3,$4,$5) RETURNING "id","name","age","createdAt","updatedAt","companyId";
```

## You can check the database

Under the database shell, you can try some commands in PostgreSQL syntax. You can also see the results similar to the output below:

```json
development_db=# \dt
           List of relations
 Schema |   Name    | Type  |  Owner   
--------+-----------+-------+----------
 public | articles  | table | postgres
 public | companies | table | postgres
 public | employees | table | postgres
(3 rows)

development_db=# select * from articles;
 id |         title         |                                  content                                   |         createdAt          |         updatedAt          
----+-----------------------+----------------------------------------------------------------------------+----------------------------+----------------------------
  1 | War and Peace         | A book about fighting and then making up.                                  | 2024-07-22 12:13:54.993+00 | 2024-07-22 12:13:54.993+00
  2 | Sequelize for dummies | Writing lots of cool javascript code that get turned into SQL.             | 2024-07-22 12:13:54.993+00 | 2024-07-22 12:13:54.993+00
  3 | I like tomatoes       | The story about the adventures of a tomato lover.                          | 2024-07-22 12:13:54.993+00 | 2024-07-22 12:13:54.993+00
  4 | PHP for dummies       | Why PHP is so so so bad at backend stuff. Why you should use express node. | 2024-07-22 12:13:54.994+00 | 2024-07-22 12:13:54.994+00
  5 | The lovely car        | How a car changed his life forever.                                        | 2024-07-22 12:13:54.994+00 | 2024-07-22 12:13:54.994+00
(5 rows)

development_db=# select * from companies;
 id |  name  | profit  |         createdAt          |         updatedAt          
----+--------+---------+----------------------------+----------------------------
  1 | Apple  | 20202.1 | 2024-07-22 12:17:08.474+00 | 2024-07-22 12:17:08.474+00
  2 | Google |      32 | 2024-07-22 12:17:08.475+00 | 2024-07-22 12:17:08.475+00
(2 rows)

development_db=# select * from employees;
 id |     name     | age |         createdAt          |         updatedAt          | companyId 
----+--------------+-----+----------------------------+----------------------------+-----------
  1 | John Smith   |  20 | 2024-07-22 12:17:08.483+00 | 2024-07-22 12:17:08.483+00 |         1
  2 | Peter Senior |  10 | 2024-07-22 12:17:08.483+00 | 2024-07-22 12:17:08.483+00 |         1
  3 | Peter Rabbit |   3 | 2024-07-22 12:17:08.486+00 | 2024-07-22 12:17:08.486+00 |         2
(3 rows)
```
