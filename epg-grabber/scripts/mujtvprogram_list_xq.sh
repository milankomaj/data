#!/bin/bash
echo -e "\033[31;1m mujtvprogram chanells \033[0m"
for XPath in {//channel//cid,//channel/name,//channel/order,//channel/logo-image/url,//channel/lang}
do
echo "${XPath}"
version=$(date +'%s%N');
echo $version

curl -X POST \
 --no-progress-meter \
 --url "https://services.mujtvprogram.cz/tvprogram2services/services/tvchannellist_mobile.php" \
 -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0" \
 -H "Accept: */*" \
 -H "Accept-Language: sk,en-US;q=0.7,en;q=0.3" \
 -H "Accept-Encoding: gzip, deflate, br" \
 -H "Content-type: application/x-www-form-urlencoded" \
 -H "Origin: https://mujtvprogram.cz" \
 -H "DNT: 1" \
 -H "Connection: keep-alive" \
 -H "Referer: https://mujtvprogram.cz/" \
 -H "Sec-Fetch-Dest: empty" \
 -H "Sec-Fetch-Mode: cors" \
 -H "Sec-Fetch-Site: same-site" \
 -H "Pragma: no-cache" \
 -H "Cache-Control: no-cache" \
 --data-raw "&channel_cid_arr=1,2,3,4,5,6,7,9,10,11,12,13,14,15,16,17,18,19,20,21,24,25,29,30,31,32,61,63,64,65,66,67,72,73,74,75,77,78,82,85,89,92,93,98,102,103,105,106,108,109,110,112,119,121,125,127,131,132,146,149,158,159,180,181,182,183,184,185,192,206,207,214,225,226,232,233,234,235,268,271,272,276,296,300,301,304,308,314,317,323,326,328,333,338,344,349,352,355,357,358,364,365,367,368,369,370,371,376,377,379,383,384,394,397,398,404,410,423,453,454,455,459,466,471,474,475,494,495,512,528,532,533,556,558,559,560,568,570,582,601,606,608,622,624,699,723,727,728,755,756,757,759,761,808,816,818,835,841,892,897,902,904,905,921,923,924,928,1016,1017,1040,1042&localization=1" \
| ./xq -x ${XPath} > ${version}.tsv
done

paste -d ',' *.tsv > mujtvprogram.tsv



awk -F ',' '{print "    <channel lang=\""$5"\" xmltv_id=\"mujtvprogram-"$1"\""" site_id=\""$1"\""" logo=\""$4"\""">"$2"</channel>"}' mujtvprogram.tsv  > channels/mujtvprogram.channels.xml
sed -i 1i"<?xml version=\"1.0\" encoding=\"UTF-8\"?>" channels/mujtvprogram.channels.xml

sed -i 2i"<site site=\"mujtvprogram.cz#skylink#cz#komplet\">" channels/mujtvprogram.channels.xml
sed -i 3i"\ \ <channels>" channels/mujtvprogram.channels.xml
echo "  </channels>" >> channels/mujtvprogram.channels.xml
echo "</site>" >> channels/mujtvprogram.channels.xml
sed -i 's/&/&amp;/g' channels/mujtvprogram.channels.xml
sed -i 's/ logo=""//g' channels/channels/mujtvprogram.channels.xml

awk -F ',' '{print "mujtvprogram-"$1","$1","$2","$3","$4}' mujtvprogram.tsv | sort -t, -k3 > csv/mujtvprogram.channels.csv
sed -i 1i"xmltv_id,site_id,name,channelNumber,logoUrl" csv/mujtvprogram.channels.csv
echo "done"