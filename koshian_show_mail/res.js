//const DEFAULT_DISABLE_MAIL = true;
//const DEFAULT_REPLACE_URL = true;
const DEFAULT_USE_NEWTAB = true;
//let disable_mail = DEFAULT_DISABLE_MAIL;
//let replace_url = DEFAULT_REPLACE_URL;
let use_newtab = DEFAULT_USE_NEWTAB;

const match_patter_list = [
    /(f\d+\.[0-9A-Za-z]+)/,
    /(fu\d+\.[0-9A-Za-z]+)/,
    /(sz\d+\.[0-9A-Za-z]+)/,
    /(sq\d+\.[0-9A-Za-z]+)/,
    /(su\d+\.[0-9A-Za-z]+)/,
    /(sa\d+\.[0-9A-Za-z]+)/,
    /(ss\d+\.[0-9A-Za-z]+)/,
    /(sp\d+\.[0-9A-Za-z]+)/,
];

const uploader_url_list = [
    `http://133.242.9.183/up/src/`,
    `http://133.242.9.183/up2/src/`,
    `http://www.siokarabin.com/futabafiles/big/src/`,
    `http://www.nijibox6.com/futabafiles/mid/src/`,
    `http://www.nijibox5.com/futabafiles/tubu/src/`,
    `http://www.nijibox6.com/futabafiles/001/src/`,
    `http://www.nijibox5.com/futabafiles/kobin/src/`,
    `http://www.nijibox2.com/futabafiles/003/src/`,
];

let last_process_index = 0;

function replaceSio(anchor){
    for(let i = 0; i < match_patter_list.length; ++i){
        let matches = anchor.text.match(match_patter_list[i]);
        if(matches){
            anchor.href = `${uploader_url_list[i]}${matches[1]}`;
            if(use_newtab){
                anchor.target = `_blank`;
            }
            return true;
        }
    }

    return false;
}

function process(beg = 0, end = -1){
    let thre = document.getElementsByClassName("thre")[0];
    if(thre == null){
        return;
    }

    let anchor_list = thre.getElementsByTagName("a");
    
    if(end == -1){
        end = anchor_list.length;
    }else{
        end = Math.min(end, anchor_list.length);
    }
    let non_anchor_list = [];

    for(let i = beg; i < end; ++i){
        let anchor = anchor_list[i];

        if(!anchor.href){
            continue;
        }

        let matches = anchor.href.match(/mailto:(.+)/);
        if(matches != null){
            let date = document.createTextNode(`${anchor.text} `);
            anchor.parentNode.insertBefore(date, anchor.nextSibling);

            let meran = decodeURI(matches[1]);
            anchor.text = `[${meran}]`;

            if(!replaceSio(anchor)){
                non_anchor_list.push(anchor);
            }
        }
    }

    for(let i = 0; i < non_anchor_list.length; ++i){
        let elem = document.createElement("span");
        elem.className = "KOSHIAN_meran";
        elem.style.color = `#1020e0`;
        elem.textContent = non_anchor_list[i].text;
        non_anchor_list[i].parentNode.replaceChild(elem, non_anchor_list[i]);
    }

    last_process_index = end;
}

function main(){
    process();

    // KOSHIAN リロード監視
    document.addEventListener("KOSHIAN_reload", (e) => {
        process(last_process_index);
    });

    // ふたば リロード監視
    let contdisp = document.getElementById("contdisp");
    if (contdisp) {
        checkFutabaReload(contdisp);
    }
    function checkFutabaReload(target) {
        let status = "";
        let reloading = false;
        let config = { childList: true };
        let observer = new MutationObserver(() => {
            if (target.textContent == status) {
                return;
            }
            status = target.textContent;
            if (status == "・・・") {
                reloading = true;
            } else if (reloading && status.endsWith("頃消えます")) {
                process(last_process_index);
                reloading = false;
            } else {
                reloading = false;
            }
        });
        observer.observe(target, config);
    }
}

function safeGetValue(value, default_value) {
    return value === undefined ? default_value : value;
}

function onError(error) {
}

function onSettingGot(result) {
    //disable_mail = safeGetValue(result.disable_mail, DEFAULT_DISABLE_MAIL);
    //replace_url = safeGetValue(result.replace_url, DEFAULT_REPLACE_URL);
    use_newtab = safeGetValue(result.use_newtab, DEFAULT_USE_NEWTAB);

    main();
}

browser.storage.local.get().then(onSettingGot, onError);
