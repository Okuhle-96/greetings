// 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

module.exports = function(){
    let objName = {};
    let errorMsg  = "";
    let counter = 0;
    let messages = "";

    const RegExp = /^[A-Za-z]+$/;

    var greeting = function(names, language){
        let StrName = ""
        let ArrName = names.trim()

        if (ArrName !== ""){
            if(ArrName.match(RegExp)){
                StrName = ArrName.charAt(0).toUpperCase() + ArrName.slice(1).toLowerCase();

                if( language === "tsonga" || language === "sotho" || language === "xhosa"){
                    if(language === "xhosa"){
                        messages = "Mholo, " + StrName;
                    }
                    else if(language === "sotho"){
                        messages = "Dumelang, " + StrName;
                    }
                    else if(language === "tsonga"){
                        messages = "Ahee, " + StrName;
                    }
                    errorMsg = "You have enterd you name correct";

                    if(objName[StrName]){
                        objName[StrName] = 1;
                        counter++;
                    }
                    else{
                        objName[StrName]++;
                    }
                }
                else{
                    messages = "Please select the language!";
                    errorMsg = "error";
                }
            }
            else{
                messages = "Icorrect fornat "
                errorMsg = "error";
            }
        }
        else{
            messages = "Please enter your name!";
            errorMsg = "error";
        }
    }
    var getMsg = function(){
        return messages;
    }
    var greetedNames = function(){
        return objName;
    }
    var allErrors = function(){
        if (errorMsg === "error"){
            return "error"
        }
        else{
            return "Correct name entered"
        }
    }
    var getCounter = function(){
        return Object.keys(objName).length;
    }
    return{
        greeting,
        getMsg,
        getCounter,
        greetedNames,
        allErrors
    }
}