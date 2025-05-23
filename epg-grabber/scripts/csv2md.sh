#!/bin/bash
#
# file=$(ls *.csv)
echo -e "\033[31;1m csv2md \033[0m"

for chanells in {horizon.tv_sk.chanell,mujtvprogram.channels,programandroid.channels,solocoo.tv_cz.chanell,solocoo.tv_sk.chanell,filmbox_chanell,iprima.cz.chanell,antiktv_sk.chanell}
do
echo "${chanells}"
awk -F ',' '{print "![]("$5") | **"$3"** | "$4}' csv/${chanells}.csv > md/${chanells}.md
sed -i 2i":---: | :---: | :---:" md/${chanells}.md
sed -i 's/\!\[\](logoUrl)/logo /g' md/${chanells}.md
done
echo "done"