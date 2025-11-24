insert into ride values ( 'RollerCoaster', 40, to_date('2015-06-01','YYYY-MM-DD') );
insert into ride values ( 'FerrisWheel', 30, to_date('2010-04-12','YYYY-MM-DD') );
insert into ride values ( 'HauntedHouse', 20, to_date('2018-10-10','YYYY-MM-DD') );
insert into ride values ( 'LogFlume', 25, to_date('2012-07-21','YYYY-MM-DD') );
insert into ride values ( 'BumperCars', 15, to_date('2011-09-14','YYYY-MM-DD') );

-- OLD CUSTOMER VALUES BEFORE TREVOR ADDED MORE DATA
-- insert into customer values ( 1, 'Alice Johnson', 'F', to_date('1990-05-14','YYYY-MM-DD') );
-- insert into customer values ( 2, 'Bob Smith', 'M', to_date('1988-08-09','YYYY-MM-DD') );
-- insert into customer values ( 3, 'Carol White', 'F', to_date('1995-11-02','YYYY-MM-DD') );
-- insert into customer values ( 4, 'David Brown', 'M', to_date('2000-01-25','YYYY-MM-DD') );
-- insert into customer values ( 5, 'Eve Davis', 'F', to_date('1993-03-07','YYYY-MM-DD') );


-- OLD Loyalty Member VALUES BEFORE TREVOR ADDED MORE DATA
-- insert into loyaltymember values ( 1, 101, 120, 10001 );
-- insert into loyaltymember values ( 2, 102, 80, 10002 );
-- insert into loyaltymember values ( 3, 103, 200, 10003 );
-- insert into loyaltymember values ( 4, 104, 0, 10004 );
-- insert into loyaltymember values ( 5, 105, 50, 10005 );

-- Gender: M
insert into customer values ( 2, 'Bob Smith', 'M', to_date('1988-08-09','YYYY-MM-DD') );
insert into customer values ( 4, 'David Brown', 'M', to_date('2000-01-25','YYYY-MM-DD') );

-- Gender: F
insert into customer values ( 1, 'Alice Johnson', 'F', to_date('1990-05-14','YYYY-MM-DD') );
insert into customer values ( 3, 'Carol White', 'F', to_date('1995-11-02','YYYY-MM-DD') );
insert into customer values ( 5, 'Eve Davis', 'F', to_date('1993-03-07','YYYY-MM-DD') );
insert into customer values ( 11, 'Sally Smith', 'F', to_date('1993-05-08','YYYY-MM-DD') );
insert into customer values ( 12, 'Patty White', 'F', to_date('1993-06-29','YYYY-MM-DD') );

-- Gender: Unspecified
insert into customer values ( 13, 'Aaron Davis', 'Unspecified', to_date('1985-08-07','YYYY-MM-DD') );
insert into customer values ( 14, 'Jessie Brown', 'Unspecified', to_date('1985-05-21','YYYY-MM-DD') );
insert into customer values ( 15, 'Quinn Jude', 'Unspecified', to_date('1985-04-17','YYYY-MM-DD') );
insert into customer values ( 16, 'River Quinn', 'Unspecified', to_date('1985-11-11','YYYY-MM-DD') );


-- Gender: Non-binary 
insert into customer values ( 100, 'James Vick', 'Non-binary', to_date('2000-03-27','YYYY-MM-DD') );
insert into customer values ( 101, 'Travis Albanza', 'Non-binary', to_date('2000-01-31','YYYY-MM-DD') );
insert into customer values ( 102, 'Ian Alexander', 'Non-binary', to_date('1994-02-14','YYYY-MM-DD') );
insert into customer values ( 103, 'Olly Alexander', 'Non-binary', to_date('1973-12-12','YYYY-MM-DD') );



-- Guests:
insert into customer values ( 6, 'John Guest', 'M', to_date('1930-06-14','YYYY-MM-DD') );
insert into customer values ( 7, 'John Guest II', 'M', to_date('1947-03-09','YYYY-MM-DD') );
insert into customer values ( 8, 'John Guest III', 'M', to_date('1965-10-02','YYYY-MM-DD') );
insert into customer values ( 9, 'John Guest IV', 'M', to_date('1995-04-25','YYYY-MM-DD') );
insert into customer values ( 10, 'Terry Margaret', 'F', to_date('1967-09-07','YYYY-MM-DD') );

