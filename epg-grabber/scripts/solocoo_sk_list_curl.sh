#!/bin/bash
#
curl -X GET \
 --no-progress-meter \
 --connect-timeout 10 \
 --max-time 10 \
 --url 'https://tvapi.solocoo.tv/v1/bouquet' \
 -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0' \
 -H 'Accept: application/json, text/plain, */*' \
 -H 'Accept-Language: sk,en-US;q=0.5' \
 -H 'Accept-Encoding: gzip, deflate, br' \
 -H "Authorization: Bearer $(echo $token_CZ | sed -e 's/\"//g')" \
 -H 'Origin: https://livetv.skylink.sk' \
 -H 'DNT: 1' \
 -H 'Sec-GPC: 1' \
 -H 'Connection: keep-alive' \
 -H 'Referer: https://livetv.skylink.sk/' \
 -H 'Sec-Fetch-Dest: empty' \
 -H 'Sec-Fetch-Mode: cors' \
 -H 'Sec-Fetch-Site: cross-site' \
 -H 'TE: trailers' \
| jq -r '.channels[] | ["skylink_sk-\(.assetInfo.params.lcn)", .assetInfo.id, .assetInfo.title, .assetInfo.params.lcn, .assetInfo.images[0].url] | join(",")'  | sort -n -t, -k4,4 > csv/solocoo.tv_sk.chanell.csv


sed -i 's/skylink_sk-null/skylink_sk-sat/g' csv/solocoo.tv_sk.chanell.csv
awk -F ',' '{print "    <channel lang=\"sk\" xmltv_id=\""$1"\""" site_id=\""$2"\""" logo=\""$5"\""">"$3"</channel>"}' csv/solocoo.tv_sk.chanell.csv > channels/solocoo.tv_sk.chanell.xml
sed -i 1i"<?xml version=\"1.0\" encoding=\"UTF-8\"?>" channels/solocoo.tv_sk.chanell.xml
sed -i 2i"<site site=\"solocoo.tv_sk\">" channels/solocoo.tv_sk.chanell.xml
sed -i 3i"\ \ <channels>" channels/solocoo.tv_sk.chanell.xml
echo "  </channels>" >> channels/solocoo.tv_sk.chanell.xml
echo "</site>" >> channels/solocoo.tv_sk.chanell.xml

sed -i 1i"xmltv_id,site_id,name,channelNumber,logoUrl" csv/solocoo.tv_sk.chanell.csv