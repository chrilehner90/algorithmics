CXX = g++
CXXFLAGS = -Wall -g -std=c++11 -O2 -lgmpxx -lgmp

all: rec it

rec:
	$(CXX) $(CXXFLAGS) -o fibonacci_recursive fibonacci_recursive.cpp
	./fibonacci_recursive
	rm -rf fibonacci_recursive.dSYM
	rm fibonacci_recursive

it:
	$(CXX) $(CXXFLAGS) -o fibonacci_iterative fibonacci_iterative.cpp
	./fibonacci_iterative
	rm -rf fibonacci_iterative.dSYM
	rm fibonacci_iterative

mat:
	$(CXX) $(CXXFLAGS) -o fibonacci_matrices fibonacci_matrices.cpp
	./fibonacci_matrices
	rm -rf fibonacci_matrices.dSYM
	rm fibonacci_matrices