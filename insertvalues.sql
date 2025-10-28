insert into ride values ( 'RollerCoaster',
                          40,
                          to_date('2015-06-01','YYYY-MM-DD') );
insert into ride values ( 'FerrisWheel',
                          30,
                          to_date('2010-04-12','YYYY-MM-DD') );
insert into ride values ( 'HauntedHouse',
                          20,
                          to_date('2018-10-10','YYYY-MM-DD') );
insert into ride values ( 'LogFlume',
                          25,
                          to_date('2012-07-21','YYYY-MM-DD') );
insert into ride values ( 'BumperCars',
                          15,
                          to_date('2011-09-14','YYYY-MM-DD') );

insert into customer values ( 1,
                              'Alice Johnson',
                              'F',
                              to_date('1990-05-14','YYYY-MM-DD') );
insert into customer values ( 2,
                              'Bob Smith',
                              'M',
                              to_date('1988-08-09','YYYY-MM-DD') );
insert into customer values ( 3,
                              'Carol White',
                              'F',
                              to_date('1995-11-02','YYYY-MM-DD') );
insert into customer values ( 4,
                              'David Brown',
                              'M',
                              to_date('2000-01-25','YYYY-MM-DD') );
insert into customer values ( 5,
                              'Eve Davis',
                              'F',
                              to_date('1993-03-07','YYYY-MM-DD') );

insert into loyaltymember values ( 1,
                                   101,
                                   120,
                                   10001 );
insert into loyaltymember values ( 2,
                                   102,
                                   80,
                                   10002 );
insert into loyaltymember values ( 3,
                                   103,
                                   200,
                                   10003 );
insert into loyaltymember values ( 4,
                                   104,
                                   0,
                                   10004 );
insert into loyaltymember values ( 5,
                                   105,
                                   50,
                                   10005 );

insert into booking1 values ( to_date('2025-07-10','YYYY-MM-DD'),
                              120 );
insert into booking1 values ( to_date('2025-07-12','YYYY-MM-DD'),
                              90 );
insert into booking1 values ( to_date('2025-07-14','YYYY-MM-DD'),
                              150 );
insert into booking1 values ( to_date('2025-07-16','YYYY-MM-DD'),
                              110 );
insert into booking1 values ( to_date('2025-07-18','YYYY-MM-DD'),
                              200 );

insert into booking2 values ( 1001,
                              to_date('2025-07-10','YYYY-MM-DD'),
                              1 );
insert into booking2 values ( 1002,
                              to_date('2025-07-12','YYYY-MM-DD'),
                              2 );
insert into booking2 values ( 1003,
                              to_date('2025-07-14','YYYY-MM-DD'),
                              3 );
insert into booking2 values ( 1004,
                              to_date('2025-07-16','YYYY-MM-DD'),
                              4 );
insert into booking2 values ( 1005,
                              to_date('2025-07-18','YYYY-MM-DD'),
                              5 );

insert into ratemodifier values ( 0,
                                  1.0 );
insert into ratemodifier values ( 1,
                                  0.9 );
insert into ratemodifier values ( 2,
                                  1.1 );
insert into ratemodifier values ( 3,
                                  0.8 );
insert into ratemodifier values ( 4,
                                  1.2 );

insert into roomtype1 values ( 'Economy',
                               100.0 );
insert into roomtype1 values ( 'Standard',
                               150.0 );
insert into roomtype1 values ( 'Luxury',
                               300.0 );
insert into roomtype1 values ( 'Premium',
                               500.0 );
insert into roomtype1 values ( 'Rustic',
                               120.0 );

insert into roomtype2 values ( 'Single',
                               1,
                               'Economy' );
insert into roomtype2 values ( 'Double',
                               2,
                               'Standard' );
insert into roomtype2 values ( 'Suite',
                               4,
                               'Luxury' );
insert into roomtype2 values ( 'Penthouse',
                               6,
                               'Premium' );
insert into roomtype2 values ( 'Cabin',
                               3,
                               'Rustic' );

insert into hotel1 values ( 'A1B2C3',
                            'BC',
                            'Vancouver' );
insert into hotel1 values ( 'B2C3D4',
                            'AB',
                            'Calgary' );
insert into hotel1 values ( 'C3D4E5',
                            'ON',
                            'Toronto' );
insert into hotel1 values ( 'D4E5F6',
                            'QC',
                            'Montreal' );
insert into hotel1 values ( 'E5F6G7',
                            'NS',
                            'Halifax' );

