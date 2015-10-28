angular.module('nodeadmin.togglemenu', [])
.directive('toggleMenu', function () {
  return { template: 
    '<div class="menu-div" style="background-color: black;">' +
      '<a ng-click="toggleMenu()" class="btn btn-default btn-lg toggle-menu" id="menu-toggle">' +
        '<span class="glyphicon" ng-class=\'{"glyphicon-chevron-right": menu, "glyphicon-chevron-left": !menu}\' aria-hidden="true">' +
        '</span>' +
      '</a>' +
    '</div>'
  }
})