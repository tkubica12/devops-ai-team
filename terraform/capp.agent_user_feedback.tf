resource "azurerm_container_app" "agent_user_feedback" {
  name                         = "ca-agent-user-feedback"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"

  template {
    min_replicas = 1

    container {
      name   = "myapp"
      image  = "ghcr.io/tkubica12/devops-ai-team/agent_user_feedback:latest"
      cpu    = 0.5
      memory = "1Gi"

      env {
        name  = "COSMOS_ENDPOINT"
        value = azurerm_cosmosdb_account.main.endpoint
      }

      env {
        name  = "COSMOS_DATABASE_NAME"
        value = azurerm_cosmosdb_sql_database.main.name
      }

      env {
        name  = "COSMOS_RAG_CONTAINER_NAME"
        value = "discussions-embeddings"
      }

      env {
        name  = "AZURE_OPENAI_API_KEY"
        value = var.AZURE_OPENAI_API_KEY
      }

      env {
        name  = "AZURE_OPENAI_ENDPOINT"
        value = var.AZURE_OPENAI_ENDPOINT
      }

      env {
        name  = "AZURE_OPENAI_DEPLOYMENT_NAME"
        value = "gpt-4o"
      }

      env {
        name  = "AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME"
        value = "text-embedding-3-large"
      }

      env {
        name  = "AZURE_CLIENT_ID"
        value = azurerm_user_assigned_identity.main.client_id
      }
    }
  }

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.main.id]
  }
}