insert into customer values ( 226, 'Michael Todd', 'M', to_date('1930-06-14','YYYY-MM-DD') );
insert into customer values ( 227, 'Janice Mann', 'F', to_date('1947-03-09','YYYY-MM-DD') );
insert into customer values ( 228, 'Vanessa Jest', 'F', to_date('1965-10-02','YYYY-MM-DD') );
insert into customer values ( 229, 'Johnny Peterson Jr', 'M', to_date('1995-04-25','YYYY-MM-DD') );
insert into customer values ( 330, 'Mary Margaret', 'F', to_date('1967-09-07','YYYY-MM-DD') );

insert into customer values ( 336, 'Richard Guest', 'M', to_date('1930-06-14','YYYY-MM-DD') );
insert into customer values ( 337, 'Ricky Guest II', 'M', to_date('1947-03-09','YYYY-MM-DD') );
insert into customer values ( 338, 'Bobby Smith', 'M', to_date('1965-10-02','YYYY-MM-DD') );
insert into customer values ( 339, 'Bobbert Smith', 'M', to_date('1995-04-25','YYYY-MM-DD') );
insert into customer values ( 340, 'Tammy Lammy', 'F', to_date('1967-09-07','YYYY-MM-DD') );

insert into customer values ( 446, 'Michella Todd', 'F', to_date('1930-06-14','YYYY-MM-DD') );
insert into customer values ( 447, 'Jasmine Robertson', 'F', to_date('1947-03-09','YYYY-MM-DD') );
insert into customer values ( 448, 'Andy Jest', 'M', to_date('1965-10-02','YYYY-MM-DD') );
insert into customer values ( 449, 'Jonny Peters Jr', 'M', to_date('1995-04-25','YYYY-MM-DD') );
insert into customer values ( 4440, 'Marlena Margaretta', 'F', to_date('1967-09-07','YYYY-MM-DD') );

insert into customer values ( 556, 'Richardo Ramirez', 'M', to_date('1930-06-14','YYYY-MM-DD') );
insert into customer values ( 557, 'Richy Guest Sr', 'M', to_date('1947-03-09','YYYY-MM-DD') );
insert into customer values ( 558, 'Waldo Smith', 'M', to_date('1965-10-02','YYYY-MM-DD') );
insert into customer values ( 559, 'Danny Smiths', 'M', to_date('1995-04-25','YYYY-MM-DD') );
insert into customer values ( 5550, 'Samson Ma', 'M', to_date('1967-09-07','YYYY-MM-DD') );

insert into customer values ( 666, 'Richardson Guest', 'M', to_date('1930-06-14','YYYY-MM-DD') );
insert into customer values ( 667, 'Ramos Guest II', 'M', to_date('1947-03-09','YYYY-MM-DD') );
insert into customer values ( 668, 'Bravado Smith', 'M', to_date('1965-10-02','YYYY-MM-DD') );
insert into customer values ( 669, 'Benjamin Smith', 'M', to_date('1995-04-25','YYYY-MM-DD') );
insert into customer values ( 6660, 'Rita Lammy', 'F', to_date('1967-09-07','YYYY-MM-DD') );

insert into customer values ( 776, 'Pamela Todd', 'F', to_date('1930-06-14','YYYY-MM-DD') );
insert into customer values ( 777, 'Jasmine Johnson', 'F', to_date('1947-03-09','YYYY-MM-DD') );
insert into customer values ( 778, 'Andrew Jest', 'M', to_date('1965-10-02','YYYY-MM-DD') );
insert into customer values ( 779, 'Jackson Peters Jr', 'M', to_date('1995-04-25','YYYY-MM-DD') );
insert into customer values ( 7770, 'Arlana Margarette', 'F', to_date('1967-09-07','YYYY-MM-DD') );

insert into customer values ( 886, 'Richardoz Ramirez', 'M', to_date('1930-06-14','YYYY-MM-DD') );
insert into customer values ( 887, 'Raoni Guest Sr', 'M', to_date('1947-03-09','YYYY-MM-DD') );
insert into customer values ( 888, 'Woodrow Smith', 'M', to_date('1965-10-02','YYYY-MM-DD') );
insert into customer values ( 889, 'Wilson Smiths', 'M', to_date('1995-04-25','YYYY-MM-DD') );
insert into customer values ( 8880, 'Samsung Manson', 'M', to_date('1967-09-07','YYYY-MM-DD') );


