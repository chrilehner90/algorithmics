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

const char* FILENAME = "./data/matrices.dat";
const unsigned MAX_TIME = 60; // 1 min
const unsigned NUMBERS_COUNT = 4;
const unsigned RUNS_COUNT = 5;
const unsigned DIMENSIONS = 2;


void multiply_matrices(mpz_class matrixA[DIMENSIONS][DIMENSIONS], mpz_class matrixB[DIMENSIONS][DIMENSIONS]) {
	mpz_class result[DIMENSIONS][DIMENSIONS] = {
		{ 0, 0 },
		{ 0, 0 }
	};

	for (unsigned i = 0; i < DIMENSIONS; ++i) {
		for (unsigned j = 0; j < DIMENSIONS; ++j) {
			for (unsigned k = 0; k < DIMENSIONS; ++k) {
				result[i][j] += matrixA[i][k] * matrixB[k][j];
			}
		}
	}

	// deep copy matrix
	for (unsigned i = 0; i < DIMENSIONS; ++i) {
		for (unsigned j = 0; j < DIMENSIONS; ++j) {
			matrixA[i][j] = result[i][j];
		}
	}
}

void potentiate_matrices(unsigned n, mpz_class matrixA[DIMENSIONS][DIMENSIONS]) {
	time_taken = std::chrono::duration_cast<std::chrono::nanoseconds>(std::chrono::high_resolution_clock::now() - start);
	if(time_taken.count() < MAX_TIME) {
		if(n <= 1) return;

		mpz_class matrixB [DIMENSIONS][DIMENSIONS] = {
			{ 1, 1 },
			{ 1, 0 }
		};

		potentiate_matrices(n/2, matrixA);
		multiply_matrices(matrixA, matrixA);

		if(n % 2 != 0) {
			multiply_matrices(matrixA, matrixB);
		}
	}
	else {
		throw "Max time exceeded -> Infinity\n";
	}

}


mpz_class fibonacci(unsigned n) {
	mpz_class matrix[DIMENSIONS][DIMENSIONS] = {
		{ 1, 1 },
		{ 1, 0 }
	};
	
	
	potentiate_matrices(n - 2, matrix);

	mpz_class fib[DIMENSIONS] = { 0, 0 };

	for (int i = 0; i < DIMENSIONS; ++i) {
		for (int j = 0; j < DIMENSIONS; ++j) {
			fib[i] +=  matrix[i][j];
		}
	}
	return fib[0];
	
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
		average_runtimes[i] = runtime / 5;
	}
	print_success(numbers, average_runtimes);
	cout << endl << "File written into data folder." << endl << endl;
	return 0;
}