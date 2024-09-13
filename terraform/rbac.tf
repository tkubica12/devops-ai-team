resource "azurerm_cosmosdb_sql_role_definition" "main" {
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
  name                = "acctestsqlrole"
  assignable_scopes   = [azurerm_cosmosdb_account.main.id]

  permissions {
    data_actions = [
      "Microsoft.DocumentDB/databaseAccounts/readMetadata",
      "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/*",
      "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/*"
    ]
  }
}

# resource "azurerm_cosmosdb_sql_role_assignment" "cosmos_function" {
#   resource_group_name = azurerm_resource_group.main.name
#   account_name        = azurerm_cosmosdb_account.main.name
#   role_definition_id  = azurerm_cosmosdb_sql_role_definition.main.id
#   principal_id        = azurerm_linux_function_app.books.identity[0].principal_id
#   scope               = azurerm_cosmosdb_account.main.id
# }

resource "azurerm_cosmosdb_sql_role_assignment" "cosmos_self" {
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
  role_definition_id  = azurerm_cosmosdb_sql_role_definition.main.id
  principal_id        = data.azurerm_client_config.current.object_id
  scope               = azurerm_cosmosdb_account.main.id
}