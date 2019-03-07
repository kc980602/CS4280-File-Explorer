const errorHandler = function(fn){
    return async function(){
        try{
            return await fn.apply(null, arguments)
        }catch(ex){
            arguments[2](ex)
        }
    }
}

module.exports = errorHandler
