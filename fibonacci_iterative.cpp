#include <iostream>
#include <stdio.h>
#include <chrono>
#include <gmp.h>
#include <gmpxx.h>

using namespace std;


std::chrono::high_resolution_clock::time_point start;
std::chrono::duration<double> time_taken;

const unsigned MAX_TIME = 300; // 5 min

mpz_class fibonacci(unsigned n) {
	time_taken = std::chrono::duration_cast<std::chrono::duration<double>>(std::chrono::high_resolution_clock::now() - start);
	
	if(time_taken.count() < MAX_TIME) {
		mpz_class fn_1 = 1;
		mpz_class fn_2 = 1;
		mpz_class result = 0;
		for(unsigned i = 3; i <= n; i++) {
			result = fn_1 + fn_2;
			fn_2 = fn_1;
			fn_1 = result;
		}
		return result;
	}
	else {
		throw "Max time exceeded max time -> Infinity\n";
	}
}

void print_success(unsigned numbers[], double average_runtimes[]) {
	for (int i = 0; i < 4; ++i) {
		cout << "Average runtime " << numbers[i] << ":\t" << average_runtimes[i] << endl;
	}
}

void print_failure(unsigned numbers[], double average_runtimes[]) {
	for (int i = 0; i < 4; ++i) {
		if(average_runtimes[i] != 0) {
			cout << "Runtime " << numbers[i] << ":\t" << average_runtimes[i] << endl;	
		}
		else {
			cout << "Runtime " << numbers[i] << ":\tINF" << endl;	
		}
	}
}

int main() {
	cout << "\nMAX RUNTIME set to " << MAX_TIME << " seconds\n" << endl;
	unsigned numbers[4] = { 100, 1000, 10000, 1000000 };
	double average_runtimes[4] = { 0 };

	for(unsigned i = 0; i < 4; i++) {
		double runtime = 0;
		for(unsigned j = 0; j < 5; j++) {
			try {
				start = std::chrono::high_resolution_clock::now();
				fibonacci(numbers[i]);
				cout << "Fib(" << numbers[i] << "): done" << endl;
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
	return 0;
}