"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const isFavorited = currentUser.favorites.some(s => s.storyId === story.storyId);
  const isOwnStory = currentUser.ownStories.some(s => s.storyId === story.storyId);
    
  return $(`
    <li id="${story.storyId}">
      <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
      ${isOwnStory ? `<button class="remove-btn" data-story-id="${story.storyId}"><i class="fas fa-trash"></i></button>` : ""}
      <button class="fav-btn" data-story-id="${story.storyId}">
        ${isFavorited ? '<i class="fas fa-heart" style="color:red";></i>' : '<i class="far fa-heart" style="color:gray;"></i>'}
      </button>
    </li>
  `);
}

async function handleNewStorySubmit(evt) {
  evt.preventDefault(); // Prevent the page from refreshing

  const title = $("#story-title").val();
  const author = $("#story-author").val();
  const url = $("#story-url").val();

  const newStory = { title, author, url };

  // Call the addStory method
  const story = await storyList.addStory(currentUser, newStory);

  // Update the current user's ownStories
  currentUser.ownStories.push(story);
  storyList.stories.unshift(story);

  // Add the new story to the UI
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  // Clear the form
  $("#new-story-form").trigger("reset");
  $("#add-story-form").hide();

  putStoriesOnPage();
}
$("#new-story-form").on("submit", handleNewStorySubmit);
  
  // Handle Favorite/Unfavorite Button Clicks
  async function handleFavoriteClick(evt) {
    const $target = $(evt.target).closest("button");
    const storyId = $target.data("story-id");
    const story = storyList.stories.find(s => s.storyId === storyId);
    const isFavorited = currentUser.favorites.some(s => s.storyId === storyId);
    const $icon = $target.find("i");
    if (!isFavorited) {
      await currentUser.favoriteStory(story);
      $icon.removeClass('far').addClass('fas').css('color', 'red'); // Switch to filled heart and make it red
    } else {
      await currentUser.unfavoriteStory(story);
      $icon.removeClass('fas').addClass('far').css('color', 'gray'); // Switch to empty heart and make it gray
    }
}

  // Handle Remove Button Clicks
  async function handleRemoveClick(evt) {
    const $target = $(evt.target).closest("button");
    const storyId = $target.data("story-id");
    const story = storyList.stories.find(s => s.storyId === storyId);

    const isFavorited = currentUser.favorites.some(s => s.storyId === storyId);
    if (isFavorited) {
      await currentUser.unfavoriteStory(story);
      currentUser.favorites = currentUser.favorites.filter(s => s.storyId !== storyId);
    }
  
    await currentUser.removeStory(story);
    storyList.stories = storyList.stories.filter(s => s.storyId !== storyId);
    $target.closest('li').remove(); // Remove the story from the DOM
  }
  
  // Attach event listeners
  $allStoriesList.on("click", ".fav-btn", handleFavoriteClick);
  $allStoriesList.on("click", ".remove-btn", handleRemoveClick);

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}
