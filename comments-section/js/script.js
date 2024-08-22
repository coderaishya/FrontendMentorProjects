import './menu_avatar.js';

const allComments = document.querySelector('.all-comments-container');
const deleteCommentContainer = document.querySelector('.delete-comment-container');
const usersUnderMenu = document.querySelector('.menu');
let lastId = 4;
let data = getStoredData();
let currentUsername = data.currentUser.username;


// Fetch default data from the local 'data.json' file
const loadComments = async() => {
    allComments.innerHTML = '';
    let response =  await fetch('./src/data.json');
    let commentData = await response.json();
    saveDataToLocalStorage(commentData);
    renderComments(commentData.comments);
};


// Attach event listener to choose current user
usersUnderMenu.addEventListener('click', e => {
    const user = e.target.closest('.menu-item');
    if (user) {  
        currentUsername = usersUnderMenu.lastElementChild.id;
        location.reload();
        updateCurrentUserToLS(currentUsername); 
    }
});


// Update current username to localStorage
function updateCurrentUserToLS(updatedCurrentUser) {
    data.currentUser.image.png = `./src/images/avatars/image-${updatedCurrentUser}.png`;
    data.currentUser.image.webp = `./src/images/avatars/image-${updatedCurrentUser}.webp`;
    data.currentUser.username = updatedCurrentUser;
    saveDataToLocalStorage(data);
}


// Render comments
function renderComments(comments){
    comments.forEach(comment => {
        const commentElement = createCommentElement(comment);
        allComments.appendChild(commentElement);

        if (comment.replies.length > 0) {
            renderReplies(comment.replies, commentElement);
        }
    });

    allComments.appendChild(createUserToResponseElement('comment'));
};


// Render replies
function renderReplies(replies, parentElement) {
    const repliesToCommentContainer = document.createElement('div');
    repliesToCommentContainer.classList.add('replies-to-comments-container');
    repliesToCommentContainer.innerHTML = '';

    replies.forEach(reply => {
        const replyElement = createReplyElement(reply);
        repliesToCommentContainer.appendChild(replyElement);
    });

    parentElement.appendChild(repliesToCommentContainer);
};


// Create comment HTML structure
function createCommentElement(comment) {
    
    const commentContainerElement = document.createElement('div');
    commentContainerElement.classList.add('comments-container');

    if (comment.user.username === currentUsername) {
        commentContainerElement.classList.add('current-user-reply');
    }

    commentContainerElement.innerHTML = `
        <div class="comments-sub-container" data-id="${comment.id}">
            <div class="score-box">
                <button class="vote-button upvote comment" aria-label="Upvote Comment">
                    <img src="./src/images/icon-plus.svg" alt="Plus Icon">
                </button>
                <span class="score">${comment.score}</span>
                <button class="vote-button downvote comment" aria-label="Downvote Comment">
                    <img src="./src/images/icon-minus.svg" alt="Minus Icon">
                </button>
            </div>

            <div class="comment-header">
                <a href="#" class="user-avatar-link">
                    <picture>
                        <source srcset="${comment.user.image.webp}" type="image/webp">
                        <img class="user-avatar" src="${comment.user.image.png}" alt="User Avatar">
                    </picture>
                </a>
                <a href="#" class="username">${comment.user.username}</a>
                ${isCurrentUserIndicator(comment)}
                <span class="dot-symbol">•</span>
                <span class="time">${getTimeSincePosted(comment.createdAt)}</span>
            </div>
            ${isCurrentUser(comment)}
        </div>
    `;

    return commentContainerElement;
};


