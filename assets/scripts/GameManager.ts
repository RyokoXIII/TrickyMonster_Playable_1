import { _decorator, Animation, Camera, Component, Material, Node, PhysicsSystem2D, RenderTexture, Sprite, SpriteFrame } from 'cc';
import { CameraController } from './CameraController';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(CameraController)
    cameraCtrl: CameraController = null;

    @property(Node)
    tutorial_1: Node = null;

    @property(Node)
    startScreen: Node = null;

    onLoad() {
        PhysicsSystem2D.instance.enable = true;
    }

    start() {
        this.tutorial_1.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(){
        this.tutorial_1.active = false;
        this.cameraCtrl.zoomToTarget();
        this.startScreen.getComponent(Animation).play();
    }
}



