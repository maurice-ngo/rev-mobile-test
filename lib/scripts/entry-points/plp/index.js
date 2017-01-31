var $ = require('jquery');
var heartProduct = require('modules/heart-product');


function filterSetup() {
  // Event for clicking on overlay on title dropdown
  var $pageHeaderOverlay = $(".js-page-header-overlay");
  var $pageHeaderTitle =$(".page-header__title");


  $pageHeaderOverlay.on("click", function() {
    $pageHeaderTitle.click();
  });
}


// var manageRefineMenu = require('./manage-refine-menu');
// var toggleCategoryDropdown = require('./toggle-category-dropdown');
// var loadBrands = require('modules/load-brands');

// function setupToggleCategoryDropdown() {
//   toggleCategoryDropdown();
// }

// function resetFilters() {
//   var $filterSelects = $('#filter_options').find('.select_single select, .select_multiple select');

//   $('#clear_filters').click(function(event) {
//     event.preventDefault();
//     $filterSelects.prop('selectedIndex', 0);
//   });
// }

// function processSorting() {
//   var $formSort = $('#sort_by_form');
//   var $filterApply = $('#apply_filters');
//   $('#sort_options').change(function(){
//     $formSort.submit();
//     $filterApply.click();
//   });
// }

// function bindBrandsURl() {
//   $('#apply_filters, #next_btn').on('click', function(e) {
//     loadBrands(e.currentTarget);
//   });

//   $('#plp_filter_dd').on('click', 'a', function(e) {
//     loadBrands(e.target);
//   });
// }

function bindHeartItems() {
  heartProduct('#pageItems', '.fav-item');
}

$(document).ready(function() {
  filterSetup();
  // manageRefineMenu();
  // setupToggleCategoryDropdown();
  // resetFilters();
  // processSorting();
  // bindBrandsURl();
  bindHeartItems();
});
