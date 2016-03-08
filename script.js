$(document).ready(function () {

	// var to keep track of first click (once done, useless)
	var hasSearched = false;

	// array to hold favorites
	var favorites = [];

	$("#search-button").click(function() {

		// ajax query
		$.ajax ({
			type: 'GET',
			dataType: 'jsonp',
			data: {},
			url: "https://itunes.apple.com/search?term=" + $("#search-field").val() + "&limit=25",
			success: function(data) {

				var text = "iTunes Search Results for " + $("#search-field").val();

				if (hasSearched) {
					$(".results-header").text(text);
					$(".results-table").remove();
				} else {
					// show h2 bar
					$("html").append($("<p><b></b></p>").addClass("results-header").text(text));
				} 

				// create table to show results
				var table = $("<table></table>").addClass("results-table").addClass("table");
				// create and append headers
				var headers = '<tr class="row"><th class="header">Favorite?</th><th class="header">Album Image</th><th class="header">Song Name</th><th class="header">Listen to It</th></tr>'
				table.append(headers);

				for (i = 0; i < data.results.length; i++) {

					// build content for row

					var img = '<img class="song-img" src="' + data.results[i]['artworkUrl100'] + '">';
					var name = '<p class="song-name">' + data.results[i]['trackCensoredName'].substring(0, 27) + '</p>';
					var link = '<a class="song-link" href="' + data.results[i]['trackViewUrl'] + '">' + 
						data.results[i]['trackViewUrl'].substring(0, 42) + '...' + '</a>'

					var row = '<tr class="row content_row"><td class="favorite"></td><td>' + img + '</td><td>' + name + '</td><td>'
						+ link + '</td></tr>';

					// append to table
					table.append(row);
				}

				// add to html
				$("html").append(table);

				// set tracker value
				hasSearched = true;
			}
		});
	});

	$(".content-row").on({
		mouseenter: function () {
			var checkbox = '<input type="checkbox" class="fav">'
			$(this).children(".favorite").append(checkbox);
		},
		mouseleave: function () {

		}
	});
});