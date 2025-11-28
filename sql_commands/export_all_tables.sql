SET ECHO OFF
SET FEEDBACK OFF
SET HEADING ON
SET TERMOUT ON
SET SQLFORMAT csv

DECLARE
    CURSOR tbls IS
        SELECT table_name FROM user_tables ORDER BY table_name;
BEGIN
    FOR t IN tbls LOOP
        DBMS_OUTPUT.PUT_LINE('Exporting ' || t.table_name);
        EXECUTE IMMEDIATE 'SPOOL exports/' || t.table_name || '.csv';
        EXECUTE IMMEDIATE 'SELECT * FROM ' || t.table_name;
        EXECUTE IMMEDIATE 'SPOOL OFF';
    END LOOP;
END;
/