--Loyalty Members
insert into customer values ( 25, 'James Guest', 'M', to_date('1930-12-01','YYYY-MM-DD') );
insert into customer values ( 26, 'James Guest Jr.', 'M', to_date('1930-09-09','YYYY-MM-DD') );
insert into customer values ( 27, 'James Guest III', 'M', to_date('1930-10-22','YYYY-MM-DD') );
insert into customer values ( 28, 'James Guest IV', 'M', to_date('1995-04-24','YYYY-MM-DD') );
insert into customer values ( 29, 'James Margaret', 'M', to_date('1995-09-02','YYYY-MM-DD') );
insert into customer values ( 30, 'Jeff Guest', 'M', to_date('1995-06-11','YYYY-MM-DD') );
insert into customer values ( 31, 'Jeff Guest II', 'M', to_date('1949-06-17','YYYY-MM-DD') );
insert into customer values ( 32, 'Jeff Guest III', 'M', to_date('1949-10-16','YYYY-MM-DD') );
insert into customer values ( 33, 'Jeff Guest IV', 'M', to_date('1995-04-30','YYYY-MM-DD') );
insert into customer values ( 34, 'Jeff Margaret', 'M', to_date('1949-09-30','YYYY-MM-DD') );
insert into customer values ( 34, 'Tom Margaret', 'M', to_date('1949-09-30','YYYY-MM-DD') );




 -- ID, LoyaltyID, Points, UUID

 -- 1988, M
insert into loyaltymember values ( 2, 102, 80, 10002 );
 -- 200, M
insert into loyaltymember values ( 4, 104, 0, 10004 );

-- Gender: 1990, F
insert into loyaltymember values ( 1, 101, 120, 10001 );

-- Gender: 1995, F
insert into loyaltymember values ( 3, 103, 200, 10003 );

--1993, F
insert into loyaltymember values ( 5, 105, 30, 10005 );
insert into loyaltymember values ( 11, 106, 40, 10006 );
insert into loyaltymember values ( 12, 107, 10, 10007 );


-- 1985, Gender: Unspecified
insert into loyaltymember values ( 13, 108, 64, 10008 );
insert into loyaltymember values ( 14, 109, 30, 10009 );
insert into loyaltymember values ( 15, 110, 17, 10010 );
insert into loyaltymember values ( 16, 111, 2201, 10011 );


--1973, Gender: Non-binary 
insert into loyaltymember values ( 103, 115, 995, 10015 ); 

--1994, Gender: Non-binary 
insert into loyaltymember values ( 102, 114, 0, 10014 );

--2000, Gender: Non-binary 
insert into loyaltymember values ( 100, 112, 3341, 10012 );
insert into loyaltymember values ( 101, 113, 1, 10013 );


-- More loyalty members for points by birth year

-- 1930
insert into loyaltymember values ( 25, 116, 1, 10012 );
insert into loyaltymember values ( 26, 117,  3, 10013 );
insert into loyaltymember values ( 27, 118,  4, 10014 );

-- 1949
insert into loyaltymember values ( 31, 122, 443, 10018); 
insert into loyaltymember values ( 32, 123,  232, 10019 ); 
insert into loyaltymember values ( 34, 125,   355, 10021 );
insert into loyaltymember values ( 35, 126,  17, 10022 );

-- 1995
insert into loyaltymember values ( 28, 119,  120, 10015 );
insert into loyaltymember values ( 29, 120,  111, 10016 ); 
insert into loyaltymember values ( 30, 121,  1111, 10017 ); 
insert into loyaltymember values ( 33, 124,  234, 10020 );


insert into booking1 values ( to_date('2025-07-10','YYYY-MM-DD'), 120 );
insert into booking1 values ( to_date('2025-07-12','YYYY-MM-DD'), 90 );
insert into booking1 values ( to_date('2025-07-14','YYYY-MM-DD'), 150 );
insert into booking1 values ( to_date('2025-07-16','YYYY-MM-DD'), 110 );
insert into booking1 values ( to_date('2025-07-18','YYYY-MM-DD'), 200 );

insert into booking2 values ( 1001, to_date('2025-07-10','YYYY-MM-DD'), 1 );
insert into booking2 values ( 1002, to_date('2025-07-12','YYYY-MM-DD'), 2 );
insert into booking2 values ( 1003, to_date('2025-07-14','YYYY-MM-DD'), 3 );
insert into booking2 values ( 1004, to_date('2025-07-16','YYYY-MM-DD'), 4 );
insert into booking2 values ( 1005, to_date('2025-07-18','YYYY-MM-DD'), 5 );

