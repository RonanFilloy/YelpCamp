function previewMultiple (event) {
    const form = document.querySelector("#formFile");
    form.innerHTML = "";
    for(i = 0; i < event.target.files.length; i++) {
        const urls = URL.createObjectURL(event.target.files[i]);
        document.getElementById("formFile").innerHTML += `<img src="${urls}">`;
    }
};

document.querySelector("#imageUpload").addEventListener("change", (ev) => {
    if(!ev.target.files) return;
    previewMultiple(ev);
});

