import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, EventTouch, Input, input, IPhysics2DContact, Node, RigidBody2D, SpringJoint2D, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DragAndDrop')
export class DragAndDrop extends Component {
    @property(Node)
    item: Node = null; // Node item có RigidBody2D

    @property(Node)
    rope: Node = null;

    @property([Node])
    softBodyPoints: Node[] = []; // Các điểm để mô phỏng soft body

    @property
    maxRopeLength: number = 200; // Độ dài tối đa của dây chun

    private touchOffset: Vec3 = new Vec3();
    private isDragging: boolean = false;
    private targetPos: Vec3 = new Vec3();
    private delayFactor: number = 3; // Hệ số delay
    private rigidBody: RigidBody2D = null;
    isItem1 = false;

    start() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this.rigidBody = this.item.getComponent(RigidBody2D);

        // Hide the rope initially
        this.rope.active = false;

        // Initialize SpringJoint2D for soft body effect
        this.softBodyPoints.forEach(point => {
            point.getComponent(RigidBody2D).gravityScale = 0;
            point.getComponent(BoxCollider2D).enabled = true;
            const springJoint = point.getComponent(SpringJoint2D);
            if (springJoint) {
                springJoint.frequency = 3; // Tần số cho sự mềm dẻo, có thể điều chỉnh
                springJoint.dampingRatio = 0.5; // Tỉ lệ giảm chấn, có thể điều chỉnh

                // Disable rotation for the softbody point
                const pointRigidBody = point.getComponent(RigidBody2D);
                pointRigidBody.fixedRotation = true;
            }
        });

        this.softBodyPoints.forEach(point => {
            let collider = point.getComponent(Collider2D);
            if (collider) {
                collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            }
        });
    }
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.tag == 3) {
            console.log("collide with: " + otherCollider.name.toString());
            // selfCollider.enabled = false;
            this.isItem1 = true;
            this.item.active = false;
        }
    }

    update(dt: number) {
        if (this.isDragging) {
            const currentPosition = this.item.getPosition();
            const newPosition = v3(
                currentPosition.x + (this.targetPos.x - currentPosition.x) * this.delayFactor * dt,
                currentPosition.y + (this.targetPos.y - currentPosition.y) * this.delayFactor * dt,
                currentPosition.z
            );
            this.item.setPosition(newPosition);

            // Cập nhật vị trí của các điểm soft body
            // this.softBodyPoints.forEach(point => {
            //     const springJoint = point.getComponent(SpringJoint2D);
            //     if (springJoint) {
            //         const pointPos = point.getPosition();
            //         const springPos = v3(
            //             pointPos.x + (newPosition.x - pointPos.x) * this.delayFactor,
            //             pointPos.y + (newPosition.y - pointPos.y) * this.delayFactor,
            //             pointPos.z
            //         );
            //         point.setPosition(springPos);
            //     }
            // });
        }

        if (this.item.position.x >= 310.556) {
            this.item.setPosition(new Vec3(310.556, this.item.position.y, 0));
        } else if (this.item.position.x <= -310.556) {
            this.item.setPosition(new Vec3(-310.556, this.item.position.y, 0));
        } else if (this.item.position.y >= 592.513) {
            this.item.setPosition(new Vec3(this.item.position.x, 592.513, 0));
        } else if (this.item.position.y <= -592.513) {
            this.item.setPosition(new Vec3(this.item.position.x, -592.513, 0));
        }
    }

    onTouchStart(event: EventTouch) {
        const touchPos = event.getUILocation();
        const nodeSpacePos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y, 0));

        if (this.isDragging == false && this.isItem1 == false) {
            if (this.isTouchingItem(nodeSpacePos)) {
                this.isDragging = true;
                const itemPos = this.item.getPosition();
                this.touchOffset = nodeSpacePos.subtract(itemPos);
                this.targetPos = itemPos;

                // Tắt tác động vật lý để item chỉ di chuyển theo touch input
                // this.rigidBody.enabled = false;
                // this.rigidBody.linearVelocity = new Vec2();
                // this.rigidBody.angularVelocity = 0;
            }
        }
    }
    onTouchMove(event: EventTouch) {
        const touchPos = event.getUILocation();
        const nodeSpacePos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y, 0));
        this.targetPos = nodeSpacePos.subtract(this.touchOffset);
    }
    onTouchEnd(event: EventTouch) {
        this.isDragging = false;
        this.rope.active = false;
        this.softBodyPoints.forEach(point => {
            point.getComponent(RigidBody2D).gravityScale = 0;
        });
    }

    isTouchingItem(touchPos: Vec3): boolean {
        const itemPos = this.item.getPosition();
        const itemSize = this.item.getComponent(UITransform).contentSize;
        const itemRect = {
            x: itemPos.x - itemSize.width / 2,
            y: itemPos.y - itemSize.height / 2,
            width: itemSize.width,
            height: itemSize.height
        };

        return touchPos.x > itemRect.x && touchPos.x < itemRect.x + itemRect.width &&
            touchPos.y > itemRect.y && touchPos.y < itemRect.y + itemRect.height;
    }

    applyForceToSoftBodyPoints() {
        this.softBodyPoints.forEach(point => {
            const pointRb = point.getComponent(RigidBody2D);
            if (pointRb) {
                const pointPos = point.getPosition();
                const forceDirection = v3(
                    this.targetPos.x - pointPos.x,
                    this.targetPos.y - pointPos.y,
                    0
                ).normalize();

                const forceMagnitude = 2; // Điều chỉnh độ lớn của lực
                const force = v3(
                    forceDirection.x * forceMagnitude,
                    forceDirection.y * forceMagnitude,
                    0
                );

                pointRb.applyForceToCenter(new Vec2(force.x, force.y), true);
            }
        });
    }

    updateRope(startPos: Vec3, endPos: Vec3) {
        const ropeTransform = this.rope.getComponent(UITransform);
        const length = Vec3.distance(startPos, endPos);
        ropeTransform.width = length;
        const angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x);
        this.rope.setRotationFromEuler(0, 0, angle * 180 / Math.PI);
    }
}


