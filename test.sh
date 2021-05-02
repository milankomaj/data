#!/bin/bash
awk -F ',' '{print $1","$4$5}' test.csv >> uuu.csv
sort -u -t, -nk1,1 uuu.csv >> do.csv