const questionsContainer = document.getElementById('questionsContainer');
const proposeBtn = document.getElementById('proposeBtn');
const mergeBtn = document.getElementById('mergeBtn');
const resetBtn = document.getElementById('resetBtn');
const searchInput = document.getElementById('searchInput');
const proposeModal = document.getElementById('proposeModal');
const mergeModal = document.getElementById('mergeModal');
const reformulationModal = document.getElementById('reformulationModal');
const newQuestionInput = document.getElementById('newQuestion');
const submitQuestionBtn = document.getElementById('submitQuestion');
const mergeCheckboxes = document.getElementById('mergeCheckboxes');
const mergedNameInput = document.getElementById('mergedName');
const submitMergeBtn = document.getElementById('submitMerge');
const reformulationText = document.getElementById('reformulationText');
const submitReformulationBtn = document.getElementById('submitReformulation');
const reformulationQuestion = document.getElementById('reformulationQuestion');
const relatedQuestionsModal = document.getElementById('relatedQuestionsModal');
const relatedCheckboxes = document.getElementById('relatedCheckboxes');
const submitRelatedBtn = document.getElementById('submitRelated');
const relatedQuestionTitle = document.getElementById('relatedQuestionTitle');
const commentsModal = document.getElementById('commentsModal');
const commentText = document.getElementById('commentText');
const submitCommentBtn = document.getElementById('submitComment');
const commentsQuestionTitle = document.getElementById('commentsQuestionTitle');
const commentsList = document.getElementById('commentsList');

let currentFilter = '';
let currentReformulationId = null;
let currentRelatedQuestionId = null;
let currentCommentsQuestionId = null;

// Modal management
function openModal(modal) {
    modal.style.display = 'block';
}

function closeModal(modal) {
    modal.style.display = 'none';
}

document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
        closeModal(e.target.closest('.modal'));
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target);
    }
});

// Reset data
resetBtn.addEventListener('click', () => {
    if (confirm('Êtes-vous sûr? Cela supprimera toutes les données.')) {
        localStorage.removeItem('votingData');
        location.reload();
    }
});

// Propose question
proposeBtn.addEventListener('click', () => {
    newQuestionInput.value = '';
    openModal(proposeModal);
});

submitQuestionBtn.addEventListener('click', () => {
    const text = newQuestionInput.value.trim();
    if (text) {
        votingSystem.addQuestion(text);
        closeModal(proposeModal);
        render();
    }
});

// Merge themes
mergeBtn.addEventListener('click', () => {
    populateMergeCheckboxes();
    mergedNameInput.value = '';
    openModal(mergeModal);
});

function populateMergeCheckboxes() {
    const questions = votingSystem.getQuestions();
    mergeCheckboxes.innerHTML = '';

    questions.forEach(q => {
        const label = document.createElement('label');
        label.className = 'merge-checkbox-label';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = q.id;
        checkbox.className = 'merge-checkbox';
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + q.text.substring(0, 60) + '...'));
        mergeCheckboxes.appendChild(label);
    });
}

submitMergeBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.merge-checkbox:checked');
    const ids = Array.from(checkboxes).map(cb => parseInt(cb.value));
    const newText = mergedNameInput.value.trim();

    if (ids.length >= 2 && newText) {
        votingSystem.mergeQuestions(ids, newText);
        closeModal(mergeModal);
        render();
    } else {
        alert('Sélectionnez au moins 2 questions et entrez un titre');
    }
});

// Reformulation
submitReformulationBtn.addEventListener('click', () => {
    const text = reformulationText.value.trim();
    if (text && currentReformulationId !== null) {
        votingSystem.proposeReformulation(currentReformulationId, text);
        closeModal(reformulationModal);
        render();
    }
});

function openReformulationModal(questionId, questionText) {
    currentReformulationId = questionId;
    reformulationQuestion.textContent = questionText;
    reformulationText.value = '';
    openModal(reformulationModal);
}

// Related questions
submitRelatedBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.related-checkbox:checked');
    const ids = Array.from(checkboxes).map(cb => parseInt(cb.value));

    if (ids.length > 0 && currentRelatedQuestionId !== null) {
        votingSystem.proposeRelatedQuestions(currentRelatedQuestionId, ids);
        closeModal(relatedQuestionsModal);
        render();
    } else {
        alert('Sélectionnez au moins une question connexe');
    }
});

function openRelatedQuestionsModal(questionId, questionText) {
    currentRelatedQuestionId = questionId;
    relatedQuestionTitle.textContent = questionText;
    populateRelatedCheckboxes(questionId);
    openModal(relatedQuestionsModal);
}

function populateRelatedCheckboxes(excludeId) {
    const questions = votingSystem.getQuestions();
    relatedCheckboxes.innerHTML = '';

    questions.forEach(q => {
        if (q.id !== excludeId) {
            const label = document.createElement('label');
            label.className = 'merge-checkbox-label';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = q.id;
            checkbox.className = 'related-checkbox';
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(' ' + q.text.substring(0, 60) + '...'));
            relatedCheckboxes.appendChild(label);
        }
    });
}

// Search
searchInput.addEventListener('input', (e) => {
    currentFilter = e.target.value;
    render();
});

