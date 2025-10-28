-- 1. Table Initializations

-- should CHECK (Capacity > 0)
CREATE TABLE Ride (
  RideName      VARCHAR2(255) PRIMARY KEY,
  Capacity      INTEGER,      
  InstallDate   DATE
);


CREATE TABLE Customer (
  CustomerID    INTEGER PRIMARY KEY,
  CustomerName  VARCHAR2(255),
  Sex           VARCHAR2(255),
  DOB           DATE
);


-- should CHECK (Cost >= 0)
CREATE TABLE Booking1 (
  BookingDate   DATE PRIMARY KEY,
  Cost          INTEGER      
);

-- Bookings should be kept even if a customer deletes their account
-- Bookings should follow the same customer even if their ID changes
CREATE TABLE Booking2 (
    BookingNumber INTEGER PRIMARY KEY,
    BookingDate   DATE, 
    CustomerID    INTEGER NULL,
    CONSTRAINT fk_customer FOREIGN KEY (CustomerID)
        REFERENCES Customer(CustomerID)
        ON DELETE SET NULL,
    CONSTRAINT fk_booking1 FOREIGN KEY (BookingDate)
        REFERENCES Booking1(BookingDate)
        ON DELETE SET NULL
);


CREATE TABLE RateModifier (
  RateCode      INTEGER PRIMARY KEY,
  Modifier      FLOAT DEFAULT 1.0
);


CREATE TABLE RoomType1 (
  Category      VARCHAR2(255) PRIMARY KEY,
  BaseRate      FLOAT
);

-- should CHECK (MaxGuests > 0)
-- if a room type is deleted, we should set it to null
-- roomtypes should follow changes in base rate, so cascade
CREATE TABLE RoomType2 (
  RoomName      VARCHAR2(255) PRIMARY KEY,
  MaxGuests     INTEGER,      
  Category      VARCHAR2(255),
  CONSTRAINT fk_roomtype1 FOREIGN KEY (Category)
    REFERENCES RoomType1(Category)
    ON DELETE SET NULL
);

CREATE TABLE Hotel1 (
  PostalCode    VARCHAR2(255) PRIMARY KEY,
  Province      VARCHAR2(255),
  City          VARCHAR2(255)
);

-- if postal codes are deleted, we should still keep the info
-- it should follow changes in postal codes
CREATE TABLE Hotel2 (
  HotelName     VARCHAR2(255) PRIMARY KEY,
  MaxGuests     INTEGER,
  PostalCode    VARCHAR2(255),
  CONSTRAINT fk_hotel2 FOREIGN KEY (PostalCode)
    REFERENCES Hotel1 (PostalCode)
    ON DELETE SET NULL
);

-- should CHECK (ValidHours >= 0)
CREATE TABLE Ticket1 (
  ValidFrom     DATE NOT NULL,
  ValidHours    INTEGER CHECK (ValidHours >= 0),      
  ValidUntil    DATE,
  PRIMARY KEY (ValidFrom, ValidHours)
);


-- should CHECK (RemainingUses >= 0)
-- should CHECK (ValidHours >= 0)
-- When bookings are deleted(like a cancellation or refund), any associated tickets should be deleted as well
-- Booking numbers should not be updated, in cases where they are, tickets that reference them should still reference the same booking 
-- When tickets are deleted, they should be cascaded in all locations
-- Ticket2s should follow Ticket1 even when/if it changes 
CREATE TABLE Ticket2 (
  TicketID      INTEGER PRIMARY KEY,
  BookingNumber INTEGER,
  ValidFrom     DATE,
  RemainingUses INTEGER,       -- should CHECK (RemainingUses >= 0)
  ValidHours    INTEGER,       -- should CHECK (ValidHours >= 0)
  CONSTRAINT fk_ticket2_booking FOREIGN KEY (BookingNumber)
    REFERENCES Booking2 (BookingNumber)
    ON DELETE CASCADE,
  CONSTRAINT fk_ticket2_ticket1 FOREIGN KEY (ValidFrom, ValidHours)
    REFERENCES Ticket1 (ValidFrom, ValidHours)
    ON DELETE CASCADE
);


