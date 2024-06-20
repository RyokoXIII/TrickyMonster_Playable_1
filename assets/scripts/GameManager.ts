import { _decorator, Animation, Camera, Component, Material, Node, PhysicsSystem2D, RenderTexture, Sprite, SpriteFrame, tween } from 'cc';
import { CameraController } from './CameraController';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(CameraController)
    cameraCtrl: CameraController = null;

    @property(Node)
    tutorial_1: Node = null;
    @property(Node)
    nextButton: Node = null;

    @property(Node)
    startScreen: Node = null;
    @property(Node)
    endScreen: Node = null;
    @property(Node)
    level_2: Node = null;

    onLoad() {
        PhysicsSystem2D.instance.enable = true;
    }

    start() {
        this.tutorial_1.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.nextButton.on(Node.EventType.TOUCH_START, this.onNextButton, this);
    }

    onTouchStart() {
        this.tutorial_1.active = false;
        this.cameraCtrl.zoomToTarget();
        this.startScreen.getComponent(Animation).play();
    }

    onNextButton() {
        tween(this.node)
            .delay(0.1)
            .call(() => {
                this.endScreen.active = false;
            })
            .delay(0.5)
            .call(() => {
                this.level_2.active = true;
            })
            .start();
    }
}