// Create reply HTML structure
function createReplyElement(reply) {
    const replyContainerElement = document.createElement('div');
    replyContainerElement.classList.add('replies-to-comments-sub-container');
    replyContainerElement.setAttribute('data-id', `${reply.id}`);

    if (reply.user.username === currentUsername) {
        replyContainerElement.classList.add('current-user-reply');
    }

    replyContainerElement.innerHTML = `
        <div class="score-box">
            <button class="vote-button upvote comment" aria-label="Upvote Comment">
                <img src="./src/images/icon-plus.svg" alt="Plus Icon">
            </button>
            <span class="score">${reply.score}</span>
            <button class="vote-button downvote comment" aria-label="Downvote Comment">
                <img src="./src/images/icon-minus.svg" alt="Minus Icon">
            </button>
        </div>

        <div class="comment-header">
            <a href="#" class="user-avatar-link">
                <picture>
                    <source srcset="${reply.user.image.webp}" type="image/webp">
                    <img class="user-avatar" src="${reply.user.image.png}" alt="User Avatar">
                </picture>
            </a>
            <a href="#" class="username">${reply.user.username}</a>
            ${isCurrentUserIndicator(reply)}
            <span class="dot-symbol">•</span>
            <span class="time">${getTimeSincePosted(reply.createdAt)}</span>
        </div>
        ${isCurrentUser(reply)}
    `;

    return replyContainerElement;
};


// Create reply (w/ icon) button if non-current user
function nonCurrentUserReply(response) {
    const nonCurrentUser = `
        <button class="reply-icon-button" aria-label="Reply to Comment">
            <img class="icon-reply" src="./src/images/icon-reply.svg" alt="Reply Icon">Reply
        </button>
        <p class="comment-content">${isResponseReply(response)} ${response.content}</p>
    `;
    return nonCurrentUser;
};


// Create delete and edit (w/ icon) button if current user
function currentUserReply(response) {
    const currentUser = `
        <div id="delete-or-edit-button-grp">
            <button class="delete-button" aria-label="Delete Comment"><img class="icon-delete" src="./src/images/icon-delete.svg" alt="Delete Icon">Delete</button>
            <button class="edit-button" aria-label="Edit to Comment"><img class="icon-edit" src="./src/images/icon-edit.svg" alt="Edit Icon">Edit</button>
        </div>
        <div id="editable-content">
            <p class="comment-content">${isResponseReply(response)} ${response.content}</p>       
        </div>
    `;
    return currentUser;
};


// Check whether its current user
function isCurrentUser(response) {
    if (response.user.username === currentUsername) {
        return currentUserReply(response);
    } else {
        return nonCurrentUserReply(response);
    };
};


// Add indicator if its current user
function isCurrentUserIndicator(response) {
    if (response.user.username === currentUsername) {
        return `<span id="current-user-indicator">you</span>`;
    } else {
        return '';
    }
};


// Only replies will have the 'replyingTo' key-value pair in json file
function isResponseReply(response) {
    if (response.replyingTo) {
        return `<strong>@${response.replyingTo}</strong>`;
    } else {
        return '';
    }
};


// Check type of send button
function sendOrReplyButtonText(response) {
    if (response === 'reply') {
        return 'reply';
    } else {
        return 'send';
    }
};


function createUserToResponseElement(response) {
    const newResponseElement = document.createElement('div');
    newResponseElement.classList.add('add-container');
    newResponseElement.id = `current-user-new-${response}`;
    newResponseElement.innerHTML = `
        <form class="add-form" id="add-${response}-form">
            <picture>
                <source srcset="./src/images/avatars/image-${currentUsername}.webp" type="image/webp">
                <img class="user-avatar current" src="./src/images/avatars/image-${currentUsername}.png" alt="User Avatar">
            </picture>  
            <textarea class="input-box" id="${response}-input" placeholder="Add a ${response}..." cols="30" rows="3"></textarea>
            <button type="submit" class="send-button" id="${response}-send-button" aria-label="Submit ${response}">${sendOrReplyButtonText(response)}</button>
        </form>
    `;

    return newResponseElement;
};


function generateUniqueId() {
    lastId += 1;
    return lastId;
}