-- should CHECK (NumberOfRides >= 0)
-- should CHECK (ValidHours >= 0)
-- When tickets IDs are changed, they should still be fastpass tickets
-- When tickets are deleted, the associated fastpass information should also be deleted
CREATE TABLE FastPassTicket (
  TicketID      INTEGER PRIMARY KEY,
  NumberOfRides INTEGER,      
  ValidHours    INTEGER,      
  CONSTRAINT fk_fastpass_ticket FOREIGN KEY (TicketID)
    REFERENCES Ticket2 (TicketID)
    ON DELETE CASCADE
);


-- Should always reference some customer
-- We should delete customer records when a customer deletes their information
-- should CHECK (Points >= 0)
CREATE TABLE LoyaltyMember (
  CustomerID    INTEGER PRIMARY KEY,
  LoyaltyID     INTEGER UNIQUE,
  Points        INTEGER DEFAULT 0, 
  UUID          INTEGER UNIQUE,
  CONSTRAINT fk_customerid FOREIGN KEY (CustomerID) 
    REFERENCES Customer(CustomerID)
    ON DELETE CASCADE
);

-- Should never be triggered, but SeasonPasses should be tied to one user
-- When a user deletes their account, any associations like SeasonPasses should also be deleted
CREATE TABLE SeasonPass2 (
  UUID            INTEGER PRIMARY KEY,
  SeasonPassLevel VARCHAR2(255),
  SeasonStart     DATE,
  SeasonEnd       DATE,
  LoyaltyID       INTEGER UNIQUE NOT NULL,
  CONSTRAINT unique_seasonpasslevel_seasonstart UNIQUE (SeasonPassLevel, SeasonStart),
  CONSTRAINT fk_seasonpass_loyalty FOREIGN KEY (LoyaltyID)
    REFERENCES LoyaltyMember (LoyaltyID)
    ON DELETE CASCADE
);


-- Should never be deleted, but keep around for record
-- Should still reference the same SeasonPass2
CREATE TABLE SeasonPass1 (
  SeasonPassLevel VARCHAR2(255),
  SeasonStart     DATE,
  SeasonEnd       DATE,
  PRIMARY KEY (SeasonPassLevel, SeasonStart),
  CONSTRAINT fk_seasonpass2 FOREIGN KEY (SeasonPassLevel, SeasonStart)
    REFERENCES SeasonPass2 (SeasonPassLevel, SeasonStart)
);

-- Should never be triggered, SeasonPass should be immutable after insertion
-- Should never be triggered, but a SeasonPassSpecial should still be connected to the same UUID even if it changes
-- When a RateModifier is deleted, any associated SeasonPassSpecials should also be deleted
-- When a RateModifier's RateCode is changed, any associated SeasonPassSpecials should still reference the same RateCode
CREATE TABLE SeasonPassSpecial (
  UUID       INTEGER,
  RateCode   INTEGER,
  PRIMARY KEY (UUID, RateCode),
  CONSTRAINT fk_sps_seasonpass FOREIGN KEY (UUID)
    REFERENCES SeasonPass2 (UUID)
    ON DELETE SET NULL,
  CONSTRAINT fk_sps_ratemodifier FOREIGN KEY (RateCode)
    REFERENCES RateModifier (RateCode)
    ON DELETE CASCADE
);

-- Bookings should always point to the same RateCode, even if that ratecode is changed
-- Bookings booked with rate modifiers point to a default ratecode with Modifier=1.0 when its ratecode is deleted 
-- When booking are deleted, references to it become invalid so should be deleted too
CREATE TABLE BookedWithRateModifier (
  RateCode      INTEGER DEFAULT 0,
  BookingNumber INTEGER,
  PRIMARY KEY (RateCode, BookingNumber),
  CONSTRAINT fk_bwrm_rate FOREIGN KEY (RateCode)
    REFERENCES RateModifier (RateCode)
    ON DELETE SET NULL,
  CONSTRAINT fk_bwrm_booking FOREIGN KEY (BookingNumber)
    REFERENCES Booking2 (BookingNumber)
    ON DELETE CASCADE
);

