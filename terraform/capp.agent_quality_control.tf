resource "azurerm_container_app" "agent_quality_control" {
  name                         = "ca-agent-quality-control"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"

  template {
    min_replicas = 1
    
    container {
      name   = "myapp"
      image  = "ghcr.io/tkubica12/devops-ai-team/agent_quality_control:latest"
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

      env {
        name  = "GITHUB_TOKEN"
        value = var.GITHUB_TOKEN
      }

      env {
        name  = "GITHUB_OWNER"
        value = var.GITHUB_OWNER
      }

      env {
        name  = "GITHUB_REPO"
        value = var.GITHUB_REPO
      }
    }
  }

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.main.id]
  }
}
