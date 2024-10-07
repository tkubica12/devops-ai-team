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
- *Azure Container Apps* agents listening to CosmosDB change feed using Event Sourcing pattern, can be scaled to zero
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