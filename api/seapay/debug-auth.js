module.exports = async (req, res) => {
  const apiKeyHeader = req.headers['authorization'] || req.headers['x-api-key'] || '';
  let parsedApiKey = apiKeyHeader.trim();
  if (parsedApiKey.toLowerCase().startsWith('apikey ')) {
    parsedApiKey = parsedApiKey.substring(7).trim();
  } else if (parsedApiKey.toLowerCase().startsWith('bearer ')) {
    parsedApiKey = parsedApiKey.substring(7).trim();
  }

  const vercelApiKey = process.env.SEPAY_API_KEY || '';
  
  return res.json({
    status: parsedApiKey === vercelApiKey ? 'MATCH' : 'MISMATCH',
    headerReceived: apiKeyHeader,
    parsedHeaderKeyLength: parsedApiKey.length,
    vercelKeyLength: vercelApiKey.length,
    vercelKeyFirstChar: vercelApiKey.charAt(0) || 'empty',
    vercelKeyLastChar: vercelApiKey.charAt(vercelApiKey.length - 1) || 'empty',
    parsedKeyFirstChar: parsedApiKey.charAt(0) || 'empty',
    parsedKeyLastChar: parsedApiKey.charAt(parsedApiKey.length - 1) || 'empty'
  });
};
