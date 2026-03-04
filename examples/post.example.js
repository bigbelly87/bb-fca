/**
 * Example usage of post API functions
 * This demonstrates how to create, delete posts and get comments
 */

const login = require('../module');

// Your Facebook credentials
const credentials = {
  appState: [] // Add your appState here
};

login(credentials, (err, api) => {
  if (err) {
    console.error('Login failed:', err);
    return;
  }

  console.log('Logged in successfully!');

  // Example 1: Create a post
  api.post.create({
    message: 'Hello from bb-fca!',
    privacy: 'SELF' // Options: 'EVERYONE', 'FRIENDS', 'SELF'
  }, (err, result) => {
    if (err) {
      console.error('Error creating post:', err);
      return;
    }

    console.log('Post created successfully!');
    console.log('Post ID:', result.postID);
    console.log('Success:', result.success);
  });

  // Example 2: Get comments from a post
  // URL: https://www.facebook.com/permalink.php?story_fbid=pfbid02WHHgPgDR9VuDfXiUR5KCseuh9f2NVmfwddGEgUuYKxrkJpFtqfUKbwcCBV7qAJxel&id=61588408996667
  api.post.getComments({
    story_fbid: 'pfbid02WHHgPgDR9VuDfXiUR5KCseuh9f2NVmfwddGEgUuYKxrkJpFtqfUKbwcCBV7qAJxel',
    id: '61588408996667'
  }, (err, comments) => {
    if (err) {
      console.error('Error getting comments:', err);
      return;
    }

    console.log(`Found ${comments.length} comments:`);
    comments.forEach((comment, index) => {
      console.log(`\n--- Comment ${index + 1} ---`);
      console.log(`ID: ${comment.id}`);
      console.log(`Text: ${comment.text}`);
      console.log(`Author: ${comment.author.name} (ID: ${comment.author.id})`);
      console.log(`Created: ${comment.created_time}`);
      console.log(`Replies: ${comment.reply_count}`);
      console.log(`Likes: ${comment.like_count}`);
    });
  });

  // Example 3: Get comments using just the story_fbid (will use current user's ID)
  api.post.getComments('pfbid02WHHgPgDR9VuDfXiUR5KCseuh9f2NVmfwddGEgUuYKxrkJpFtqfUKbwcCBV7qAJxel')
    .then(comments => {
      console.log(`\nUsing Promise: Found ${comments.length} comments`);
    })
    .catch(err => {
      console.error('Error:', err);
    });

  // Example 4: Delete a post
  api.post.delete('post_id_here', (err, result) => {
    if (err) {
      console.error('Error deleting post:', err);
      return;
    }

    console.log('Post deleted successfully!');
    console.log('Deleted Post ID:', result.postID);
    console.log('Success:', result.success);
  });
});
