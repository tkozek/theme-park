CREATE TABLE Customer (
  CustomerID    INTEGER PRIMARY KEY,
  CustomerName  VARCHAR2(255),
  Sex           VARCHAR2(255),
  DOB           DATE
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

-- Should always reference some customer
-- We should delete customer records when a customer deletes their information
CREATE TABLE LoyaltyMember (
  CustomerID    INTEGER PRIMARY KEY,
  LoyaltyID     INTEGER UNIQUE,
  Points        INTEGER DEFAULT 0, 
  UUID          INTEGER UNIQUE,
  CONSTRAINT fk_customerid FOREIGN KEY (CustomerID) 
    REFERENCES Customer(CustomerID)
    ON DELETE CASCADE,
  CHECK (Points >= 0)
);

insert into customer values ( 1, 'Alice Johnson', 'F', to_date('1990-05-14','YYYY-MM-DD') );
insert into customer values ( 2, 'Bob Smith', 'M', to_date('1988-08-09','YYYY-MM-DD') );
insert into customer values ( 3, 'Carol White', 'F', to_date('1995-11-02','YYYY-MM-DD') );
insert into customer values ( 4, 'David Brown', 'M', to_date('2000-01-25','YYYY-MM-DD') );
insert into customer values ( 5, 'Eve Davis', 'F', to_date('1993-03-07','YYYY-MM-DD') );
insert into customer values ( 11, 'Sally Smith', 'F', to_date('1993-05-08','YYYY-MM-DD') );
insert into customer values ( 12, 'Patty White', 'F', to_date('1993-06-29','YYYY-MM-DD') );


insert into customer values ( 13, 'Aaron Davis', 'Unspecified', to_date('1980-08-07','YYYY-MM-DD') );
insert into customer values ( 14, 'Jessie Brown', 'Unspecified', to_date('1993-05-21','YYYY-MM-DD') );
insert into customer values ( 15, 'Quinn Jude', 'Unspecified', to_date('1983-04-17','YYYY-MM-DD') );
insert into customer values ( 16, 'River Quinn', 'Unspecified', to_date('19753-11-11','YYYY-MM-DD') );

insert into customer values ( 100, 'James Vick', 'Non-binary', to_date('2000-03-27','YYYY-MM-DD') );
insert into customer values ( 101, 'Travis Albanza', 'Non-binary', to_date('2003-01-31','YYYY-MM-DD') );
insert into customer values ( 102, 'Ian Alexander', 'Non-binary', to_date('1994-02-14','YYYY-MM-DD') );
insert into customer values ( 103, 'Olly Alexander', 'Non-binary', to_date('19753-12-12','YYYY-MM-DD') );


insert into loyaltymember values ( 1, 101, 120, 10001 ); -- ID, LoyaltyID, Points, UUID
insert into loyaltymember values ( 2, 102, 80, 10002 );
insert into loyaltymember values ( 3, 103, 200, 10003 );
insert into loyaltymember values ( 4, 104, 0, 10004 );
insert into loyaltymember values ( 5, 105, 50, 10005 );
insert into loyaltymember values ( 11, 106, 50, 10006 );
insert into loyaltymember values ( 12, 107, 50, 10007 );

insert into loyaltymember values ( 13, 108, 50, 10008 );
insert into loyaltymember values ( 14, 109, 50, 10009 );
insert into loyaltymember values ( 15, 110, 50, 10010 );
insert into loyaltymember values ( 16, 111, 50, 10011 );

insert into loyaltymember values ( 100, 112, 50, 10012 );
insert into loyaltymember values ( 101, 113, 50, 10013 );
insert into loyaltymember values ( 102, 114, 50, 10014 );
insert into loyaltymember values ( 103, 115, 50, 10015 );


insert into customer values ( 6, 'Alice Johnson', 'F', to_date('1990-05-14','YYYY-MM-DD') );
insert into customer values ( 7, 'Bob Smith', 'M', to_date('1988-08-09','YYYY-MM-DD') );
insert into customer values ( 8, 'Carol White', 'F', to_date('1995-11-02','YYYY-MM-DD') );
insert into customer values ( 9, 'David Brown', 'M', to_date('2000-01-25','YYYY-MM-DD') );
insert into customer values ( 10, 'Eve Davis', 'F', to_date('1993-03-07','YYYY-MM-DD') );




insert into guest values ( 6, to_date('2025-07-10','YYYY-MM-DD') );
insert into guest values ( 7, to_date('2025-07-12','YYYY-MM-DD') );
insert into guest values ( 8, to_date('2025-07-14','YYYY-MM-DD') );
insert into guest values ( 9, to_date('2023-07-16','YYYY-MM-DD') );
insert into guest values ( 10, to_date('2023-07-18','YYYY-MM-DD') );
