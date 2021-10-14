create table users (
    id serial primary key, 
    username text not null, 
    counters int not null);