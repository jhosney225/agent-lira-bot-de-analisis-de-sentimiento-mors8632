```javascript
// Bot de análisis de sentimiento de noticias financieras
// Ejecutar: node index.js

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Simulación de noticias financieras para demostración
const sampleNews = [
  {
    title: "Stock market reaches all-time high with strong earnings reports",
    content: "The market surged today as major companies reported exceptional quarterly earnings. Investors showed strong confidence in the sector.",
    date: new Date()
  },
  {
    title: "Tech sector faces decline amid regulatory concerns",
    content: "Regulatory pressure and concerns about market saturation have led to significant losses in the tech sector. Analysts warn of further decline.",
    date: new Date()
  },
  {
    title: "Banking sector shows modest recovery after recent losses",
    content: "The banking sector has started to recover slowly from previous losses. Interest rate changes show some positive indicators for financial institutions.",
    date: new Date()
  },
  {
    title: "Oil prices plummet on oversupply concerns",
    content: "Global oil prices have dropped sharply due to oversupply in the market. Energy stocks are experiencing heavy selling pressure.",
    date: new Date()
  },
  {
    title: "Cryptocurrency market experiences unprecedented growth",
    content: "Digital assets have reached new milestones with growing institutional adoption. Experts are optimistic about the future of blockchain technology.",
    date: new Date()
  }
];

// Base de palabras positivas y negativas para análisis de sentimiento
const sentimentDictionary = {
  positive: [
    'strong', 'growth', 'profit', 'gain', 'surge', 'rise', 'bull', 'bullish',
    'excellent', 'recovery', 'positive', 'confidence', 'opportunity', 'success',
    'opportunity', 'upgrade', 'outperform', 'beat', 'exceed', 'rally', 'boom',
    'breakthrough', 'expansion', 'optimistic', 'promising', 'robust', 'solid',
    'earnings', 'revenue', 'milestone', 'record', 'exceptional', 'impressive'
  ],
  negative: [
    'decline', 'loss', 'fall', 'drop', 'bear', 'bearish', 'weak', 'weakness',
    'crisis', 'crash', 'collapse', 'plunge', 'slump', 'recession', 'depression',
    'concern', 'warning', 'risk', 'threat', 'pressure', 'downgrade', 'underperform',
    'miss', 'fail', 'loss', 'deficit', 'negative', 'pessimistic', 'bleak',
    'downturn', 'danger', 'problem', 'issue', 'challenge', 'difficulty'
  ]
};

// Clase para análisis de sentimiento
class SentimentAnalyzer {
  constructor() {
    this.results = [];
  }

  // Análisis básico de sentimiento basado en palabras clave
  analyzeSentiment(text) {
    const lowerText = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;

    // Contar palabras positivas
    sentimentDictionary.positive.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      const matches = lowerText.match(regex);
      if (matches) positiveCount += matches.length;
    });

    // Contar palabras negativas
    sentimentDictionary.negative.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      const matches = lowerText.match(regex);
      if (matches) negativeCount += matches.length;
    });

    // Calcular score de sentimiento (-100 a 100)
    const total = positiveCount + negativeCount;
    let score = 0;
    
    if (total > 0) {
      score = ((positiveCount - negativeCount) / total) * 100;
    }

    // Determinar sentimiento
    let sentiment = 'NEUTRAL';
    if (score > 20) sentiment = 'POSITIVE';
    if (score < -20) sentiment = 'NEGATIVE';

    return {
      score: Math.round(score),
      sentiment: sentiment,
      positiveWords: positiveCount,
      negativeWords: negativeCount,
      confidence: Math.min(100, Math.abs(score) + (total * 5))
    };
  }

  // Analizar una noticia completa
  analyzeNews(newsItem) {
    const combinedText = `${newsItem.title} ${newsItem.content}`;
    const sentiment = this.analyzeSentiment(combinedText);
    
    return {
      title: newsItem.title,
      content: newsItem.content.substring(0, 100) + '...',
      date: newsItem.date.toISOString(),
      analysis: sentiment
    };
  }

  // Procesar múltiples noticias
  processNews(newsArray) {
    this.results = newsArray.map(news => this.analyzeNews(news));
    return this.results;
  }

  // Generar reporte de análisis
  generateReport() {
    if (this.results.length === 0) {
      return { error: 'No results to generate report' };
    }

    const sentiments = this.results.map(r => r.analysis.sentiment);
    const scores = this.results.map(r => r.analysis.score);
    
    const positivCount = sentiments.filter(s => s === 'POSITIVE').length;
    const negativeCount = sentiments.filter(s => s === 'NEGATIVE').length;
    const neutralCount = sentiments.filter(s => s === 'NEUTRAL').length;

    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    