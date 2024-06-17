import { _decorator, CircleCollider2D, Component, Node, RigidBody2D, sp, SpringJoint2D, UITransform, Vec2, Vec3 } from 'cc';
import { InheritedSkeleton } from './InheritedSkeleton';
const { ccclass, property } = _decorator;

@ccclass('SpineSoftBody')
export class SpineSoftBody extends Component {

    @property(InheritedSkeleton)
    skeleton: InheritedSkeleton = null;

    @property([RigidBody2D])
    rigidbodies: RigidBody2D[] = [];

    protected lateUpdate(): void {
        let sockets = this.skeleton.sockets;

        this.rigidbodies.forEach((element: RigidBody2D, index: number) => {
            let worldPos = element.getComponent(UITransform).convertToWorldSpaceAR(Vec3.ZERO);
            // let rootBone = this.skeleton.findBone("root");
            let path = sockets[index].path;
            let bonesName = path.split("/");
            let boneName = bonesName[bonesName.length - 1];
            let bone = this.skeleton.findBone(boneName);
            let newPos = this.skeleton.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
            bone.x = newPos.x;
            bone.y = newPos.y;
            this.skeleton.updateWorldTransform();
        });
    }
}