insert into ratemodifier values ( 0, 1.0 );
insert into ratemodifier values ( 1, 0.9 );
insert into ratemodifier values ( 2, 1.1 );
insert into ratemodifier values ( 3, 0.8 );
insert into ratemodifier values ( 4, 1.2 );

insert into roomtype1 values ( 'Economy', 100.0 );
insert into roomtype1 values ( 'Standard', 150.0 );
insert into roomtype1 values ( 'Luxury', 300.0 );
insert into roomtype1 values ( 'Premium', 500.0 );
insert into roomtype1 values ( 'Rustic', 120.0 );

insert into roomtype2 values ( 'Single', 1, 'Economy' );
insert into roomtype2 values ( 'Double', 2, 'Standard' );
insert into roomtype2 values ( 'Suite', 4, 'Luxury' );
insert into roomtype2 values ( 'Penthouse', 6, 'Premium' );
insert into roomtype2 values ( 'Cabin', 3, 'Rustic' );

insert into hotel1 values ( 'A1B2C3', 'BC', 'Vancouver' );
insert into hotel1 values ( 'B2C3D4', 'AB', 'Calgary' );
insert into hotel1 values ( 'C3D4E5', 'ON', 'Toronto' );
insert into hotel1 values ( 'D4E5F6', 'QC', 'Montreal' );
insert into hotel1 values ( 'E5F6G7', 'NS', 'Halifax' );

insert into hotel2 values ( 'OceanView', 200, 'A1B2C3' );
insert into hotel2 values ( 'MountainInn', 150, 'B2C3D4' );
insert into hotel2 values ( 'CityCenter', 300, 'C3D4E5' );
insert into hotel2 values ( 'LakesideLodge', 100, 'D4E5F6' );
insert into hotel2 values ( 'HarborHotel', 180, 'E5F6G7' );

insert into offersroomtype values ( 'OceanView', 'Single', 20 );
insert into offersroomtype values ( 'MountainInn', 'Double', 15 );
insert into offersroomtype values ( 'CityCenter', 'Suite', 5 );
insert into offersroomtype values ( 'LakesideLodge', 'Cabin', 8 );
insert into offersroomtype values ( 'HarborHotel', 'Penthouse', 2 );

insert into ticket1 values ( to_date('2025-07-01','YYYY-MM-DD'), 8, to_date('2025-07-31','YYYY-MM-DD') );
insert into ticket1 values ( to_date('2025-08-01','YYYY-MM-DD'), 10, to_date('2025-08-31','YYYY-MM-DD') );
insert into ticket1 values ( to_date('2025-09-01','YYYY-MM-DD'), 6, to_date('2025-09-30','YYYY-MM-DD') );
insert into ticket1 values ( to_date('2025-10-01','YYYY-MM-DD'), 12, to_date('2025-10-31','YYYY-MM-DD') );
insert into ticket1 values ( to_date('2025-11-01','YYYY-MM-DD'), 4, to_date('2025-11-30','YYYY-MM-DD') );

insert into ticket2 values ( 5001, 1001, to_date('2025-07-01','YYYY-MM-DD'), 5, 8 );
insert into ticket2 values ( 5002, 1002, to_date('2025-08-01','YYYY-MM-DD'), 3, 10 );
insert into ticket2 values ( 5003, 1003, to_date('2025-09-01','YYYY-MM-DD'), 2, 6 );
insert into ticket2 values ( 5004, 1004, to_date('2025-10-01','YYYY-MM-DD'), 4, 12 );
insert into ticket2 values ( 5005, 1005, to_date('2025-11-01','YYYY-MM-DD'), 1, 4 );

insert into fastpassticket values ( 5001, 10, 8 );
insert into fastpassticket values ( 5002, 8, 10 );
insert into fastpassticket values ( 5003, 5, 6 );
insert into fastpassticket values ( 5004, 7, 12 );
insert into fastpassticket values ( 5005, 3, 4 );

insert into bookedwithratemodifier values ( 1, 1001 );
insert into bookedwithratemodifier values ( 2, 1002 );
insert into bookedwithratemodifier values ( 3, 1003 );
insert into bookedwithratemodifier values ( 4, 1004 );
insert into bookedwithratemodifier values ( 0, 1005 );

