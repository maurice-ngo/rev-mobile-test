$(window).load(function(){
    $('#jqt').fadeIn(1000);
});
$(document).ready(function(){
	//<!-- Toggle SubMenu -->
	$('#plpheader_dropdown .plp_filter_dd').hide();
    $('#plpheader_dropdown .rev_page_header').click(function() {
    	if($('#arrowdown_header').hasClass('arrowdown')) {
	        if($('#plp_filter_dd').is(':hidden')) {
	            $(this).toggleClass('active');
	            $('#plp_filter_dd').slideDown();
	        } else {
	            $(this).toggleClass('active');
	            $('#plp_filter_dd').slideUp();
	        }
    	}
    });
	
    $('#clear_filters').click(function(event) {
        event.preventDefault();
        $('.select_single select, .select_multiple select').prop('selectedIndex', 0);
    });

    $('#sort_options').change(function(){
        $('#sort_by_form').submit();
        $('#apply_filters').click();
    });

    //color swatch
    $('.color-icon-switch').click(function(){
    	if($(this).hasClass('icon-arrow-down')){
    		$(this).parents('.plp_color').find('.more-color-div').slideDown();
    		$(this).addClass('icon-arrow-up').removeClass('icon-arrow-down');
    	}else{
    		$(this).parents('.plp_color').find('.more-color-div').slideUp();
    		$(this).addClass('icon-arrow-down').removeClass('icon-arrow-up');
    	}
    });
    /*
    // This attempted to deselect the first entry in multi-select drop downs (e.g., All Designers) once an actual designer is selected
    // It behaves strangely across different browsers, though.
    $('.select_multiple select').change(function(){
        var selectDropDown = $(this);
        if (selectDropDown.prop('selectedIndex') != 0){
            $('option', selectDropDown).first().prop('selected', false);
        }
    });
    */
});

/*
// Used http://stackoverflow.com/a/10136523 to implement this, but the behavior is not consistent across browsers
function showDropDown(element) {
    var event;
    event = document.createEvent('MouseEvents');
    event.initMouseEvent('mousedown', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
    element.dispatchEvent(event);
}

function toggleSort(){
    $('#filter_options').slideUp('fast', function(){
        $('#sort_options').slideToggle(function(){
            var sortByDropDown = $('#sortby');
            if (sortByDropDown.is(':visible')){
                var dropdown = document.getElementById('sortby');
                showDropDown(dropdown);
            }
        });
    });
}
 */
function getMultiItemOptions(element){
	if (element && element.length > 0){
		// Remove empty values (i.e., the "All" value) if there are other values
		// Customer will have clear all filters or de-select filters to get back the "All" value
		var options = element.val();
		if (options.length > 1){
			var rtn = [];
			for (var i=0; i<options.length; i++){
				if (options[i] != '')
					rtn.push(options[i]);
			}
			options = rtn;
		}
		return options;
	} else {
		return [''];
	}
}
function loadBrandsURL(elem){
	if (elem === 'undefined')
		return;
	var urlParams = {
			path: window.location.href,
			sortBy: $('#sortby option:selected').length > 0 ? $('#sortby option:selected').val() : [''],
			designers: getMultiItemOptions($('#alldesigners')),
			sizes: getMultiItemOptions($('#allsizes')),
			colors: getMultiItemOptions($('#allcolors')),
			arrivalDate: $('#newarrivals').length > 0 ? $('#newarrivals').prop('value') : '',
			pageNum: parseInt($('#pageNum_param').val())
	};
	var isNewPage = $('#newarrivals').length > 0;
	var selectFromCategory = $(elem).closest('div').prop('id') === 'plp_filter_dd';
	
	// category filters
	if (selectFromCategory) {
		urlParams.path = $(elem).data('caturl');
		resetFilters(urlParams);
	}
	
	// new arrival dates
	if (isNewPage && !selectFromCategory) {
		urlParams.path = $('#newarrivals option:selected').data('url');
		urlParams.arrivalDate = $('#newarrivals').prop('value');
	}
	
	// pagination
	if (elem.id === 'pre_btn')
		urlParams.pageNum = urlParams.pageNum - 1;
	if (elem.id === 'next_btn')
		urlParams.pageNum = urlParams.pageNum + 1;

    // redirect to page 1 when filter is reset
    if (elem.id === 'apply_filters')
        urlParams.pageNum = 1;
	
	var newURL = '';
	var alreadyParams = (urlParams.path.indexOf("?") > -1);
	//var isPrettyURL = (urlParams.path.indexOf(".jsp") < 0);
	urlParams.path = removeFilterParams(urlParams);
	if (alreadyParams) {
		var amp = '&';
		if (urlParams.path.indexOf("?") === (urlParams.path.length - 1))
			amp = '';
		newURL = urlParams.path + amp + getFilterParams(urlParams);
	} else {
		newURL = urlParams.path + '?' + getFilterParams(urlParams);
	}
	
	// append arrival date for selected status
	if (isNewPage)
		newURL = newURL + "&arrivalDate=" + urlParams.arrivalDate;
	
	window.location.assign(newURL);
}

