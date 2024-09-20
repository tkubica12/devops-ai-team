resource "azurerm_container_app_job" "github_import_data" {
  name                         = "cjob-github-import-data"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  location                     = azurerm_resource_group.main.location
  replica_retry_limit          = 10
  replica_timeout_in_seconds   = 3600

  schedule_trigger_config {
    cron_expression = "0 0 * * *"
    parallelism     = 1
  }

  template {
    container {
      name   = "myapp"
      image  = "ghcr.io/tkubica12/devops-ai-team/github_import_data:latest"
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
