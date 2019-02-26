function create(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}

window.onload = function () {
	
	var fragment3 = create('<img src="https://www.conversionpirate.com/safesite.jpg" alt="safe site" class="text-center center-block" style="margin:29px 0px">');
	document.getElementsByClassName('main__header')[0].appendChild(fragment3);
};