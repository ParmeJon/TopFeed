const urlParams = new URLSearchParams(window.location.search);
const access_token = urlParams.get("access_token");
console.log(access_token)
if (access_token) {
    fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_url,media_type,permalink,like_count&access_token=${access_token}`)
    .then((res) => {
        console.log(res)
    })
}
document.getElementById('authorize-btn')
document.addEventListener('click', (e) => {
    console.log("clickable")
})