// Render
function render() {
    const questions = currentFilter 
        ? votingSystem.searchQuestions(currentFilter)
        : votingSystem.getQuestions();

    if (questions.length === 0) {
        questionsContainer.innerHTML = '<div class="empty-state">Aucune question trouvée</div>';
        return;
    }

    questionsContainer.innerHTML = questions.map((q, index) => {
        const avgRating = votingSystem.getAverageRating(q);
        const ratingCount = q.votes.length;
        const questionNumber = index + 1;
        const reformulations = q.reformulations || [];
        const relatedQuestions = q.relatedQuestions || [];

        let reformulationsHtml = '';
        if (reformulations.length > 0) {
            reformulationsHtml = `
                <div class="reformulations-section">
                    <div class="reformulations-title">Reformulations proposées:</div>
                    ${reformulations.map(ref => `
                        <div class="reformulation-item">
                            <div class="reformulation-text">${escapeHtml(ref.text)}</div>
                            <div class="reformulation-votes">👍 ${ref.votes}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        let relatedHtml = '';
        if (relatedQuestions.length > 0) {
            const relatedQuestionsText = relatedQuestions.map(id => {
                const relQ = votingSystem.questions.find(q => q.id === id);
                return relQ ? relQ.text.substring(0, 40) + '...' : '';
            }).join(', ');
            relatedHtml = `<div class="question-meta">🔗 Connexe à: ${relatedQuestionsText}</div>`;
        }

        const hasComments = q.comments && q.comments.length > 0;

        return `
            <div class="question-card ${hasComments ? 'has-comments' : ''}">
                <div class="question-header">
                    <div class="question-number">#${questionNumber}</div>
                    ${hasComments ? '<div class="comment-indicator" title="Commentaires présents">💬</div>' : ''}
                </div>
                <div class="question-text">${escapeHtml(q.text)}</div>
                
                <div class="rating-info">
                    <strong>${avgRating}</strong> / 5 
                    ${ratingCount > 0 ? `(${ratingCount} ${ratingCount === 1 ? 'vote' : 'votes'})` : '(pas encore noté)'}
                </div>
                <div class="user-vote-info">
                    ${votingSystem.getUserRating(q.id) ? `Votre vote: ${votingSystem.getUserRating(q.id)} ⭐` : ''}
                </div>

                ${createStarRating(q.id, votingSystem.getUserRating(q.id))}

                <div class="button-group">
                    <button type="button" class="btn btn-small" onclick="openReformulationModal(${q.id}, '${escapeHtml(q.text).replace(/'/g, "\\'")}')">
                        ✏️ Reformuler
                    </button>
                    <button type="button" class="btn btn-small" onclick="openRelatedQuestionsModal(${q.id}, '${escapeHtml(q.text).replace(/'/g, "\\'")}')">
                        🔗 Connexes
                    </button>
                    <button type="button" class="btn btn-small" onclick="openCommentsModal(${q.id})">
                        💬 Commentaires ${q.comments && q.comments.length > 0 ? `(${q.comments.length})` : ''}
                    </button>
                    <button type="button" class="btn btn-small btn-delete" onclick="deleteQuestion(${q.id})">
                        🗑️ Supprimer
                    </button>
                </div>

                ${reformulationsHtml}
                ${relatedHtml}
                ${q.merged ? '<div class="question-meta">✓ Fusionné</div>' : ''}
            </div>
        `;
    }).join('');
}

function handleRate(questionId, rating) {
    votingSystem.rate(questionId, rating);
    render();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function createStarRating(questionId, userRating) {
    const question = votingSystem.questions.find(q => q.id === questionId);
    const avgRating = votingSystem.getAverageRating(question);
    
    let html = '<div class="rating-container">';
    html += '<div class="stars-row">';
    for (let i = 1; i <= 5; i++) {
        const isActive = userRating >= i ? 'active' : '';
        html += `<span class="star ${isActive}" onclick="handleRate(${questionId}, ${i})">⭐</span>`;
    }
    html += '</div>';
    html += `<div class="average-rating">Moyenne: ${avgRating}/5</div>`;
    html += '</div>';
    return html;
}

function deleteQuestion(questionId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette question?')) {
        votingSystem.deleteQuestion(questionId);
        render();
    }
}

// Comments
submitCommentBtn.addEventListener('click', () => {
    const text = commentText.value.trim();
    if (text && currentCommentsQuestionId !== null) {
        votingSystem.addComment(currentCommentsQuestionId, text);
        commentText.value = '';
        openCommentsModal(currentCommentsQuestionId);
    }
});

function openCommentsModal(questionId) {
    currentCommentsQuestionId = questionId;
    const question = votingSystem.questions.find(q => q.id === questionId);
    if (!question) return;

    commentsQuestionTitle.textContent = question.text;
    commentText.value = '';
    displayComments(question);
    openModal(commentsModal);
}

function displayComments(question) {
    const comments = question.comments || [];
    if (comments.length === 0) {
        commentsList.innerHTML = '<div class="no-comments">Aucun commentaire pour le moment</div>';
        return;
    }

    commentsList.innerHTML = comments.map((comment, index) => `
        <div class="comment-item">
            <div class="comment-text">${escapeHtml(comment.text)}</div>
            <div class="comment-footer">
                <span class="comment-date">${new Date(comment.createdAt).toLocaleDateString('fr-FR')}</span>
                <button type="button" class="btn-delete-comment" onclick="deleteComment(${currentCommentsQuestionId}, ${index})">✕</button>
            </div>
        </div>
    `).join('');
}

function deleteComment(questionId, commentIndex) {
    if (confirm('Supprimer ce commentaire?')) {
        votingSystem.deleteComment(questionId, commentIndex);
        const question = votingSystem.questions.find(q => q.id === questionId);
        displayComments(question);
    }
}

// Setup real-time sync listener
votingSystem.onSync(() => {
    render();
    updateSyncStatus();
});

function updateSyncStatus() {
    const statusEl = document.getElementById('syncStatus');
    if (statusEl) {
        if (votingSystem.isOnline) {
            statusEl.textContent = '🟢 Synchronisé';
            statusEl.className = 'sync-status online';
        } else {
            statusEl.textContent = '🔴 Hors ligne (données locales)';
            statusEl.className = 'sync-status offline';
        }
    }
}

// Initial render
render();
updateSyncStatus();
