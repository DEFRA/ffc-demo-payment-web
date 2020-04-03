const Joi = require('@hapi/joi')
const getOktaConfig = require('./get-okta-config')

// Define config schema
const schema = Joi.object({
  port: Joi.number().default(3000),
  env: Joi.string().valid('development', 'test', 'production').default('development'),
  staticCacheTimeoutMillis: Joi.number().default(15 * 60 * 1000),
  restClientTimeoutMillis: Joi.number().default(20 * 1000),
  paymentServiceUrl: Joi.string().uri().required(),
  cookiePassword: Joi.string().required(),
  oktaEnabled: Joi.boolean().default(true)
})

// Build config
const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  cookiePassword: process.env.COOKIE_PASSWORD,
  oktaEnabled: process.env.OKTA_ENABLED,
  staticCacheTimeoutMillis: process.env.STATIC_CACHE_TIMEOUT_IN_MILLIS,
  paymentServiceUrl: process.env.PAYMENT_SERVICE_URL,
  restClientTimeoutMillis: process.env.REST_CLIENT_TIMEOUT_IN_MILLIS
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

// Use the Joi validated value
const value = result.value

// Add some helper props
value.isDev = (value.env === 'development' || value.env === 'test')
value.isTest = value.env === 'test'
value.isProd = value.env === 'production'
if (value.oktaEnabled) {
  value.okta = getOktaConfig()
}
module.exports = value
