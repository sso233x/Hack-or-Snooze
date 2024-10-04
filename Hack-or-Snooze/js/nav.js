"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".mainNavLinks").removeClass("hidden");
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();

  hidePageComponents();
  putStoriesOnPage();
}

/** When user clicks submit, will show the form to submit story */

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $("#add-story-form").show();
}

$body.on("click", "#nav-submit", navSubmitClick);

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  putFavoritesOnPage(); 
}

$body.on("click", "#navFav", navFavoritesClick);

function putFavoritesOnPage() {
  const favorites = currentUser.favorites; // Get the user's favorites
  $allStoriesList.empty(); // Clear current stories
  for (let story of favorites) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
}

function navMyStoriesClick(evt) {
  console.debug("navMyStoriesClick", evt);
  hidePageComponents();
  putMyStoriesOnPage();
}

$body.on("click", "#myStories", navMyStoriesClick);

function putMyStoriesOnPage() {
  console.debug("putMyStoriesOnPage");

  $allStoriesList.empty(); // Clear current stories

  const myStories = currentUser.ownStories; // Get the user's own stories
  for (let story of myStories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}