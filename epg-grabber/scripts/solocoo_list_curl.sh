#!/bin/bash
# | jq > $(echo "${SkCz}" | cut -d "-" -f 1).json
#
#
echo -e "\033[31;1m solocoo chanells \033[0m"

# echo "$token_CZ"
# echo "$token_SK"

CzToken=$(echo $token_CZ | sed -e 's/\"//g')
SkToken=$(echo $token_SK | sed -e 's/\"//g')

# echo $CzToken
# echo $SkToken

for SkCz in {sk-$SkToken,cz-$CzToken}

do
echo "${SkCz}"
lang=$(echo "${SkCz}" | cut -d "-" -f 1)
# echo $lang



curl -X GET \
 --no-progress-meter \
 --url 'https://tvapi.solocoo.tv/v1/bouquet' \
 -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0' \
 -H 'Accept: application/json, text/plain, */*' \
 -H 'Accept-Language: sk,en-US;q=0.5' \
 -H 'Accept-Encoding: gzip, deflate, br' \
 -H "Authorization: Bearer $(echo "${SkCz}" | cut -d "-" -f 2)" \
 -H "Origin: https://livetv.skylink.${lang}" \
 -H 'DNT: 1' \
 -H 'Sec-GPC: 1' \
 -H 'Connection: keep-alive' \
 -H "Referer: https://livetv.skylink.${lang}/" \
 -H 'Sec-Fetch-Dest: empty' \
 -H 'Sec-Fetch-Mode: cors' \
 -H 'Sec-Fetch-Site: cross-site' \
 -H 'TE: trailers' \
| jq -r '.channels[] | ["skylink.language-\(.assetInfo.params.lcn)", .assetInfo.id, .assetInfo.title, .assetInfo.params.lcn, .assetInfo.images[0].url] | join(",")'  | sort -n -t, -k4,4 > csv//solocoo.tv_${lang}.chanell.csv

sed -i "s/skylink.language/skylink.${lang}/g" csv/solocoo.tv_${lang}.chanell.csv
awk -F ',' '{print "    <channel lang=\"language\" xmltv_id=\""$1"\""" site_id=\""$2"\""" logo=\""$5"\""">"$3"</channel>"}' csv/solocoo.tv_${lang}.chanell.csv > channels/solocoo.tv_${lang}.chanell.xml
sed -i "s/language/${lang}/g" channels/solocoo.tv_${lang}.chanell.xml
sed -i 1i"<?xml version=\"1.0\" encoding=\"UTF-8\"?>" channels/solocoo.tv_${lang}.chanell.xml
sed -i 2i"<site site=\"skylink.${lang}\">" channels/solocoo.tv_${lang}.chanell.xml
sed -i 3i"\ \ <channels>" channels/solocoo.tv_${lang}.chanell.xml
echo "  </channels>" >> channels/solocoo.tv_${lang}.chanell.xml
echo "</site>" >> channels/solocoo.tv_${lang}.chanell.xml
sed -i 1i"xmltv_id,site_id,name,channelNumber,logoUrl" csv/solocoo.tv_${lang}.chanell.csv

done
echo "done"