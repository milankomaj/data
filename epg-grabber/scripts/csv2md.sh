#!/bin/bash
#
# file=$(ls *.csv)
echo -e "\033[31;1m csv2md \033[0m"


for chanells in ${horizon.tv_sk.chanell.csv,mujtvprogram.channels.csv,programandroid.channels.csv,solocoo.tv_cz.chanell.csv,solocoo.tv_sk.chanell.csv}
do
echo "${chanells}"
awk -F ',' '{print "![]("$5") | **"$3"** | "$4}' csv/${chanells} > md/${chanells}.md
sed -i 2i":---: | :---: | :---:" .md/${chanells}.md
done
echo "done"