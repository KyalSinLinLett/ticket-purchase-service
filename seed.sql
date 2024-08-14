-- Insert sample data into cmsdb.statistic_record
INSERT INTO
    cmsdb.statistic_record (
        id,
        record_datetime,
        new_user_count,
        total_user_count,
        active_user_count,
        created_at,
        updated_at
    )
VALUES
    (
        1,
        '2024-07-14 08:00:00',
        10,
        100,
        50,
        NOW(),
        NOW()
    ),
    (
        2,
        '2024-07-13 08:00:00',
        8,
        98,
        48,
        NOW(),
        NOW()
    ),
    (
        3,
        '2024-07-12 08:00:00',
        12,
        110,
        55,
        NOW(),
        NOW()
    ),
    (
        4,
        '2024-07-11 08:00:00',
        15,
        112,
        58,
        NOW(),
        NOW()
    ),
    (
        5,
        '2024-07-10 08:00:00',
        7,
        105,
        52,
        NOW(),
        NOW()
    );

-- Insert sample data into cmsdb.users
INSERT INTO
    cmsdb.users (
        id,
        name,
        username,
        email,
        password_hash,
        phone_number,
        role,
        created_at,
        updated_at
    )
VALUES
    (
        1,
        'Ye Kyaw Thu',
        'ykt1991',
        'ykt1991@gmail.com',
        '$2b$04$f.Y1QdgWb0z54fTAXWbnDe73n6Y0xkFiKf7/MImRLChzakS25BizW',
        '09123123123',
        'Admin',
        NOW(),
        NOW()
    ),
    (
        2,
        'Alex Sin',
        'alexsin0012',
        'alexsin0012@gmail.com',
        '$2b$04$f.Y1QdgWb0z54fTAXWbnDe73n6Y0xkFiKf7/MImRLChzakS25BizW',
        '09124124124',
        'Admin',
        NOW(),
        NOW()
    );