insert into hotelstay values ( 1, 2, to_date('2025-07-10','YYYY-MM-DD'), to_date('2025-07-12','YYYY-MM-DD'), 'OceanView', 'Single', 1001 );
insert into hotelstay values ( 2, 4, to_date('2025-07-12','YYYY-MM-DD'), to_date('2025-07-15','YYYY-MM-DD'), 'MountainInn', 'Double', 1002 );
insert into hotelstay values ( 3, 3, to_date('2025-07-14','YYYY-MM-DD'), to_date('2025-07-17','YYYY-MM-DD'), 'CityCenter', 'Suite', 1003 );
insert into hotelstay values ( 4, 2, to_date('2023-07-16','YYYY-MM-DD'), to_date('2023-07-18','YYYY-MM-DD'), 'LakesideLodge', 'Cabin', 1004 );
insert into hotelstay values ( 5, 5, to_date('2023-07-18','YYYY-MM-DD'), to_date('2023-07-21','YYYY-MM-DD'), 'HarborHotel', 'Penthouse', 1005 );


-- Old GUEST values before Trevor added more data
-- insert into guest values ( 1, to_date('2025-07-10','YYYY-MM-DD') );
-- insert into guest values ( 2, to_date('2025-07-12','YYYY-MM-DD') );
-- insert into guest values ( 3, to_date('2025-07-14','YYYY-MM-DD') );
-- insert into guest values ( 4, to_date('2023-07-16','YYYY-MM-DD') );
-- insert into guest values ( 5, to_date('2023-07-18','YYYY-MM-DD') );


-- January Visit
insert into guest values ( 6660, to_date('2023-01-07','YYYY-MM-DD') );
insert into guest values ( 776, to_date('2024-01-14','YYYY-MM-DD') );
insert into guest values ( 777,  to_date('2024-01-09','YYYY-MM-DD') );
insert into guest values ( 778, to_date('2024-01-02','YYYY-MM-DD') );
insert into guest values ( 779,  to_date('2024-01-25','YYYY-MM-DD') );
insert into guest values ( 7770,  to_date('2024-01-07','YYYY-MM-DD') );

-- February Visit
insert into guest values ( 886,  to_date('2022-02-14','YYYY-MM-DD') );
insert into guest values ( 887,  to_date('2022-02-09','YYYY-MM-DD') );
insert into guest values ( 888, to_date('2022-02-02','YYYY-MM-DD') );

-- March, April, May, June Visit
insert into guest values ( 889,  to_date('2023-03-25','YYYY-MM-DD') );
insert into guest values ( 8880, to_date('2019-04-07','YYYY-MM-DD') );
insert into guest values ( 6, to_date('2025-05-10','YYYY-MM-DD') );
insert into guest values ( 7, to_date('2025-06-11','YYYY-MM-DD') );

-- July Visit
insert into guest values ( 8, to_date('2025-07-12','YYYY-MM-DD') );
insert into guest values ( 9, to_date('2023-07-09','YYYY-MM-DD') );
insert into guest values ( 10, to_date('2023-07-18','YYYY-MM-DD') );

-- August Visit
insert into guest values ( 226, to_date('2024-08-14','YYYY-MM-DD') );
insert into guest values ( 227, to_date('2024-08-09','YYYY-MM-DD') );
insert into guest values ( 228, to_date('2024-08-02','YYYY-MM-DD') );
insert into guest values ( 229, to_date('2024-08-22','YYYY-MM-DD') );
insert into guest values ( 330, to_date('2024-08-07','YYYY-MM-DD') );
insert into guest values ( 336,  to_date('2024-08-07','YYYY-MM-DD') );
insert into guest values ( 337,  to_date('2024-08-07','YYYY-MM-DD') );

-- September Visit
insert into guest values ( 338,  to_date('2024-09-02','YYYY-MM-DD') );
insert into guest values ( 339,  to_date('2024-09-25','YYYY-MM-DD') );

-- October Visit
insert into guest values ( 340,  to_date('2024-10-07','YYYY-MM-DD') );
insert into guest values ( 446,  to_date('2023-10-14','YYYY-MM-DD') );
insert into guest values ( 447,  to_date('2023-10-09','YYYY-MM-DD') );
insert into guest values ( 448,  to_date('2023-10-02','YYYY-MM-DD') );
insert into guest values ( 449,  to_date('2023-10-25','YYYY-MM-DD') );
insert into guest values ( 4440, to_date('2023-10-07','YYYY-MM-DD') );

