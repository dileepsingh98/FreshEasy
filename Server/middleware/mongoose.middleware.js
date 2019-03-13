class mongoMiddleware {

    setOptions(schema) {
  
      function setRunValidators() {
        this.setOptions({
          runValidators: true
        });
        this.setOptions({
          new: true
        });
      }
      schema.pre('findOneAndUpdate', setRunValidators);
    }
  }
  
  module.exports = new mongoMiddleware;
  