function sendNewComment(userInput) {
    const timestamp = new Date();
    const formattedTimestamp = timestamp.toString();
    const newCommentObj = {
        "id": generateUniqueId(),
        "content": userInput,
        "createdAt": formattedTimestamp,
        "score": 0,
        "user": {
            "image": { 
                "png": `./src/images/avatars/image-${currentUsername}.png`,
                "webp": `./src/images/avatars/image-${currentUsername}.webp`
            },
            "username": currentUsername
        },
        "replies": []
    };

    const newCommentElement = createCommentElement(newCommentObj);

    allComments.insertBefore(newCommentElement, document.querySelector('#current-user-new-comment'));

    // Get the existing data, add the new comment, and save it
    addNewCommentToLocalStorage(newCommentObj);
};


function addNewCommentToLocalStorage(commentObj) {
    data.comments.push(commentObj);
    saveDataToLocalStorage(data);
}


function sendNewReply(userInput, toUser, parentElement, commentId) { //refer to the id of the comment user is sending reply to
    const timestamp = new Date();
    const formattedTimestamp = timestamp.toString();
    const newReplyObj = {
        "id": generateUniqueId(),
        "content": userInput,
        "createdAt": formattedTimestamp,
        "score": 0,
        "replyingTo": toUser,
        "user": {
            "image": { 
                "png": `./src/images/avatars/image-${currentUsername}.png`,
                "webp": `./src/images/avatars/image-${currentUsername}.webp`
            },
            "username": currentUsername
        }
    };

    const newReplyElement = createReplyElement(newReplyObj);

    parentElement.appendChild(newReplyElement);

    // Get the existing data, add the new reply, and save it
    addNewReplyToLocalStorage (commentId, newReplyObj);
    
};


function addNewReplyToLocalStorage(commentId, replyObj) {
    const commentToReply = findCommentById(data.comments, commentId);

    if (commentToReply) {
        commentToReply.replies.push(replyObj);
        saveDataToLocalStorage(data);
    }
}


// As data.comments is an object, not array - you can only use find() for arrays
function findCommentById(comments, commentId) {
    for (const key in comments) {
        if (comments[key].id === commentId) {
            return comments[key]; // which is an object
        }
    }
    return null;
}


// Attach event listener for submitting a new comment
allComments.addEventListener('submit', e => {
    e.preventDefault();
    const addContainer = e.target.closest('#current-user-new-comment');
    const userCommentInput = addContainer.querySelector('#comment-input').value;
    const commentSendButton = addContainer.querySelector('.send-button');
    
    if (commentSendButton) {  
        if (userCommentInput === '') {
            addContainer.appendChild(createPopUp('Cannot be empty!'));
            removePopUp(addContainer);
        } else if (addContainer) { 
            sendNewComment(userCommentInput);
        }
    
        addContainer.querySelector('#comment-input').value = ''; // clear the input field
    }
});

let targetUser;

// Attach event listener for creating a new reply element
allComments.addEventListener('click', e => {
    const selectedReplyIconButton = e.target.closest('.reply-icon-button'); // removed e.preventDefault()

    if (selectedReplyIconButton) {
        const selectedCommentContainer = selectedReplyIconButton.closest('.comments-container');
        const selectedReplyParentElem = selectedReplyIconButton.parentElement;
        targetUser = selectedReplyParentElem.querySelector('.username').textContent;
        // console.log(targetUser);

        if (selectedReplyParentElem) {
            const hasRepliesToCommentsContainer = selectedCommentContainer.querySelector('.replies-to-comments-container');
            
            // Check if there is already a reply element within the replies-to-comments container. If exists, prevent user from adding another one.
            if (hasRepliesToCommentsContainer && !hasRepliesToCommentsContainer.querySelector('.add-container')) {
                hasRepliesToCommentsContainer.appendChild(createUserToResponseElement('reply'));
            } else if (!hasRepliesToCommentsContainer) {
                const repliesToCommentsContainer = document.createElement('div');
                repliesToCommentsContainer.classList.add('replies-to-comments-container');
                selectedCommentContainer.appendChild(repliesToCommentsContainer);
                repliesToCommentsContainer.appendChild(createUserToResponseElement('reply'));
            }
        }
    }
});


