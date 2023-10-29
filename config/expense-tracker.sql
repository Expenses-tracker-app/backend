CREATE TABLE "users" (
  "user_id" SERIAL PRIMARY KEY,
  "username" varchar,
  "password" varchar,
  "email" varchar
);

CREATE TABLE "expenses" (
  "expense_id" SERIAL PRIMARY KEY,
  "user_id" integer,
  "expense_date" date,
  "expense_amount" double precision,
  "expense_description" varchar,
  "tag_id" integer,
  "is_recurring" bool,
  "recurring_frequency" varchar
);

CREATE TABLE "incomes" (
  "income_id" SERIAL PRIMARY KEY,
  "user_id" integer,
  "income_date" date,
  "income_amount" double precision,
  "income_description" varchar,
  "tag_id" integer
);

CREATE TABLE "tags" (
  "tag_id" SERIAL PRIMARY KEY,
  "tag_name" varchar
);

ALTER TABLE "expenses" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

ALTER TABLE "expenses" ADD FOREIGN KEY ("tag_id") REFERENCES "tags" ("tag_id");

ALTER TABLE "incomes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

ALTER TABLE "incomes" ADD FOREIGN KEY ("tag_id") REFERENCES "tags" ("tag_id");

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public to user_name;