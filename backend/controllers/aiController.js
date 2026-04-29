const suggestService = async (req, res, next) => {
    try {
        const { query } = req.body;

        if (!query) {
            res.status(400);
            throw new Error('Please provide query text');
        }

        const lowerQuery = query.toLowerCase();
        let suggestion = "Other";

        if (lowerQuery.includes('ac') || lowerQuery.includes('cool') || lowerQuery.includes('thanda')) {
            suggestion = 'AC Repair';
        } else if (lowerQuery.includes('water') || lowerQuery.includes('leak') || lowerQuery.includes('pipe') || lowerQuery.includes('tap')) {
            suggestion = 'Plumber';
        } else if (lowerQuery.includes('light') || lowerQuery.includes('wire') || lowerQuery.includes('switch') || lowerQuery.includes('fan') || lowerQuery.includes('current')) {
            suggestion = 'Electrician';
        } else if (lowerQuery.includes('wood') || lowerQuery.includes('furniture') || lowerQuery.includes('door') || lowerQuery.includes('bed')) {
            suggestion = 'Carpentry';
        } else if (lowerQuery.includes('clean') || lowerQuery.includes('dust') || lowerQuery.includes('sweep') || lowerQuery.includes('wash')) {
            suggestion = 'Cleaning';
        } else if (lowerQuery.includes('paint') || lowerQuery.includes('color') || lowerQuery.includes('wall')) {
            suggestion = 'Painting';
        }

        res.status(200).json({
            query: query,
            suggestedCategory: suggestion,
            message: `AI suggests ${suggestion} based on your problem.`
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { suggestService };
