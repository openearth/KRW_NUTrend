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

/**
 * Generate timespan.json from 1991 to VUE_APP_END_YEAR
 * Creates an array of ISO date strings in descending order
 */
function generateTimespan(endYear, outputPath) {
  try {
    const startYear = 1991
    const endYearNum = parseInt(endYear, 10)
    
    if (isNaN(endYearNum)) {
      throw new Error(`Invalid VUE_APP_END_YEAR: ${ endYear }`)
    }
    
    const timespan = []
    // Generate from endYear down to 1991 (descending order)
    for (let year = endYearNum; year >= startYear; year--) {
      timespan.push(`"${ year }-01-01T00: 00: 00Z"`)
    }
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    
    // Format as JSON array
    const content = '[\n' + timespan.map(item => `  ${ item }`).join(',\n') + '\n]'
    
    fs.writeFileSync(outputPath, content, 'utf8')
    console.log(`✓ Generated timespan.json (${ startYear }-${ endYearNum })`)
  } catch (error) {
    console.error('✗ Error generating timespan.json:', error.message)
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

// Generate timespan.json automatically
const endYear = env.VUE_APP_END_YEAR
if (!endYear) {
  console.error('✗ VUE_APP_END_YEAR is not defined in environment variables')
  process.exit(1)
}

const timespanPath = path.join(configDir, 'timespan.json')
generateTimespan(endYear, timespanPath)

console.log('✓ Config processing complete')