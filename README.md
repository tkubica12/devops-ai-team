# DevOps AI Team
# Download at https://github.com/tkubica12/devops-ai-team

This is demo for **AI Tour Prague** conference. It is toy example of using robust application architecture on Azure Cloud Native infrastructure together with multi-agent scenario and GitHub integrations.

**Theme:** AI team working on development and deployment of application

**Architecture:**
- **GitHub Discussions** for user feedback
- **GitHub Issues** to track progress, bugs, features and backlog
- **GitHub Actions** to deploy **Virtual Office Pet** application
- **Azure Container Apps Jobs** to ingest GitHub Issues and Discussions using **GraphQL API** to raw **CosmosDB** table
- **Azure Container Apps** listening to **CosmosDB change feed** to create embeddings from OpenAI model and storing in CosmosDB vector store with possibility to scale to zero
- Azure Container Apps agents listening to CosmosDB change feed using Event Sourcing pattern, can be scaled to zero
- Azure Container Apps agent providing callback API for GitHub Actions pipeline to handle errors during build and deployment
- Azure Container Apps UI component using **React** and **Python** backend
- Azure Container App with our application deployment - Virtual Office Pet, scalable to zero
- CosmosDB for storing all data, vectors and event store including change feeds
- **Infrastucture as Code** using Terraform to deploy complete solution
- **GitHub Copilot** was helping to put this together, 35% written by Copilot Chat, 40%% by Copilot "tab" and only 30% by me.

**Agents:**
- **agent_user_feedback**: Overlooks user discussions on GitHub and provides information about what features people are talking about, sentiment, suggestions, etc.
- **agent_product_manager**: Maintains the roadmap of features and bugs, and oversees overall product strategy.
- **agent_user_experience**: Ensures the application is easy to use and understandable.
- **agent_monetization**: Looks into ways to monetize the product and make it valuable yet profitable.
- **agent_writer**: Creates content for the product, including documentation, blog posts, and marketing materials after code is finished.
- **agent_coder**: Implements new features and fixes bugs in the product.
- **agent_security**: Ensures the product is secure and compliant with relevant regulations.
- **agent_devops**: Manages the deployment and operation of the product. Executes CI/CD pipeline and reports any issues back to facilitator should there be issues in code.
- **agent_quality_control**: Ensures the code meets quality standards and is free of defects.

**Demo flow:**
1. Open GitHub and explain Discussions and Issues
2. Hit "." to open VS Code in browser, comment on Codespaces if you need to run on compile on remote computer
3. Mention Terraform IaC that was used to deploy this and that Codespaces can be use to get preinstalled tools in remote computer
4. Show current state of our Virtual Office Pet and explain Azure Container Apps with scale to zero
5. Explain job to import data from GitHub to CosmosDB
6. Explain change feed to get new items and create embeddings for it using OpenAI and CosmosDB vector store
7. Explain individual agents and their roles
8. Explain how agents communicate using event sourcing pattern and each agents is deployed as separate Azure Container App that can scale to zero
9. Go to devops ai team UI and start new work, for example to work on some monetization features and see what is going on
10. Go to Facilitator code to explain little bit more how this agent moderates discussion
11. Open some other agent, just as example to explain each is unique in prompts or data it can access
12. When coder starts to write code, go to GitHub to see commits to new branch agent is making
13. When coder, security and QA is satisfied, see how they created Pull Request in GitHub and how GitHub Actions started to package and deploy app
14. If pipeline fails during creation it is fed back to process so coder with security and QA can fix it and redeploy until done