const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get("myParam");
console.log(myParam)
fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_url,media_type,permalink,like_count&access_token=${myParam.access_token}`)
.then((res) => {
    console.log(res)
})
document.getElementById('authorize-btn')
document.addEventListener('click', (e) => {
    console.log("clickable")
})