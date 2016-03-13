$(document).ready(function () {

	// on load, hide checkmark
	$(".favorites-checkmark").hide();
	$(".favorites-delete").hide();

	// var to keep track of first click (once done, useless)
	var hasSearched = false;

	// array to hold favorites
	var favorites = [];

	// on load, parse and add favorites
	if (JSON.parse(localStorage["favorites_array"])) {
		loadFavorites();
	}

	function loadFavorites() {
		// retrive array
		favorites = JSON.parse(localStorage["favorites_array"]);

		// push favorites into favorites list
		for (i = 0; i < favorites.length; i++) {
			// push favorites into list
			var favorite = '<p class="favorites-list">' + favorites[i] + '</p>';
			$(".favorites").append(favorite);
		}
	}

	$("#search-button").click(function() {

		// ajax query
		$.ajax ({
			type: 'GET',
			dataType: 'jsonp',
			data: {},
			url: "https://itunes.apple.com/search?term=" + $("#search-field").val() + "&limit=25",
		})
		.then(function(data) {

			var text = "iTunes Search Results for " + $("#search-field").val();

			if (hasSearched) {
				$(".results-header").text(text);
				$(".results-table").remove();
			} else {
				// show h2 bar
				$(".content").append("<p><b>" + text + "</b></p>").addClass("results-header");
			} 

			// create table to show results
			var table = $("<table></table>").addClass("results-table").addClass("table");

			// create and append headers
			var headers = '<tr class="row"><th class="header">Album Image</th><th class="header">Song Name</th><th class="header">Listen to It</th></tr>'
			table.append(headers);

			for (i = 0; i < data.results.length; i++) {

				// build content for row
				var img = '<img class="song-img" id=' + data.results[i]["previewUrl"] + ' src="' + data.results[i]['artworkUrl100'] + '">';
				var name = '<p class="song-name">' + data.results[i]['trackCensoredName'].substring(0, 27) + '</p>';
				var link = '<a class="song-link" href="' + data.results[i]['trackViewUrl'] + '">' + 
					data.results[i]['trackViewUrl'].substring(0, 42) + '...' + '</a>'

				var row = '<tr class="row content-row"><td>' + img + '</td><td>' + name + '</td><td>'
					+ link + '</td></tr>';

				// append to table
				table.append(row);
			}

			// add to content div
			$(".content").append(table);

			// set tracker value
			hasSearched = true;

		});
	});

	$(".content").on("click", ".song-img", function() {
		// set audio src
		$("#thirty-second-preview").attr("src", $(this).attr("id"));

		// play audio
		$("thirty-second-preview").get(0).play();

	});

	$(".content").on("click", ".song-name", function() {
		// declare song name
		var song_name = $(this).text();

		// check if in favorites already
		if (jQuery.inArray(song_name, favorites) == -1) {

			// if not (-1 return), push into favorites
			favorites.push(song_name);

			// render on page
			var favorite = '<p class="favorites-list">' + song_name + '</p>';
			$(".favorites").append(favorite);

			// fade ins / outs
			$(".favorites-checkmark").fadeIn();
			$(".favorites-checkmark").fadeOut();
		}

		// overhead for pushing array to localstorage
		localStorage["favorites_array"] = JSON.stringify(favorites);
	});

	$(".favorites").on("mouseenter mouseleave", ".favorites-list", function(e) {
		if (e.type == "mouseenter") {
			$(".favorites-delete").fadeIn();
		} else {
			$(".favorites-delete").fadeOut();
		}
	});

	$(".favorites").on("click", ".favorites-list", function() {
		// remove from favorites array
		favorites = favorites.splice(favorites.indexOf($(this).text()), 1);

		// remove from DOM
		$(this).remove();
		$(".favorites-delete").fadeOut();

		// bug fix
		if (favorites.length == 1) {
			favorites = [];
		}

		// set localstorage properly
		localStorage["favorites_array"] = JSON.stringify(favorites);
	});
});