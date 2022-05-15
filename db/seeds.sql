INSERT INTO departments (department_name)
VALUES ('Auto'),
    ('Home'),
    ('Liability'),
    ('Underwriting');

INSERT INTO roles (title, department_id, salary)
VALUES ('Claims Manager', 1, 105000),
    ('Claims Adjuster', 1, 65000),
    ('Unit Manager', 2, 145000),
    ('Property Appraiser', 2, 90000),
    ('Legal Advisor', 3, 160000),
    ('Account Executive', 3, 90000),
    ('Business Account Lead', 4, 150000),
    ('Underwriter', 4, 80000);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('Eric', 'Nuni', 1, 1),
    ('Nick', 'Sanchez', 2, NULL),
    ('JJ', 'Gault', 3, 2),
    ('Duncan', 'Idaho', 4, NULL),
    ('Blade', 'Runner', 5, 3),
    ('Murphy', 'Cooper', 6, NULL),
    ('Bruce', 'Wayne', 7, 4),
    ('Bat', 'Man', 8, NULL);