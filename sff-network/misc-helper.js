var request = require('request');


function theLastNameFirst(full_name, split_char) {
    var name_trimmed = full_name.trim();
    var aka_brackets = name_trimmed.split(' (');
    var first_whole_name = aka_brackets[0];
    var spaces_names = first_whole_name.split(split_char);
    var last_name = spaces_names.pop();
    if (spaces_names.length == 0) {
        var first_name = '-';
    } else {
        var first_name = spaces_names.join(split_char);
    }
    var last_first = last_name + split_char + first_name;
    if (last_first.indexOf('Jr.') === 0) {
        var jr_array = first_name.split(split_char);
        var jr_last_name_comma = jr_array.pop();
        var jr_first_name = jr_array[0];
        var jr_last_name = jr_last_name_comma.replace(',', '');
        var jr_last_first = jr_last_name + split_char + 'Jr.' + split_char + jr_first_name;
        return jr_last_first;
    }
    return last_first;
}
//   "book author":"H. Nearing, Jr."

function spacesToUnderscore(author_title) {
    var underscore_author_title = author_title.replace(/ /g, '_');
    return underscore_author_title;
}

function stripToLower(csv_string) {
    var lower_csv = csv_string.toLowerCase();
    var lower_stripped = lower_csv.replace(/[^0-9a-z ]/gi, '');
    return lower_stripped.trim();
}

function alphaUnderscore(book_or_author) {
    var lower_striped = stripToLower(book_or_author);
    var lower_underscored = spacesToUnderscore(lower_striped);
    return lower_underscored;
}


function getRedirects(a_node, field_name) {
    return new Promise(function (fulfill, reject) {
        var get_url = a_node[field_name];
        var node_id = a_node.id;
        if (get_url === '') {
            var end_redirect_url = '';
            fulfill({end_redirect_url, node_id, field_name})
        } else {
            request.get({
                url: get_url,
                method: "HEAD",
                headers: {}
            }, function (error, response, body) {
                if (error) {
                    reject(error)
                }
                var end_redirect_url = response.request.uri.href;
                fulfill({end_redirect_url, node_id, field_name})
            })
        }
    })

}


function resolveRedirects(get_url) {
    return new Promise(function (fulfill, reject) {
        request.get({
            url: get_url,            ///protocol relative URL
            method: "HEAD",
            headers: {}
        }, function (error, response, body) {
            if (error) {
                reject(error)
            }
            var end_redirect_url = response.request.uri.href;
            fulfill(end_redirect_url)
        })
    })
}

function waitSeconds(second_count, number_authors) {
    var milli_seconds = second_count * 1000
    if (number_authors < 50) {
        milli_seconds = 0;
    }
    var wait_promise = new Promise(function (resolve) {
        setTimeout(resolve, milli_seconds);
    });
    if (milli_seconds > 0) {
        console.log('    waiting for', second_count, 'seconds.')
    }
    return wait_promise;
}


function padStartNode(pad_number, pad_template) {
    var str_number = "" + pad_number
    var padded_number = pad_template.substring(0, pad_template.length - str_number.length) + str_number
    return padded_number;
}


function consoleTimeEnd(start_date, interval_name) {
    var end_date = Date.now();
    var seconds_interval = (end_date - start_date) / 1000;
    var seconds_round = Math.round(seconds_interval)
    const padded_number = padStartNode(seconds_round, "000");
    console.log(padded_number, "secs", interval_name);
}

function deleteCachedData() {

    const CachedAuthors = rootAppRequire('sff-network/build-nodes/cached-lists/cached-authors');
    const CachedBooks = rootAppRequire('sff-network/build-nodes/cached-lists/cached-books');
    var CachedQuality = rootAppRequire('sff-network/build-nodes/cached-lists/cached-quality');
    var CachedDefaults = rootAppRequire('sff-network/build-nodes/cached-lists/cached-default');

    const cached_authors = new CachedAuthors();
    const cached_books = new CachedBooks();
    const cached_quality = new CachedQuality();
    const cached_defaults = new CachedDefaults();
    cached_authors.deleteCache();
    cached_books.deleteCache();
    cached_quality.deleteCache();
    cached_defaults.deleteCache();
}


module.exports = {
    consoleTimeEnd,
    waitSeconds,

    theLastNameFirst,
    spacesToUnderscore,
    stripToLower,
    alphaUnderscore,
    getRedirects,
    resolveRedirects,
    deleteCachedData
};
