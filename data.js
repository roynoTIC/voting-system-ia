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
        console.log('Démarrage de la synchronisation Firebase...');
        this.db.ref('questions').on('value', (snapshot) => {
            const data = snapshot.val();
            console.log('Données reçues de Firebase:', data);
            if (data) {
                // Convertir les données Firebase en format interne
                this.questions = Object.values(data).map(q => ({
                    id: q.id,
                    text: q.text,
                    votes: this.parseVotes(q.votes),
                    averageRating: q.averageRating || 0,
                    createdAt: q.createdAt,
                    merged: q.merged || false,
                    reformulations: this.parseReformulations(q.reformulations),
                    relatedQuestions: this.parseRelatedQuestions(q.relatedQuestions),
                    comments: this.parseComments(q.comments)
                }));
                this.isOnline = true;
                console.log('Questions chargées depuis Firebase:', this.questions.length);
                this.notifySyncCallbacks();
            } else {
                console.warn('Aucune donnée dans Firebase, chargement des données locales');
                this.loadLocalData();
                this.isOnline = false;
                this.notifySyncCallbacks();
            }
        }, (error) => {
            console.error('Firebase sync error:', error);
            this.isOnline = false;
            this.loadLocalData();
            this.notifySyncCallbacks();
        });
    }

    loadLocalData() {
        console.log('Chargement des données locales...');
        const stored = localStorage.getItem('votingData');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Convertir les données en format interne
                if (Array.isArray(parsed)) {
                    this.questions = parsed.map(q => ({
                        id: q.id,
                        text: q.text,
                        votes: this.parseVotes(q.votes),
                        averageRating: q.averageRating || 0,
                        createdAt: q.createdAt,
                        merged: q.merged || false,
                        reformulations: this.parseReformulations(q.reformulations),
                        relatedQuestions: this.parseRelatedQuestions(q.relatedQuestions),
                        comments: this.parseComments(q.comments)
                    }));
                } else {
                    this.questions = Object.values(parsed).map(q => ({
                        id: q.id,
                        text: q.text,
                        votes: this.parseVotes(q.votes),
                        averageRating: q.averageRating || 0,
                        createdAt: q.createdAt,
                        merged: q.merged || false,
                        reformulations: this.parseReformulations(q.reformulations),
                        relatedQuestions: this.parseRelatedQuestions(q.relatedQuestions),
                        comments: this.parseComments(q.comments)
                    }));
                }
                console.log('Données locales chargées:', this.questions.length);
            } catch (e) {
                console.error('Erreur parsing données locales:', e);
                this.questions = [];
            }
        } else {
            console.log('Aucune donnée locale, création des questions initiales');
            this.questions = initialQuestions.map((text, id) => ({
                id: id,
                text: text,
                votes: [],
                averageRating: 0,
                createdAt: new Date().toISOString(),
                merged: false,
                reformulations: [],
                relatedQuestions: [],
                comments: []
            }));
        }
    }

    parseVotes(votesData) {
        if (!votesData || votesData === 0) return [];
        if (typeof votesData === 'object' && !Array.isArray(votesData)) {
            return Object.values(votesData);
        }
        return Array.isArray(votesData) ? votesData : [];
    }

    parseReformulations(reformData) {
        if (!reformData || reformData === 0) return [];
        if (typeof reformData === 'object' && !Array.isArray(reformData)) {
            return Object.values(reformData);
        }
        return Array.isArray(reformData) ? reformData : [];
    }

    parseRelatedQuestions(relatedData) {
        if (!relatedData || relatedData === 0) return [];
        if (typeof relatedData === 'object' && !Array.isArray(relatedData)) {
            const values = Object.values(relatedData);
            // Filtrer les valeurs non-numériques
            return values.filter(v => typeof v === 'number');
        }
        return Array.isArray(relatedData) ? relatedData : [];
    }

    parseComments(commentsData) {
        if (!commentsData || commentsData === 0) return [];
        if (typeof commentsData === 'object' && !Array.isArray(commentsData)) {
            return Object.values(commentsData);
        }
        return Array.isArray(commentsData) ? commentsData : [];
    }

    save() {
        // Sauvegarder localement
        localStorage.setItem('votingData', JSON.stringify(this.questions));
        console.log('Données sauvegardées localement');
        
        // Sauvegarder dans Firebase
        if (this.isOnline && this.db) {
            const questionsObj = {};
            this.questions.forEach(q => {
                // Convertir les tableaux en objets pour Firebase
                const votesObj = {};
                if (Array.isArray(q.votes) && q.votes.length > 0) {
                    q.votes.forEach((v, idx) => {
                        votesObj[idx] = v;
                    });
                }

                const reformulationsObj = {};
                if (Array.isArray(q.reformulations) && q.reformulations.length > 0) {
                    q.reformulations.forEach((r, idx) => {
                        reformulationsObj[idx] = r;
                    });
                }

                const relatedObj = {};
                if (Array.isArray(q.relatedQuestions) && q.relatedQuestions.length > 0) {
                    q.relatedQuestions.forEach((r, idx) => {
                        relatedObj[idx] = r;
                    });
                }

                const commentsObj = {};
                if (Array.isArray(q.comments) && q.comments.length > 0) {
                    q.comments.forEach((c, idx) => {
                        commentsObj[idx] = c;
                    });
                }

                questionsObj[q.id] = {
                    id: q.id,
                    text: q.text,
                    votes: Object.keys(votesObj).length > 0 ? votesObj : 0,
                    averageRating: q.averageRating || 0,
                    createdAt: q.createdAt,
                    merged: q.merged || false,
                    reformulations: Object.keys(reformulationsObj).length > 0 ? reformulationsObj : 0,
                    relatedQuestions: Object.keys(relatedObj).length > 0 ? relatedObj : 0,
                    comments: Object.keys(commentsObj).length > 0 ? commentsObj : 0
                };
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

        // Initialiser votes comme tableau s'il ne l'est pas
        if (!Array.isArray(question.votes)) {
            question.votes = [];
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
            
            // Mettre à jour la moyenne
            question.averageRating = this.getAverageRating(question);
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
        // Si averageRating existe déjà, l'utiliser
        if (question.averageRating !== undefined && question.averageRating !== null) {
            return question.averageRating;
        }
        // Sinon calculer à partir des votes
        if (question.votes && Array.isArray(question.votes) && question.votes.length > 0) {
            const sum = question.votes.reduce((a, b) => a + (b.rating || 0), 0);
            return (sum / question.votes.length).toFixed(1);
        }
        return 0;
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

        // Initialiser reformulations comme tableau s'il ne l'est pas
        if (!Array.isArray(question.reformulations)) {
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

        // Initialiser relatedQuestions comme tableau s'il ne l'est pas
        if (!Array.isArray(question.relatedQuestions)) {
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

        // Initialiser comments comme tableau s'il ne l'est pas
        if (!Array.isArray(question.comments)) {
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