-- November Visit
insert into guest values ( 556,  to_date('2022-11-14','YYYY-MM-DD') );
insert into guest values ( 557, to_date('2022-11-09','YYYY-MM-DD') );
insert into guest values ( 558, to_date('2022-11-02','YYYY-MM-DD') );
insert into guest values ( 559, to_date('2023-11-25','YYYY-MM-DD') );
insert into guest values ( 5550, to_date('2024-11-07','YYYY-MM-DD') );


-- December Visit
insert into guest values ( 666, to_date('2023-12-14','YYYY-MM-DD') );
insert into guest values ( 667, to_date('2023-12-09','YYYY-MM-DD') );
insert into guest values ( 668, to_date('2023-12-02','YYYY-MM-DD') );
insert into guest values ( 669, to_date('2023-12-25','YYYY-MM-DD') );

insert into seasonpass2 values ( 9001, 'Gold', to_date('2025-01-01','YYYY-MM-DD'), to_date('2025-12-31','YYYY-MM-DD'), 101 );
insert into seasonpass2 values ( 9002, 'Silver', to_date('2025-04-01','YYYY-MM-DD'), to_date('2025-03-31','YYYY-MM-DD'), 102 );
insert into seasonpass2 values ( 9003, 'Bronze', to_date('2025-06-01','YYYY-MM-DD'), to_date('2025-05-31','YYYY-MM-DD'), 103 );
insert into seasonpass2 values ( 9004, 'Platinum', to_date('2025-02-01','YYYY-MM-DD'), to_date('2025-01-31','YYYY-MM-DD'), 104 );
insert into seasonpass2 values ( 9005, 'Member', to_date('2025-03-01','YYYY-MM-DD'), to_date('2025-02-28','YYYY-MM-DD'), 105 );

insert into seasonpass1 values ( 'Gold', to_date('2025-01-01','YYYY-MM-DD'), to_date('2025-12-31','YYYY-MM-DD') );
insert into seasonpass1 values ( 'Silver', to_date('2025-04-01','YYYY-MM-DD'), to_date('2025-03-31','YYYY-MM-DD') );
insert into seasonpass1 values ( 'Bronze', to_date('2025-06-01','YYYY-MM-DD'), to_date('2025-05-31','YYYY-MM-DD') );
insert into seasonpass1 values ( 'Platinum', to_date('2025-02-01','YYYY-MM-DD'), to_date('2025-01-31','YYYY-MM-DD') );
insert into seasonpass1 values ( 'Member', to_date('2025-03-01','YYYY-MM-DD'), to_date('2025-02-28','YYYY-MM-DD') );

insert into seasonpassspecial values ( 9001, 1 );
insert into seasonpassspecial values ( 9002, 2 );
insert into seasonpassspecial values ( 9003, 3 );
insert into seasonpassspecial values ( 9004, 4 );
insert into seasonpassspecial values ( 9005, 0 );

insert into maintenancerecord1 values ( 'Oil Change', 2 );
insert into maintenancerecord1 values ( 'Brake Inspection', 3 );
insert into maintenancerecord1 values ( 'Structural Check', 4 );
insert into maintenancerecord1 values ( 'Electrical Test', 2 );
insert into maintenancerecord1 values ( 'Safety Audit', 5 );

insert into maintenancerecord2 values ( 'RollerCoaster', 1, 'Oil Change', to_date('2025-01-10','YYYY-MM-DD') );
insert into maintenancerecord2 values ( 'FerrisWheel', 1, 'Brake Inspection', to_date('2025-02-20','YYYY-MM-DD') );
insert into maintenancerecord2 values ( 'HauntedHouse', 1, 'Structural Check', to_date('2025-03-05','YYYY-MM-DD') );
insert into maintenancerecord2 values ( 'LogFlume', 1, 'Electrical Test', to_date('2025-04-11','YYYY-MM-DD') );
insert into maintenancerecord2 values ( 'BumperCars', 1, 'Safety Audit', to_date('2025-05-22','YYYY-MM-DD') );

insert into forride values ( 'RollerCoaster', 5001 );
insert into forride values ( 'FerrisWheel', 5002 );
insert into forride values ( 'HauntedHouse', 5003 );
insert into forride values ( 'LogFlume', 5004 );
insert into forride values ( 'BumperCars', 5005 );