insert into hotel2 values ( 'OceanView',
                            200,
                            'A1B2C3' );
insert into hotel2 values ( 'MountainInn',
                            150,
                            'B2C3D4' );
insert into hotel2 values ( 'CityCenter',
                            300,
                            'C3D4E5' );
insert into hotel2 values ( 'LakesideLodge',
                            100,
                            'D4E5F6' );
insert into hotel2 values ( 'HarborHotel',
                            180,
                            'E5F6G7' );

insert into offersroomtype values ( 'OceanView',
                                    'Single',
                                    20 );
insert into offersroomtype values ( 'MountainInn',
                                    'Double',
                                    15 );
insert into offersroomtype values ( 'CityCenter',
                                    'Suite',
                                    5 );
insert into offersroomtype values ( 'LakesideLodge',
                                    'Cabin',
                                    8 );
insert into offersroomtype values ( 'HarborHotel',
                                    'Penthouse',
                                    2 );

insert into ticket1 values ( to_date('2025-07-01','YYYY-MM-DD'),
                             8,
                             to_date('2025-07-31','YYYY-MM-DD') );
insert into ticket1 values ( to_date('2025-08-01','YYYY-MM-DD'),
                             10,
                             to_date('2025-08-31','YYYY-MM-DD') );
insert into ticket1 values ( to_date('2025-09-01','YYYY-MM-DD'),
                             6,
                             to_date('2025-09-30','YYYY-MM-DD') );
insert into ticket1 values ( to_date('2025-10-01','YYYY-MM-DD'),
                             12,
                             to_date('2025-10-31','YYYY-MM-DD') );
insert into ticket1 values ( to_date('2025-11-01','YYYY-MM-DD'),
                             4,
                             to_date('2025-11-30','YYYY-MM-DD') );

insert into ticket2 values ( 5001,
                             1001,
                             to_date('2025-07-01','YYYY-MM-DD'),
                             5,
                             8 );
insert into ticket2 values ( 5002,
                             1002,
                             to_date('2025-08-01','YYYY-MM-DD'),
                             3,
                             10 );
insert into ticket2 values ( 5003,
                             1003,
                             to_date('2025-09-01','YYYY-MM-DD'),
                             2,
                             6 );
insert into ticket2 values ( 5004,
                             1004,
                             to_date('2025-10-01','YYYY-MM-DD'),
                             4,
                             12 );
insert into ticket2 values ( 5005,
                             1005,
                             to_date('2025-11-01','YYYY-MM-DD'),
                             1,
                             4 );

insert into fastpassticket values ( 5001,
                                    10,
                                    8 );
insert into fastpassticket values ( 5002,
                                    8,
                                    10 );
insert into fastpassticket values ( 5003,
                                    5,
                                    6 );
insert into fastpassticket values ( 5004,
                                    7,
                                    12 );
insert into fastpassticket values ( 5005,
                                    3,
                                    4 );

insert into bookedwithratemodifier values ( 1,
                                            1001 );
insert into bookedwithratemodifier values ( 2,
                                            1002 );
insert into bookedwithratemodifier values ( 3,
                                            1003 );
insert into bookedwithratemodifier values ( 4,
                                            1004 );
insert into bookedwithratemodifier values ( 0,
                                            1005 );

insert into hotelstay values ( 1,
                               2,
                               to_date('2025-07-10','YYYY-MM-DD'),
                               to_date('2025-07-12','YYYY-MM-DD'),
                               'OceanView',
                               'Single',
                               1001 );
insert into hotelstay values ( 2,
                               4,
                               to_date('2025-07-12','YYYY-MM-DD'),
                               to_date('2025-07-15','YYYY-MM-DD'),
                               'MountainInn',
                               'Double',
                               1002 );
insert into hotelstay values ( 3,
                               3,
                               to_date('2025-07-14','YYYY-MM-DD'),
                               to_date('2025-07-17','YYYY-MM-DD'),
                               'CityCenter',
                               'Suite',
                               1003 );
insert into hotelstay values ( 4,
                               2,
                               to_date('2023-07-16','YYYY-MM-DD'),
                               to_date('2023-07-18','YYYY-MM-DD'),
                               'LakesideLodge',
                               'Cabin',
                               1004 );
insert into hotelstay values ( 5,
                               5,
                               to_date('2023-07-18','YYYY-MM-DD'),
                               to_date('2023-07-21','YYYY-MM-DD'),
                               'HarborHotel',
                               'Penthouse',
                               1005 );

