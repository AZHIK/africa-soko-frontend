let selectedRating = 5;
let currentProductId = null;
let skipCount = 0;
const PAGE_LIMIT = 20;
let loadingReviews = false;

// Helper to get Authorization headers
function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("sokoni_identity")}`
  };
}

export function renderComment(review, container, currentUserId = null) {
  const commentDiv = document.createElement('div');
  commentDiv.className = 'comment';
  const avatar = (review.user && review.user.profile_pic) ? review.user.profile_pic : 'assets/images/faces/user1.jfif';
  const username = (review.user && review.user.username) ? review.user.username : 'anonymous';
  const badgeImg = (review.user && review.user.verification) ? `<img src="assets/images/badges/${review.user.verification}.png">` : '';
  let ratingHtml = '';
  if (review.rating > 0) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
      if (i < review.rating) {
        stars += `<i class="fi fi-sr-star" style="color: gold;"></i>`;
      } else {
        stars += `<i class="fi fi-rr-star" style="color: #d3d3d3;"></i>`;
      }
    }
    ratingHtml = `<div class="rating-stars" style="display: flex; gap: 2px;">${stars}</div>`;
  }
  const dateStr = review.created_at ? ` <small class="rev-date">${new Date(review.created_at).toLocaleString()}</small>` : '';

  commentDiv.innerHTML = `
    <img src="${avatar}" alt="${username}">
    <div class="data">
      <h4>${username} ${badgeImg}${dateStr}</h4>
      <p>${(review.comment || '').replaceAll('\n','<br>')}</p>
      ${ratingHtml}
    </div>
  `;

  if (typeof CURRENT_USER_ID !== 'undefined') {
    const isOwner = review.user_id === CURRENT_USER_ID;
    if (isOwner) {
      const actionWrap = document.createElement('div');
      actionWrap.className = 'commentActions';
      actionWrap.innerHTML = `
        <i class="fi fi-rr-edit edit-review" title="Edit"></i>
        <i class="fi fi-rr-trash delete-review" title="Delete"></i>
      `;
      commentDiv.querySelector('.data').appendChild(actionWrap);

      // Edit handler
      actionWrap.querySelector('.edit-review').addEventListener('click', () => {
        const input = document.querySelector('.commentInput input');
        input.value = review.comment || '';
        selectedRating = review.rating || 5;
        lockStars(selectedRating - 1);
        commentDraft.reviewId = review.id;
        commentDraft.isEditing = true;
        updateSendButtonForEdit();
        input.focus();
      });

      // Delete handler
      actionWrap.querySelector('.delete-review').addEventListener('click', async () => {
        if (!confirm('Delete this review?')) return;
        try {
          const res = await fetch(`${MAIN_SERVER}/reviews/${review.id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
          });
          if (res.status === 204 || res.ok) {
            commentDiv.remove();
            decrementCommentCount();
            initStatusMessage && initStatusMessage('Review deleted');
          } else {
            const err = await res.json().catch(()=>null);
            console.error('Delete failed', err);
            initStatusMessage && initStatusMessage('Failed to delete review');
          }
        } catch (err) {
          console.error('Delete error', err);
          initStatusMessage && initStatusMessage('Failed to delete review');
        }
      });
    }
  }

  container.appendChild(commentDiv);
}

// --- star helper functions ---
function highlightStars(index) {
  const stars = document.querySelectorAll('.commentInput .rateSlt i');
  stars.forEach((s, i) => s.classList.toggle('active', i <= index));
}
function lockStars(index) {
  const stars = document.querySelectorAll('.commentInput .rateSlt i');
  stars.forEach((s, i) => {
    s.classList.toggle('locked', i <= index);
    s.classList.toggle('active', i <= index);
  });
}

// used by edit flow
const commentDraft = { reviewId: null, isEditing: false };
function updateSendButtonForEdit() {
  const sendBtn = document.querySelector('.commentInput .fi-rr-paper-plane');
  if (!sendBtn) return;
  if (commentDraft.isEditing) {
    sendBtn.classList.add('editing');
    sendBtn.title = 'Update review';
  } else {
    sendBtn.classList.remove('editing');
    sendBtn.title = 'Post review';
  }
}

