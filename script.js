document.addEventListener("DOMContentLoaded", function () {
  const mealList = document.getElementById("meal");
  const mealDetailsContent = document.querySelector(".meal-details-content");
  const recipeCloseBtn = document.getElementById("recipe-close-btn");

  // Fetch and display search results when the page loads
  getMealListFromURL();

  mealList.addEventListener("click", getMealRecipe);
  recipeCloseBtn.addEventListener("click", function () {
    mealDetailsContent.parentElement.classList.remove("showRecipe");
  });

  // get meal list from URL query parameter
  function getMealListFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchInputTxt = urlParams.get("searchInput");

    if (searchInputTxt) {
      fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`
      )
        .then((response) => response.json())
        .then((data) => {
          let html = "";
          if (data.meals) {
            const meals = data.meals;
            const columns = 3; // Number of columns

            for (let i = 0; i < meals.length; i += columns) {
              html += "<div class='row'>";
              for (let j = i; j < i + columns && j < meals.length; j++) {
                const meal = meals[j];
                html += `
                  <div class="column">
                    <div class="meal-item" data-id="${meal.idMeal}">
                      <div class="meal-img">
                        <img src="${meal.strMealThumb}" alt="food">
                      </div>
                      <div class="meal-name">
                        <h3>${meal.strMeal}</h3>
                        <a href="#" class="recipe-btn">Get Recipe</a>
                      </div>
                    </div>
                  </div>
                `;
              }
              html += "</div>";
            }
            mealList.classList.remove("notFound");
          } else {
            html = "Sorry, we didn't find any meal!";
            mealList.classList.add("notFound");
          }

          mealList.innerHTML = html;
        });
    }
  }

  // get recipe of the meal
  function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains("recipe-btn")) {
      let mealItem = e.target.parentElement.parentElement;
      fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
      )
        .then((response) => response.json())
        .then((data) => mealRecipeModal(data.meals[0]));
    }
  }

  // create a modal
  function mealRecipeModal(meal) {
    let html = `
      <h2 class="recipe-title">${meal.strMeal}</h2>
      <p class="recipe-category">${meal.strCategory}</p>
      <div class="recipe-instruct">
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
      </div>
      <div class="recipe-meal-img">
        <img src="${meal.strMealThumb}" alt="">
      </div>
      <div class="recipe-link">
        <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
      </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add("showRecipe");
  }
});