-- should CHECK (Quantity >= 0)
-- Hotels should never be deleted, but in that case that it is, the Roomtypes offered should be saved for history reasons
-- Roomtypes should never be deleted, but if they are they should be kept for history reasons
CREATE TABLE OffersRoomType (
  HotelName     VARCHAR2(255),
  RoomName      VARCHAR2(255),
  Quantity      INTEGER,      
  PRIMARY KEY (HotelName, RoomName),
  CONSTRAINT fk_offers_hotel FOREIGN KEY (HotelName)
    REFERENCES Hotel2 (HotelName)
    ON DELETE SET NULL,
  CONSTRAINT fk_offers_room FOREIGN KEY (RoomName)
    REFERENCES RoomType2 (RoomName)
    ON DELETE SET NULL
);

-- should CHECK (NumGuests > 0)
-- if a hotel is deleted, hotel stays should be kept for historical reasons
-- if a hotel changes its name, the new name should be used for all records for consistency
-- if a roomtype is deleted, we should keep the stays 
-- if the name of a roomtype changes, we should update records to reflect the new name
-- If a booking is deleted, the hotel stay associated with it is no longer valid, so should be deleted
-- If a booking is updated, it's hotel stay should stay attached to it 
CREATE TABLE HotelStay (
  HotelBookingID INTEGER PRIMARY KEY,
  NumGuests      INTEGER,      
  CheckInDate    DATE,
  CheckOutDate   DATE,
  HotelName      VARCHAR2(255) NOT NULL,
  RoomName       VARCHAR2(255) NOT NULL,
  BookingNumber  INTEGER NOT NULL,
  CONSTRAINT fk_hs_hotel FOREIGN KEY (HotelName)
    REFERENCES Hotel2 (HotelName)
    ON DELETE SET NULL ,
  CONSTRAINT fk_hs_room FOREIGN KEY (RoomName)
    REFERENCES RoomType2 (RoomName)
    ON DELETE SET NULL ,
  CONSTRAINT fk_hs_booking FOREIGN KEY (BookingNumber)
    REFERENCES Booking2 (BookingNumber)
    ON DELETE CASCADE
);

-- When Rides are deleted(should never be), we should keep the ticket association with the ride just in case
-- When RideNames are updated(should never be), the tickets should still be for the same ride
-- When tickets are deleted(like when a booking is deleted/refunded), their associations to some ride should be deleted too
-- When tickets are updated(should never be), their associations to some ride should be attached to the same ticket
CREATE TABLE ForRide (
  RideName  VARCHAR2(255),
  TicketID  INTEGER,
  PRIMARY KEY (RideName, TicketID),
  CONSTRAINT fk_forride_ride FOREIGN KEY (RideName)
    REFERENCES Ride (RideName)
    ON DELETE SET NULL,
  CONSTRAINT fk_forride_ticket FOREIGN KEY (TicketID)
    REFERENCES Ticket2 (TicketID)
    ON DELETE CASCADE
);

-- should CHECK (NumberOfWorkers >= 0)
CREATE TABLE MaintenanceRecord1 (
  MaintenancePerformed VARCHAR2(255) PRIMARY KEY,
  NumberOfWorkers      INTEGER       
);


-- When rides are deleted, their maintenance records should be deleted too 
-- When ride names are updated(should never happen), their maintenance records should still be for the same ride
CREATE TABLE MaintenanceRecord2 (
  RideName             VARCHAR2(255),
  RecordID             INTEGER,
  MaintenancePerformed VARCHAR2(255),
  MaintenanceDate      DATE,
  PRIMARY KEY (RideName, RecordID),
  CONSTRAINT fk_mr2_ride FOREIGN KEY (RideName)
    REFERENCES Ride (RideName)
    ON DELETE CASCADE,
  CONSTRAINT fk_mr2_mr1 FOREIGN KEY (MaintenancePerformed)
    REFERENCES MaintenanceRecord1 (MaintenancePerformed)
    ON DELETE CASCADE
);

-- When a customer is deleted, their Guest info should be deleted too(Data Privacy reasons)
-- Guests should always be attached to the same Customer object
CREATE TABLE Guest (
  CustomerID  INTEGER PRIMARY KEY,
  DateOfVisit DATE,
  CONSTRAINT fk_guest_customer FOREIGN KEY (CustomerID)
    REFERENCES Customer (CustomerID)
    ON DELETE CASCADE
);