// --- load reviews ---
export async function loadProductReviews(productId, reset = true) {
  if (loadingReviews) return;
  loadingReviews = true;

  const container = document.querySelector('.allComments');
  if (!container) return;

  if (reset) {
    container.innerHTML = '';
    skipCount = 0;
    currentProductId = productId;
    commentDraft.reviewId = null;
    commentDraft.isEditing = false;
    updateSendButtonForEdit();
    selectedRating = 5;
    lockStars(selectedRating - 1);
  }

  try {
    const res = await fetch(`${MAIN_SERVER}/products/${productId}/reviews?skip=${skipCount}&limit=${PAGE_LIMIT}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch reviews');
    const reviews = await res.json();

    reviews.reverse(); // newest first
    reviews.forEach(r => renderComment(r, container));
    skipCount += reviews.length;
    updateCommentCountDisplay(skipCount);
  } catch (err) {
    console.error('Failed to load reviews:', err);
    if (container && skipCount === 0) container.innerHTML = '<p class="error">Failed to load comments.</p>';
  } finally {
    loadingReviews = false;
  }
}

// --- post review ---
export async function postReview() {
  if (!currentProductId) return;

  const input = document.querySelector('.commentInput input');
  const commentText = input ? input.value.trim() : '';
  const payload = {
    rating: selectedRating || 5,
    comment: commentText,
    product_id: currentProductId
  };

  try {
    const sendBtn = document.querySelector('.commentInput .fi-rr-paper-plane');
    sendBtn.classList.add('load');

    if (commentDraft.isEditing && commentDraft.reviewId) {
      const res = await fetch(`${MAIN_SERVER}/reviews/${commentDraft.reviewId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ rating: payload.rating, comment: payload.comment })
      });
      if (!res.ok) throw new Error('Failed to update review');
      await loadProductReviews(currentProductId, true);
      initStatusMessage && initStatusMessage('Review updated');
      commentDraft.reviewId = null;
      commentDraft.isEditing = false;
      updateSendButtonForEdit();
    } else {
      const res = await fetch(`${MAIN_SERVER}/products/${currentProductId}/reviews`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json().catch(()=>null);
        console.error('Create review failed', err);
        const msg = (err && err.detail) ? err.detail : 'Failed to post review';
        initStatusMessage && initStatusMessage(msg);
        return;
      }
      const created = await res.json();
      const container = document.querySelector('.allComments');
      const firstChild = container.firstChild;
      const tmp = document.createElement('div');
      renderComment(created, tmp);
      if (firstChild) container.insertBefore(tmp.firstChild, firstChild);
      else container.appendChild(tmp.firstChild);

      input.value = '';
      selectedRating = 5;
      lockStars(selectedRating - 1);
      incrementCommentCount();
      initStatusMessage && initStatusMessage('Review added');
    }
  } catch (err) {
    console.error('Error posting review', err);
    initStatusMessage && initStatusMessage('Failed to post review');
  } finally {
    const sendBtn = document.querySelector('.commentInput .fi-rr-paper-plane');
    sendBtn && sendBtn.classList.remove('load');
  }
}

// --- helpers ---
function updateCommentCountDisplay(total) {
  const head = document.querySelector('.content-popup.comments .popHead');
  if (!head) return;
  head.textContent = head.textContent.replace(/\(.+\)/, `(${total})`);
}
function decrementCommentCount() {
  const head = document.querySelector('.content-popup.comments .popHead');
  if (!head) return;
  const m = head.textContent.match(/\((\d+)\)/);
  if (m) {
    const n = Math.max(0, parseInt(m[1], 10) - 1);
    head.textContent = head.textContent.replace(/\(.+\)/, `(${n})`);
  }
}
function incrementCommentCount() {
  const head = document.querySelector('.content-popup.comments .popHead');
  if (!head) return;
  const m = head.textContent.match(/\((\d+)\)/);
  if (m) {
    const n = parseInt(m[1], 10) + 1;
    head.textContent = head.textContent.replace(/\(.+\)/, `(${n})`);
  } else {
    head.textContent = head.textContent + ` (${1})`;
  }
}

// infinite scroll
export function initCommentsInfiniteScroll() {
  const container = document.querySelector('.allComments');
  if (!container) return;
  container.addEventListener('scroll', () => {
    if (!currentProductId || loadingReviews) return;
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 60) {
      loadProductReviews(currentProductId, false);
    }
  });
}

// init rating selector
export function initRatingSelector() {
  const stars = document.querySelectorAll('.commentInput .rateSlt i');
  if (!stars || !stars.length) return;
  stars.forEach((star, index) => {
    star.classList.remove('active','locked');
    star.addEventListener('mouseenter', () => highlightStars(index));
    star.addEventListener('mouseleave', () => lockStars(selectedRating - 1));
    star.addEventListener('click', () => {
      selectedRating = index + 1;
      lockStars(index);
    });
  });
  lockStars(selectedRating - 1);
}

// init popup
export function initCommentsPopup() {
  const sendBtn = document.querySelector('.commentInput .fi-rr-paper-plane');
  if (sendBtn) sendBtn.addEventListener('click', postReview);

  const input = document.querySelector('.commentInput input');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        postReview();
      }
    });
  }

  initRatingSelector();
  initCommentsInfiniteScroll();
}

// open comments
export function openCommentsForProduct(event, productId) {
  event.stopPropagation();
  try { if (typeof getPop === 'function') getPop('.comments'); } catch(e){ }
  currentProductId = productId;
  skipCount = 0;
  loadProductReviews(productId, true);
  setTimeout(()=> {
    const input = document.querySelector('.commentInput input');
    input && input.focus();
  }, 300);
}

window.openCommentsForProduct = openCommentsForProduct;
window.initCommentsPopup = initCommentsPopup;
