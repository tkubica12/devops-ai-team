variable "prefix" {
  type        = string
  default     = "ai-team"
  description = <<EOF
Prefix for resources.
Preferably 2-4 characters long without special characters, lowercase.
EOF
}

variable "location" {
  type        = string
  default     = "germanywestcentral"
  description = <<EOF
Azure region for resources.

Examples: swedencentral, westeurope, northeurope, germanywestcentral.
EOF
}

variable "AZURE_OPENAI_API_KEY" {
  type        = string
  description = "Azure OpenAI API key."
}

variable "AZURE_OPENAI_ENDPOINT" {
  type        = string
  description = "Azure OpenAI endpoint."
}

variable "GITHUB_TOKEN" {
  type        = string
  description = "GitHub token."
}

variable "GITHUB_OWNER" {
  type        = string
  description = "GitHub owner."
}

variable "GITHUB_REPO" {
  type        = string
  description = "GitHub repository."
}