insert into guest values ( 1,
                           to_date('2025-07-10','YYYY-MM-DD') );
insert into guest values ( 2,
                           to_date('2025-07-12','YYYY-MM-DD') );
insert into guest values ( 3,
                           to_date('2025-07-14','YYYY-MM-DD') );
insert into guest values ( 4,
                           to_date('2023-07-16','YYYY-MM-DD') );
insert into guest values ( 5,
                           to_date('2023-07-18','YYYY-MM-DD') );

insert into seasonpass2 values ( 9001,
                                 'Gold',
                                 to_date('2025-01-01','YYYY-MM-DD'),
                                 to_date('2025-12-31','YYYY-MM-DD'),
                                 101 );
insert into seasonpass2 values ( 9002,
                                 'Silver',
                                 to_date('2025-04-01','YYYY-MM-DD'),
                                 to_date('2025-03-31','YYYY-MM-DD'),
                                 102 );
insert into seasonpass2 values ( 9003,
                                 'Bronze',
                                 to_date('2025-06-01','YYYY-MM-DD'),
                                 to_date('2025-05-31','YYYY-MM-DD'),
                                 103 );
insert into seasonpass2 values ( 9004,
                                 'Platinum',
                                 to_date('2025-02-01','YYYY-MM-DD'),
                                 to_date('2025-01-31','YYYY-MM-DD'),
                                 104 );
insert into seasonpass2 values ( 9005,
                                 'Member',
                                 to_date('2025-03-01','YYYY-MM-DD'),
                                 to_date('2025-02-28','YYYY-MM-DD'),
                                 105 );

insert into seasonpass1 values ( 'Gold',
                                 to_date('2025-01-01','YYYY-MM-DD'),
                                 to_date('2025-12-31','YYYY-MM-DD') );
insert into seasonpass1 values ( 'Silver',
                                 to_date('2025-04-01','YYYY-MM-DD'),
                                 to_date('2025-03-31','YYYY-MM-DD') );
insert into seasonpass1 values ( 'Bronze',
                                 to_date('2025-06-01','YYYY-MM-DD'),
                                 to_date('2025-05-31','YYYY-MM-DD') );
insert into seasonpass1 values ( 'Platinum',
                                 to_date('2025-02-01','YYYY-MM-DD'),
                                 to_date('2025-01-31','YYYY-MM-DD') );
insert into seasonpass1 values ( 'Member',
                                 to_date('2025-03-01','YYYY-MM-DD'),
                                 to_date('2025-02-28','YYYY-MM-DD') );

insert into seasonpassspecial values ( 9001,
                                       1 );
insert into seasonpassspecial values ( 9002,
                                       2 );
insert into seasonpassspecial values ( 9003,
                                       3 );
insert into seasonpassspecial values ( 9004,
                                       4 );
insert into seasonpassspecial values ( 9005,
                                       0 );

insert into maintenancerecord1 values ( 'Oil Change',
                                        2 );
insert into maintenancerecord1 values ( 'Brake Inspection',
                                        3 );
insert into maintenancerecord1 values ( 'Structural Check',
                                        4 );
insert into maintenancerecord1 values ( 'Electrical Test',
                                        2 );
insert into maintenancerecord1 values ( 'Safety Audit',
                                        5 );

insert into maintenancerecord2 values ( 'RollerCoaster',
                                        1,
                                        'Oil Change',
                                        to_date('2025-01-10','YYYY-MM-DD') );
insert into maintenancerecord2 values ( 'FerrisWheel',
                                        1,
                                        'Brake Inspection',
                                        to_date('2025-02-20','YYYY-MM-DD') );
insert into maintenancerecord2 values ( 'HauntedHouse',
                                        1,
                                        'Structural Check',
                                        to_date('2025-03-05','YYYY-MM-DD') );
insert into maintenancerecord2 values ( 'LogFlume',
                                        1,
                                        'Electrical Test',
                                        to_date('2025-04-11','YYYY-MM-DD') );
insert into maintenancerecord2 values ( 'BumperCars',
                                        1,
                                        'Safety Audit',
                                        to_date('2025-05-22','YYYY-MM-DD') );

insert into forride values ( 'RollerCoaster',
                             5001 );
insert into forride values ( 'FerrisWheel',
                             5002 );
insert into forride values ( 'HauntedHouse',
                             5003 );
insert into forride values ( 'LogFlume',
                             5004 );
insert into forride values ( 'BumperCars',
                             5005 );

