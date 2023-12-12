// src/components/Feed.js
import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/auth';
import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore'; // Import the necessary Firestore functions
import { firestore } from '../firebase';
import pfp from '../assets/pfp.png';
import './feed.css';
import ErrorPopup from './ErrorPopup';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import ImageModal from '../components/common/ImageModal'; // Import the ImageModal component

const Feed = () => {
  const auth = useAuth();
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState(null); // Add state for the new post image
  const [characterError, setCharacterError] = useState(false);
  const [posts, setPosts] = useState([]);
  const [commentInputValue, setCommentInputValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [commentsToShow, setCommentsToShow] = useState(5);

  const handleLoadMoreComments = (postId) => {
    setCommentsToShow((prevCount) => prevCount + 5);
  };



  




  // Function to handle like button click for comments
  const handleLikeComment = async (postId, commentIndex) => {

    console.log('Like Comment Function Called');
    console.log('Post ID:', postId);
    console.log('Comment Index:', commentIndex);
    try {
      const postsCollection = collection(firestore, 'posts');
      const postRef = doc(postsCollection, postId);

      // Update likes for the specific comment in Firestore
      await updateDoc(postRef, {
        [`comments.${commentIndex}.likes`]: arrayUnion(auth.user.uid),
      });

      // Fetch updated posts from Firestore
      fetchPosts();
    } catch (error) {
      console.error('Error handling like for comment:', error.message);
    }
  };

  // Function to handle responding to a comment
  const handleRespondToComment = async (postId, commentIndex, responseContent) => {
    try {
      const postsCollection = collection(firestore, 'posts');
      const postRef = doc(postsCollection, postId);
      console.log('Respond To Comment Function Called');
      console.log('Post ID:', postId);
      console.log('Comment Index:', commentIndex);
          // Add a new response to the specific comment in Firestore
      await updateDoc(postRef, {
        [`comments.${commentIndex}.responses`]: arrayUnion({
          userId: auth.user.uid,
          userName: auth.user.displayName || 'Anonymous',
          content: responseContent,
        }),
      });

      // Fetch updated posts from Firestore
      fetchPosts();
    } catch (error) {
      console.error('Error responding to comment:', error.message);
    }
  };

  const maxPostLength = 1200;

  const fetchPosts = async () => {
    try {
      const postsCollection = collection(firestore, 'posts');
      const postsSnapshot = await getDocs(postsCollection);
      const fetchedPosts = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      
      console.log('Fetched Posts:', fetchedPosts);
  
      setPosts(fetchedPosts || []); // Initialize as an empty array if undefined
    } catch (error) {
      console.error('Error fetching posts from Firestore:', error.message);
    }
  };
  

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostChange = (e) => {
    const content = e.target.value;

    if (content.length <= maxPostLength && !hasRepeatedCharacters(content)) {
      setNewPostContent(content);
      setCharacterError(false);
    } else {
      setCharacterError(true);
    }
    if (e.target.files && e.target.files[0]) {
      setNewPostImage(e.target.files[0]);
    }
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    setSelectedImage(image);

    // Additional code to handle file name display (remove this if you don't want to display the file name)
    if (image) {
      // Display the file name above the buttons
      alert(`Selected image: ${image.name}`);
    }
  };

  const handlePostSubmit = async () => {
    if (newPostContent.trim() !== '' && auth && auth.user) {
      const newPost = {
        content: newPostContent,
        userId: auth.user.uid,
        userName: auth.user.displayName || 'Anonymous',
        userProfilePicture: auth.user.photoURL || pfp,
        createdAt: new Date(),
        likes: [], // Initialize likes as an empty array
        comments: [], // Initialize comments as an empty array
      };

      try {
        // Check if an image is selected
        if (newPostImage) {
          // Upload the image to storage
          const imageUrl = await uploadImageToStorage(newPostImage);
          // Update the new post object with the image URL
          newPost.imageUrl = imageUrl;
        }

        // Add the new post to Firestore
        const postsCollection = collection(firestore, 'posts');
        const docRef = await addDoc(postsCollection, newPost);
        const postId = docRef.id;

        // Set the local state with the new post
        setPosts((prevPosts) => [{ id: postId, ...newPost }, ...prevPosts]);

        // Clear the input fields after posting
        setNewPostContent('');
        setNewPostImage(null); // Clear the selected image
        setCharacterError(false);

        // Fetch updated posts from Firestore
        fetchPosts();
      } catch (error) {
        console.error('Error adding post to Firestore:', error.message);
      }
    }
  };

  // Function to upload the image to storage
  const uploadImageToStorage = async (imageFile) => {
    const imageRef = ref(storage, `post-images/${imageFile.name}`);
    const uploadTask = uploadBytesResumable(imageRef, imageFile);

    try {
      await uploadTask;
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error.message);
      throw error;
    }
  };

  const hasRepeatedCharacters = (content) => {
    const maxConsecutiveChars = 3; // Adjust this value based on your preference
    let consecutiveCount = 0;
    for (let i = 0; i < content.length - 1; i++) {
      const currentChar = content[i];
      const nextChar = content[i + 1];

      // Skip spaces
      if (currentChar === ' ') {
        continue;
      }

      if (currentChar === nextChar) {
        consecutiveCount++;

        if (consecutiveCount > maxConsecutiveChars) {
          return true; // Too many consecutive repeated characters detected
        }
      } else {
        consecutiveCount = 0; // Reset consecutive count for different characters
      }
    }

    return false;
  };

  // Function to handle like button click
  const handleLike = async (postId) => {
    try {
      const postsCollection = collection(firestore, 'posts');
      const postRef = doc(postsCollection, postId);

      console.log('Like Comment Function Called');
      console.log('Post ID:', postId);
    
      // Update likes in Firestore
      await updateDoc(postRef, {
        likes: arrayUnion(auth.user.uid),
      });

      // Fetch updated posts from Firestore
      fetchPosts();
    } catch (error) {
      console.error('Error handling like:', error.message);
    }
  };

  // Function to handle comment input change
  const handleCommentChange = (e) => {
    setCommentInputValue(e.target.value);
  };

  // Function to handle adding comments
  const handleComment = async (postId, commentContent) => {
    try {
      const postsCollection = collection(firestore, 'posts');
      const postRef = doc(postsCollection, postId);

      // Add a new comment to the post
      await updateDoc(postRef, {
        comments: arrayUnion({
          userId: auth.user.uid,
          userName: auth.user.displayName || 'Anonymous',
          content: commentContent,
        }),
      });

      // Fetch updated posts from Firestore
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error.message);
    }

    // Reset comment input value
    setCommentInputValue('');
  };

  // Update your Feed component
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="feed-container">
      <div className="post-input">
        <textarea
          placeholder="What's on your mind?"
          value={newPostContent}
          onChange={handlePostChange}
          maxLength={maxPostLength}
        />
        <input type="file" onChange={handleImageChange} accept="image/*" />
        <button onClick={handlePostSubmit}>Post</button>
      </div>

      <ul>
        {posts && Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <li key={post.id} className="post">
              <div className="post-box">
                <img src={post.userProfilePicture} alt="Profile" className="profile-picture" />
                <div>
                  <p>{post.userName}</p>
                  {post.imageUrl && <img src={post.imageUrl} alt="Post" onClick={() => handleImageClick(post.imageUrl || post.userProfilePicture || pfp)} />}
                  <p>{post.content}</p>
                  {/* Like button */}
                  <div className="like-section">
                    <button onClick={() => handleLike(post.id)}>
                      <span role="img" aria-label="heart">❤️</span> {post.likes ? post.likes.length : 0} Likes
                    </button>
                  </div>

                  {/* Comment section */}
                  <div className="comment-section">
                    <h3>Comments</h3>
                    <ul>
                    {Array.isArray(post.comments) && post.comments.slice(0, commentsToShow).map((comment, commentIndex) => (
                <li key={commentIndex} className="comment">
                  {/* Existing code for displaying comments */}
                  <div className="button-group">
                    <button onClick={() => handleLikeComment(post.id, commentIndex)}>
                      Like
                    </button>
                    <button onClick={() => handleRespondToComment(post.id, commentIndex, "Your response")}>
                      Respond
                    </button>
                  </div>
                  {/* Display responses if available */}
                  {comment.responses && comment.responses.length > 0 && (
                    <ul>
                      {comment.responses.map((response, responseIndex) => (
                        <li key={responseIndex} className="response">
                          <p><strong>{response.userName}:</strong> {response.content}</p>
                          {/* Add like button for responses if needed */}
                          {/* <button onClick={() => handleLikeResponse(post.id, commentIndex, responseIndex)}>
                            Like
                          </button> */}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}


                    </ul>

                    {/* Load More Comments button */}
                    {post.comments.length > commentsToShow && (
                      <button
                        onClick={() => handleLoadMoreComments(post.id)}
                        className="load-more-button"
                      >
                        Load More Comments
                      </button>
                    )}

                    {/* Comment input */}
                    <div className="comment-input">
                      <textarea
                        placeholder="Add a comment..."
                        value={commentInputValue}
                        onChange={handleCommentChange}
                      />
                      <button onClick={() => handleComment(post.id, commentInputValue)}>
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li>No posts available</li>
        )}
      </ul>

      {characterError && <ErrorPopup message={`Too many characters or repeated characters! Maximum is ${maxPostLength}.`} />}
      {isModalOpen && <ImageModal selectedImage={selectedImage}
    onClose={handleCloseModal} />}
    </div>
  );
};

export default Feed;
