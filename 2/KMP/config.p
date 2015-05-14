set terminal png

set xlabel "Prefix length"
set ylabel "Time in nanoseconds"

plot \
"data.dat" using 1:3 with errorlines title "Naive Algorithm", \
"data.dat" using 1:4 with errorlines title "KMP Algorithm"