(function () {
    function selectDataSource(params) {
        return "db.mysql_any_badge"
    }

    function _init_() {
        Data.setDataSourceSelector(selectDataSource);
    }

    return {
        init: _init_
    }
})();