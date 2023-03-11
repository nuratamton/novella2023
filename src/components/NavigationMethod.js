import {navRef} from "../routes/AppStack"
import { StackActions } from "@react-navigation/native"

export const PushToStack = (screenName) =>  {
    let group
    screenName === "CreateScrapbook" ? group = false : group = ""

    if(navRef.isReady()){
        navRef.navigate(screenName, {group: group})
    }

}

export const popFromStack = () => {
     if(navRef.isReady()){
        const pop = StackActions.pop();
        navRef.dispatch(pop);

        
     }
}