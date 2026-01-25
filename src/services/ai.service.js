const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'meta-llama/llama-3.2-3b-instruct:free';

const buildPrompt = (movies) => {
  const movieList = movies
    .map(m => `- "${m.title}" (${m.year})`)
    .join('\n');

  return `Eres un experto en cine. Para cada película de la siguiente lista, proporciona:
1. Una anécdota breve de su producción
2. Un dato curioso
3. Un pitch de venta convincente

Lista de películas:
${movieList}

IMPORTANTE: Responde ÚNICAMENTE con un JSON válido, sin texto adicional.
El formato debe ser exactamente:
{
  "movies": [
    {
      "title": "Título exacto de la película",
      "anecdote": "anécdota aquí",
      "funFact": "dato curioso aquí",
      "pitch": "pitch de venta aquí"
    }
  ]
}`;
};

const parseAIResponse = (content, movies) => {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.movies || !Array.isArray(parsed.movies)) return null;

    const enrichmentMap = new Map();
    parsed.movies.forEach(item => {
      enrichmentMap.set(item.title.toLowerCase(), {
        anecdote: item.anecdote,
        funFact: item.funFact,
        pitch: item.pitch
      });
    });

    return enrichmentMap;
  } catch {
    return null;
  }
};

export const enrichMoviesWithAI = async (movies) => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || !movies || movies.length === 0) {
    return movies.map(movie => ({ ...movie, ai_enriched: null }));
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Movie Match API'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: buildPrompt(movies)
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      return movies.map(movie => ({ ...movie, ai_enriched: null }));
    }

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content;

    if (!aiContent) {
      return movies.map(movie => ({ ...movie, ai_enriched: null }));
    }

    const enrichmentMap = parseAIResponse(aiContent, movies);

    if (!enrichmentMap) {
      return movies.map(movie => ({ ...movie, ai_enriched: null }));
    }

    return movies.map(movie => {
      const enrichment = enrichmentMap.get(movie.title.toLowerCase());
      return {
        ...movie,
        ai_enriched: enrichment || null
      };
    });

  } catch {
    return movies.map(movie => ({ ...movie, ai_enriched: null }));
  }
};
