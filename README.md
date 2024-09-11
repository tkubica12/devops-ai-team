# DevOps AI Team
This is toy example of multi-agent scenario in which AI agents try to build new features and fixes to application and deploy it. Agents are representing different roles in DevOps team, are able to leverage different tools such as accessing GitHub Discussions, Projects or Actions, can generate code to calculate statistics and generate graphs, and have access to different knowledge bases such as user feedback, product documentation or internet search.

## Agents
- User feedback agent - have access to discussions over RAG + have official feedback tag from projects (tool)

## Microservices
- Get discussions from GitHub Discussions a push it to CosmosDB
- Get discussions change feed from CosmosDB, get sentiment and vectorize the result
- Access GitGub Projects based on tag filter