// Attach event listener for submitting a new reply
allComments.addEventListener('submit', e => {
    e.preventDefault();
    const addContainer = e.target.closest('#current-user-new-reply');
    const commentsContainer = addContainer.closest('.comments-container'); // closest usually only to find nearest ancestor, not child
    const userReplyInput = addContainer.querySelector('#reply-input').value;
    const replySendButton = addContainer.querySelector('.send-button');
    
    if (replySendButton) {
        if (userReplyInput === '') {
            addContainer.appendChild(createPopUp('Cannot be empty!'));
            removePopUp(addContainer);
        } else {
            const commentsSubContainer = commentsContainer.querySelector('.comments-sub-container');
            const repliesToCommentsContainer = commentsContainer.querySelector('.replies-to-comments-container');
            const commentId = Number(commentsSubContainer.dataset.id); // retrieve the comment ID, convert to number
            sendNewReply(userReplyInput, targetUser, repliesToCommentsContainer, commentId);   
            repliesToCommentsContainer.removeChild(addContainer);
        }
    }
});


// Attach event listener to bring up the delete prompt box
allComments.addEventListener('click', e => {
    const deleteIconButton = e.target.closest('.delete-button');
    const responseContainerToDelete = deleteIconButton.closest('.current-user-reply');
    // console.log(responseContainerToDelete);
    
    if (deleteIconButton) {
        deleteCommentContainer.style.display = 'grid';
    }

    toDeleteResponse(responseContainerToDelete);
});


// To cancel or confirm delete a comment/reply/response
function toDeleteResponse(response) {
    const deleteButtonGrp = document.querySelector('#delete-button-grp');
    const noCancelButton = document.querySelector('#no-cancel-button');
    const yesDeleteButton = document.querySelector('#yes-delete-button');
    
    deleteButtonGrp.addEventListener('click', e => {
        const toDelete = e.target.closest('.next-action-button');
        if (toDelete === noCancelButton) {
            deleteCommentContainer.style.display = 'none';
        } else if (yesDeleteButton) {
            const responseToBeDeleted = response;
            deleteCommentContainer.style.display = 'none';
            deleteFrLocalStorage (response); // have to come first before responseToBeDeleted.remove() else data to reference to is deleted from HTML
            responseToBeDeleted.remove();
        }
    });
};


// To delete from localStorage
function deleteFrLocalStorage (toDeleteElement) {
    let isComment = false;
    if (toDeleteElement.querySelector('.comments-sub-container')) { // not closest as it is the entire element you r selecting
        isComment = true;

        const commentId = Number(toDeleteElement.querySelector('.comments-sub-container').dataset.id);
        const comment = findCommentById(data.comments, commentId);

        let indexToRemove;
        
        for (let index in data.comments) {
            if (data.comments[index] === comment) {
              indexToRemove = index;
              break; // Exit the loop once the key is found
            }
        }

        data.comments.splice(indexToRemove, 1);   

    } else {
        const replySubContainer = toDeleteElement.closest('.replies-to-comments-sub-container');
        const replyId = Number(replySubContainer.dataset.id);

        const commentSubContainer = toDeleteElement.closest('.comments-container').querySelector('.comments-sub-container');
        const commentId = Number(commentSubContainer.dataset.id);

        const comment = findCommentById(data.comments, commentId);
        const reply = findCommentById(comment.replies, replyId);

        let replyIndexToRemove;

        for (let index in comment.replies) {
            if (comment.replies[index] === reply) {
                replyIndexToRemove = index;
                break; // Exit the loop once the key is found
            }
        }

        comment.replies.splice(replyIndexToRemove, 1);
    }
    
    saveDataToLocalStorage(data);
}


