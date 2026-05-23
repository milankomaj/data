#!/bin/bash
echo -e "\033[31;1m skylink_balicky \033[0m"

#
for lang in {sk/televizia-cez-satelit,cz/televize-pres-satelit}
do
  for balicky in {multi,komplet}
  do
    krajina="${lang:0:2}"

    echo "${lang}"
    echo "${krajina}"
    echo "${balicky}"


    curl -sL "https://www.skylink.${lang}/balicky/${balicky}" | grep -oP '"name":"\K[^"]+'  > "${balicky}"-"${krajina}"_skylink.tsv
    sed -i '/Všeobecné/,$d' "${balicky}"-"${krajina}"_skylink.tsv
    sed -i 's/$/,/' "${balicky}"-"${krajina}"_skylink.tsv
    sed -i "1s/.*/${balicky^^}-${krajina},/" "${balicky}"-"${krajina}"_skylink.tsv
    awk -i inplace 'NR == 1; NR > 1 {print $0 | "sort -f -t, -k1"}' "${balicky}"-"${krajina}"_skylink.tsv
    paste -d '' *_skylink.tsv | awk -F, '{NF=4}1' OFS="," > csv/skylink_balicky.csv



  done
done