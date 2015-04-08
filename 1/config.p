set terminal png enhanced

#set datafile separator "\t"

set xlabel "x for Fibonacci calculation"
set ylabel "Time in seconds"

set logscale x
set logscale y

set xrange[100:1000000]
#set format x '2^{%L}'

set key left top

plot \
"data/matrices.dat" using 1:2 with errorlines title "Matrices",\
"data/recursive.dat" using 1:2 with errorlines title "Recursive (infinite)",\
"data/iterative.dat" using 1:2 with errorlines title "Iterative"
