window.onload = getCandies();

// To fetch data from candyshop API and store it in local storage
async function getCandies(){
    const apiUrl = 'https://majazocom.github.io/Data/candyshop.json';
    // Check if there is already data in local storage
    let candies = JSON.parse(localStorage.getItem('candies'));

    if (!candies) {
        try {
            const response = await fetch(`${apiUrl}`);
            candies = await response.json();
            //Store data in local storage 
            localStorage.setItem('candies', JSON.stringify(candies));
        } catch (error) {
            console.error(error);
            displayErrorMessage('There was an error fetching the candies data.');
        }
    }
    displayCandies(candies);
}

function displayCandies(candies) {
	const candiesSection = document.querySelector(".candies");
	candiesSection.innerHTML = " " ; // Clear previous results

	candies.forEach((candy) => {
        const candyArticle = document.createElement("article");
        candyArticle.className = "candy-article";
    
        const candyImg = document.createElement("img");
        candyImg.src = candy.svg; 
        candyImg.alt = candy.name;
    
        const candyNamePriceDiv = document.createElement("div");
        candyNamePriceDiv.classList.add("namePrice");
    
        const candyName = document.createElement("h2");
        candyName.className = "name";
        candyName.innerText = candy.name;
    
        const candyPrice = document.createElement("h2");
        candyPrice.className = "price";
        candyPrice.innerHTML = `<i>$</i>${candy.price}`;
    
        candyNamePriceDiv.appendChild(candyName);
        candyNamePriceDiv.appendChild(candyPrice);
    
        const candyDesc = document.createElement("p");
        candyDesc.innerText = candy.description;
    
        const editDeleteDiv = document.createElement("div");
        editDeleteDiv.className = "edit-delete";
    
        const editBtn = document.createElement("i");
        editBtn.className = "edit-btn";
        editBtn.innerHTML = "&#9998;"; 
    
 
        const deleteBtn = document.createElement("i");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerHTML = "&#128465;"; 
    
        editDeleteDiv.appendChild(editBtn);
        editDeleteDiv.appendChild(deleteBtn);
    
        candyArticle.appendChild(candyImg);
        candyArticle.appendChild(candyNamePriceDiv);
        candyArticle.appendChild(candyDesc);
        candyArticle.appendChild(editDeleteDiv);
    
        candiesSection.appendChild(candyArticle);
	});

}
