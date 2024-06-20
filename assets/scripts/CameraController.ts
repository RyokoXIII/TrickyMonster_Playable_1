import { _decorator, Camera, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {

    @property(Camera)
    camera: Camera = null;

    @property(Node)
    targetNode: Node = null;
    @property(Node)
    startScreen: Node = null;
    @property(Node)
    gameLevel: Node = null;

    @property
    zoomDuration: number = 1.0;

    @property
    targetZoomRatio: number = 1.0;

    private originalPosition: Vec3 = new Vec3();
    private originalOrthoHeight: number = 0;

    start() {
        // Lưu lại trạng thái ban đầu của camera
        this.originalPosition.set(this.camera.node.position);
        this.originalOrthoHeight = this.camera.orthoHeight;
    }

    zoomToTarget() {
        if (!this.camera || !this.targetNode) {
            console.warn("Camera or targetNode is not assigned.");
            return;
        }

        // Lấy vị trí của node mục tiêu
        const targetWorldPos = this.targetNode.getWorldPosition();

        // Chuyển đổi vị trí thế giới của node mục tiêu sang không gian của camera
        const targetCameraPos = this.camera.node.parent.inverseTransformPoint(new Vec3(), targetWorldPos);

        // Đặt tween để di chuyển camera đến vị trí mục tiêu và zoom
        tween(this.camera.node)
            .to(this.zoomDuration, { position: new Vec3(targetCameraPos.x, targetCameraPos.y, this.camera.node.position.z) })
            .start();

        // Tween để thay đổi zoom ratio
        tween(this.camera)
            .to(this.zoomDuration, { orthoHeight: this.camera.orthoHeight / this.targetZoomRatio })
            .delay(0.2)
            .call(()=>{
                this.resetCamera();
            })
            .delay(0.1)
            .call(()=>{
                this.startScreen.active = false;
                this.gameLevel.active = true;
            })
            .start();
    }

    resetCamera() {
        if (!this.camera) {
            console.warn("Camera is not assigned.");
            return;
        }

        // Reset vị trí và zoom của camera về trạng thái ban đầu
        this.camera.node.setPosition(this.originalPosition);
        this.camera.orthoHeight = this.originalOrthoHeight;
    }
}


