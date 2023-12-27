function stripHtmlTagsAndDecodeEntities(htmlString: string) {
    if (!htmlString) return ''
    // Remove HTML tags
    let strippedString = htmlString.replace(/(<([^>]+)>)/gi, "");

    // Decode HTML entities
    let decodedString = document.createElement("textarea");
    decodedString.innerHTML = strippedString;
    strippedString = decodedString.value;

    return strippedString;
}

export function copyText(value: string) {
    value = stripHtmlTagsAndDecodeEntities(value)
    const textarea = document.createElement('textarea');
    textarea.setAttribute('readonly', 'readonly'); // 防止手机上弹出软键盘
    textarea.value = value
    document.body.appendChild(textarea);
    textarea.select();
    const res = document.execCommand('copy');
    document.body.removeChild(textarea);
    return res;
}
