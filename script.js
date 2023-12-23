// script.js

$(document).ready(function () {
  // Get the search input value from the URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const searchInputTxt = urlParams.get("searchInput");
  console.log("Search input:", searchInputTxt);

  // Check if searchInputTxt is not null or empty
  if (searchInputTxt) {
    // Make an API request to get meals based on the search input
    $.ajax({
      url: `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`,
      method: "GET",
      success: function (data) {
        // Check if meals are returned
        if (data.meals) {
          // Iterate through the meals and display them on the page
          const mealsContainer = $("#meals-container");

          data.meals.forEach((meal) => {
            const mealCard = `
              <div class="meal-card">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                <h3>${meal.strMeal}</h3>
                <p>${meal.strInstructions}</p>
              </div>
            `;

            mealsContainer.append(mealCard);
          });
        } else {
          // Display a message if no meals are found
          $("#meals-container").html(
            "<p>No meals found for the given ingredient.</p>"
          );
        }
      },
      error: function (error) {
        console.error("Error fetching meals:", error);
        // Display an error message
        $("#meals-container").html(
          "<p>Error fetching meals. Please try again later.</p>"
        );
      },
    });
  }

  $.ajax({
    // ... existing options
    error: function (xhr, status, error) {
      console.error("Error:", status, error);
      $("#meals-container").html(
        "<p>Error fetching meals. Please try again later.</p>"
      );
    },
  });
});
