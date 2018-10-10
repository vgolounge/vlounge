/**
 * Created by nikhil on 20-Jul-18.
 */
function renderInPage(where, content){
    $(where).html(content);
}

$(document).on('click', '.modal-background, .modal-close', function () {
    $(this).closest('.modal').removeClass('is-active')
});