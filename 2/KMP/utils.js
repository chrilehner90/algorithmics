(function() {
	var UTILS = {
		average: function(arr) {
			var sum = 0;
			for(var i in arr) {
				sum += arr[i];
			}
			var avg = sum / arr.length;
			return avg;
		}
	}
	module.exports = UTILS;	
})();

