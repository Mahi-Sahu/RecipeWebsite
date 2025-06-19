const searchBox=document.querySelector(".searchBox");
const searchButton=document.querySelector(".searchButton");
const recipeContainer=document.querySelector(".recipe-container");
const recipeContent=document.querySelector(".recipe-details-content");
const closeButton=document.querySelector(".recipe-closeBtn");

const fetchRecipes =async (query) =>{
    recipeContainer.innerHTML="Fetching Recipes...";

    try {
        const data=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    //convert this above promise into json
    const response= await data.json();

    recipeContainer.innerHTML="";
    response.meals.forEach(meal =>{
        //console.log(meal);
        const recipeDiv=document.createElement('div');
        recipeDiv.classList.add('recipe');
        recipeDiv.innerHTML=`
            <img src="${meal.strMealThumb}">
            <h3>${meal.strMeal}</h3>
            <p><span>${meal.strArea}</span> Dish</p>
            <p>It's <span>${meal.strCategory}</span> </p>
            `

            const button=document.createElement('button');
            button.textContent="View Recipe";
            recipeDiv.appendChild(button);

            button.addEventListener("click",()=>{
                openRecipePopup(meal);
            });

            recipeContainer.appendChild(recipeDiv);
    });
    } 
    catch (error) {
        recipeContainer.innerHTML="<h2>Error in fetching recipes...</h2>"
    }
    //console.log(response.meals[0]);
}

//function to fetch ingredients and measurments
const fetchIngredients=(meal) =>{
    //console.log(meal);
    let ingredientsList="";
    for(let i=1;i<=20;i++){
        const ingredient=meal[`strIngredient${i}`];
        if(ingredient){
            const measurment=meal[`strMeasure${i}`];
            ingredientsList+=`<li>${measurment} ${ingredient}</li>`
        }else{
            break;
        }
    }
    return ingredientsList;
}


const openRecipePopup=(meal)=>{
    recipeContent.innerHTML=`
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>

        <div class="instructions">
            <h3>Instructions</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `
    recipeContent.parentElement.style.display="block";

    /*blur and freeze background*/
    recipeContainer.style.filter = "blur(5px)";
    recipeContainer.style.pointerEvents = "none";
    recipeContainer.style.userSelect = "none";
    document.body.style.overflow = "hidden";  // prevents scroll

}

closeButton.addEventListener("click",()=>{
    recipeContent.parentElement.style.display="none";

    //remove blur amd freeze
    recipeContainer.style.filter="";
    recipeContainer.style.pointerEvents = "";
    recipeContainer.style.userSelect = "";
    document.body.style.overflow = "";
});

searchButton.addEventListener("click",(e)=>{
    e.preventDefault();
    const searchInput=searchBox.value.trim();
    if(!searchInput){
        recipeContainer.innerHTML= `<h2>Type the meal you want to search.</h2>`;
        return;
    }
    fetchRecipes(searchInput);
    console.log("Button clicked");
});