#include <iostream>
#include <stdio.h>
#include <chrono>
#include <gmp.h>
#include <gmpxx.h>
#include <fstream>

using namespace std;


std::chrono::high_resolution_clock::time_point start;
std::chrono::duration<double> time_taken;

ofstream file;

const char* FILENAME = "./data/iterative.dat";
const unsigned MAX_TIME = 60; // 1 min
const unsigned NUMBERS_COUNT = 4;
const unsigned RUNS_COUNT = 5;

mpz_class fibonacci(unsigned n) {
	mpz_class fn_1 = 1;
	mpz_class fn_2 = 1;
	mpz_class result = 0;
	for(unsigned i = 3; i <= n; i++) {
		if(time_taken.count() < MAX_TIME) {
			result = fn_1 + fn_2;
			fn_2 = fn_1;
			fn_1 = result;
		}
		else {
			throw "Max time exceeded -> Infinity\n";
		}
		time_taken = std::chrono::duration_cast<std::chrono::nanoseconds>(std::chrono::high_resolution_clock::now() - start);
	}
	return result;
	
}

void print_success(unsigned numbers[NUMBERS_COUNT], double average_runtimes[NUMBERS_COUNT]) {
	file.open(FILENAME);
	for (int i = 0; i < NUMBERS_COUNT; ++i) {
		file << numbers[i] << "\t" << average_runtimes[i] << endl;
	}
	file.close();
}

void print_failure(unsigned numbers[NUMBERS_COUNT], double average_runtimes[NUMBERS_COUNT]) {
	file.open(FILENAME);
	for (int i = 0; i < NUMBERS_COUNT; ++i) {
		if(average_runtimes[i] != 0) {
			file << numbers[i] << "\t" << average_runtimes[i] << endl;	
		}
		else {
			file << numbers[i] << "\tINF" << endl;	
		}
	}
	file.close();
}

int main() {
	cout << "\nMAX RUNTIME set to " << MAX_TIME << " seconds\n" << endl;
	unsigned numbers[NUMBERS_COUNT] = { 100, 1000, 10000, 1000000 };
	double average_runtimes[NUMBERS_COUNT] = { 0 };


	for(unsigned i = 0; i < NUMBERS_COUNT; i++) {
		double runtime = 0;
		for(unsigned j = 0; j < RUNS_COUNT; j++) {
			try {
				start = std::chrono::high_resolution_clock::now();
				fibonacci(numbers[i]);
				time_taken = std::chrono::duration_cast<std::chrono::nanoseconds>(std::chrono::high_resolution_clock::now() - start);
				cout << "Fib(" << numbers[i] << "): done..." << endl;
				runtime += time_taken.count();
			}
			catch(const char* e) {
				cout << e << endl;
				print_failure(numbers, average_runtimes);
				return 0;
			}
		}
		average_runtimes[i] = runtime / RUNS_COUNT;
	}
	print_success(numbers, average_runtimes);
	cout << endl << "File written into data folder." << endl << endl;
	return 0;
}