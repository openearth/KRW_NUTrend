const fs = require('fs')
const path = require('path')

/**
 * Load environment variables from .env file
 */
function loadEnvFile() {
  const envPath = path.join(__dirname, '../.env')
  if (!fs.existsSync(envPath)) {
    console.warn('⚠ .env file not found, using process.env only')
    return
  }

  const envContent = fs.readFileSync(envPath, 'utf8')
  const lines = envContent.split('\n')
  
  lines.forEach((line) => {
    // Skip comments and empty lines
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      return
    }
    
    // Parse KEY=VALUE format
    const match = trimmed.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      let value = match[2].trim()
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith('\'') && value.endsWith('\''))) {
        value = value.slice(1, -1)
      }
      
      // Only set if not already in process.env (process.env takes precedence)
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  })
}

/**
 * Recursively replace placeholders in an object/array
 * Replaces ${VAR_NAME} with environment variable values
 */
function replacePlaceholders(obj, env) {
  if (typeof obj === 'string') {
    // Replace ${VAR_NAME} patterns with environment variable values
    return obj.replace(/\$\{([^}]+)\}/g, (match, varName) => {
      const value = env[varName]
      if (value === undefined) {
        console.warn(`⚠ Environment variable ${ varName } is not defined, keeping placeholder`)
        return match
      }
      return value
    })
  } else if (Array.isArray(obj)) {
    return obj.map(item => replacePlaceholders(item, env))
  } else if (obj !== null && typeof obj === 'object') {
    const result = {}
    for (const key in obj) {
      result[key] = replacePlaceholders(obj[key], env)
    }
    return result
  }
  return obj
}

/**
 * Process a JSON config file from template
 * Reads from .template.json and writes to .json
 * Replaces placeholders like ${VUE_APP_API_ENDPOINT} with environment variable values
 */
function processConfigFile(templatePath, outputPath, env) {
  try {
    const content = fs.readFileSync(templatePath, 'utf8')
    const json = JSON.parse(content)
    const processed = replacePlaceholders(json, env)
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(processed, null, 2), 'utf8')
    console.log(`✓ Processed ${ path.basename(templatePath) } -> ${ path.basename(outputPath) }`)
  } catch (error) {
    console.error(`✗ Error processing ${ templatePath }:`, error.message)
    process.exit(1)
  }
}

// Load .env file first
loadEnvFile()

// Main execution
const configDir = path.join(__dirname, '../src/config')
const env = process.env

// Process each config file from template
const configFiles = [
  { template: 'reports.template.json', output: 'reports.json' },
  { template: 'services.template.json', output: 'services.json' },
  { template: 'timespan.template.json', output: 'timespan.json' },
]

configFiles.forEach(({ template, output }) => {
  const templatePath = path.join(configDir, template)
  const outputPath = path.join(configDir, output)
  
  if (fs.existsSync(templatePath)) {
    processConfigFile(templatePath, outputPath, env)
  } else {
    console.warn(`⚠ Template file not found: ${ templatePath }`)
  }
})

console.log('✓ Config processing complete')