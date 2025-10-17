const iframeInput = document.querySelector("#iframeInput");
const URLInput = document.querySelector("#URLInput");
const OpenBtnIframe = document.querySelector("#OpenBtnIframe");
const OpenBtnURL = document.querySelector("#OpenBtnURL");
const DoURLEncode = document.querySelector("#DoURLEncode");
const Title = document.querySelector("#title");
const frmIframeTagRadio = document.querySelector("#frmIframeTag");
const frmURLRadio = document.querySelector("#frmURL");

function customDecode(encoded) {
    if (!encoded) return encoded;
  
    // 「?」で本体とクエリパラメータを分離
    const [base, ...query] = encoded.split("?");
  
    // URIデコード（%xx を通常の文字へ）
    const decoded = decodeURIComponent(base);
  
    // 奇数番目の文字だけ XOR (2 ^ charCode) で復号
    const original = decoded
      .split("")
      .map((char, idx) =>
        idx % 2 === 1 ? String.fromCharCode(2 ^ char.charCodeAt(0)) : char
      )
      .join("");
  
    // クエリパラメータがあれば再結合
    return original + (query.length ? "?" + query.join("?") : "");
}
function GetURLAndDecode(input){
    const valArr = input.split('/');
    const val = valArr[valArr.indexOf("ixl") + 1];
    let result = customDecode(val);
    return result;
}
function downloadFile(filename, content, type) {
    // 1. Blobオブジェクトを作成
    const blob = new Blob([content], { type: type });
    
    // 2. オブジェクトURLを生成
    const url = URL.createObjectURL(blob);
    
    // 3. aタグを動的に作成
    const a = document.createElement('a');
    
    // 4. aタグの属性を設定
    a.href = url;
    a.download = filename;
    
    // 5. ダウンロードをトリガー
    document.body.appendChild(a);
    a.click();
    
    // 6. 後処理
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function OpenFrmIframe(){
    const ElemText = iframeInput.value;
    const div = document.createElement('div');
    div.innerHTML = ElemText;
    const Elem = div.firstChild;
    if (Elem.tagName.toLowerCase() != "iframe"){
        window.alert("入力された要素はiframeではありません。");
        return;
    } 
    if (DoURLEncode.checked == true){
        Elem.src = GetURLAndDecode(Elem.src);
    }
    let title = "Iframe";
    if (!(Title.value == "")){
        title = Title.value;
    }
    const resultElem = document.querySelector('#result');
    resultElem.textContent = "";
    const shareLink = document.createElement('a');
    const encoded = encodeURIComponent(Elem.outerHTML);
    console.log(encoded);
    shareLink.href = `/iframe/?u=${encoded}&t=${encodeURIComponent(title)}`;
    shareLink.textContent = "WebのURL";
    resultElem.append(shareLink);
    resultElem.append(document.createElement('br'));
    const downloadContent = `<title>${title}</title><style>body{margin:0;padding:0;overflow:hidden;}iframe{height:100vh !important;width:100vw !important;}</style>`;
    // <title>Iframe</title><style>h1{color:red}iframe{height:100vh !important;width:100vw !important;overflow: hidden !important;}</style>${Elem.outerHTML}
    const downloadLink = document.createElement('a');
    downloadLink.href = `data:text/html,${encodeURIComponent(downloadContent)}`;
    downloadLink.download = "iframe.html";
    downloadLink.textContent = "data: URL";
    resultElem.append(downloadLink);
    // downloadFile('iframe.html', htmlContent, 'text/html');
}

function OpenFrmURL(){
    const URLText = URLInput.value;
    const Elem = document.createElement('iframe');
    Elem.src = URLText;
    if (DoURLEncode.checked == true){
        Elem.src = GetURLAndDecode(Elem.src);
    }
    let title = "Iframe";
    if (!(Title.value == "")){
        title = Title.value;
    }
    const resultElem = document.querySelector('#result');
    resultElem.textContent = "";
    const shareLink = document.createElement('a');
    const encoded = encodeURIComponent(Elem.outerHTML);
    console.log(encoded);
    shareLink.href = `/iframe/?u=${encoded}&t=${encodeURIComponent(title)}`;
    shareLink.textContent = "WebのURL";
    resultElem.append(shareLink);
    resultElem.append(document.createElement('br'));
    const downloadContent = `<title>${title}</title><style>body{margin:0;padding:0;overflow:hidden;}iframe{height:100vh !important;width:100vw !important;}</style>${Elem.outerHTML}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = `data:text/html,${encodeURIComponent(downloadContent)}`;
    downloadLink.download = "iframe.html";
    downloadLink.textContent = "data: URL";
    resultElem.append(downloadLink);
    // downloadFile('iframe.html', htmlContent, 'text/html');
}

OpenBtnIframe.addEventListener("click", OpenFrmIframe);
OpenBtnURL.addEventListener("click", OpenFrmURL);

frmIframeTagRadio.addEventListener("click", () => {
    frmURLRadio.checked = false;
    URLInput.disabled = true;
    OpenBtnURL.disabled = true;
    iframeInput.disabled = false;
    OpenBtnIframe.disabled = false;
});

frmURLRadio.addEventListener("click", () => {
    frmIframeTagRadio.checked = false;
    iframeInput.disabled = true;
    OpenBtnIframe.disabled = true;
    URLInput.disabled = false;
    OpenBtnURL.disabled = false;
});