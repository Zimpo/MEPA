drop table product;
drop table country;
drop table profil;

create table product(
id int primary key not null,
name text not null,
code text not null,
price int not null,
description text not null);

create table country(
id int primary key not null,
name text not null);

create table profil(
pseudo text not null,
name text not null,
price text not null);

insert into product
values (0, 'banane', 'X5F43', 80, 'bon pour la santé');
insert into product
values (1, 'coca', 'GT65R', 80, 'tres mauvais pour la santé');
insert into product
values (2, 'eau', 'GT90L', 80, 'indispensable pour survivre');
insert into product
values (3, 'avoine', 'DE59O', 80, 'indispensable pour la muscu');
insert into product
values (4, 'snicker', 'TR5DE', 80, 'trop bon');
insert into product
values (5, 'riz', 'YUI82', 80, 'mouais plus dinspi');

insert into country
values (0, 'France');
insert into country
values (1, 'Bolivia');
insert into country
values (2, 'Brazil');
insert into country
values (3, 'Cambodia');
insert into country
values (4, 'China');
insert into country
values (5, 'Croatia');
insert into country
values (6, 'Egypt');
insert into country
values (7, 'Finland');
insert into country
values (8, 'Germany');
insert into country
values (9, 'India');
insert into country
values (10, 'France');
