#!/bin/bash
for i in {01,02,03,04,05,06,07,08,09,10,11,12}
do
echo "${i}"
dd=("2022-${i}-01")
echo "${dd}"
yy=$(LC_ALL=sk_SK.utf8 date -d "${dd}" +%Y)
mm=$(LC_ALL=sk_SK.utf8 date -d "${dd}" +%B | sed -r 's/[á]+/a/g' | sed -r 's/[ú]+/u/g' | sed -r 's/[í]+/i/g' | sed -r 's/[ó]+/o/g')
echo "${yy}"
echo "${mm,,}"
echo "${mm^^}"
echo "${mm^}"
SCRAPER=$(System.getenv("SCRAPER"))
echo "${SCRAPER}"
cal -d "${dd}" | awk -v yy="$yy" -v mm="${mm,,}" '
NR>2 {
    for (i=1; i<=NF; i++) {
        printf("prefix " "#https://" SCRAPER "/?url=https://www.teraz.sk/historicky-kalendar/" $i "-" mm "&selector=h3,p&scrape=attr&spaced=true&attr=&pretty=true#" " | jq >> " mm "/" $i"-"mm"-1test.json" "\n")
        printf("jq €. + {£" $i "-" mm "£: .result} | del(.result)€ " mm "/" $i "-" mm "-1test.json >> " mm "/"  $i "-" mm "-2test.json" "\n")
        printf("jq €{" mm ": .}€ <" mm "/"  $i "-" mm "-2test.json >> " mm "/"  $i "-" mm "-3test.json" "\n")
        printf("jq €{month: .}€ <" mm "/"  $i "-" mm "-3test.json >> " mm "/" mm ".json" "\n")
        printf("echo £const " $i " =" " require(€./output/" $i "-" mm ".json€)£ >> " mm ".txt" "\n")
    }
}'> ww.sh
sed 's/£/\"/1g' ww.sh > ee.sh
sed 's/€/'\''/1g' ee.sh > 1.sh
sed 's/prefix /curl -a -L -s -H "Accept\: application\/json" /1g' 1.sh > 2.sh
sed 's/#/"/1g' 2.sh > 3.sh
mkdir ${mm,,}
sed 's/_//g' 3.sh > ${mm,,}.sh
echo "jq 'reduce inputs as \$w (.; . * \$w)' ${mm,,}/${mm,,}.json >> ${mm,,}.json" >> ${mm,,}.sh
bash ${mm,,}.sh
cat ${mm,,}.json >> months.json
done
jq 'reduce inputs as $w (.; . * $w)' months.json > namedays.json
bash reduce.sh