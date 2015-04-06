function fileAwayDemTabs(newTab)
{

	if(localStorage.toggleState == "on")
	{
		console.log("Stawted from the bottom");

		if(localStorage.tabvFolderId == null)
		{
			chrome.bookmarks.search({title: "Tabvention"}, function(results)
				{
					if(results.length == 0)
					{
						console.log("Create that bitch");
						chrome.bookmarks.create({parentId : "1", title: "Tabvention" }, function(tabventionFolder)
							{
								localStorage.tabvFolderId = tabventionFolder.id;
							});
					}
					else
					{
						console.log("Dat result butter");
						console.log(results);
						localStorage.tabvFolderId = results[0].id;
					}
					console.log("Found results");
					console.log(results);
				});
		}

		//chrome.bookmarks.create({parentId : "1", title: "Tabvention" });

		console.log(moment().format('MMMM Do, YYYY'));

		chrome.tabs.query({}, function(tabs){
			var tabCount = tabs.length;

			console.log("tabCount: " + tabCount);

			if(tabCount > localStorage.maxTabs)
			{
				var curDate = moment().format('MMMM Do, YYYY');

				if(localStorage.dateFolderId == null || localStorage.dateFolderTitle != curDate)
				{
					console.log("Trying to build");
					console.log(curDate);
					console.log(localStorage.tabvFolder);
					chrome.bookmarks.create({parentId : localStorage.tabvFolderId, title: curDate}, function(currentDateFolder)
							{
								localStorage.dateFolderId = currentDateFolder.id;
								localStorage.dateFolderTitle = currentDateFolder.title;
							});
				}

				var tabsToDelete = tabCount - localStorage.maxTabs;
				for(x=0; x<tabsToDelete; x++)
				{
					console.log(tabs[x]);
					chrome.bookmarks.create({parentId : localStorage.dateFolderId, title: tabs[x].title, url: tabs[x].url});
					//TODO: Don't create bookmark if in delete mode
					chrome.tabs.remove(tabs[x].id);
				}
			}

			chrome.bookmarks.getTree(function(bookmarks){
				bookmarks.forEach(function(bookmark)
				{
					console.log(bookmark);
				});
			});

		})

		//TODO: If focus/antisocial mode, close any tabs that go to social sites
		//One more thing: eventually make an update to check for YouTube, SoundCloud, Pandora, etc
		//so as to not stop da beat
	}
}

window.onload = function()
{
	if(localStorage.maxTabs !== null)
	{
		$("#maxTabs").val(localStorage.maxTabs);
		if(localStorage.toggleState == "on")
		{
			$('#onOff').prop('checked', true);
		}
	}

	chrome.tabs.onCreated.addListener(fileAwayDemTabs);
	$("#maxTabs").keydown(function(e){
		localStorage.toggleState = null;
		$('#onOff').prop('checked', false);

		//Took this from http://stackoverflow.com/questions/469357/html-text-input-allow-only-numeric-input

		if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
             // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
             // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress

        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
	});

	$("#onOff").change(function() {
		console.log("This is firing!!!")
	    if(this.checked) {
	    	var maxTabs = $("#maxTabs").val();
	    	if(maxTabs !== null && maxTabs > 0)
	    	{
		        localStorage.toggleState = "on";
		        localStorage.maxTabs = $("#maxTabs").val();
		        fileAwayDemTabs();
	    	}
	    	else
	    	{
	    		localStorage.toggleState = null;
	    		$('#onOff').prop('checked', false);
	    	}
	    }
	    else
	    {
	    	localStorage.toggleState = null;
	    }
	});


};

