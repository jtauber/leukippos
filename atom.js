/* loosely based on jfeed */

$.getFeed = function(options) {
    options = jQuery.extend({ url: null, data: null, success: null, error: null }, options);
    
    if (options.url) {
        $.ajax({
            type: 'GET',
            url: options.url,
            data: options.data,
            dataType: 'xml',
            success: function(xml) {
                var feed = new Feed(xml);
                if ($.isFunction(options.success)) options.success(feed);
            },
            error: function(xhr, status, errorThrown) {
                if ($.isFunction(options.error)) options.error(status); else alert(status);
            }
        });
    }
};


function Entry() {};

function Feed(xml) {
    this._parse(xml);
};

Feed.prototype = {
    
    _parse: function(xml) {
        
        this.title = $("feed > title", xml).text();
        this.link_self = $("feed > link[rel=self]", xml).attr('href');
        this.link_alternate = $("feed > link[rel=alternate]", xml).attr('href');
        if (!this.link_alternate) this.link_alternate = $("feed > link", xml).attr('href');
        this.updated = $("feed > updated", xml).text();
        this.author = $("feed > author > name", xml).text();
        this.id = $("feed > id", xml).text();
        
        this.entries = new Array();
        
        var feed = this;
        
        $("feed > entry", xml).each(function() {
            var entry = new Entry();
            
            entry.title = $(this).find("title").text();
            entry.link_alternate = $(this).find("link[rel=alternate]").attr('href');
            if (!entry.link_alternate) entry.link_alternate = $(this).find("link").attr('href');
            entry.id = $(this).find("id").text();
            entry.updated = $(this).find("updated").text();
            entry.published = $(this).find("published").text();
            entry.author_name = $(this).find("author > name").text();
            entry.author_uri = $(this).find("author > uri").text();
            entry.summary = $(this).find("summary").text();
            entry.content = $(this).find("content").text();
            
            feed.entries.push(entry);
        });
    }
};

