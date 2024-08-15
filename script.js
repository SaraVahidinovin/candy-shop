
document.addEventListener('DOMContentLoaded', () => {
    getCandies();

    const exportButton = document.getElementById('exportData');
    exportButton.addEventListener('click', () => {
        exportData();
    });

    const importButton = document.getElementById('importData');
    const importFileInput = document.getElementById('importFileInput');
    importButton.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', importData);
});

// To fetch data from candyshop API and store it in local storage
async function getCandies() {
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
    candiesSection.innerHTML = " "; // Clear previous results

    candies.forEach((candy) => {
        const candyArticle = document.createElement("article");
        candyArticle.className = "candy-article";

        const candyImg = document.createElement("img");
        const svgMarkup = candy.svg;

        // Convert SVG to Base64
        const encodedSvg = encodeURIComponent(svgMarkup)
            .replace(/'/g, "%27")
            .replace(/"/g, "%22");

        //Encode the SVG as a Data URI
        const imgSrc = `data:image/svg+xml;charset=UTF-8,${encodedSvg}`;

        candyImg.src = imgSrc;
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
        candyDesc.innerText = getDescriptionUntilPeriod(candy.description);

        const editDeleteDiv = document.createElement("div");
        editDeleteDiv.className = "edit-delete";

        const editBtn = document.createElement("i");
        editBtn.className = "edit-btn fa fa-edit";
        editBtn.title = "Edit";

        // Set up the edit functionality
        editBtn.addEventListener('click', () => {
            openEditModal(candy);
        });

        const deleteBtn = document.createElement("i");
        deleteBtn.className = "delete-btn fa fa-trash-o";
        deleteBtn.title = "Delete";

        // Set up the delete functionality
        deleteBtn.addEventListener('click', () => {
            confirmDelete(candy.id);
        });

        editDeleteDiv.appendChild(editBtn);
        editDeleteDiv.appendChild(deleteBtn);

        candyArticle.appendChild(candyImg);
        candyArticle.appendChild(candyNamePriceDiv);
        candyArticle.appendChild(candyDesc);
        candyArticle.appendChild(editDeleteDiv);

        candiesSection.appendChild(candyArticle);
    });

}

//To extract description up to and including the first period
function getDescriptionUntilPeriod(description) {
    const periodIndex = description.indexOf('.');

    // If a period is found, slice the description up to and including the period
    if (periodIndex !== -1) {
        return description.slice(0, periodIndex + 1);
    }
    // If no period is found, return the entire description
    return description;
}

function openEditModal(candy) {
    const modal = document.getElementById('editModal');
    modal.style.display = 'block';

    // Fill in the current candy data
    document.getElementById('candyName').value = candy.name;
    document.getElementById('candyPrice').value = candy.price;
    document.getElementById('candyDescription').value = candy.description;

    // Update candy in local storage on form submit
    document.getElementById('editForm').addEventListener('submit', () => {
        saveCandyChanges(candy.id);
    })

    // Close modal when clicking on close button
    document.getElementById('closeButton').addEventListener('click', () => {
        closeModal();
    })
}

function saveCandyChanges(candyId) {
    const updatedPrice = document.getElementById('candyPrice').value;
    const updatedDescription = document.getElementById('candyDescription').value;

    const candies = JSON.parse(localStorage.getItem('candies'));
    const candyIndex = candies.findIndex(candy => candy.id === candyId);

    if (candyIndex !== -1) {
        candies[candyIndex].price = updatedPrice;
        candies[candyIndex].description = updatedDescription;

        // To update local storage
        localStorage.setItem('candies', JSON.stringify(candies));

        // To refresh the candy display
        displayCandies(candies);

        closeModal();
    }
}

function closeModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'none';
}

// To confirm candy deletion
function confirmDelete(candyId) {
    if (confirm(`Are you sure you want to delete this item?`)) {
        deleteCandy(candyId);
    }
}

// To delete candy from local storage and refresh the list
function deleteCandy(candyId) {
    let candies = JSON.parse(localStorage.getItem('candies'));
    candies = candies.filter(candy => candy.id !== candyId)

    // To update local storage
    localStorage.setItem('candies', JSON.stringify(candies));

    // To refresh the candy display
    displayCandies(candies);
}

//To export the candies data from local storage
function exportData() {
    const data = localStorage.getItem('candies');

    // To check for the presence of the candies data in localStorage
    if (!data || JSON.parse(data).length === 0) {
        alert('No data available to export.');
        return;
    }

    //To convert onverts this data into a Blob object
    const file = new Blob([data], { type: 'application/json' });

    //To create a URL for it
    const url = URL.createObjectURL(file);

    //To create a downloadable file that the user can save
    const link = document.createElement('a');
    link.href = url;
    link.download = 'candies_data.json';
    link.click();

    //To release the memory associated with the url
    URL.revokeObjectURL(url);
}

function importData(event) {
    // To store the reference to the selected file
    const file = event.target.files[0];

    // To read the file data
    const fileReader = new FileReader();

    // 
    fileReader.onload = function () {
        try {
            // To convert the file's content (which is in JSON format) into a object
            const parsedData = JSON.parse(fileReader.result);
            localStorage.setItem('candies', JSON.stringify(parsedData));
            alert('Data imported successfully');
            displayCandies(parsedData);
        } catch (error) {
            alert("Failed to import data. Please make sure the file is a valid JSON.");
            console.log(error);
        }
    };

    //To start reading the file content so that it can be processed and imported.
    fileReader.readAsText(file);
}