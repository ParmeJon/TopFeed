document.getElementById('authorize-btn')
document.addEventListener('click', (e) => {
    fetch('/auth')
    .then((res) => {
        console.log(res)
    })
})