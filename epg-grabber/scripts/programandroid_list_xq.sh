#!/bin/bash
echo -e "\033[31;1m programandroid chanells \033[0m"
for XPath in {'//a/@id','//n','//o','//p','//a/@k','//a/@c'}
do
echo "${XPath}"
version=$(date +'%s%N')
echo $version

curl -X GET \
  --no-progress-meter \
  --connect-timeout 10 \
  --max-time 10 \
  --url "https://programandroid.365dni.cz/android/v5-tv.php?locale=sk" \
| ./xq -x ${XPath} > $(echo $version)_programandroid.tsv
done

paste -d ',' *_programandroid.tsv > programandroid.tsv
sed -i '/České\|Slovenské/!d' programandroid.tsv
sed -i '/Ostatné/d' programandroid.tsv

awk -F ',' '{print "    <channel lang=\""tolower($6)"\" xmltv_id=\"programandroid-"$1"\""" site_id=\""$1"\""" logo=\"https://www.sms.cz/kategorie/televize/bmp/loga/velka/"$3"\""">"$2"</channel>"}' programandroid.tsv  > channels/programandroid.channels.xml
sed -i 1i"<?xml version=\"1.0\" encoding=\"UTF-8\"?>" channels/programandroid.channels.xml
sed -i 2i"<site site=\"programandroid.365dni.cz\">" channels/programandroid.channels.xml
sed -i 3i"\ \ <channels>" channels/programandroid.channels.xml
echo "  </channels>" >> channels/programandroid.channels.xml
echo "</site>" >> channels/programandroid.channels.xml
awk -F ',' '{print "programandroid-"$1","$1","$2","$5",""https://www.sms.cz/kategorie/televize/bmp/loga/velka/"$3}' programandroid.tsv | sort -t, -k3 > csv/programandroid.channels.csv

sed -i 1i"xmltv_id,site_id,name,channelNumber,logoUrl" csv/programandroid.channels.csv
echo "done"