// Attach event listener for changing existing comment/reply/response to editable mode
allComments.addEventListener('click', e => {
    const editIconButton = e.target.closest('.edit-button');
    const editableContentBox = editIconButton.closest('#delete-or-edit-button-grp').nextElementSibling;
    const contentToEdit = editableContentBox.querySelector('.comment-content').textContent;
    editableContentBox.innerHTML = `
        <form class="update-form">    
            <textarea type="text" class="input-box" cols="30" rows="4">${contentToEdit}</textarea>
            <button type="submit" class="send-button" id="update-button" aria-label="Update Comment">Update</button>
        </form>
    `;
});


// Attach event listener for submitting update of edited comment/reply/response
allComments.addEventListener('click', e => {
    const updateButton = e.target.closest('#update-button');
    if (updateButton) {
        const contentToUpdateElement = updateButton.previousElementSibling;
        const contentToUpdate = contentToUpdateElement.value;
        const editedContentBox = contentToUpdateElement.closest('#editable-content');
        editedContentBox.innerHTML = `<p class="comment-content">${contentToUpdate}</p>`;

        updateContentToLocalStorage (editedContentBox, contentToUpdate);
    }
});


// To update edited comment/reply/response at localStorage
function updateContentToLocalStorage (element, updatedContent) {
    updatedContent = element.textContent;

    let isComment = false;
    if (element.closest('.comments-sub-container')) {
        isComment = true;
        const commentId = Number(element.closest('.comments-sub-container').dataset.id);
        const comment = findCommentById(data.comments, commentId);
        comment.content = updatedContent;

    } else if (element.closest('.replies-to-comments-sub-container')) {
        const replySubContainer = element.closest('.replies-to-comments-sub-container');
        const commentSubContainer = replySubContainer.closest('.comments-container').querySelector('.comments-sub-container');
        const commentId = Number(commentSubContainer.dataset.id);
        const comment = findCommentById(data.comments, commentId);
        
        const replyId = Number(replySubContainer.dataset.id);
        const reply = findCommentById(comment.replies, replyId);
        
        reply.content = updatedContent;
    }

    saveDataToLocalStorage(data);
}


// Upvote and downvote comment
function voteComment(scoreBoxElement, voteType) {
    const scoreNumElement = scoreBoxElement.querySelector('.score');
    let score = parseInt(scoreNumElement.textContent);

    if (voteType === 'upvote') {
        score++;
    } else if (voteType === 'downvote') {
        if (score > 0) {
            score--;
        } else {
            score = 0; // set score to 0 if it's already at 0
        }
    }

    updateCommentScore(scoreBoxElement, score);

    // Save the updated votes data to localStorage
    updateVotesToLocalStorage(scoreBoxElement, score);
};


// Update comment score
function updateCommentScore(scoreBoxElement, score) {
    const scoreNumElement = scoreBoxElement.querySelector('.score');
    scoreNumElement.textContent = score;
};


// To update votes at localStorage
function updateVotesToLocalStorage(scoreBoxElement, updatedScore) {
    updatedScore = Number(scoreBoxElement.querySelector('.score').textContent);
    // console.log([updatedScore, typeof updatedScore]);

    let isComment = false;
    if (scoreBoxElement.closest('.comments-sub-container')) {
        isComment = true;
        const commentId = Number(scoreBoxElement.closest('.comments-sub-container').dataset.id);
        const comment = findCommentById(data.comments, commentId);
        // console.log(commentId);
        // console.log(comment);
        comment.score = updatedScore;
    } else if (scoreBoxElement.closest('.replies-to-comments-sub-container')) {
        const replySubContainer = scoreBoxElement.closest('.replies-to-comments-sub-container');
        // console.log(replySubContainer);
        const commentSubContainer = replySubContainer.closest('.comments-container').querySelector('.comments-sub-container');
        // console.log(commentSubContainer);
        const commentId = Number(commentSubContainer.dataset.id);
        const comment = findCommentById(data.comments, commentId);
        
        const replyId = Number(replySubContainer.dataset.id);
        const reply = findCommentById(comment.replies, replyId);
        
        reply.score = updatedScore;
    }

    saveDataToLocalStorage(data);
}


// Map to track votes by username
const userVotes = new Map();

