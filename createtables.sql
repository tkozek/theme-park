-- 1. Table Initializations

-- should CHECK (Capacity > 0)
create table ride (
   ridename    varchar2(255) primary key,
   capacity    integer,
   installdate date
);


create table customer (
   customerid   integer primary key,
   customername varchar2(255),
   sex          varchar2(255),
   dob          date
);


-- should CHECK (Cost >= 0)
create table booking1 (
   bookingdate date primary key,
   cost        integer
);

-- Bookings should be kept even if a customer deletes their account
-- Bookings should follow the same customer even if their ID changes
create table booking2 (
   bookingnumber integer primary key,
   bookingdate   date,
   customerid    integer null,
   constraint fk_customer foreign key ( customerid )
      references customer ( customerid )
         on delete set null,
   constraint fk_booking1 foreign key ( bookingdate )
      references booking1 ( bookingdate )
         on delete set null
);


create table ratemodifier (
   ratecode integer primary key,
   modifier float default 1.0
);


create table roomtype1 (
   category varchar2(255) primary key,
   baserate float
);

-- should CHECK (MaxGuests > 0)
-- if a room type is deleted, we should set it to null
-- roomtypes should follow changes in base rate, so cascade
create table roomtype2 (
   roomname  varchar2(255) primary key,
   maxguests integer,
   category  varchar2(255),
   constraint fk_roomtype1 foreign key ( category )
      references roomtype1 ( category )
         on delete set null
);

create table hotel1 (
   postalcode varchar2(255) primary key,
   province   varchar2(255),
   city       varchar2(255)
);

-- if postal codes are deleted, we should still keep the info
-- it should follow changes in postal codes
create table hotel2 (
   hotelname  varchar2(255) primary key,
   maxguests  integer,
   postalcode varchar2(255),
   constraint fk_hotel2 foreign key ( postalcode )
      references hotel1 ( postalcode )
         on delete set null
);

-- should CHECK (ValidHours >= 0)
create table ticket1 (
   validfrom  date not null,
   validhours integer check ( validhours >= 0 ),
   validuntil date,
   primary key ( validfrom,
                 validhours )
);


-- should CHECK (RemainingUses >= 0)
-- should CHECK (ValidHours >= 0)
-- When bookings are deleted(like a cancellation or refund), any associated tickets should be deleted as well
-- Booking numbers should not be updated, in cases where they are, tickets that reference them should still reference the same booking 
-- When tickets are deleted, they should be cascaded in all locations
-- Ticket2s should follow Ticket1 even when/if it changes 
create table ticket2 (
   ticketid      integer primary key,
   bookingnumber integer,
   validfrom     date,
   remaininguses integer,       -- should CHECK (RemainingUses >= 0)
   validhours    integer,       -- should CHECK (ValidHours >= 0)
   constraint fk_ticket2_booking foreign key ( bookingnumber )
      references booking2 ( bookingnumber )
         on delete cascade,
   constraint fk_ticket2_ticket1
      foreign key ( validfrom,
                    validhours )
         references ticket1 ( validfrom,
                              validhours )
            on delete cascade
);


-- should CHECK (NumberOfRides >= 0)
-- should CHECK (ValidHours >= 0)
-- When tickets IDs are changed, they should still be fastpass tickets
-- When tickets are deleted, the associated fastpass information should also be deleted
create table fastpassticket (
   ticketid      integer primary key,
   numberofrides integer,
   validhours    integer,
   constraint fk_fastpass_ticket foreign key ( ticketid )
      references ticket2 ( ticketid )
         on delete cascade
);


-- Should always reference some customer
-- We should delete customer records when a customer deletes their information
-- should CHECK (Points >= 0)
create table loyaltymember (
   customerid integer primary key,
   loyaltyid  integer unique,
   points     integer default 0,
   uuid       integer unique,
   constraint fk_customerid foreign key ( customerid )
      references customer ( customerid )
         on delete cascade
);

-- Should never be triggered, but SeasonPasses should be tied to one user
-- When a user deletes their account, any associations like SeasonPasses should also be deleted
create table seasonpass2 (
   uuid            integer primary key,
   seasonpasslevel varchar2(255),
   seasonstart     date,
   seasonend       date,
   unique ( seasonpasslevel,
            seasonstart ),
   loyaltyid       integer unique not null,
   constraint fk_seasonpass_loyalty foreign key ( loyaltyid )
      references loyaltymember ( loyaltyid )
         on delete cascade
);


-- Should never be deleted, but keep around for record
-- Should still reference the same SeasonPass2
create table seasonpass1 (
   seasonpasslevel varchar2(255),
   seasonstart     date,
   seasonend       date,
   primary key ( seasonpasslevel,
                 seasonstart ),
   constraint fk_seasonpass2
      foreign key ( seasonpasslevel,
                    seasonstart )
         references seasonpass2 ( seasonpasslevel,
                                  seasonstart )
);

