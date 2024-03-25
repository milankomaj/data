#!/bin/bash
#
#
cat solocoo.tv_sk.json \
| jq -r '.channels[] | ["skylink_sk-\(.assetInfo.params.lcn)", .assetInfo.id, .assetInfo.title, .assetInfo.params.lcn, .assetInfo.images[0].url] | join(",")'  | sort -n -t, -k4,4 > solocoo.tv_sk.chanell.csv


sed -i 's/skylink_sk-null/skylink_sk-sat/g' solocoo.tv_sk.chanell.csv
awk -F ',' '{print "    <channel lang=\"sk\" xmltv_id=\""$1"\""" site_id=\""$2"\""" logo=\""$5"\""">"$3"</channel>"}' solocoo.tv_sk.chanell.csv > solocoo.tv_sk.xml
sed -i 1i"<?xml version=\"1.0\" encoding=\"UTF-8\"?>" solocoo.tv_sk.xml
sed -i 2i"<site site=\"solocoo.tv_sk\">" solocoo.tv_sk.xml
sed -i 3i"\ \ <channels>" solocoo.tv_sk.xml
echo "  </channels>" >> solocoo.tv_sk.xml
echo "</site>" >> solocoo.tv_sk.xml

sed -i 1i"xmltv_id,site_id,name,channelNumber,logoUrl" solocoo.tv_sk.chanell.csv