SET GLOBAL log_bin_trust_function_creators = 1;

create procedure create_user
    (
        in pUsername varchar(100),
        in pEmail varchar(100),
        in pPassword varchar(500)
    )
begin
    declare vExist boolean default true;

    if (select count(*) from user where email = pEmail or username = pUsername) < 1 then
        set vExist = false;
    end if;

    if not vExist then
        -- crea l'utente
        insert into webchat.user (email, username, password, sysdate0)
            values
        (pEmail, pUsername, pPassword, sysdate());
    end if;
end;


create function create_chat(users varchar(4000)) returns int
begin
    declare vUsers varchar(4000);
    declare vChatId int;
    declare nextValue int default 1;
    declare vNameGroup varchar(100);
    declare vNumUsers int;

    set vUsers = users;
    set vNumUsers = 0;
    set vNameGroup = 'Group';
    insert into webchat.chat( ) values ( );

    set vChatId = last_insert_id();

    while LENGTH(vUsers) > 0 do
        if substr(vUsers, nextValue, 1) = ':' then
            -- insert into webchat.log(value) values (vUsers);
            -- insert into webchat.log(value) values (substr(vUsers, 1, nextValue - 1));
            -- commit;
            insert into webchat.chat_detail(fk_user, fk_chat) values (CAST(substr(vUsers, 1, nextValue - 1) as UNSIGNED), vChatId);
            set vNumUsers = vNumUsers + 1;
            set vNameGroup = (select vNameGroup + ' ' + user.username from user where id_user = CAST(substr(vUsers, 1, nextValue - 1) as UNSIGNED));
            set vUsers = substr(vUsers, nextValue + 1);
            set nextValue = 1;
        end if;
        set nextValue = nextValue + 1;
    end while;

    if vNumUsers > 2 then
        update chat set
         chat.name = vNameGroup
        where id_chat = vChatId;
    end if;

    return vChatId;
end;





create procedure send_message(in from_id int, in chat_id int, in pType enum('TEXT'), in pContent varchar(4000))
begin
    declare vMessageId int;

    insert into webchat.message (type, content, fk_from, fk_chat, createdAt) values (pType, pContent, from_id, chat_id, current_timestamp());

    set vMessageId = last_insert_id();

    INSERT INTO message_detail (fk_chat, fk_message, status)
        SELECT id_detail, vMessageId, 'SENT'
        FROM chat_detail
        WHERE fk_chat = chat_id;

end;

call send_message(1, 1, 'TEXT', 'test00000000');

select create_chat('2:3');