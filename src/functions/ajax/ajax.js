public static function ajax(url : String) : uQueryXHR {
    return uQuery.ajax(url, null);
}

public static function ajax(settings : Boo.Lang.Hash) : uQueryXHR {
    return uQuery.ajax(settings["url"] as String, settings);
}

public static function ajax(url : String, settings : Boo.Lang.Hash) : uQueryXHR {
    var xhr : uQueryXHR = new uQueryXHR();
    var form : WWWForm = new WWWForm();
    xhr.headers = form.headers;
    xhr.form = form;
    
    xhr.url = url;
    
    if ( settings['beforeSend'] != null ) {
        xhr.beforeSend = settings['beforeSend'] as Function;
    }
    
    if( settings['cache'] == false ) {
        xhr.cache = false;
    }
    
    if ( settings['complete'] != null ) {
        xhr.complete = settings['complete'] as Function;
    }
    
    if ( settings['contentType'] != null ) {
        xhr.headers['Content-Type'] = settings['contentType'];
    }
    
    if ( settings['data'] != null ) {
        if ( settings['data'].GetType() == Boo.Lang.Hash ) {
            xhr.data = settings['data'] as Boo.Lang.Hash;
        }
    }
    
    if ( settings['error'] != null ) {
        xhr.error = settings['error'] as Function;
    }
    
    if ( settings['headers'] != null ) {
        for( var entry : System.Collections.DictionaryEntry in settings['headers'] as System.Collections.DictionaryEntry[] ) {
            xhr.headers.Add(entry.Key.ToString(), entry.Value.ToString());
        }
    }
    
    if ( settings['success'] != null ) {
        xhr.success = settings['success'] as function(String, uQueryXHR);
    }
    
    if ( settings['type'] != null ) {
        xhr.type = settings['type'].ToString();
    }
    
    if ( settings['username'] != null && settings['password'] != null ) {
        xhr.headers.Add("Authorization", "Basic " + System.Convert.ToBase64String(System.Text.Encoding.ASCII.GetBytes(settings['username'] + ":" + settings['password'] )));
    }
    
    xhr.run();
    return xhr;
    
}