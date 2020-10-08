const Joi = require('@hapi/joi')
const getOktaConfig = require('./get-okta-config')
const getB2cConfig = require('./get-b2c-config')

// Define config schema
const schema = Joi.object({
  port: Joi.number().default(3000),
  env: Joi.string().valid('development', 'test', 'production').default('development'),
  staticCacheTimeoutMillis: Joi.number().default(15 * 60 * 1000),
  restClientTimeoutMillis: Joi.number().default(20 * 1000),
  paymentServiceUrl: Joi.string().uri().required(),
  cookiePassword: Joi.string().required(),
  oidcProvider: Joi.string().default('dev').lowercase(),
  googleTagManagerKey: Joi.string().default('')
})

// Build config
const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  cookiePassword: process.env.COOKIE_PASSWORD,
  oidcProvider: process.env.OIDC_PROVIDER,
  staticCacheTimeoutMillis: process.env.STATIC_CACHE_TIMEOUT_IN_MILLIS,
  paymentServiceUrl: process.env.PAYMENT_SERVICE_URL,
  restClientTimeoutMillis: process.env.REST_CLIENT_TIMEOUT_IN_MILLIS,
  googleTagManagerKey: process.env.GOOGLE_TAG_MANAGER_KEY
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
if (value.oidcProvider === 'b2c') {
  value.b2c = getB2cConfig()
} else if (value.oidcProvider === 'okta') {
  value.okta = getOktaConfig()
}
module.exports = value
