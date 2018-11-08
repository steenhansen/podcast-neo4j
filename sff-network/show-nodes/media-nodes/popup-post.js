module.exports =  function (server_var) {

var load_css_external = `



sff_vars.post_procs = (function (post_close_svg, post_proxy) {

    var my = {
        my_var: ${server_var}
    };

    my.loadPost = function (pdf_url,strip_author,req_query_view) {
    
        if (req_query_view===''){
            sff_vars.history_state.pushAuthor(strip_author);
        }else{
            sff_vars.history_state.pushAuthorView(strip_author,req_query_view);
       }
       
       
        sff_vars.helpers.setDisplay('close--icon', 'none');
        document.getElementById('close--icon').src = post_close_svg;     /// q*bert
         sff_vars.helpers.setDisplay('popup--container', 'block');
            sff_vars.helpers.setDisplay('pdf--controller', 'none');
            
        var proxy_call = post_proxy + pdf_url;
        
       // console.log('post_px, pdf==-', proxy_call, pdf_url);
        
        
        fetch(proxy_call)
            .then(function (response) {
                 var text_promise = response.text();
                  return text_promise;
            })
            .then(function (post_html) {
            
                document.getElementById("post--container").innerHTML = post_html;
                var post_height = document.getElementById("post--container").offsetHeight + 200;
                document.getElementById('popup--container').style.height = post_height + 'px';
                 sff_vars.blur_procs.blockPage('popup--container');
            });
       
       
        sff_vars.blur_procs.postPdfWidth('post--container');
    }
    return my;

}( sff_vars.graph_vars.node_icons.I_CLOSE_POST.image, sff_vars.post_vars.post_proxy
)) 







`;
return load_css_external;

}







