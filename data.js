const initialQuestions = [
    "Pourquoi l'IA invente-t-elle des choses fausses?",
    "Est-ce que l'IA est mon amie?",
    "Est-ce que l'IA m'espionne?",
    "L'IA est-elle intelligente?",
    "Est-ce que je vais devenir moins intelligent si j'utilise l'IA?",
    "Pourquoi les femmes sont-elles oubliées par l'IA?",
    "Comment l'IA trouve-t-elle ses réponses?",
    "Mes données sont-elles en sécurité?",
    "Puis-je faire confiance à l'IA",
    "Pourquoi ai-je toujours raison avec l'IA ?",
    "Est-ce que l'IA cherche à m'influencer ?",
    "Si je vois une vidéo, puis-je y croire ?",
    "Est-ce dangereux d'entraîner une IA avec nos données personnelles ?",
    "Quels sont mes outils pour discerner du contenu créé par l'IA (vidéo / photo / textuel) ?",
    "L'IA va-t-elle remplacer les humains… ou seulement les tâches qu'on déteste faire ?",
    "L'IA peut-elle raisonner… ou seulement calculer ?",
    "Que se passe-t-il avec les données qu'on donne aux IA ?",
    "Que veut dire \"entraîner\" une IA ?",
    "Peut-on savoir si un texte a été écrit par une IA ?",
    "Comment l'IA influence-t-elle notre créativité ?",
    "Comment L'IA générative fait-elle pour générer sa réponse?",
    "Est-ce que l'IA est fiable?"
];

class VotingSystem {
    constructor() {
        this.userId = this.getOrCreateUserId();
        this.questions = [];
        this.isOnline = false;
        this.syncCallbacks = [];
        this.initFirebase();
    }

