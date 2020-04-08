// your code here!

document.addEventListener("DOMContentLoaded", function(e) {
    console.log("🥧")
    fetch("http://localhost:3000/bakes")
        .then(resp => resp.json())
        .then(bakes => {
            console.log(bakes)
            bakes.forEach(bake => {
                renderBake(bake)
            })

        })
})

//Render a single Bake Element
function renderBake(bake) {
    let bakeLi = document.createElement("li")
    bakeLi.classList.add("item")
    bakeLi.innerText = bake.name
    bakeLi.dataset.id = bake.id
    bakeLi.addEventListener("click", function(e) {
        let bakeDetailsParent = document.querySelector("#detail")
        bakeDetailsParent.innerHTML = ""
        let bakeId = e.target.dataset.id
        fetch(`http://localhost:3000/bakes/${bakeId}`)
            .then(resp => resp.json())
            .then(bake => {
                let bakeImg = document.createElement("img")
                bakeImg.src = bake.image_url
                bakeImg.alt = bake.name
                let bakeHeader = document.createElement("h1")
                bakeHeader.innerText = bake.name
                let bakeDesc = document.createElement("p")
                bakeDesc.classList.add("description")
                bakeDesc.innerText = bake.description
                    //Create Bake Form and Append It Together
                let bakeForm = document.createElement("form")
                bakeForm.id = "score-form"
                bakeForm.dataset.id = bake.id
                let bakeInput = document.createElement("input")
                bakeInput.value = 10
                bakeInput.type = "number"
                bakeInput.name = "score"
                bakeInput.min = 0
                bakeInput.max = 10
                bakeInput.step = 1
                let submitInput = document.createElement("input")
                submitInput.type = "submit"
                submitInput.value = "Rate"
                submitInput.addEventListener("click", function(e) {
                    e.preventDefault()
                    let bakeRating = e.target.parentElement.querySelector("input").value
                    let bakeId = e.target.parentElement.dataset.id
                    fetch(`http://localhost:3000/bakes/${bakeId}/ratings`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer 699a9ff1-88ca-4d77-a26e-e4bc31cfc261"
                            },
                            body: JSON.stringify({ score: bakeRating })
                        })
                        .then(response => response.json())
                        .then(bake => {
                            console.log(bake)
                        })

                })
                bakeForm.append(bakeInput, submitInput)
                    //Append all the children to the Parent 
                bakeDetailsParent.append(bakeImg, bakeHeader, bakeDesc, bakeForm)
            })
    })
    let bakeParent = document.querySelector("#bakes-container")
    bakeParent.appendChild(bakeLi)

}

//Judge Button Functionality
let judgeBtn = document.querySelector("#judge-bake-button")
judgeBtn.addEventListener("click", function(e) {
    e.preventDefault()
    fetch("http://localhost:3000/bakes/winner")
        .then(resp => resp.json())
        .then(bake => {
            console.log(bake)
            let bakeWinner = document.querySelector("#bakes-container").querySelector(`[data-id='${bake.id}']`)
            bakeWinner.classList.add("winner")
        })
})


//Create New Bake Object
newBakeForm = document.querySelector("#new-bake-form")
newBakeForm.addEventListener("submit", function(e) {
    e.preventDefault()
    let newBakeName = e.target.name.value
    let newBakeImg = e.target.image_url.value
    let newBakeDesc = e.target.querySelector("textarea").value
    const newBake = {
        name: newBakeName,
        image_url: newBakeImg,
        description: newBakeDesc
    }
    fetch('http://localhost:3000/bakes', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newBake)
        })
        .then(response => response.json())
        .then(finalizedBake => {
            console.log(finalizedBake)
            renderBake(finalizedBake)
        })
    newBakeForm.reset()
    let detailDiv = document.querySelector("#modal")
    detailDiv.style.display = "none"
})