/* GET */

// Todo: Find a way to use uQuery.get (on lowercase).
public static function Get(url : String) {
    Get(url, {});
}

public static function Get(url : String, data : Boo.Lang.Hash) {
    Get(url, data, null);
}

public static function Get(url : String, success : function(String, uQueryXHR)) {
    Get(url, null, success);
}

public static function Get(url : String, data : Boo.Lang.Hash, success : function(String, uQueryXHR)) {
    Get(url, data, success, null);
}

public static function Get(url : String, data : Boo.Lang.Hash, success : function(String, uQueryXHR), dataType : String) { 
    uQuery.ajax({
        "url": url,
        "data": data,
        "success": success,
        "dataType": dataType
    });
}


/* POST */

public static function post(url : String) {
    post(url, {});
}

public static function post(url : String, data : Boo.Lang.Hash) {
    post(url, data, null);
}

public static function post(url : String, data : Boo.Lang.Hash, success : function(String, uQueryXHR)) {
    post(url, data, success, null);
}

public static function post(url : String, data : Boo.Lang.Hash, success : function(String, uQueryXHR), dataType : String) { 
    uQuery.ajax({
        "type": "POST",
        "url": url,
        "data": data,
        "success": success,
        "dataType": dataType
    });
}
