import { _decorator, Component, Node, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Node)
    landscapeUI: Node = null;
    @property(Node)
    portraitUI: Node = null;

    update(deltaTime: number) {
        // Check Device orientation
        var frameSize = view.getVisibleSize();
        if (frameSize.height > frameSize.width) {
            // portrait
            this.portraitUI.active = true;
            this.landscapeUI.active = false;
        }
        else if (frameSize.height < frameSize.width) {
            // landscape
            this.landscapeUI.active = true;
            this.portraitUI.active = false;
        }
    }
}


