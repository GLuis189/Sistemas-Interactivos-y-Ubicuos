const body = document.querySelector("body")
const libro = {
    frontpage : "https://upload.wikimedia.org/wikipedia/commons/5/5b/Homo_Deus_-_A_Brief_History_of_Tomorrow.jpg",
    title : "Homo Deus: A brief history of tomorrow",
    author : "Yuval Noah Harari",
    pages : 496,
    
}
const container = document.createElement("div")
container.style.display = "flex"
body.appendChild(container)

for (let i in libro){
    let add
    if (i=="frontpage"){
        add = document.createElement("img")
        add.style.width = "500px"
        add.src = libro[i]
    }
    else{
        add = document.createElement("ul")
        txt = document.createElement("p")
        txt.innerHTML = i + ": " + libro[i]
        add.appendChild(txt)
    }
    container.appendChild(add)
}