    getOrCreateUserId() {
        let userId = localStorage.getItem('userId');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
            localStorage.setItem('userId', userId);
        }
        return userId;
    }

    initFirebase() {
        if (!window.firebase) {
            console.error('Firebase SDK not loaded');
            this.loadLocalData();
            return;
        }

        try {
            this.db = firebase.database();
            this.auth = firebase.auth();
            
            // Authentification anonyme
            this.auth.signInAnonymously().then(() => {
                this.setupRealtimeSync();
            }).catch((error) => {
                console.error('Authentication error:', error);
                this.loadLocalData();
            });
        } catch (error) {
            console.error('Firebase initialization error:', error);
            this.loadLocalData();
        }
    }

    setupRealtimeSync() {
        this.db.ref('questions').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                this.questions = Object.values(data);
                this.isOnline = true;
                console.log('Questions chargées depuis Firebase:', this.questions.length);
                this.notifySyncCallbacks();
            } else {
                console.warn('Aucune donnée dans Firebase, chargement des données locales');
                this.loadLocalData();
            }
        }, (error) => {
            console.warn('Firebase sync error:', error);
            this.isOnline = false;
            this.loadLocalData();
        });
    }

    loadLocalData() {
        const stored = localStorage.getItem('votingData');
        if (stored) {
            this.questions = JSON.parse(stored);
        } else {
            this.questions = initialQuestions.map((text, id) => ({
                id: id,
                text: text,
                votes: [],
                createdAt: new Date().toISOString(),
                merged: false,
                reformulations: [],
                relatedQuestions: [],
                comments: []
            }));
        }
    }

    save() {
        // Sauvegarder localement
        localStorage.setItem('votingData', JSON.stringify(this.questions));
        console.log('Données sauvegardées localement');
        
        // Sauvegarder dans Firebase
        if (this.isOnline && this.db) {
            const questionsObj = {};
            this.questions.forEach(q => {
                questionsObj[q.id] = q;
            });
            this.db.ref('questions').set(questionsObj).then(() => {
                console.log('Données synchronisées avec Firebase');
            }).catch(err => {
                console.error('Erreur de synchronisation Firebase:', err);
            });
        } else {
            console.warn('Firebase hors ligne - données en cache local uniquement');
        }
    }

    onSync(callback) {
        this.syncCallbacks.push(callback);
    }

    notifySyncCallbacks() {
        this.syncCallbacks.forEach(cb => cb());
    }

    rate(questionId, rating) {
        const question = this.questions.find(q => q.id === questionId);
        if (!question) {
            console.error('Question non trouvée:', questionId);
            return;
        }

        // Supprimer l'ancien vote de cet utilisateur
        question.votes = question.votes.filter(v => v.userId !== this.userId);

        // Ajouter le nouveau vote
        if (rating !== null) {
            const vote = {
                userId: this.userId,
                rating: rating,
                createdAt: new Date().toISOString()
            };
            question.votes.push(vote);
            console.log('Vote enregistré:', vote);
        } else {
            console.log('Vote supprimé pour la question:', questionId);
        }

        this.save();
    }

    getUserRating(questionId) {
        const question = this.questions.find(q => q.id === questionId);
        if (!question) return null;
        const userVote = question.votes.find(v => v.userId === this.userId);
        return userVote ? userVote.rating : null;
    }

    getAverageRating(question) {
        if (question.votes.length === 0) return 0;
        const sum = question.votes.reduce((a, b) => a + b.rating, 0);
        return (sum / question.votes.length).toFixed(1);
    }

    addQuestion(text) {
        const newId = Math.max(...this.questions.map(q => q.id), -1) + 1;
        this.questions.push({
            id: newId,
            text: text,
            votes: [],
            createdAt: new Date().toISOString(),
            merged: false,
            reformulations: [],
            relatedQuestions: [],
            comments: []
        });
        this.save();
        return newId;
    }

    mergeQuestions(ids, newText) {
        const questions = ids.map(id => this.questions.find(q => q.id === id)).filter(q => q);
        
        if (questions.length < 2) return null;

        const merged = {
            id: Math.max(...this.questions.map(q => q.id), -1) + 1,
            text: newText,
            votes: questions.flatMap(q => q.votes),
            createdAt: new Date().toISOString(),
            merged: true,
            mergedFrom: ids,
            reformulations: [],
            relatedQuestions: [],
            comments: []
        };

        this.questions = this.questions.filter(q => !ids.includes(q.id));
        this.questions.push(merged);
        this.save();
        return merged;
    }

    proposeReformulation(questionId, newText) {
        const question = this.questions.find(q => q.id === questionId);
        if (!question) {
            console.error('Question non trouvée:', questionId);
            return;
        }

        if (!question.reformulations) {
            question.reformulations = [];
        }

        const reformulation = {
            text: newText,
            votes: 0,
            createdAt: new Date().toISOString()
        };

        question.reformulations.push(reformulation);
        console.log('Reformulation proposée:', reformulation);
        this.save();
    }

    proposeRelatedQuestions(questionId, relatedIds) {
        const question = this.questions.find(q => q.id === questionId);
        if (!question) {
            console.error('Question non trouvée:', questionId);
            return;
        }

        if (!question.relatedQuestions) {
            question.relatedQuestions = [];
        }

        const addedIds = [];
        relatedIds.forEach(id => {
            if (!question.relatedQuestions.includes(id)) {
                question.relatedQuestions.push(id);
                addedIds.push(id);
            }
        });

        console.log(`${addedIds.length} questions connexes ajoutées:`, addedIds);
        this.save();
    }

    deleteQuestion(questionId) {
        this.questions = this.questions.filter(q => q.id !== questionId);
        this.save();
    }

    addComment(questionId, text) {
        const question = this.questions.find(q => q.id === questionId);
        if (!question) {
            console.error('Question non trouvée:', questionId);
            return;
        }

        if (!question.comments) {
            question.comments = [];
        }

        const comment = {
            text: text,
            userId: this.userId,
            createdAt: new Date().toISOString()
        };

        question.comments.push(comment);
        console.log('Commentaire ajouté:', comment);
        this.save();
    }

    deleteComment(questionId, commentIndex) {
        const question = this.questions.find(q => q.id === questionId);
        if (!question || !question.comments) return;

        question.comments.splice(commentIndex, 1);
        this.save();
    }

    getQuestionNumber(questionId) {
        const sorted = this.getQuestions();
        return sorted.findIndex(q => q.id === questionId) + 1;
    }

    getQuestions() {
        return this.questions.sort((a, b) => this.getAverageRating(b) - this.getAverageRating(a));
    }

    searchQuestions(query) {
        const lower = query.toLowerCase();
        return this.getQuestions().filter(q => q.text.toLowerCase().includes(lower));
    }
}

const votingSystem = new VotingSystem();
