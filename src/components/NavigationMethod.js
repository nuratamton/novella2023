import {navRef} from "../routes/AppStack"
import { StackActions } from "@react-navigation/native"

export const PushToStack = (screenName) =>  {
    if(navRef.isReady()){
        navRef.navigate(screenName)
    }

}

export const popFromStack = () => {
     if(navRef.isReady()){
        const pop = StackActions.pop();
        navRef.dispatch(pop);

        
     }
}