import { _decorator, Component, Node } from 'cc';
import Dictionary from '../Container/Dictionary';
const { ccclass, property } = _decorator;


export class State{

    Fsm : FSM

    Enter(fsm : FSM) {
        this.Fsm = fsm;
    }

    Update?(deltaTime: number) : void;

    Exit?() : void ;

}

@ccclass('FSM')
export class FSM extends Component {

    StateMap : Dictionary<string, State> = new Dictionary();

    Current : State;

    update(deltaTime: number) {
        if(this.Current){
            this.Current.Update(deltaTime);
        }
    }

    AddState(stateName : string, newState : State){
        if(this.StateMap.containsKey(stateName)){
            this.StateMap.set(stateName, newState);
        }
        else{
            this.StateMap.add(stateName, newState);
        }
    }

    DelState(stateName : string){
        if(this.StateMap.containsKey(stateName)){
            this.StateMap.remove(stateName);
        }
    }

    ChangeState(stateName : string){
        if(this.StateMap.containsKey(stateName)){
            if(this.Current){
                this.Current.Exit();
            }
            this.Current = this.StateMap.get(stateName);
            this.Current.Enter(this);
        }
    }
}


