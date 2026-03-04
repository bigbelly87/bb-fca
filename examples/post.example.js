/**
 * Example usage of post API functions
 * This demonstrates how to create, delete posts, upload photos, and get comments
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

  // Example 2: Upload a photo
  api.post.uploadPhoto('./path/to/your/photo.png', (err, result) => {
    if (err) {
      console.error('Error uploading photo:', err);
      return;
    }

    console.log('Photo uploaded successfully!');
    console.log('Photo ID:', result.photoID);
    console.log('Upload ID:', result.uploadID);
    console.log('Success:', result.success);
  });

  // Example 3: Upload photo with Promise
  api.post.uploadPhoto('./path/to/your/photo.jpg')
    .then(result => {
      console.log('Photo uploaded:', result.photoID);
    })
    .catch(err => {
      console.error('Upload failed:', err);
    });

  // Example 3.1: Create a post with photo attachments
  // First upload the photo, then create post with photo ID
  api.post.uploadPhoto('./path/to/your/photo.png')
    .then(uploadResult => {
      return api.post.create({
        message: 'Check out this photo!',
        privacy: 'SELF',
        photos: [uploadResult.photoID] // Attach the uploaded photo
      });
    })
    .then(createResult => {
      console.log('Post with photo created successfully!');
      console.log('Post ID:', createResult.postID);
    })
    .catch(err => {
      console.error('Error:', err);
    });

  // Example 3.2: Create a post with multiple photos
  Promise.all([
    api.post.uploadPhoto('./photo1.jpg'),
    api.post.uploadPhoto('./photo2.jpg'),
    api.post.uploadPhoto('./photo3.jpg')
  ])
    .then(results => {
      const photoIDs = results.map(r => r.photoID);
      return api.post.create({
        message: 'Multiple photos!',
        privacy: 'FRIENDS',
        photos: photoIDs
      });
    })
    .then(result => {
      console.log('Post with multiple photos created!');
      console.log('Post ID:', result.postID);
    })
    .catch(err => {
      console.error('Error:', err);
    });

  // Example 4: Get comments from a post
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
      console.log(`GraphQL ID: ${comment.graphql_id}`);
      console.log(`Text: ${comment.text}`);
      console.log(`Author: ${comment.author.name} (ID: ${comment.author.id})`);
      console.log(`Created: ${new Date(comment.created_time * 1000).toLocaleString('vi-VN')}`);
      console.log(`Replies: ${comment.reply_count}/${comment.total_reply_count}`);
      console.log(`Depth: ${comment.depth}`);

      if (comment.replies && comment.replies.length > 0) {
        console.log(`  Nested replies:`);
        comment.replies.forEach((reply, i) => {
          console.log(`  └─ [${i + 1}] ${reply.author.name}: ${reply.text}`);
        });
      }
    });
  });

  // Example 5: Get comments using just the story_fbid (will use current user's ID)
  api.post.getComments('pfbid02WHHgPgDR9VuDfXiUR5KCseuh9f2NVmfwddGEgUuYKxrkJpFtqfUKbwcCBV7qAJxel')
    .then(comments => {
      console.log(`\nUsing Promise: Found ${comments.length} comments`);
    })
    .catch(err => {
      console.error('Error:', err);
    });

  // Example 6: Delete a post
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
