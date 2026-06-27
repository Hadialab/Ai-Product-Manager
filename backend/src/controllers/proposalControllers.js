const aiService = require("../services/aiService");

const generateProposal = async (req, res) => {
    try {
    
        const { idea } = req.body;
           
        if (!idea) {
            return res.status(400).json({
                success: false,
                message: "Business idea is required."
            });
        }

        const proposal = await aiService.generateProposal(idea);

        return res.status(200).json({
            success: true,
            proposal
        });
    } catch (error) {
        console.error("Error generating proposal:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate proposal."
        });
    }
};

module.exports = {
    generateProposal
};