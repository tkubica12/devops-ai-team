# DevOps AI Team
This is toy example of multi-agent scenario in which AI agents try to build new features and fixes to application and deploy it. Agents are representing different roles in DevOps team, are able to leverage different tools such as accessing GitHub Discussions, Projects or Actions, can generate code to calculate statistics and generate graphs, and have access to different knowledge bases such as user feedback, product documentation or internet search.

## Agents
- User feedback agent - have access to discussions over RAG + have official feedback tag from projects (tool)

## Microservices
- Get discussions from GitHub Discussions a push it to CosmosDB
- Get discussions change feed from CosmosDB, get sentiment and vectorize the result
- Access GitGub Projects based on tag filter


notes - agent avatar prompt of prompt
Your task is to generate short prompts for image generation Flux AI. I need funny beatiful avatar icons for chat app where various AI agents will be represented. For each agent generate separate prompt. List of agents: user, agent_monetization, agent_product_manager, agent_user_feedback, agent_facilitator (moderator)

User: “Create a vibrant and friendly avatar icon of a user with a big smile, wearing casual clothes, and holding a smartphone. The background should be colorful and lively.”
Agent_Monetization: “Design a humorous and attractive avatar icon for a monetization agent, featuring a character with dollar signs in their eyes, wearing a suit, and holding a stack of coins. The background should include playful elements like gold coins and cash.”
Agent_Product_Manager: “Generate a funny and appealing avatar icon for a product manager agent, showing a character with a clipboard and a lightbulb above their head, wearing a business casual outfit. The background should have elements like charts, graphs, and sticky notes.”
Agent_User_Feedback: “Create a charming and amusing avatar icon for a user feedback agent, depicting a character with a megaphone and a speech bubble, wearing a casual outfit. The background should include elements like thumbs up, stars, and feedback forms.”