function resetFilters(urlParams){
	urlParams.designers = [''];
	urlParams.sizes = [''];
	urlParams.colors = [''];
	urlParams.arrivalDate = '';
	urlParams.pageNum = 1;
}

function getFilterParams(urlParams){
	var newURL = 'sortBy=' + urlParams.sortBy;
	
	for (i=0; i<urlParams.designers.length; i++) {
		newURL = newURL + '&designer=' + encodeURIComponent(urlParams.designers[i]);
	}
	
	for (i=0; i<urlParams.sizes.length; i++) {
		newURL = newURL + '&size=' + urlParams.sizes[i];
	}
	
	for (i=0; i<urlParams.colors.length; i++) {
		newURL = newURL + '&color=' + urlParams.colors[i];
	}
	
	newURL = newURL + '&pageNum=' + urlParams.pageNum;
	
	return newURL;
}

function removeFilterParams(urlParams) {
	// assume filter params are followed by each other
	// starts from sortby and ends at pagenume
	var startString = '&sortBy=';
	var endString = '&pageNum=' + parseInt($('#pageNum_param').val());
	var start = urlParams.path.indexOf(startString);
	var end = urlParams.path.indexOf(endString) + endString.length;
	if (start < 0) {
		start = urlParams.path.indexOf('sortBy=')
		if (start < 0)
			return urlParams.path;
	}
	
	var resultPath = urlParams.path.substring(0, start) + urlParams.path.substring(end);
	
	return resultPath;
}

function toggleSort(){
    $('#filter_options').slideUp('fast', function(){$('#sort_options').slideToggle();});
}

function toggleFilter(){
    $('#sort_options').slideUp('fast', function(){$('#filter_options').slideToggle();});
}

/* Taken from: http://jsfiddle.net/johnsonjo4531/3e83kkn7/3/
 * which was found here: http://stackoverflow.com/questions/5059526/infinite-scroll-jquery-plugin
 */
var shouldGetMoreItems = true;
var currentScrollTop;
function infiniteScroll (options) {
	var defaultOptions = {
		binder: $(window), // parent scrollable element
		loadSpot: 400
	}

	options = $.extend(defaultOptions, options);

	function scrollHandler () {
		var isAtBottom = ($(window).scrollTop() + $(window).height()) >= $(document).height();
		var isWithinRangeOfBottom = ($(window).scrollTop() + $(window).height() + options.loadSpot) >= $(document).height();
		if (shouldGetMoreItems && (isAtBottom || isWithinRangeOfBottom)) {
			currentScrollTop = $(window).scrollTop(); // Only trigger if scrolling down, not up
			shouldGetMoreItems = false;
			if(typeof options.cb === "function") {
				new Promise(function (resolve) {resolve();}).then(function() { return options.cb(); });
			}
		}
	}

	options.binder.scroll(scrollHandler);
}
function getMoreItems(container){
	var currentPage = container.data('currentPage');
	var maxPages = container.data('totalPages');
	var pageSize = container.data('pageSize');
	var newPage = currentPage ? currentPage+1 : 1;
	if (currentPage >= maxPages){
		return false;
	} else {
		$('#loading-text').show();
		$.ajax({
			type: 'POST',
			url: '/r/ipadApp/Brands.jsp?' + $('#plp-parameters').val(),
			data: $.param({
				pageSize: pageSize,
				pageNum: newPage,
				format: $('#plp-format').val(),
				mobile: true
			}),
			//dataType: 'html',
			success: function(data) {
				var items = $('.citem', data);
				$('#loading-text').hide();
				$('#pageItems').append(items);
				container.data('currentPage', newPage);
				shouldGetMoreItems = true;
			},
			failure: function(){
				console.log('getMoreItems failure!');
			},
			error: function(jqXHR, status, error){
				console.log('getMoreItems error!');
			}
		});
		return true;
	}

}
/*
$(document).ready(function () {
	currentScrollTop = $(window).scrollTop();
		infiniteScroll({
		cb: function () {
			return getMoreItems($('#pageItems'));
		}
	});
	$('#pre_btn, #next_btn').hide();  // If infinite scroll is available, do not use normal pagination
});
*/