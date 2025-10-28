-- Ride
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

-- Customer
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

-- LoyaltyMember (depends on Customer)
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

-- Booking1 (parent of Booking2)
insert into booking1 values ( to_date('2023-07-10','YYYY-MM-DD'),
                              120 );
insert into booking1 values ( to_date('2023-07-12','YYYY-MM-DD'),
                              90 );
insert into booking1 values ( to_date('2023-07-14','YYYY-MM-DD'),
                              150 );
insert into booking1 values ( to_date('2023-07-16','YYYY-MM-DD'),
                              110 );
insert into booking1 values ( to_date('2023-07-18','YYYY-MM-DD'),
                              200 );

-- Booking2 (references Booking1 and Customer)
insert into booking2 values ( 1001,
                              to_date('2023-07-10','YYYY-MM-DD'),
                              1 );
insert into booking2 values ( 1002,
                              to_date('2023-07-12','YYYY-MM-DD'),
                              2 );
insert into booking2 values ( 1003,
                              to_date('2023-07-14','YYYY-MM-DD'),
                              3 );
insert into booking2 values ( 1004,
                              to_date('2023-07-16','YYYY-MM-DD'),
                              4 );
insert into booking2 values ( 1005,
                              to_date('2023-07-18','YYYY-MM-DD'),
                              5 );

-- RateModifier
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

-- RoomType
-- Room type categories (roomtype1: category, baserate)
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

-- Individual room types (roomtype2: roomname, maxguests, category)
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

-- Hotel1
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

-- Hotel2
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

-- OffersRoomType (depends on Hotel2 and RoomType2)
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

-- Ticket1
-- Ticket1 columns: validfrom DATE, validhours INTEGER, validuntil DATE
insert into ticket1 values ( to_date('2023-07-01','YYYY-MM-DD'),
                             8,
                             to_date('2023-07-31','YYYY-MM-DD') );
insert into ticket1 values ( to_date('2023-08-01','YYYY-MM-DD'),
                             10,
                             to_date('2023-08-31','YYYY-MM-DD') );
insert into ticket1 values ( to_date('2023-09-01','YYYY-MM-DD'),
                             6,
                             to_date('2023-09-30','YYYY-MM-DD') );
insert into ticket1 values ( to_date('2023-10-01','YYYY-MM-DD'),
                             12,
                             to_date('2023-10-31','YYYY-MM-DD') );
insert into ticket1 values ( to_date('2023-11-01','YYYY-MM-DD'),
                             4,
                             to_date('2023-11-30','YYYY-MM-DD') );

-- Ticket2
insert into ticket2 values ( 5001,
                             1001,
                             to_date('2023-07-01','YYYY-MM-DD'),
                             5,
                             8 );
insert into ticket2 values ( 5002,
                             1002,
                             to_date('2023-08-01','YYYY-MM-DD'),
                             3,
                             10 );
insert into ticket2 values ( 5003,
                             1003,
                             to_date('2023-09-01','YYYY-MM-DD'),
                             2,
                             6 );
insert into ticket2 values ( 5004,
                             1004,
                             to_date('2023-10-01','YYYY-MM-DD'),
                             4,
                             12 );
insert into ticket2 values ( 5005,
                             1005,
                             to_date('2023-11-01','YYYY-MM-DD'),
                             1,
                             4 );

-- FastPassTicket
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

-- BookedWithRateModifier (depends on RateModifier and Booking2)
insert into bookedwithratemodifier values ( 1,
                                            1001 );
insert into bookedwithratemodifier values ( 2,
                                            1002 );
insert into bookedwithratemodifier values ( 3,
                                            1003 );

-- HotelStay (depends on Booking2, Hotel2, RoomType2)
insert into hotelstay values ( 1,
                               2,
                               to_date('2023-07-10','YYYY-MM-DD'),
                               to_date('2023-07-12','YYYY-MM-DD'),
                               'OceanView',
                               'Single',
                               1001 );
insert into hotelstay values ( 2,
                               4,
                               to_date('2023-07-12','YYYY-MM-DD'),
                               to_date('2023-07-15','YYYY-MM-DD'),
                               'MountainInn',
                               'Double',
                               1002 );
insert into hotelstay values ( 3,
                               3,
                               to_date('2023-07-14','YYYY-MM-DD'),
                               to_date('2023-07-17','YYYY-MM-DD'),
                               'CityCenter',
                               'Suite',
                               1003 );

-- Guest (depends on Customer)
insert into guest values ( 1,
                           to_date('2023-07-10','YYYY-MM-DD') );
insert into guest values ( 2,
                           to_date('2023-07-12','YYYY-MM-DD') );
insert into guest values ( 3,
                           to_date('2023-07-14','YYYY-MM-DD') );

-- MaintenanceRecord1
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