var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.grid.pagination', 'ui.grid.expandable']);
 
app.controller('MainCtrl', [
'$scope', '$http', 'uiGridConstants', function($scope, $http, uiGridConstants) {
 
  var paginationOptions = {
    pageNumber: 1,
    pageSize: 25,
    sort: null
  };

  var subgridpaginationOptions = {
    pageNumber: 1,
    pageSize: 25,
    sort: null
  };
 
  $scope.gridOptions = {
    expandableRowTemplate: 'expandableRowTemplate.html',
    expandableRowHeight: 250,
    paginationPageSizes: [25, 50, 75],
    paginationPageSize: 25,
    useExternalPagination: true,
    useExternalSorting: true,
    columnDefs: [
      { name: 'name' },
      { name: 'gender', enableSorting: false },
      { name: 'company', enableSorting: false }
    ],
    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
      $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
        if (sortColumns.length == 0) {
          paginationOptions.sort = null;
        } else {
          paginationOptions.sort = sortColumns[0].sort.direction;
        }
        getPage();
      });
      gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
        paginationOptions.pageNumber = newPage;
        paginationOptions.pageSize = pageSize;
        getPage();
      });
      gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
          var isExpanded = row.isExpanded;

          gridApi.expandable.collapseAllRows();

          if (isExpanded) row.isExpanded = true;

          if (row.isExpanded) {
              row.entity.subGridOptions = {
                columnDefs: [
                { name: 'name'},
                { name: 'gender'},
                { name: 'company'}
              ],
              paginationPageSizes: [10],
              paginationPageSize: 10,
              useExternalPagination: true,
              useExternalSorting: true,
              onRegisterApi: function(gridApi) {
                gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                    if (sortColumns.length == 0) {
                      subgridpaginationOptions.sort = null;
                    } else {
                      subgridpaginationOptions.sort = sortColumns[0].sort.direction;
                    }
                    subgridgetPage(row);
                });

                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    subgridpaginationOptions.pageNumber = newPage;
                    subgridpaginationOptions.pageSize = pageSize;
                    subgridgetPage(row);
                });

                subgridgetPage(row);
              }
            };
          }
      });
    },
    expandAllRows: function() {
      $scope.gridApi.expandable.expandAllRows();
    },
    collapseAllRows: function() {
      $scope.gridApi.expandable.collapseAllRows();
    }
  };
 
  var getPage = function() {
    var url = 'http://ui-grid.info';
    switch(paginationOptions.sort) {
      case uiGridConstants.ASC:
        url = url + '/data/100_ASC.json';
        break;
      case uiGridConstants.DESC:
        url = url + '/data/100_DESC.json';
        break;
      default:
        url = url + '/data/100.json';
        break;
    }
 
    $http.get(url)
    .success(function (data) {
      $scope.gridOptions.totalItems = 100;
      var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
      $scope.gridOptions.data = data.slice(firstRow, firstRow + paginationOptions.pageSize);
    });
  };

  var subgridgetPage = function(row) {
    var url = 'http://ui-grid.info';
    switch(subgridpaginationOptions.sort) {
      case uiGridConstants.ASC:
        url = url + '/data/100_ASC.json';
        break;
      case uiGridConstants.DESC:
        url = url + '/data/100_DESC.json';
        break;
      default:
        url = url + '/data/100.json';
        break;
    }
 
    $http.get(url)
    .success(function (data) {
      row.entity.subGridOptions.totalItems = 100;
      var firstRow = (subgridpaginationOptions.pageNumber - 1) * subgridpaginationOptions.pageSize;
      row.entity.subGridOptions.data = data.slice(firstRow, firstRow + subgridpaginationOptions.pageSize);
    });
  };
 
  getPage();
}
]);