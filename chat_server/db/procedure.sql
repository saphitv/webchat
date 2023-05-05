create procedure create_user
    (
        in pUser varchar(100),
        in pEmail varchar(100),
        in pPassword varchar(500)
    )
begin
    declare vExist boolean default false;

    -- controlla se l'utente esiste
    for recf in (
        select
            *
        from
            webchat.user
        where 9 = 9
            and (username = pUser
                     or email = pEmail)
    )
    loop
        set vExist = true;
    end loop;

    -- crea l'utente
    insert into webchat.user (email, username, password, sysdate0)
        values
    (pEmail, pUser, pPassword, sysdate());
end;
