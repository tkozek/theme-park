/*
When looking at this SQL file, there are 2 parts
1. Table Initializations
  - FK ON X justifications are done as comments
2. Insert statements
*/

-- 1. Table Initializations
CREATE TABLE Ride (
  RideName      VARCHAR(255) PRIMARY KEY,
  Capacity      INTEGER,       -- should CHECK (Capacity > 0)
  InstallDate   DATE
);

CREATE TABLE Customer (
  CustomerID    INTEGER PRIMARY KEY,
  CustomerName  VARCHAR(255),
  Sex           VARCHAR(255),
  DOB           DATE
);

CREATE TABLE Booking2 (
  BookingNumber INTEGER PRIMARY KEY,
  BookingDate   DATE, 
  CustomerID    INTEGER,        -- should CHECK (Cost >= 0)
  CONSTRAINT fk_customer FOREIGN KEY (CustomerID) 
    REFERENCES Customer(CustomerID)
    -- Bookings should be kept even if a customer deletes their account
    ON DELETE SET NULL
    -- Bookings should follow the same customer even if their ID changes
    ON UPDATE CASCADE,
  CONSTRAINT fk_booking1 FOREIGN KEY (BookingDate) 
    REFERENCES Booking1(BookingDate)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

CREATE TABLE Booking1 (
  BookingDate   DATE PRIMARY KEY,
  Cost          INTEGER       -- should CHECK (Cost >= 0)
);

CREATE TABLE RateModifier (
  RateCode      INTEGER PRIMARY KEY,
  Modifier      FLOAT DEFAULT 1.0
);

CREATE TABLE RoomType2 (
  RoomName      VARCHAR(255) PRIMARY KEY,
  MaxGuests     INTEGER,       -- should CHECK (MaxGuests > 0)
  Category      VARCHAR(255),
  CONSTRAINT fk_roomtype1 FOREIGN KEY (Category)
    REFERENCES RoomType1 (Category)
    -- if a room type is deleted, we should set it to null
    ON DELETE SET NULL
    -- roomtypes should follow changes in base rate, so cascade
    ON UPDATE CASCADE
);

CREATE TABLE RoomType1 (
  Category      VARCHAR(255) PRIMARY KEY,
  BaseRate      FLOAT
);


CREATE TABLE Hotel2 (
  HotelName     VARCHAR(255) PRIMARY KEY,
  MaxGuests     INTEGER,
  PostalCode    VARCHAR(255),
  CONSTRAINT fk_hotel2 FOREIGN KEY (PostalCode)
    REFERENCES Hotel2 (PostalCode)
    -- if postal codes are deleted, we should still keep the info
    ON DELETE SET NULL
    -- it should follow changes in postal codes
    ON UPDATE CASCADE
);

CREATE TABLE Hotel1 (
  PostalCode    VARCHAR(255) PRIMARY KEY,
  Province      VARCHAR(255),
  City          VARCHAR(255)
);

CREATE TABLE Ticket2 (
  TicketID      INTEGER PRIMARY KEY,
  BookingNumber INTEGER,
  ValidFrom     DATE,
  RemainingUses INTEGER,       -- should CHECK (RemainingUses >= 0)
  ValidHours    INTEGER,       -- should CHECK (ValidHours >= 0)
  CONSTRAINT fk_ticket2_booking FOREIGN KEY (BookingNumber)
    REFERENCES Booking2 (BookingNumber)
    -- When bookings are deleted(like a cancellation or refund), any associated tickets should be deleted as well
    ON DELETE CASCADE
    -- Booking numbers should not be updated, in cases where they are, tickets that reference them should still reference the same booking 
    ON UPDATE CASCADE,
  CONSTRAINT fk_ticket2_ticket1 FOREIGN KEY (ValidFrom, ValidHours)
    REFERENCES Ticket1 (ValidFrom, ValidHours)
    -- When tickets are deleted, they should be cascaded in all locations
    ON DELETE CASCADE
    -- Ticket2s should follow Ticket1 even when/if it changes 
    ON UPDATE CASCADE
);

CREATE TABLE Ticket1 (
  ValidFrom     DATE,
  ValidUntil    DATE,
  ValidHours    INTEGER,       -- should CHECK (ValidHours >= 0)
  PRIMARY KEY (ValidFrom, ValidHours)
);

CREATE TABLE FastPassTicket (
  TicketID      INTEGER PRIMARY KEY,
  NumberOfRides INTEGER,       -- should CHECK (NumberOfRides >= 0)
  ValidHours    INTEGER,       -- should CHECK (ValidHours >= 0)
  CONSTRAINT fk_fastpass_ticket FOREIGN KEY (TicketID)
    REFERENCES Ticket2 (TicketID)
    -- When tickets IDs are changed, they should still be fastpass tickets
    ON UPDATE CASCADE
    -- When tickets are deleted, the associated fastpass information should also be deleted
    ON DELETE CASCADE
);

CREATE TABLE LoyaltyMember (
  CustomerID    INTEGER PRIMARY KEY,
  LoyaltyID     INTEGER UNIQUE,
  Points        INTEGER DEFAULT 0,  -- should CHECK (Points >= 0)
  UUID          INTEGER UNIQUE,
  CONSTRAINT fk_customerid FOREIGN KEY (CustomerID) 
    REFERENCES Customer(CustomerID)
    -- Should always reference some customer
    ON UPDATE CASCADE 
    -- We should delete customer records when a customer deletes their information
    ON DELETE CASCADE
);

CREATE TABLE SeasonPass2 (
  UUID            INTEGER PRIMARY KEY,
  SeasonPassLevel VARCHAR(255),
  SeasonStart     DATE,
  SeasonEnd       DATE,
  LoyaltyID       INTEGER UNIQUE NOT NULL,
  CONSTRAINT fk_seasonpass_loyalty FOREIGN KEY (LoyaltyID)
    REFERENCES LoyaltyMember (LoyaltyID)
    -- Should never be triggered, but SeasonPasses should be tied to one user
    ON UPDATE CASCADE
    -- When a user deletes their account, any associations like SeasonPasses should also be deleted
    ON DELETE CASCADE
);

CREATE TABLE SeasonPass1 (
  SeasonPassLevel VARCHAR(255),
  SeasonStart     DATE,
  SeasonEnd       DATE,
  PRIMARY KEY (SeasonPassLevel, SeasonStart),
  CONSTRAINT fk_seasonpass2 FOREIGN KEY (SeasonPassLevel, SeasonStart)
    REFERENCES SeasonPass2 (SeasonPassLevel, SeasonStart)
    -- Should never be deleted, but keep around for record
    -- Should still reference the same SeasonPass2
    ON UPDATE CASCADE
);



CREATE TABLE SeasonPassSpecial (
  UUID       INTEGER,
  RateCode   INTEGER,
  PRIMARY KEY (UUID, RateCode),
  CONSTRAINT fk_sps_seasonpass FOREIGN KEY (UUID)
    REFERENCES SeasonPass2 (UUID)
    -- Should never be triggered, SeasonPass should be immutable after insertion
    ON DELETE SET NULL
    -- Should never be triggered, but a SeasonPassSpecial should still be connected to the same UUID even if it changes
    ON UPDATE CASCADE,
  CONSTRAINT fk_sps_ratemodifier FOREIGN KEY (RateCode)
    REFERENCES RateModifier (RateCode)
    -- When a RateModifier is deleted, any associated SeasonPassSpecials should also be deleted
    ON DELETE CASCADE
    -- When a RateModifier's RateCode is changed, any associated SeasonPassSpecials should still reference the same RateCode
    ON UPDATE CASCADE
);

CREATE TABLE BookedWithRateModifier (
  RateCode      INTEGER DEFAULT 0,
  BookingNumber INTEGER,
  PRIMARY KEY (RateCode, BookingNumber),
  CONSTRAINT fk_bwrm_rate FOREIGN KEY (RateCode)
    REFERENCES RateModifier (RateCode)
    -- Bookings should always point to the same RateCode, even if that ratecode is changed
    ON UPDATE CASCADE
  -- Bookings booked with rate modifiers point to a default ratecode with Modifier=1.0 when its ratecode is deleted 
    ON DELETE SET DEFAULT,
  CONSTRAINT fk_bwrm_booking FOREIGN KEY (BookingNumber)
    REFERENCES Booking2 (BookingNumber)
    -- When booking are deleted, references to it become invalid so should be deleted too
    ON DELETE CASCADE
);

CREATE TABLE OffersRoomType (
  HotelName     VARCHAR(255),
  RoomName      VARCHAR(255),
  Quantity      INTEGER,       -- should CHECK (Quantity >= 0)
  PRIMARY KEY (HotelName, RoomName),
  CONSTRAINT fk_offers_hotel FOREIGN KEY (HotelName)
    REFERENCES Hotel2 (HotelName)
    -- Hotels should never be deleted, but in that case that it is, the Roomtypes offered should be saved for history reasons
    ON DELETE SET NULL,
  CONSTRAINT fk_offers_room FOREIGN KEY (RoomName)
    REFERENCES RoomType2 (RoomName)
    -- Roomtypes should never be deleted, but if they are they should be kept for history reasons
    ON DELETE SET NULL
);

CREATE TABLE HotelStay (
  HotelBookingID INTEGER PRIMARY KEY,
  NumGuests      INTEGER,       -- should CHECK (NumGuests > 0)
  CheckInDate    DATE,
  CheckOutDate   DATE,
  HotelName      VARCHAR(255) NOT NULL,
  RoomName       VARCHAR(255) NOT NULL,
  BookingNumber  INTEGER NOT NULL,
  CONSTRAINT fk_hs_hotel FOREIGN KEY (HotelName)
    REFERENCES Hotel2 (HotelName)
    -- if a hotel is deleted, hotel stays should be kept for historical reasons
    ON DELETE SET NULL
    -- if a hotel changes its name, the new name should be used for all records for consistency
    ON UPDATE CASCADE,
  CONSTRAINT fk_hs_room FOREIGN KEY (RoomName)
    REFERENCES RoomType2 (RoomName)
    -- if a roomtype is deleted, we should keep the stays 
    ON DELETE SET NULL
    -- if the name of a roomtype changes, we should update records to reflect the new name
    ON UPDATE CASCADE,
  CONSTRAINT fk_hs_booking FOREIGN KEY (BookingNumber)
    REFERENCES Booking2 (BookingNumber)
    -- If a booking is deleted, the hotel stay associated with it is no longer valid, so should be deleted
    ON DELETE CASCADE
    -- If a booking is updated, it's hotel stay should stay attached to it 
    ON UPDATE CASCADE
);

CREATE TABLE ForRide (
  RideName  VARCHAR(255),
  TicketID  INTEGER,
  PRIMARY KEY (RideName, TicketID),
  CONSTRAINT fk_forride_ride FOREIGN KEY (RideName)
    REFERENCES Ride (RideName)
    -- When Rides are deleted(should never be), we should keep the ticket association with the ride just in case
    ON DELETE SET NULL
    -- When RideNames are updated(should never be), the tickets should still be for the same ride
    ON UPDATE CASCADE,
  CONSTRAINT fk_forride_ticket FOREIGN KEY (TicketID)
    REFERENCES Ticket2 (TicketID)
    -- When tickets are deleted(like when a booking is deleted/refunded), their associations to some ride should be deleted too
    ON DELETE CASCADE
    -- When tickets are updated(should never be), their associations to some ride should be attached to the same ticket
    ON UPDATE CASCADE
);

CREATE TABLE MaintenanceRecord1 (
  MaintenancePerformed VARCHAR(255) PRIMARY KEY,
  NumberOfWorkers      INTEGER        -- should CHECK (NumberOfWorkers >= 0)
);

CREATE TABLE MaintenanceRecord2 (
  RideName             VARCHAR(255),
  RecordID             INTEGER,
  MaintenancePerformed VARCHAR(255),
  MaintenanceDate      DATE,
  PRIMARY KEY (RideName, RecordID),
  CONSTRAINT fk_mr2_ride FOREIGN KEY (RideName)
    REFERENCES Ride (RideName)
    -- When rides are deleted, their maintenance records should be deleted too 
    ON DELETE CASCADE
    -- When ride names are updated(should never happen), their maintenance records should still be for the same ride
    ON UPDATE CASCADE
);

CREATE TABLE Guest (
  CustomerID  INTEGER,
  DateOfVisit DATE,
  PRIMARY KEY (CustomerID),
  CONSTRAINT fk_guest_customer FOREIGN KEY (CustomerID)
    REFERENCES Customer (CustomerID)
    -- When a customer is deleted, their Guest info should be deleted too(Data Privacy reasons)
    ON DELETE CASCADE
    -- Guests should always be attached to the same Customer object
    ON UPDATE CASCADE
);

-- 2. Insert Statements
-- Ride
INSERT INTO Ride VALUES ('RollerCoaster', 40, TO_DATE('2015-06-01'));
INSERT INTO Ride VALUES ('FerrisWheel', 30, TO_DATE(TO_DATE('2010-04-12')));
INSERT INTO Ride VALUES ('HauntedHouse', 20, TO_DATE('2018-10-10'));
INSERT INTO Ride VALUES ('LogFlume', 25, TO_DATE('2012-07-21'));
INSERT INTO Ride VALUES ('BumperCars', 15, TO_DATE('2011-09-14'));

-- Customer
INSERT INTO Customer VALUES (1, 'Alice Johnson', 'F', TO_DATE('1990-05-14'));
INSERT INTO Customer VALUES (2, 'Bob Smith', 'M', TO_DATE('1988-08-09'));
INSERT INTO Customer VALUES (3, 'Carol White', 'F', TO_DATE('1995-11-02'));
INSERT INTO Customer VALUES (4, 'David Brown', 'M', TO_DATE('2000-01-25'));
INSERT INTO Customer VALUES (5, 'Eve Davis', 'F', TO_DATE('1993-03-07'));

-- Booking2
INSERT INTO Booking2 VALUES (1001, TO_DATE('2023-07-10'), 1);
INSERT INTO Booking2 VALUES (1002, TO_DATE('2023-07-12'), 2);
INSERT INTO Booking2 VALUES (1003, TO_DATE('2023-07-14'), 3);
INSERT INTO Booking2 VALUES (1004, TO_DATE('2023-07-16'), 4);
INSERT INTO Booking2 VALUES (1005, TO_DATE('2023-07-18'), 5);

-- Booking1
INSERT INTO Booking1 VALUES (TO_DATE('2023-07-10'), 120);
INSERT INTO Booking1 VALUES (TO_DATE('2023-07-12'), 90);
INSERT INTO Booking1 VALUES (TO_DATE('2023-07-14'), 150);
INSERT INTO Booking1 VALUES (TO_DATE('2023-07-16'), 110);
INSERT INTO Booking1 VALUES (TO_DATE('2023-07-18'), 200);

-- RateModifier
INSERT INTO RateModifier VALUES (0, 1.0);
INSERT INTO RateModifier VALUES (1, 0.9);
INSERT INTO RateModifier VALUES (2, 1.1);
INSERT INTO RateModifier VALUES (3, 0.8);
INSERT INTO RateModifier VALUES (4, 1.2);

-- RoomType
INSERT INTO RoomType VALUES ('Single', 1, 'Economy', 100.0);
INSERT INTO RoomType VALUES ('Double', 2, 'Standard', 150.0);
INSERT INTO RoomType VALUES ('Suite', 4, 'Luxury', 300.0);
INSERT INTO RoomType VALUES ('Penthouse', 6, 'Premium', 500.0);
INSERT INTO RoomType VALUES ('Cabin', 3, 'Rustic', 120.0);

-- Hotel1
INSERT INTO Hotel1 VALUES ('A1B2C3', 'BC', 'Vancouver');
INSERT INTO Hotel1 VALUES ('B2C3D4', 'AB', 'Calgary');
INSERT INTO Hotel1 VALUES ('C3D4E5', 'ON', 'Toronto');
INSERT INTO Hotel1 VALUES ('D4E5F6', 'QC', 'Montreal');
INSERT INTO Hotel1 VALUES ('E5F6G7', 'NS', 'Halifax');

-- Hotel2
INSERT INTO Hotel2 VALUES ('OceanView', 200, 'A1B2C3');
INSERT INTO Hotel2 VALUES ('MountainInn', 150, 'B2C3D4');
INSERT INTO Hotel2 VALUES ('CityCenter', 300, 'C3D4E5');
INSERT INTO Hotel2 VALUES ('LakesideLodge', 100, 'D4E5F6');
INSERT INTO Hotel2 VALUES ('HarborHotel', 180, 'E5F6G7');

-- Ticket1
INSERT INTO Ticket1 VALUES (TO_DATE('2023-07-01'), TO_DATE('2023-07-31'), 8);
INSERT INTO Ticket1 VALUES (TO_DATE('2023-08-01'), TO_DATE('2023-08-31'), 10);
INSERT INTO Ticket1 VALUES (TO_DATE('2023-09-01'), TO_DATE('2023-09-30'), 6);
INSERT INTO Ticket1 VALUES (TO_DATE('2023-10-01'), TO_DATE('2023-10-31'), 12);
INSERT INTO Ticket1 VALUES (TO_DATE('2023-11-01'), TO_DATE('2023-11-30'), 4);

-- Ticket2
INSERT INTO Ticket2 VALUES (5001, 1001, TO_DATE('2023-07-01'), 5, 8);
INSERT INTO Ticket2 VALUES (5002, 1002, TO_DATE('2023-08-01'), 3, 10);
INSERT INTO Ticket2 VALUES (5003, 1003, TO_DATE('2023-09-01'), 2, 6);
INSERT INTO Ticket2 VALUES (5004, 1004, TO_DATE('2023-10-01'), 4, 12);
INSERT INTO Ticket2 VALUES (5005, 1005, TO_DATE('2023-11-01'), 1, 4);

-- FastPassTicket
INSERT INTO FastPassTicket VALUES (5001, 10, 8);
INSERT INTO FastPassTicket VALUES (5002, 8, 10);
INSERT INTO FastPassTicket VALUES (5003, 5, 6);
INSERT INTO FastPassTicket VALUES (5004, 7, 12);
INSERT INTO FastPassTicket VALUES (5005, 3, 4);

-- MaintenanceRecord1
INSERT INTO MaintenanceRecord1 VALUES ('Oil Change', 2);
INSERT INTO MaintenanceRecord1 VALUES ('Brake Inspection', 3);
INSERT INTO MaintenanceRecord1 VALUES ('Structural Check', 4);
INSERT INTO MaintenanceRecord1 VALUES ('Electrical Test', 2);
INSERT INTO MaintenanceRecord1 VALUES ('Safety Audit', 5);
