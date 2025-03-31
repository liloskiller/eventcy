module.exports = {
    webpack: (config) => {
      config.resolve.symlinks = false // Preserve original casing
      return config
    }
  }