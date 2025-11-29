#!/usr/bin/env fish

set script_dir (dirname (status -f))
set sql_dir (realpath "$script_dir/sql_commands")
set drop_file "$sql_dir/dropall.sql"
set create_file "$sql_dir/createtables.sql"
set insert_file "$sql_dir/insertvalues.sql"
set output_file "$sql_dir/doeverything.sql"

for file in $drop_file $create_file $insert_file
    if not test -f $file
        printf 'Missing required SQL file: %s\n' $file >&2
        exit 1
    end
end

rm -f $output_file

cat $drop_file > $output_file
printf '\n' >> $output_file
cat $create_file >> $output_file
printf '\n' >> $output_file
cat $insert_file >> $output_file

printf 'Regenerated %s\n' $output_file
