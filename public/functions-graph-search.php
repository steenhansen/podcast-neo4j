<?php

/*
 * public_html/wp-content/themes/revolution-code-blue2/functions.php
 *   include 'functions-graph-search.php';
 * 
 * 
 *  Modify public_html/wp-content/themes/revolution-code-blue2/header.php
 <div id="navbarright">
         <form role="search" method="post" id="searchform" class="searchform" action="https://www.sffaudio.com/search/"
    onsubmit="
	    if ( (location.pathname==='/search/') && sff_js_vars){
		    var wp_search_text = document.getElementById('search_term').value;
		    var graph_text_box = document.getElementById('filter--author--text');
		    graph_text_box.value=wp_search_text;                
		    sff_js_vars.vars_events.executeSearch(wp_search_text);
		    return false;
	    }else{
		    return true;
	    }
    "  >
<div>
 * 
 * 
 *  Modify WordPress Page - Search
 *    add [graph_search_component] to the HTML
 *    and page attributes
 *          - NO PARENT
 *          - Default Template
 */

// public_html/wp-content/themes/revolution-code-blue2/functions-graph-search.php

if (!class_exists('SffGraphSearch')) {


    class SffGraphSearch
    {
        static function redirectAfterHeader($new_location)
        {
            echo "<meta http-equiv='Refresh' content='0;url=$new_location' />";
            exit();
        }

        static function isMobileOne($http_user_agent)
        {
            if (strpos($http_user_agent, '(iPad;')) {
                return true;
            }
            $regex_user_agent = '/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i';
            if (preg_match($regex_user_agent, $http_user_agent)) {
                return true;
            } else {
                return false;
            }
        }

        static function isMobileTwo($http_user_agent)
        {
            $regex_4_user_agent = '/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i';
            $user_agent_4 = substr($http_user_agent, 0, 4);
            if (preg_match($regex_4_user_agent, $user_agent_4)) {    // http://detectmobilebrowsers.com/
                return true;
            } else {
                return false;
            }
        }

        static function leaveIfMobile($url_with_parameters)
        {
            if (SffGraphSearch::isMobileOne($_SERVER['HTTP_USER_AGENT'])) {
                SffGraphSearch::redirectAfterHeader($url_with_parameters);
            } else if (SffGraphSearch::isMobileTwo($_SERVER['HTTP_USER_AGENT'])) {
                SffGraphSearch::redirectAfterHeader($url_with_parameters);
            } else {
                return;
            }
        }


       static  function curlGetContents($get_url)
        {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_URL, $get_url);
            $page_data = curl_exec($ch);
            curl_close($ch);
            return $page_data;
        }

        static function getQueryParameters($widget_url, $get_author, $get_book, $get_view, $get_choice)
        {
            if ($get_book) {
                if ($get_view) {
                    if ($get_choice){
                        $author_book_view = "$widget_url?book=$get_book&author=$get_author&view=$get_view&choice=$get_choice";
                    }else{
                        $author_book_view = "$widget_url?book=$get_book&author=$get_author&view=$get_view";
                    }
                } else {
                    $author_book_view = "$widget_url?book=$get_book&author=$get_author";
                }
            } else if ($get_author) {
                if ($get_view) {
                   if ($get_choice){
                       $author_book_view = "$widget_url?author=$get_author&view=$get_view&choice=$get_choice";
                   }else {
                       $author_book_view = "$widget_url?author=$get_author&view=$get_view";
                   }
                } else {
                    $author_book_view = "$widget_url?author=$get_author";
                }
            } else {
                $author_book_view = $widget_url;
            }
            return $author_book_view;
        }

//https://www.sffaudio.com/?s=beyond+lies
// s=philip+k+dick => search_term=philip-k-dick
        static function whatSearch($search_term)
        {
            $search_dashes = '';
            if (is_string($search_term)) {
                if (strlen($search_term)>0) {
                    $search_dashes = str_replace('+', '-', $search_term);
                }
            }
            return $search_dashes;
        }

        static function mobileRedirect($mobile_leaving_pages, $url_with_parameters)
        {
            $php_filename = basename(__FILE__);
            if (in_array($php_filename, $mobile_leaving_pages)) {
                SffGraphSearch::leaveIfMobile($url_with_parameters);
            }
        }

        static function phpCodeOnly($url_with_parameters)
        {
            $graph_html = SffGraphSearch::curlGetContents($url_with_parameters);
            $iosMetaViewPort__webHtmlJavascript = explode('<!-- end widget intro. NB, this text is used by PHP -->', $graph_html);
            $web_html_javascript = $iosMetaViewPort__webHtmlJavascript[1];
            return $web_html_javascript;
        }
    }
}

// https://www.sffaudio.com/search/
if (!function_exists('graph_search_component')) {
    function graph_search_component()
    {  //  [graph_search_component]
    
error_reporting(E_ALL);
ini_set('display_errors', 1);
    
        $mobile_leaving_pages = array('about.php', '');
        $widget_url = 'https://sffaudio-search.herokuapp.com';
        $get_author = @$_GET['author'];
        $get_book = @$_GET['book'];
        $get_view = @$_GET['view'];
        $get_choice = @$_GET['choice'];

        $url_with_parameters = SffGraphSearch::getQueryParameters($widget_url, $get_author, $get_book, $get_view, $get_choice);
        SffGraphSearch::mobileRedirect($mobile_leaving_pages, $url_with_parameters);
          $search_dashes = SffGraphSearch::whatSearch(@$_POST['search_term']);
        $web_html_javascript = SffGraphSearch::phpCodeOnly($url_with_parameters);

        $from_php_js_html = <<<JAVASCRIPT_HTML
        <script>
            window.sff_php_vars={ 
			    "php_url"   : "$widget_url",
			    "php_author": "$get_author",
			    "php_book"  : "$get_book",
			    "php_search": "$search_dashes"             // if not '' then inject into text box, fix 'reset' and then run ....
			       };
        </script>
        $web_html_javascript
JAVASCRIPT_HTML;

error_reporting(0);
ini_set('display_errors', 0);

        return $from_php_js_html;
    }
}




if ( !shortcode_exists( 'graph_search_component' ) ) {
    if (function_exists('add_shortcode')) {
          add_shortcode('graph_search_component', graph_search_component);
    }
}