// Attach event listeners for upvote and downvote buttons
allComments.addEventListener('click', e => {
    const voteButton = e.target.closest('.vote-button');
    if (voteButton) {
        const scoreBoxElement = voteButton.closest('.score-box');
        const voteType = voteButton.classList.contains('upvote') ? 'upvote' : 'downvote';
        
        const voterCommentContainer = scoreBoxElement.nextElementSibling; // only for adjacent sibling
        const voter = voterCommentContainer.querySelector('.username').textContent; 
        
        if (voter !== currentUsername) {
            if (userVotes.has(voter)) {
                const [previousVoteType, previousVoteCount] = userVotes.get(voter);
                
                if (previousVoteType !== voteType) {
                    userVotes.set(voter, [voteType, previousVoteCount - 1]); // update voteType and reset voteCount to 0
                    // Remove moderate-blue class from both upvote and downvote buttons
                    scoreBoxElement.querySelectorAll('.vote-button').forEach(button => {
                        button.classList.remove('moderate-blue');
                    });
                    // console.log(userVotes);
                    voteComment(scoreBoxElement, voteType);
                } else if (previousVoteType === voteType && previousVoteCount ===  0) {
                    userVotes.set(voter, [voteType, 1]);
                    voteButton.classList.add('moderate-blue');
                    // console.log(userVotes);
                    voteComment(scoreBoxElement, voteType);
                }
            } else {
                userVotes.set(voter, [voteType, 1]); // first vote by the user, initialize voteCount as 1
                voteButton.classList.add('moderate-blue');
                // console.log(userVotes);
                voteComment(scoreBoxElement, voteType);
            }
        }
    }
});


// Create pop-up messages to alert user
function createPopUp(msg) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = `<span class="popuptext" id="popup-msg">${msg}</span>`;
    return popup;
};


// Remove pop-up messages using setTimeout
function removePopUp(parentElement) {
    const popup = parentElement.querySelector('.popup');
    setTimeout(() => {
        popup.classList.add('fade-out');
        setTimeout(() => {
            popup.remove();
        }, 500); // Remove the popup after the fade-out animation (1 sec)
    }, 1000); // Display the popup for 1 sec
};


// // Update time since posted
// function updateTimeSincePosted(element, timestamp) {
//     const timeElement = element.querySelector('.time');
//     const timeSincePosted = getTimeSincePosted(timestamp);
//     timeElement.textContent = timeSincePosted;
// };


// Get time since posted
function getTimeSincePosted(timestamp) {
    const currentTime = new Date(),
          postedTime = new Date(timestamp),
          timeDifference = currentTime - postedTime,
          seconds = Math.floor(timeDifference / 1000),
          minutes = Math.floor(seconds / 60),
          hours = Math.floor(minutes / 60),
          days = Math.floor(hours / 24),
          weeks = Math.floor(days / 7),
          months = Math.floor(days / 30),
          years = Math.floor(days / 365);

    if (seconds < 60) {
        return seconds === 1 ? '1 second ago' : `${seconds} seconds ago`;
    } else if (minutes < 60) {
        return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else if (hours < 24) {
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else if (days < 7) {
        return days === 1 ? '1 day ago' : `${days} days ago`;
    } else if (weeks < 4.35) {
        return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    } else if (months < 12) {
        return months === 1 ? '1 month ago' : `${months} months ago`;
    } else {
        return years === 1 ? '1 year ago' : `${years} years ago`;
    }
};


// Load any pre-existing data in localStorage if any
function getStoredData() {
    const storedData = localStorage.getItem('commentData');
    if (storedData) {
      return JSON.parse(storedData);
    } else {
        return {
            currentUser: {
                image: {
                    png: './src/images/avatars/image-juliusomo.png',
                    webp: './src/images/avatars/image-juliusomo.webp'
                },
                username: 'juliusomo'
            },
            comments: []
        };
    }
}


function saveDataToLocalStorage(data) {
    localStorage.setItem('commentData', JSON.stringify(data));
}


// Fetch data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadComments();
});