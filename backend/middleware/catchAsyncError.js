//to resolve the middleware error for handling async await error arised due to unresolved promises

module.exports = theFunc => (req,res,next) =>{

  //calling theFunc function inside resolve function to catch the error if any error arises
  Promise.resolve(theFunc(req,res,next)).catch(next);
}