-- Should never be triggered, SeasonPass should be immutable after insertion
-- Should never be triggered, but a SeasonPassSpecial should still be connected to the same UUID even if it changes
-- When a RateModifier is deleted, any associated SeasonPassSpecials should also be deleted
-- When a RateModifier's RateCode is changed, any associated SeasonPassSpecials should still reference the same RateCode
create table seasonpassspecial (
   uuid     integer,
   ratecode integer,
   primary key ( uuid,
                 ratecode ),
   constraint fk_sps_seasonpass foreign key ( uuid )
      references seasonpass2 ( uuid )
         on delete cascade,
   constraint fk_sps_ratemodifier foreign key ( ratecode )
      references ratemodifier ( ratecode )
         on delete cascade
);

-- Bookings should always point to the same RateCode, even if that ratecode is changed
-- Bookings booked with rate modifiers point to a default ratecode with Modifier=1.0 when its ratecode is deleted 
-- When booking are deleted, references to it become invalid so should be deleted too
create table bookedwithratemodifier (
   ratecode      integer default 0,
   bookingnumber integer,
   primary key ( ratecode,
                 bookingnumber ),
   constraint fk_bwrm_rate foreign key ( ratecode )
      references ratemodifier ( ratecode )
         on delete cascade,
   constraint fk_bwrm_booking foreign key ( bookingnumber )
      references booking2 ( bookingnumber )
         on delete cascade
);

-- should CHECK (Quantity >= 0)
-- Hotels should never be deleted, but in that case that it is, the Roomtypes offered should be saved for history reasons
-- Roomtypes should never be deleted, but if they are they should be kept for history reasons
create table offersroomtype (
   hotelname varchar2(255),
   roomname  varchar2(255),
   quantity  integer,
   primary key ( hotelname,
                 roomname ),
   constraint fk_offers_hotel foreign key ( hotelname )
      references hotel2 ( hotelname )
         on delete cascade,
   constraint fk_offers_room foreign key ( roomname )
      references roomtype2 ( roomname )
         on delete cascade
);

-- should CHECK (NumGuests > 0)
-- if a hotel is deleted, hotel stays should be kept for historical reasons
-- if a hotel changes its name, the new name should be used for all records for consistency
-- if a roomtype is deleted, we should keep the stays 
-- if the name of a roomtype changes, we should update records to reflect the new name
-- If a booking is deleted, the hotel stay associated with it is no longer valid, so should be deleted
-- If a booking is updated, it's hotel stay should stay attached to it 
create table hotelstay (
   hotelbookingid integer primary key,
   numguests      integer,
   checkindate    date,
   checkoutdate   date,
   hotelname      varchar2(255) not null,
   roomname       varchar2(255) not null,
   bookingnumber  integer not null,
   constraint fk_hs_hotel foreign key ( hotelname )
      references hotel2 ( hotelname )
         on delete cascade,
   constraint fk_hs_room foreign key ( roomname )
      references roomtype2 ( roomname )
         on delete cascade,
   constraint fk_hs_booking foreign key ( bookingnumber )
      references booking2 ( bookingnumber )
         on delete cascade
);

-- When Rides are deleted(should never be), we should keep the ticket association with the ride just in case
-- When RideNames are updated(should never be), the tickets should still be for the same ride
-- When tickets are deleted(like when a booking is deleted/refunded), their associations to some ride should be deleted too
-- When tickets are updated(should never be), their associations to some ride should be attached to the same ticket
create table forride (
   ridename varchar2(255),
   ticketid integer,
   primary key ( ridename,
                 ticketid ),
   constraint fk_forride_ride foreign key ( ridename )
      references ride ( ridename )
         on delete cascade,
   constraint fk_forride_ticket foreign key ( ticketid )
      references ticket2 ( ticketid )
         on delete cascade
);

-- should CHECK (NumberOfWorkers >= 0)
create table maintenancerecord1 (
   maintenanceperformed varchar2(255) primary key,
   numberofworkers      integer
);


-- When rides are deleted, their maintenance records should be deleted too 
-- When ride names are updated(should never happen), their maintenance records should still be for the same ride
create table maintenancerecord2 (
   ridename             varchar2(255),
   recordid             integer,
   maintenanceperformed varchar2(255),
   maintenancedate      date,
   primary key ( ridename,
                 recordid ),
   constraint fk_mr2_ride foreign key ( ridename )
      references ride ( ridename )
         on delete cascade,
   constraint fk_mr2_mr1 foreign key ( maintenanceperformed )
      references maintenancerecord1 ( maintenanceperformed )
         on delete cascade
);

-- When a customer is deleted, their Guest info should be deleted too(Data Privacy reasons)
-- Guests should always be attached to the same Customer object
create table guest (
   customerid  integer primary key,
   dateofvisit date,
   constraint fk_guest_customer foreign key ( customerid )
      references customer ( customerid )
         on delete cascade
);
/