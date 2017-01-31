function clearContents(){
    	document.getElementById('search_term').value="";
    }
    function findValue(li)
    {
    	//if( li == null ) return alert("No match!");

    	// if coming from an AJAX call, let's use the CityId as the value
    	if( !!li.extra ) var sValue = li.extra[0];

    	// otherwise, let's just display the value in the text box
    	else var sValue = li.selectValue;

    	//alert("The value you selected was: " + sValue);
    }

    function selectItem(li)
    {
    	var sValue = li.selectValue;
        document.forms["frmSearch"].submit();
    
    }

    function formatItem(row)
    {
    	var searchTerm = document.getElementById('search_term').value;
    	var start = searchTerm.length;
    	
    	var displayString = row[0].substr(0,start) + '<span>' + row[0].substr(start,row[0].length) + '</span>';
    	return displayString;
    }

    function lookupAjax()
    {
    	var oSuggest = $("#search_term")[0].autocomplete;
    	oSuggest.findValue();
    	return false;
    } 
    $(function() {
    	$("#search_term").autocomplete(
        		"/mobile/SearchSuggestions.jsp",
        		{
        			delay:100,
        			minChars:2,
        			matchSubset:1,
        			matchContains:1,
        			cacheLength:1,
        			onItemSelect:selectItem,
        			onFindValue:findValue,
        			maxItemsToShow: 20,
        			formatItem:formatItem,			
        			autoFill:false
        		}
        	); 
    });
    function createCookie(name,value,days) {
		if (days!=null && days>0) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();			
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";		
	}
	
	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}

	function createTransientCookie(name,value)
	{
		createCookie(name,value,-1);
	}

$(function(){
    $(".top_search_btn").on("click",function(){
        $("#search_term").focus();
    });
});
	
	