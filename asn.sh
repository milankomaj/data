#!/bin/bash
version=$(date +'%Y-%m');
echo $version
#curl -o $version.csv.gz https://download.db-ip.com/free/dbip-asn-lite-$version.csv.gz
curl -s https://download.db-ip.com/free/dbip-asn-lite-$version.csv.gz | gunzip >> data/test.csv
sed '/::/d' data/test.csv >> data/f.csv # (vymaže riadky ::)
#awk -F ',' '{print $1","$2","$3","$4$5}' f.csv >> 1.csv # (skráti 4 stĺpec)
awk -F ',' '{print $3","$1"-"$2","$4$5}' data/f.csv >> data/1.csv # (+ prehodí stĺpec)
sed 's/"//g' data/1.csv > data/only.csv # (nahradí " /*/) 
sed 's/\,//4g' data/only.csv >> data/cc.csv # (nahradí(vymaže) v stlpci 4+ , medzerou) 
awk -F ',' 'length($1) >= 4&&$2$3$4' data/cc.csv >> data/dd.csv # (počet znakov >= 4 v stĺpci 1)
awk -F ',' 'length($1) <= 5&&$2$3$4' data/dd.csv >> data/ee.csv # (počet znakov <= 5 v stĺpci 1)
sort -t, -nk1 data/ee.csv  >> data/Clear.csv # (triedi oddelovač je , n iba čísla k stĺpec 1)

sed -i 1i"asn,od-do,isp" data/Clear.csv # (header) 

awk -F ',' '{print $1","$3}' data/Clear.csv >> data/uuu.csv # (iba asn a isp)
sort -u -t, -nk1,1 data/uuu.csv >> data/AsnIsp.csv # (vymaže duplikáty)


