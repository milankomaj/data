#!/bin/bash
version=$(date +'%Y-%m');
echo $version
curl -sSL https://download.db-ip.com/free/dbip-asn-lite-$version.csv.gz | gunzip > data/Clear.csv
if [ $? -eq 0 ]
then
    echo curl OK
else
    echo curl FAIL
    exit
fi

sed -i '/::/d' data/Clear.csv                                         # (vymaže riadky ::)
awk -i inplace -F ',' '{print $3","$1"-"$2","$4$5}' data/Clear.csv    # (skráti 4 stĺpec + prehodí stĺpec)
sed -i 's/"//g' data/Clear.csv                                        # (nahradí " /*/)
sed -i 's/\,//4g' data/Clear.csv                                      # (nahradí(vymaže) v stlpci 4+ , medzerou)
awk -i inplace -F ',' 'length($1) >= 4&&$2$3$4' data/Clear.csv        # (počet znakov >= 4 v stĺpci 1)
awk -i inplace -F ',' 'length($1) <= 5&&$2$3$4' data/Clear.csv        # (počet znakov <= 5 v stĺpci 1) #  |
sort -t, -nk1 -o data/Clear.csv data/Clear.csv                        # (triedi oddelovač je , n iba čísla k stĺpec 1)
sed -i 1i"asn,od-do,isp" data/Clear.csv                               # (header)

awk -F ',' '{print $1","$3}' data/Clear.csv >  data/AsnIsp.csv        # (iba asn a isp)
sort -u -t, -nk1 -o data/AsnIsp.csv data/AsnIsp.csv                   # | sort -u -t, -nk1,1 (vymaže duplikáty)


# csv2json Clear.json
echo "csv2json Clear.json"
jq -R -s -f csv2json data/Clear.csv > data/Clear.json


# ClearAsn.json
echo "ClearAsn.json"
jq --compact-output 'group_by(.asn) | map({ "asn": .[0].asn,"isp": .[0].isp })' data/Clear.json > data/ClearAsn.json

# ClearIpRange.json
echo "ClearIpRange.json"
jq --compact-output 'group_by(.asn) | map({ "asn": .[0].asn,"isp": .[0].isp, "od-do": map(."od-do") | unique })' data/Clear.json > data/ClearIpRange.json
