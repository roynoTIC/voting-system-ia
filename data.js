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
        this.loadData();
    }

    loadData() {
        const stored = localStorage.getItem('votingData');
        if (stored) {
            const parsed = JSON.parse(stored);
            // Migration: convert old format to new format
            this.questions = parsed.map(q => {
                if (q.ratings === undefined) {
                    return {
                        id: q.id,
                        text: q.text,
                        ratings: [],
                        userRating: null,
                        createdAt: q.createdAt || new Date().toISOString(),
                        merged: q.merged || false
                    };
                }
                return q;
            });
        } else {
            this.questions = initialQuestions.map((text, id) => ({
                id: id,
                text: text,
                ratings: [],
                userRating: null,
                createdAt: new Date().toISOString(),
                merged: false
            }));
            this.save();
        }
    }

    save() {
        localStorage.setItem('votingData', JSON.stringify(this.questions));
    }

    rate(questionId, rating) {
        const question = this.questions.find(q => q.id === questionId);
        if (!question) return;

        if (question.userRating !== null) {
            question.ratings = question.ratings.filter(r => r !== question.userRating);
        }

        if (rating !== null) {
            question.ratings.push(rating);
            question.userRating = rating;
        } else {
            question.userRating = null;
        }

        this.save();
    }

    getAverageRating(question) {
        if (question.ratings.length === 0) return 0;
        return (question.ratings.reduce((a, b) => a + b, 0) / question.ratings.length).toFixed(1);
    }

    addQuestion(text) {
        const newId = Math.max(...this.questions.map(q => q.id), -1) + 1;
        this.questions.push({
            id: newId,
            text: text,
            ratings: [],
            userRating: null,
            createdAt: new Date().toISOString(),
            merged: false
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
            ratings: questions.flatMap(q => q.ratings),
            userRating: null,
            createdAt: new Date().toISOString(),
            merged: true,
            mergedFrom: ids
        };

        this.questions = this.questions.filter(q => !ids.includes(q.id));
        this.questions.push(merged);
        this.save();
        return merged;
    }

    proposeReformulation(questionId, newText) {
        const question = this.questions.find(q => q.id === questionId);
        if (!question) return;

        if (!question.reformulations) {
            question.reformulations = [];
        }

        question.reformulations.push({
            text: newText,
            votes: 0,
            createdAt: new Date().toISOString()
        });

        this.save();
    }

    proposeRelatedQuestions(questionId, relatedIds) {
        const question = this.questions.find(q => q.id === questionId);
        if (!question) return;

        if (!question.relatedQuestions) {
            question.relatedQuestions = [];
        }

        relatedIds.forEach(id => {
            if (!question.relatedQuestions.includes(id)) {
                question.relatedQuestions.push(id);
            }
        });

        this.save();
    }

    deleteQuestion(questionId) {
        this.questions = this.questions.filter(q => q.id !== questionId);
        this.save();
    }

    addComment(questionId, text) {
        const question = this.questions.find(q => q.id === questionId);
        if (!question) return;

        if (!question.comments) {
            question.comments = [];
        }

        question.comments.push({
            text: text,
            createdAt: new Date().toISOString()
        });

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
