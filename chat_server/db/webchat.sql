drop database webchat;
create database webchat;

use webchat;

create table user (
    id_user  int auto_increment,
    email    varchar(100),
    username varchar(100),
    password varchar(500),
    sysdate0 DATETIME,
    constraint cpk_user primary key ( id_user ),
    constraint cuq_user_username unique (username),
    constraint cuq_user_email    unique ( email )
);

create table roles (
    id_role int auto_increment,
    fk_user int,
    role    varchar(100),
    constraint cpk_roles primary key ( id_role ),
    constraint cfk_roles_users foreign key ( id_role ) references user( id_user )
);

create table chat (
    id_chat int auto_increment,
    constraint cpk_chat primary key ( id_chat )
);

create table chat_detail (
    id_detail  int auto_increment,
    fk_user    int,
    fk_chat    int,
    constraint cpk_details primary key ( id_detail ),
    constraint cfk_details_users foreign key ( fk_user ) references user( id_user ),
    constraint cfk_details_chat foreign key ( fk_chat ) references chat( id_chat )
);

create table message (
    id_message int auto_increment,
    type       enum('TEXT'),
    content    varchar(4000),
    fk_from    int,
    fk_chat    int,
    constraint cpk_messages primary key ( id_message ),
    constraint ckf_messages_user foreign key ( fk_from ) references user( id_user ),
    constraint cfk_messages_chat foreign key ( fk_chat ) references chat( id_chat )
);

create table message_detail (
    id_detail  int auto_increment,
    fk_chat    int,
    fk_message int,
    status     varchar(100),
    constraint cpk_message_detail primary key message_detail( id_detail ),
    constraint cfk_messageDetail_chatDetail foreign key message_detail( fk_chat ) references chat_detail( id_detail ),
    constraint cfk_messageDetail_message foreign key message_detail( fk_message ) references message( id_message )
);