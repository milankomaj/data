#!/bin/bash
#
# file=$(ls *.csv)
echo -e "\033[31;1m csv2md \033[0m"

file=$(ls csv/*.csv)
for chanells in ${file}
do
echo "${chanells}"
awk -F ',' '{print "![]("$5") | **"$3"** | "$4}' csv/${chanells} > md/${chanells}.md
sed -i 2i":---: | :---: | :---:" md/${chanells}.md
done
echo "done"