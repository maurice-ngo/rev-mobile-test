var $ = require('jquery');
var SELECTORS = {
  filterOptions: '#filter_options',
  sortOptions: '#sort_options',
  refineSort: '#refine-sort',
  refineFilter: '#refine-filter'
};

module.exports = manageRefineMenu;
module.exports.SELECTORS = SELECTORS;

function manageRefineMenu() {
  var $filterOptions = $(SELECTORS.filterOptions);
  var $sortOptions = $(SELECTORS.sortOptions);

  $(SELECTORS.refineSort).on('click', function() {
    $filterOptions.slideUp('fast', function() {
      $sortOptions.slideToggle();
    });
  });

  $(SELECTORS.refineFilter).on('click', function() {
    $sortOptions.slideUp('fast', function() {
      $filterOptions.slideToggle();
    });
  });
}
